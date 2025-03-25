import uuid
from datetime import datetime
from dataclasses import dataclass
from typing import TypeVar, Generic, Literal, Optional
from loguru import logger

from sqlalchemy.orm import Session, Mapped, mapped_column
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import DateTime, func, Integer, String, select, asc, desc

from .context import with_session
from cache import Cache

T = TypeVar('T')


@dataclass
class PaginatedResponse(Generic[T]):
    """
    A structured response for paginated results that includes both
    ascending and descending cursors for flexible navigation.
    """
    items: list[T]
    has_next: bool
    total_count: Optional[int] = None


class TimestampMixin(object):
    """
    A mixin class that provides common timestamp fields and methods for models.
    This mixin is designed to be used with SQLAlchemy models to add created_at and updated_at timestamps.
    """
    __abstract__ = True

    @declared_attr
    def created_at(self) -> Mapped[datetime]:
        """
        Represents the timestamp when the record was created.
        This field is automatically set to the current datetime when a new record is inserted.
        """
        return mapped_column(
            DateTime(timezone=True),
            server_default=func.now(),
            nullable=False
        )

    @declared_attr
    def updated_at(self) -> Mapped[datetime]:
        """
        Represents the timestamp when the record was last updated.
        This field is automatically set to the current datetime when a record is updated.
        """
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
        This method is useful for triggering updates from related models.
        """
        self.updated_at = func.now()
        session.add(self)

    @classmethod
    @with_session()
    async def get_pagination(cls, session: AsyncSession,
                             order_type: Literal['created_asc',
                                                 'updated_desc'] = 'updated_desc',
                             cursor: Optional[datetime] = None,
                             limit: int = 10) -> PaginatedResponse[T]:
        """
        Retrieve a paginated response for the model, ordered by either creation or update time.

        Args:
            session: The database session to use for the query.
            order_type: The type of order to use for the pagination. Options are 'created_asc' for ascending order by creation time and 'updated_desc' for descending order by update time.
            cursor: The cursor to use for the pagination. If None, it defaults to the current datetime for 'updated_desc' order or datetime.min for 'created_asc' order.
            limit: The limit of items to return in the pagination.

        Returns:
            A paginated response for the model, including the items, a flag indicating if there are more items, and the total count of items.
        """
        if cursor is None or cursor == datetime.min:
            cursor = datetime.now() if order_type == 'updated_desc' else datetime.min

        if order_type == 'created_asc':
            order_column = cls.created_at
            order_func = asc
            operator = '>'
        elif order_type == 'updated_desc':
            order_column = cls.updated_at
            order_func = desc
            operator = '<'

        logger.info(f"Ordering by {order_type} with cursor {cursor}")

        query = select(cls).where(
            order_column.op(operator)(cursor)
        ).order_by(order_func(order_column)).limit(limit)

        result = await session.execute(query)
        items = result.scalars().unique().all()

        total_count = await session.scalar(
            select(func.count()).select_from(cls)
        )
        return PaginatedResponse(items=items,
                                 has_next=len(items) == limit,
                                 total_count=total_count)


class PublicIDMixin:
    """
    A mixin class that provides a public ID for models. This mixin is designed to be used with SQLAlchemy models to generate a unique public ID for each instance. The public ID is generated based on the model name and a UUID.
    """

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
        def cache_key():
            return f"{cls.__name__}:{public_id}"

        internal_id = Cache.get(cache_key())
        if internal_id:
            return cls.get_by_internal_id(session, internal_id)

        result = await session.scalar(
            select(cls).where(cls.public_id == public_id)
        )
        Cache.set(cache_key(), result.id)
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
