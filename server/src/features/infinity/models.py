from sqlalchemy import (
    Column,
    String,
    Enum,
    Text,
    JSON,
    ForeignKey,
    UniqueConstraint
)
from sqlalchemy.orm import relationship
from sqlalchemy.orm import Mapped, mapped_column
from db import Base, TimestampMixin, PublicIDMixin
from .base import ModeType


class LearningModeConfig(Base, TimestampMixin, PublicIDMixin):
    """Database model for learning mode configurations."""
    __tablename__ = "learning_modes"

    mode_type: Mapped[ModeType] = mapped_column(
        Enum(ModeType),
        nullable=False,
        unique=True,
        index=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=False)
    metadata: Mapped[dict] = mapped_column(JSON, nullable=True)

    topic_contents = relationship("TopicModeContent", back_populates="mode")
