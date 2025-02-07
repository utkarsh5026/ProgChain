from datetime import datetime, timezone
from typing import List

from config.db import Base, db_session
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, select, update, delete
from sqlalchemy.orm import relationship


class ExploreChat(Base):
    __tablename__ = "explore_chats"

    chat_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    chat_topic = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    chat_messages = relationship("ExploreChatMessage", back_populates="chat")

    def __repr__(self) -> str:
        return f"<ExploreChat(chat_id={self.chat_id})>"


class ExploreChatMessage(Base):
    __tablename__ = "explore_chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_question = Column(String, nullable=False)
    assistant_answer = Column(String, nullable=False)
    chat_id = Column(Integer, ForeignKey(
        "explore_chats.chat_id"), nullable=False, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    chat = relationship("ExploreChat", back_populates="chat_messages")

    def __repr__(self) -> str:
        return f"<ExploreChatMessage(id={self.id}, chat_id={self.chat_id})>"


async def create_chat(chat_topic: str) -> int:
    """
    Create a new chat with the specified topic.

    Args:
        chat_topic (str): The topic for the new chat.

    Returns:
        int: The ID of the newly created chat.
    """
    async with db_session() as session:
        chat = ExploreChat(chat_topic=chat_topic)
        session.add(chat)
        await session.flush()
        chat_id = chat.chat_id
        await session.commit()
        return chat_id


async def get_chat_messages(chat_id: int) -> List[ExploreChatMessage]:
    """
    Retrieve all messages for a given chat.

    Args:
        chat_id (int): The ID of the chat.

    Returns:
        List[ExploreChatMessage]: A list of chat messages associated with the chat.
    """
    async with db_session() as session:
        result = await session.execute(
            select(ExploreChatMessage).where(
                ExploreChatMessage.chat_id == chat_id)
        )
        messages: List[ExploreChatMessage] = result.scalars().all()
        return messages


async def add_chat_message(chat_id: int, user_question: str, assistant_answer: str) -> ExploreChatMessage:
    """
    Add a new message to an existing chat.

    Args:
        chat_id (int): The ID of the chat.
        user_question (str): The user's question.
        assistant_answer (str): The assistant's answer.

    Returns:
        ExploreChatMessage: The newly created chat message object.
    """
    async with db_session() as session:
        message = ExploreChatMessage(
            chat_id=chat_id,
            user_question=user_question,
            assistant_answer=assistant_answer
        )
        session.add(message)
        await session.commit()
        return message


async def delete_chat(chat_id: int) -> bool:
    """
    Delete a chat from the database.

    Args:
        chat_id (int): The ID of the chat to be deleted.

    Returns:
        bool: True if chat was deleted, False if chat was not found.
    """
    async with db_session() as session:
        result = await session.execute(
            delete(ExploreChat).where(ExploreChat.chat_id == chat_id)
        )
        await session.commit()
        return result.rowcount > 0


async def update_chat_topic(chat_id: int, chat_topic: str) -> None:
    """
    Update the topic of an existing chat.

    Args:
        chat_id (int): The ID of the chat to update.
        chat_topic (str): The new chat topic.
    """
    async with db_session() as session:
        await session.execute(
            update(ExploreChat)
            .where(ExploreChat.chat_id == chat_id)
            .values(chat_topic=chat_topic)
        )
        await session.commit()


async def get_chats() -> List[ExploreChat]:
    """
    Retrieve all chats from the database.

    Returns:
        List[ExploreChat]: A list of all chats in the database.
    """
    async with db_session() as session:
        result = await session.execute(select(ExploreChat))
        chats: List[ExploreChat] = result.scalars().all()
        return chats


async def chat_exists(chat_id: int) -> bool:
    """
    Check if a chat exists in the database.

    Args:
        chat_id (int): The ID of the chat to check.

    Returns:
        bool: True if chat exists, False otherwise.
    """
    async with db_session() as session:
        result = await session.execute(
            select(ExploreChat).where(ExploreChat.chat_id == chat_id)
        )
        chat = result.scalars().first()
        return chat is not None


async def create_empty_chat() -> int:
    """
    Create a new empty chat.

    Returns:
        int: The ID of the newly created chat.
    """
    async with db_session() as session:
        chat = ExploreChat(chat_topic="")
        session.add(chat)
        await session.flush()
        chat_id = chat.chat_id
        await session.commit()
        return chat_id


async def update_chat_topic(chat_id: int, chat_topic: str) -> None:
    """
    Update the topic of an existing chat.

    Args:
        chat_id (int): The ID of the chat to update.
        chat_topic (str): The new chat topic.
    """
    async with db_session() as session:
        await session.execute(
            update(ExploreChat)
            .where(ExploreChat.chat_id == chat_id)
            .values(chat_topic=chat_topic)
        )
        await session.commit()
