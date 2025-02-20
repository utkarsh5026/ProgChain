from db import Base, TimestampMixin, PublicIDMixin, with_session
from sqlalchemy import (
    String,
    Integer,
    ForeignKey,
    Index,
    event
)
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import (
    relationship,
    object_session,
    Mapped,
    mapped_column
)
from sqlalchemy.future import select


class Thread(Base, TimestampMixin, PublicIDMixin):
    __tablename__ = "thread"

    topic: Mapped[str] = mapped_column(String, nullable=False, index=True)
    contents_cnt: Mapped[int] = mapped_column(
        Integer, nullable=False, default=0)

    __table_args__ = (
        Index('idx_thread_updated_public', 'updated_at', 'public_id'),
    )

    contents: Mapped[list["ThreadContent"]] = relationship(
        "ThreadContent",
        back_populates="thread",
        order_by="ThreadContent.created_at",
        cascade="all, delete-orphan"
    )

    @classmethod
    @with_session()
    async def create(cls, session: AsyncSession, topic: str) -> str:
        """
        Create a new thread with the specified topic in the database.
        """
        thread = cls(topic=topic)
        session.add(thread)
        return thread.public_id

    @classmethod
    @with_session()
    async def load_thread_contents(cls, session: AsyncSession, thread_public_id: str) -> tuple["Thread", list["ThreadContent"]]:
        """
        Load all contents for a given thread.
        """
        thread = await cls.get_by_public_id(session, thread_public_id)
        return thread, thread.contents


class ThreadContent(Base, TimestampMixin, PublicIDMixin):
    __tablename__ = "thread_content"

    thread_public_id: Mapped[str] = mapped_column(
        String,
        ForeignKey("thread.public_id"),
        nullable=False,
        index=True
    )
    thread_topic: Mapped[str] = mapped_column(String, nullable=False)
    content: Mapped[str] = mapped_column(String, nullable=False)

    thread: Mapped["Thread"] = relationship(
        "Thread", back_populates="contents")

    chats: Mapped[list["ThreadContentChat"]] = relationship(
        "ThreadContentChat",
        back_populates="start_point",
        cascade="all, delete-orphan",
        lazy="selectin"
    )

    @classmethod
    def __declare_last__(cls):
        @event.listens_for(cls, 'after_insert')
        def update_thread_on_insert(mapper, connection, target):
            thread = target.thread
            if thread:
                thread.touch(session=object_session(target))

        @event.listens_for(cls, 'after_update')
        def update_thread_on_change(mapper, connection, target):
            thread = target.thread
            if thread:
                thread.touch(session=object_session(target))

    @classmethod
    @with_session()
    async def create(cls, session: AsyncSession, thread_public_id: str, content: str, topic: str) -> str:
        """
        Create a new content entry and ensure thread's updated_at is refreshed.
        Returns the public_id of the new content.
        """
        async with session.begin():
            result = await session.execute(
                select(Thread).where(Thread.public_id == thread_public_id)
            )
            thread = result.scalar_one_or_none()

            content = cls(
                thread_public_id=thread_public_id,
                content=content,
                thread_topic=topic
            )
            session.add(content)
            thread.contents_cnt += 1
            return content.public_id

    @classmethod
    @with_session()
    async def update(cls, session: AsyncSession, content_public_id: str, new_content: str):
        """
        Update an existing content entry and ensure thread's updated_at is refreshed.
        Returns the public_id of the updated content.
        """
        async with session.begin():
            result = await session.execute(
                select(ThreadContent).where(
                    ThreadContent.public_id == content_public_id)
            )
            content = result.scalar_one_or_none()

            if not content:
                raise ValueError(
                    f"Content with public_id {content_public_id} not found")
            content.content = new_content

    @classmethod
    @with_session()
    async def get_chats(cls, session: AsyncSession, public_id: str) -> list["ThreadContentChat"]:
        """
        Get all chats for a given thread content.
        """
        thread_content = await cls.get_by_public_id(session, public_id)
        return thread_content.chats


class ThreadContentChat(Base, TimestampMixin, PublicIDMixin):
    __tablename__ = "thread_content_chat"

    user_question: Mapped[str] = mapped_column(String, nullable=False)
    ai_answer: Mapped[str] = mapped_column(String, nullable=False)
    content_public_id: Mapped[str] = mapped_column(
        String,
        ForeignKey("thread_content.public_id"),
        nullable=False,
        index=True
    )

    start_point: Mapped["ThreadContent"] = relationship(
        "ThreadContent", back_populates="chats")

    @classmethod
    @with_session()
    async def create_chat(cls, session: AsyncSession, content_public_id: str, user_question: str, ai_answer: str) -> int:
        """
        Create a new chat entry associated with a given content.

        Args:
            content_public_id:
            session:
            user_question (str): The user's question.
            ai_answer (str): The AI's answer.

        Returns:
            int: The ID of the newly created chat record.
        """
        new_chat = cls(
            content_public_id=content_public_id,
            user_question=user_question,
            ai_answer=ai_answer
        )
        session.add(new_chat)
        return new_chat.id
