from db import Base, TimestampMixin, PublicIDMixin, with_session
from sqlalchemy import (
    Column,
    String,
    Integer,
    ForeignKey,
    CheckConstraint,
    Index,
    select,
    event
)
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import relationship, selectinload
from pydantic import BaseModel, Field
from enum import IntEnum


class Difficulty(IntEnum):
    EASY = 0
    MEDIUM = 1
    HARD = 2


class SubTopicType(BaseModel):
    difficulty: int = Field(..., ge=0, le=2)
    topic: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)


class TopicChain(Base, TimestampMixin, PublicIDMixin):
    __tablename__ = "topic_chains"
    start_topic_name = Column(String, nullable=False)
    topics = relationship(
        "BaseTopic",
        back_populates="topic_chains",
        cascade="all, delete",
        order_by="BaseTopic.created_at"
    )

    @classmethod
    @with_session()
    async def create(cls, session: AsyncSession, start_topic_name: str) -> "TopicChain":
        topic_chain = cls(start_topic_name=start_topic_name,
                          public_id=cls.generate_public_id())
        session.add(topic_chain)
        return topic_chain

    @classmethod
    @with_session()
    async def fetch_topic_chain(cls, session: AsyncSession, public_id: str) -> "TopicChain":
        query = (
            select(TopicChain)
            .where(TopicChain.public_id == public_id)
            .options(
                selectinload(TopicChain.topics).selectinload(
                    BaseTopic.subtopics)
            )
        )

        result = await session.execute(query)
        return result.scalar_one_or_none()


class BaseTopic(Base, TimestampMixin, PublicIDMixin):
    __tablename__ = "topics"
    name = Column(String, nullable=False)
    subtopics = relationship(
        "SubTopic",
        back_populates="topic",
        cascade="all, delete",
        lazy="selectin"
    )
    main_chain_public_id = Column(
        String,
        ForeignKey("topic_chains.public_id"),
        nullable=False,
        index=True
    )
    topic_chains = relationship(
        "TopicChain",
        back_populates="topics",
    )

    __table_args__ = (
        Index('idx_topic_chain_name', 'main_chain_public_id', 'name'),
    )

    @classmethod
    @with_session()
    async def create(cls, session: AsyncSession, topic_name: str, topic_chain_public_id: str):
        topic = cls(
            name=topic_name,
            main_chain_public_id=topic_chain_public_id
        )
        session.add(topic)
        return topic


class SubTopic(Base, TimestampMixin, PublicIDMixin):
    __tablename__ = "sub_topics"
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    difficulty = Column(Integer, nullable=False)
    topic_id = Column(
        String,
        ForeignKey("topics.public_id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    topic = relationship(
        "BaseTopic",
        back_populates="subtopics",
    )

    __table_args__ = (
        CheckConstraint(
            f'difficulty >= {Difficulty.EASY} AND difficulty <= {Difficulty.HARD}',
            name='check_valid_difficulty'
        ),
        Index('idx_subtopic_topic_difficulty', 'topic_id', 'difficulty'),
    )

    @classmethod
    @with_session()
    async def batch_create_subtopics(cls, session: AsyncSession, subtopics: list[SubTopicType], topic_id: str):
        for subtopic in subtopics:
            subtopic = cls(
                name=subtopic.topic,
                description=subtopic.description,
                difficulty=subtopic.difficulty,
                public_id=cls.generate_public_id(),
                topic_id=topic_id
            )
            session.add(subtopic)
        await session.commit()


class TopicChainStats(Base, TimestampMixin, PublicIDMixin):
    __tablename__ = "topic_chain_stats"
    topic_chain_internal_id = Column(
        Integer,
        ForeignKey("topic_chains.id"),
        nullable=False,
        index=True
    )
    topics_generated = Column(Integer, nullable=False, default=0)
