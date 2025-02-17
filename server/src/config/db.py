from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base, declared_attr
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from contextlib import asynccontextmanager
from sqlalchemy import Column, DateTime, func, Integer, String, select
import logging
import uuid

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

ASYNC_DATABASE_URL = "sqlite+aiosqlite:///./sqlite.db"
async_engine = create_async_engine(ASYNC_DATABASE_URL, echo=False)


AsyncSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=async_engine,
    class_=AsyncSession
)
Base = declarative_base()


@asynccontextmanager
async def db_session():
    """
    Robust asynchronous context manager for handling database sessions.

    This function yields an AsyncSession and ensures that the session is
    properly committed if everything goes well, or rolled back if an error occurs.
    Additionally, it automatically refreshes and detaches objects before commit
    to ensure they're usable outside the session.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            for obj in session.identity_map.values():
                await session.refresh(obj)
            session.expunge_all()
            await session.commit()
        except Exception as error:
            logger.exception("Error during DB session; rolling back.")
            await session.rollback()
            raise error
        finally:
            await session.close()


def with_session():
    """
    Decorator that wraps async functions to provide a database session.
    The wrapped function should have 'session' as its first parameter after self (for methods)
    or as its first parameter (for standalone functions).
    """
    def decorator(func):
        async def wrapper(*args, **kwargs):
            async with db_session() as session:
                return await func(*args, session, **kwargs)
        return wrapper
    return decorator


async def init_db():
    """
    Asynchronously initialize the database by creating all tables defined in Base.
    """
    async with async_engine.begin() as conn:

        await conn.run_sync(Base.metadata.create_all)


class TimestampMixin(object):
    @declared_attr
    def created_at(cls):
        return Column(
            DateTime(timezone=True),
            server_default=func.now(),
            nullable=False
        )

    @declared_attr
    def updated_at(cls):
        return Column(
            DateTime(timezone=True),
            server_default=func.now(),
            onupdate=func.now(),
            index=True,  # create index for updated_at
            nullable=False
        )

    def touch(self, session: Session):
        """
        Explicitly update the updated_at timestamp.
        Useful for triggering updates from related models.
        """
        self.updated_at = func.now()
        session.add(self)


class PublicIDMixin:
    """Mixin to handle public IDs and ID masking in models."""
    id = Column(Integer, primary_key=True, autoincrement=True)
    public_id = Column(String, unique=True, nullable=False, index=True)

    def __init__(self, *args, **kwargs):
        kwargs['public_id'] = self.generate_public_id()
        super().__init__(*args, **kwargs)

    @classmethod
    def generate_public_id(cls) -> str:
        """
        Generate a unique public ID with a prefix based on the model name.
        """
        prefix = cls.__name__.lower()[:3]
        unique_id = str(uuid.uuid4())
        return f"{prefix}_{unique_id}"

    @classmethod
    async def get_by_public_id(cls, public_id: str):
        """Get a model by its public ID."""
        async with db_session() as session:
            result = await session.execute(select(cls).filter(cls.public_id == public_id))
            return result.scalar_one_or_none()

    @classmethod
    async def delete(cls, public_id: str):
        """Delete a model by its public ID."""
        async with db_session() as session:
            result = await session.execute(select(cls).filter(cls.public_id == public_id))
            obj = result.scalar_one_or_none()
            if obj:
                await session.delete(obj)
                await session.commit()

    def to_dict(self) -> dict:
        """Convert model to dictionary, excluding internal ID."""
        data = {
            column.name: getattr(self, column.name)
            for column in self.__table__.columns
            if column.name != 'id'
        }
        return data
