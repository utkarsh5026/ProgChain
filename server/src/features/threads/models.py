from config.db import Base, db_session
from sqlalchemy import Column, String, Integer, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship, selectinload
from sqlalchemy.future import select


class Thread(Base):
    __tablename__ = "thread"

    id = Column(Integer, primary_key=True)
    topic = Column(String, nullable=False, index=True)
    contents_cnt = Column(Integer, nullable=False, default=0)

    contents = relationship(
        "ThreadContent",
        back_populates="thread",
        order_by="ThreadContent.created_at",
        cascade="all, delete-orphan"
    )


class ThreadContent(Base):
    __tablename__ = "thread_content"

    id = Column(Integer, primary_key=True)
    thread_id = Column(
        Integer,
        ForeignKey("thread.id"),
        nullable=False,
        index=True
    )
    thread_topic = Column(String, nullable=False)
    content = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True),
                        server_default=func.now(), nullable=False,
                        index=True)
    thread = relationship("Thread", back_populates="contents")

    chats = relationship(
        "ThreadContentChat",
        back_populates="start_point",
        cascade="all, delete-orphan",
        lazy="selectin"
    )


class ThreadContentChat(Base):
    __tablename__ = "thread_content_chat"

    id = Column(Integer, primary_key=True)
    user_question = Column(String, nullable=False)
    ai_answer = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True),
                        server_default=func.now(), nullable=False,
                        index=True)
    content_id = Column(Integer, ForeignKey(
        "thread_content.id"), nullable=False)
    start_point = relationship("ThreadContent", back_populates="chats")


async def create_thread(topic: str) -> int:
    """
    Create a new thread with the specified topic in the database.

    Args:
        topic (str): The topic for the new thread.

    Returns:
        int: The ID of the newly created thread.
    """
    async with db_session() as session:
        thread = Thread(topic=topic)
        session.add(thread)
        await session.flush()
        return thread.id


async def create_content(thread_id: int, content: str, topic: str) -> int:
    """
    Create a new content entry associated with a given thread.

    Args:
        thread_id (int): The ID of the thread to which the content belongs.
        content (str): The content of the thread.
        topic (str): The topic used for the content.

    Returns:
        int: The ID of the newly created content record.

    Raises:
        ValueError: If no thread exists with the specified thread_id.
    """
    async with db_session() as session:
        new_content = ThreadContent(
            thread_id=thread_id,
            content=content,
            thread_topic=topic
        )
        session.add(new_content)
        thread = await session.get(Thread, thread_id)
        if thread:
            thread.contents_cnt += 1
        else:
            raise ValueError(f"Thread with id {thread_id} not found")
        await session.flush()
        return new_content.id


async def delete_thread(thread_id: int) -> None:
    """
    Delete an existing thread from the database.

    Args:
        thread_id (int): The ID of the thread to delete.

    Raises:
        ValueError: If no thread exists with the specified thread_id.
    """
    async with db_session() as session:
        thread = await session.get(Thread, thread_id)
        if thread:
            await session.delete(thread)
            await session.flush()
        else:
            raise ValueError(f"Thread with id {thread_id} not found")


async def load_thread_with_topics(thread_id: int) -> tuple[str, list]:
    """
    Load a thread from the database along with its topics.
    Returns tuple of (thread_topic, contents)
    """
    async with db_session() as session:
        # Use select with selectinload to eagerly load contents
        result = await session.execute(
            select(Thread)
            .options(selectinload(Thread.contents))
            .filter(Thread.id == thread_id)
        )
        thread = result.scalar_one_or_none()
        if not thread:
            raise ValueError(f"Thread with id {thread_id} not found")

        return thread.topic, [content.thread_topic for content in thread.contents]


async def get_all_threads() -> list[dict]:
    """
    Get all threads from the database.

    Returns:
        list[dict]: A list of dictionaries containing thread information (id, topic, contents_cnt)
    """
    async with db_session() as session:
        result = await session.execute(select(Thread))
        threads = result.scalars().all()
        return [
            {
                "id": thread.id,
                "topic": thread.topic,
                "contents_cnt": thread.contents_cnt
            }
            for thread in threads
        ]


async def get_thread_contents(thread_id: int) -> list[dict]:
    """
    Get all contents for a given thread.
    """
    async with db_session() as session:
        result = await session.execute(
            select(ThreadContent)
            .options(selectinload(ThreadContent.thread))
            .filter(ThreadContent.thread_id == thread_id)
        )
        contents = result.scalars().all()
        return [
            {
                "id": content.id,
                "content": content.content,
                "created_at": content.created_at,
                "thread_topic": content.thread_topic
            }
            for content in contents
        ]


async def create_chat(content_id: int, user_question: str, ai_answer: str) -> int:
    """
    Create a new chat entry associated with a given content.

    Args:
        content_id (int): The ID of the content to associate with the chat.
        user_question (str): The user's question.
        ai_answer (str): The AI's answer.

    Returns:
        int: The ID of the newly created chat record.
    """
    async with db_session() as session:
        new_chat = ThreadContentChat(
            content_id=content_id,
            user_question=user_question,
            ai_answer=ai_answer
        )
        session.add(new_chat)
        await session.flush()
        return new_chat.id


async def get_thread_content(content_id: int) -> ThreadContent:
    """
    Get a thread content by its ID.

    Args:
        content_id (int): The ID of the thread content to retrieve.

    Returns:
        ThreadContent: The thread content object with all attributes loaded.

    Raises:
        ValueError: If no thread content exists with the specified content_id.
    """
    async with db_session() as session:
        thread_content = await session.get(ThreadContent, content_id)
        if not thread_content:
            raise ValueError(f"Thread content with id {content_id} not found")
        # Ensure the content is loaded before session closes
        await session.refresh(thread_content)
        # Create a detached copy of the object
        session.expunge(thread_content)
        return thread_content


async def get_chats_for_thread_content(content_id: int) -> list[dict]:
    """
    Get all chats for a given thread content.
    """
    async with db_session() as session:
        result = await session.execute(
            select(ThreadContentChat)
            .filter(ThreadContentChat.content_id == content_id)
        )

        return result.scalars().all()
