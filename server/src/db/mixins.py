import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session, Mapped, mapped_column
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import DateTime, func, Integer, String, select

from .context import with_session
from cache import Cache


class TimestampMixin(object):
    __abstract__ = True

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

    __abstract__ = True
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
        def cache_key(cls, public_id: str):
            return f"{cls.__name__}:{public_id}"

        internal_id = Cache.get(cache_key(cls, public_id))
        if internal_id:
            return cls.get_by_internal_id(session, internal_id)

        result = await session.scalar(
            select(cls).where(cls.public_id == public_id)
        )
        Cache.set(cache_key(cls, public_id), result.id)
        return result

    @classmethod
    @with_session()
    async def get_by_internal_id(cls, session: AsyncSession, internal_id: int):
        """
        Get a model instance by its internal ID.
        """
        return await session.scalar(
            select(cls).where(cls.id == internal_id)
        )

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
