from config.db import Base, db_session
from sqlalchemy import Column, String, Integer, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship


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
