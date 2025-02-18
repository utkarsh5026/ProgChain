import logging
import uuid
import functools
from datetime import datetime

from sqlalchemy.orm import sessionmaker, Session, Mapped, mapped_column
from sqlalchemy.ext.declarative import declarative_base, declared_attr
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy import DateTime, func, Integer, String, select

from contextlib import asynccontextmanager
from typing import TypeVar, Callable, Optional


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

T = TypeVar('T')


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

    def decorator(function: Callable[..., T]) -> Callable[..., T]:
        @functools.wraps(function)
        async def wrapper(*args, **kwargs):
            is_class_method = isinstance(args[0], type)

            async with AsyncSessionLocal() as session:
                try:
                    if is_class_method:
                        cls = args[0]
                        other_args = args[1:]
                        result = await function(cls, session, *other_args, **kwargs)
                    else:
                        result = await function(session, *args, **kwargs)
                    for obj in session.identity_map.values():
                        await session.refresh(obj)

                    session.expunge_all()
                    await session.commit()
                    return result

                except Exception as error:
                    logger.exception(
                        f"Database Operation failed with error:  {error}")
                    await session.rollback()
                    raise

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
    def created_at(self) -> Mapped[datetime]:
        return mapped_column(
            DateTime(timezone=True),
            server_default=func.now(),
            nullable=False
        )

    @declared_attr
    def updated_at(self) -> Mapped[datetime]:
        return mapped_column(
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
    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True)

    @declared_attr
    def public_id(cls) -> Mapped[str]:
        """Define public_id as a declared attribute for better inheritance."""
        return mapped_column(
            String,
            unique=True,
            nullable=False,
            index=True,
            default=lambda: cls.generate_public_id()
        )

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
    @with_session()
    async def get_by_public_id(cls, session: AsyncSession, public_id: str):
        """
        Get a model instance by its public ID.
        Uses the session decorator for cleaner transaction management.
        """
        result = await session.scalar(
            select(cls).where(cls.public_id == public_id)
        )
        return result

    @classmethod
    @with_session()
    async def delete(cls, session: AsyncSession, public_id: str):
        """Delete a model by its public ID."""
        obj = await cls.get_by_public_id(session, public_id)
        if obj:
            await session.delete(obj)
            return True
        return False

    def to_dict(self, exclude: Optional[set[str]] = None) -> dict:
        """
        Convert model to dictionary, with configurable field exclusion.
        Automatically excludes internal ID and any specified fields.
        Handles relationship attributes by converting them to dictionaries as well.
        """
        exclude = exclude or set()
        exclude.add('id')

        result = {}

        # Handle regular columns
        for column in self.__table__.columns:
            if column.name not in exclude:
                result[column.name] = getattr(self, column.name)

        return result
