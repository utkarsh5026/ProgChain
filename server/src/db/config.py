import logging

from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.ext.declarative import declarative_base

from contextlib import asynccontextmanager


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


async def init_db():
    """
    Asynchronously initialize the database by creating all tables defined in Base.
    """
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
