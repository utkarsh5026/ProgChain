from typing import List, Sequence

from config.db import Base, with_session, PublicIDMixin, TimestampMixin
from sqlalchemy import (
    Column,
    String,
    ForeignKey,
    select,
    update,
    delete
)
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import relationship


class ExploreChat(Base, TimestampMixin, PublicIDMixin):
    __tablename__ = "explore_chats"

    chat_topic = Column(String, nullable=False)
    chat_messages = relationship("ExploreChatMessage", back_populates="chat")

    def __repr__(self) -> str:
        return f"<ExploreChat(chat_id={self.public_id})>"

    @classmethod
    @with_session()
    async def create(cls, session: AsyncSession, chat_topic: str) -> int:
        """"""
        chat = cls(chat_topic=chat_topic)
        session.add(chat)
        await session.flush()
        return chat.id

    @classmethod
    @with_session()
    async def get_chats(cls, session: AsyncSession) -> Sequence["ExploreChat"]:
        """Retrieve all chats from the database."""
        result = await session.execute(select(cls))
        return result.scalars().all()

    @classmethod
    @with_session()
    async def chat_exists(cls, session: AsyncSession, public_id: str) -> bool:
        """Check if a chat exists in the database."""
        result = await session.execute(
            select(cls).where(cls.public_id == public_id)
        )
        chat = result.scalars().first()
        return chat is not None

    @classmethod
    @with_session()
    async def create_empty_chat(cls, session: AsyncSession) -> str:
        """Create a new empty chat."""
        chat = cls(chat_topic="")
        session.add(chat)
        await session.flush()
        return chat.public_id

    @classmethod
    @with_session()
    async def update_chat_topic(cls, session: AsyncSession, public_id: str, chat_topic: str) -> None:
        """Update the topic of an existing chat."""
        await session.execute(
            update(cls)
            .where(cls.public_id == public_id)
            .values(chat_topic=chat_topic)
        )

    @classmethod
    @with_session()
    async def delete_chat(cls, session: AsyncSession, public_id: str) -> bool:
        """Delete a chat from the database."""
        result = await session.execute(
            delete(cls).where(cls.public_id == public_id)
        )
        return result.rowcount > 0


class ExploreChatMessage(Base, PublicIDMixin, TimestampMixin):
    __tablename__ = "explore_chat_messages"

    user_question = Column(String, nullable=False)
    assistant_answer = Column(String, nullable=False)
    chat_id = Column(String, ForeignKey(
        "explore_chats.public_id"), nullable=False, index=True)
    chat = relationship("ExploreChat", back_populates="chat_messages")

    def __repr__(self) -> str:
        return f"<ExploreChatMessage(id={self.id}, chat_id={self.chat_id})>"

    @classmethod
    @with_session()
    async def get_chat_messages(cls, session: AsyncSession, chat_public_id: str) -> List["ExploreChatMessage"]:
        """Retrieve all messages for a given chat."""
        result = await session.execute(
            select(cls).where(cls.chat_id == chat_public_id)
        )
        return result.scalars().all()

    @classmethod
    @with_session()
    async def add_chat_message(cls, session: AsyncSession, chat_public_id: str, user_question: str, assistant_answer: str) -> "ExploreChatMessage":
        """Add a new message to an existing chat."""
        message = cls(
            chat_id=chat_public_id,
            user_question=user_question,
            assistant_answer=assistant_answer
        )
        session.add(message)
        return message

    @classmethod
    @with_session()
    async def create_empty_chat_message(cls, session: AsyncSession, chat_public_id: str) -> str:
        """Create a new empty chat message."""
        message = cls(
            chat_id=chat_public_id, user_question="", assistant_answer="")
        session.add(message)
        await session.flush()
        return message.public_id

    @classmethod
    @with_session()
    async def update_chat_message(cls, session: AsyncSession, chat_public_id: str, user_question: str, assistant_answer: str) -> None:
        """Update a chat message."""
        await session.execute(
            update(cls)
            .where(cls.chat_id == chat_public_id)
            .values(user_question=user_question, assistant_answer=assistant_answer)
        )
