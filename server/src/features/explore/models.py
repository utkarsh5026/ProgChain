from typing import List, Sequence, Optional

from db import Base, with_session, PublicIDMixin, TimestampMixin
from sqlalchemy import (
    Integer,
    String,
    Float,
    ForeignKey,
    select,
    update,
    func,
    event,
)
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import relationship, Session, joinedload, Mapped, mapped_column


class ExploreChat(Base, TimestampMixin, PublicIDMixin):
    __tablename__ = "explore_chats"

    chat_topic: Mapped[str] = mapped_column(String, nullable=False)
    chat_messages_count: Mapped[int] = mapped_column(
        Integer, nullable=False, default=0)

    chat_messages: Mapped[list["ExploreChatMessage"]] = relationship(
        "ExploreChatMessage",
        back_populates="chat",
        lazy="dynamic",
        primaryjoin="ExploreChatMessage.chat_internal_id == ExploreChat.id",
        order_by="desc(ExploreChatMessage.created_at)"
    )

    stats: Mapped[list["ExploreChatStats"]] = relationship(
        "ExploreChatStats",
        back_populates="chat",
        lazy="joined",
        primaryjoin="ExploreChatStats.chat_internal_id == ExploreChat.id",
        order_by="desc(ExploreChatStats.created_at)"
    )

    def __repr__(self) -> str:
        return f"<ExploreChat(chat_id={self.public_id})>"

    @classmethod
    @with_session()
    async def create(cls, session: AsyncSession, chat_topic: str) -> int:
        """
        Create a new chat with the specified topic.

        Args:
            session (AsyncSession): The database session to use for the operation.
            chat_topic (str): The topic of the chat.

        Returns:
            int: The internal ID of the newly created chat.
        """
        chat = cls(chat_topic=chat_topic)
        session.add(chat)
        await session.flush()
        return chat.id

    @classmethod
    @with_session()
    async def get_chats(cls, session: AsyncSession) -> Sequence[dict]:
        """
        Retrieve all chats from the database.

        Args:
            session (AsyncSession): The database session to use for the operation.

        Returns:
            Sequence[dict]: A list of all chats in the database as dictionaries.
        """
        chats = await session.execute(select(cls).options(joinedload(cls.stats)))
        return [
            {
                "chat": chat.to_dict(),
                "stats": [stat.to_dict() for stat in chat.stats] if chat.stats else []
            } for chat in chats.unique().scalars().all()
        ]

    @classmethod
    @with_session()
    async def chat_exists(cls, session: AsyncSession, public_id: str) -> bool:
        """
        Check if a chat exists in the database.

        Args:
            session (AsyncSession): The database session to use for the operation.
            public_id (str): The public ID of the chat to check.

        Returns:
            bool: True if the chat exists, False otherwise.
        """
        result = await session.execute(
            select(cls).where(cls.public_id == public_id)
        )
        chat = result.scalars().first()
        return chat is not None

    @classmethod
    @with_session()
    async def create_empty_chat(cls, session: AsyncSession) -> "ExploreChat":
        """
        Create a new empty chat.

        Args:
            session (AsyncSession): The database session to use for the operation.

        Returns:
            ExploreChat: The newly created empty chat.
        """
        chat = cls(chat_topic="")
        session.add(chat)
        await session.flush()
        return chat

    @classmethod
    @with_session()
    async def update_chat_topic(cls, session: AsyncSession, internal_id: int, chat_topic: str) -> None:
        """
        Update the topic of an existing chat.

        Args:
            session (AsyncSession): The database session to use for the operation.
            internal_id (int): The internal ID of the chat to update.
            chat_topic (str): The new topic for the chat.
        """
        await session.execute(
            update(cls)
            .where(cls.id == internal_id)
            .values(chat_topic=chat_topic)
        )

    @classmethod
    def __declare_last__(cls):
        """Register all SQLAlchemy event listeners for this model."""
        event.listen(ExploreChat, 'after_insert', cls._after_chat_insert)
        event.listen(ExploreChatMessage, 'after_insert',
                     cls._after_message_insert)

    @staticmethod
    def _after_chat_insert(mapper, connection: Session, target: "ExploreChat"):
        """Handle updates after a new chat is inserted.

        This event listener updates the chat's message count in ExploreChat and creates a stats object.
        """
        connection.execute(
            update(ExploreChat)
            .where(ExploreChat.id == target.id)
            .values(
                chat_messages_count=0,
                updated_at=func.now()
            )
        )

        connection.execute(
            ExploreChatStats.__table__.insert().values(
                chat_internal_id=target.id,
                chat_id=target.public_id,
                total_tokens=0,
                prompt_tokens=0,
                completion_tokens=0,
                msg_cnt=0,
                total_cost=0
            )
        )

    @staticmethod
    def _after_message_insert(mapper, connection: Session, target: "ExploreChatMessage"):
        """Handle updates after a new message is inserted.

        This event listener updates both the chat's message count in ExploreChat
        and the statistics in ExploreChatStats for the associated chat.
        """
        connection.execute(
            update(ExploreChat)
            .where(ExploreChat.id == target.chat_internal_id)
            .values(
                chat_messages_count=ExploreChat.chat_messages_count + 1,
                updated_at=func.now()
            )
        )

        prompt_token_count = len(target.user_question.split())
        completion_token_count = len(target.assistant_answer.split())
        total_token_count = prompt_token_count + completion_token_count
        cost = total_token_count * 0.001

        connection.execute(
            update(ExploreChatStats)
            .where(ExploreChatStats.chat_internal_id == target.chat_internal_id)
            .values(
                msg_cnt=ExploreChatStats.msg_cnt + 1,
                total_tokens=ExploreChatStats.total_tokens + total_token_count,
                prompt_tokens=ExploreChatStats.prompt_tokens + prompt_token_count,
                completion_tokens=ExploreChatStats.completion_tokens + completion_token_count,
                total_cost=ExploreChatStats.total_cost + cost,
                updated_at=func.now()
            )
        )


class ExploreChatMessage(Base, PublicIDMixin, TimestampMixin):
    __tablename__ = "explore_chat_messages"

    user_question: Mapped[str] = mapped_column(String, nullable=False)
    assistant_answer: Mapped[str] = mapped_column(String, nullable=False)
    chat_id: Mapped[str] = mapped_column(
        String,
        ForeignKey("explore_chats.public_id"),
        nullable=False,
        index=True
    )
    chat_internal_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("explore_chats.id"),
        nullable=False,
        index=True
    )

    chat: Mapped["ExploreChat"] = relationship(
        "ExploreChat",
        back_populates="chat_messages",
        foreign_keys=[chat_internal_id]
    )

    def __repr__(self) -> str:
        return f"<ExploreChatMessage(id={self.id}, chat_id={self.chat_id})>"

    @classmethod
    @with_session()
    async def get_chat_messages(cls, session: AsyncSession, chat_public_id: str) -> List["ExploreChatMessage"]:
        """
        Retrieve all messages for a given chat.

        This method queries the database for all messages associated with a specific chat identified by its public ID.
        It returns a list of ExploreChatMessage instances, which contain the user questions and assistant answers.

        Args:
            session (AsyncSession): The database session to use for the operation.
            chat_public_id (str): The public ID of the chat for which messages are to be retrieved.

        Returns:
            List[ExploreChatMessage]: A list of messages related to the specified chat.
        """
        result = await session.execute(
            select(cls).where(cls.chat_id == chat_public_id)
        )
        return result.scalars().all()

    @classmethod
    @with_session()
    async def create(cls, session: AsyncSession,
                     chat_public_id: str,
                     user_question: str,
                     assistant_answer: str) -> "ExploreChatMessage":
        """
        Add a new message to an existing chat.

        This method creates a new ExploreChatMessage instance with the provided user question and assistant answer,
        linking it to the specified chat identified by its public ID. The new message is then added to the session.

        Args:
            session (AsyncSession): The database session to use for the operation.
            chat_public_id (str): The public ID of the chat to which the message will be added.
            user_question (str): The question posed by the user.
            assistant_answer (str): The response provided by the assistant.

        Returns:
            ExploreChatMessage: The newly created message instance.
        """
        chat = await session.scalar(
            select(ExploreChat).where(ExploreChat.public_id == chat_public_id)
        )
        message = cls(
            chat_id=chat_public_id,
            chat_internal_id=chat.id,
            user_question=user_question,
            assistant_answer=assistant_answer
        )
        session.add(message)
        return message

    @classmethod
    @with_session()
    async def create_empty_chat_message(cls, session: AsyncSession, chat_internal_id: int, chat_public_id: str) -> str:
        """
        Create a new empty chat message.

        This method initializes a new ExploreChatMessage instance with empty user question and assistant answer,
        linking it to the specified chat identified by its public ID. The new message is then added to the session.

        Args:
            session (AsyncSession): The database session to use for the operation.
            chat_internal_id (int): The internal ID of the chat for which the empty message is created.
            chat_public_id (str): The public ID of the chat for which the empty message is created.

        Returns:
            str: The public ID of the newly created empty chat message.
        """
        message = cls(
            chat_internal_id=chat_internal_id,
            chat_id=chat_public_id,
            user_question="",
            assistant_answer="")
        session.add(message)
        await session.flush()
        return message.public_id

    @classmethod
    @with_session()
    async def update_chat_message(cls, session: AsyncSession, chat_internal_id: int, user_question: str, assistant_answer: str) -> None:
        """
        Update a chat message.

        This method updates the user question and assistant answer for a specific chat message identified by its internal ID.

        Args:
            session (AsyncSession): The database session to use for the operation.
            chat_internal_id (int): The internal ID of the chat message to be updated.
            user_question (str): The new question posed by the user.
            assistant_answer (str): The new response provided by the assistant.
        """
        await session.execute(
            update(cls)
            .where(cls.chat_internal_id == chat_internal_id)
            .values(user_question=user_question, assistant_answer=assistant_answer)
        )

    @classmethod
    @with_session()
    async def get_messages_by_internal_id(
            cls,
            session: AsyncSession,
            chat_internal_id: int
    ) -> Sequence["ExploreChatMessage"]:
        """
        Internal method for efficient message retrieval using internal ID.

        This method retrieves all messages associated with a specific chat identified by its internal ID.
        It is primarily used for internal service operations and returns a sequence of ExploreChatMessage instances.

        Args:
            session (AsyncSession): The database session to use for the operation.
            chat_internal_id (int): The internal ID of the chat for which messages are to be retrieved.

        Returns:
            Sequence[ExploreChatMessage]: A sequence of messages related to the specified chat.
        """
        result = await session.execute(
            select(cls)
            .where(cls.chat_internal_id == chat_internal_id)
            .order_by(cls.created_at)
        )
        return result.scalars().all()


class ExploreChatStats(Base, TimestampMixin, PublicIDMixin):
    __tablename__ = "explore_chat_stats"

    chat_id: Mapped[str] = mapped_column(
        String,
        ForeignKey("explore_chats.public_id"),
        nullable=False,
        index=True
    )
    chat_internal_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("explore_chats.id"),
        nullable=False,
        index=True
    )
    total_tokens: Mapped[int] = mapped_column(
        Integer, nullable=False, default=0)
    prompt_tokens: Mapped[int] = mapped_column(
        Integer, nullable=False, default=0)
    completion_tokens: Mapped[int] = mapped_column(
        Integer, nullable=False, default=0)
    msg_cnt: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    total_cost: Mapped[float] = mapped_column(Float, nullable=False, default=0)

    chat: Mapped["ExploreChat"] = relationship(
        "ExploreChat",
        back_populates="stats",
        foreign_keys=[chat_internal_id],
        lazy='joined'
    )

    def __repr__(self) -> str:
        return f"<ExploreChatStats(chat_id={self.chat_id})>"

    def to_dict(self, exclude: Optional[set[str]] = None) -> dict:
        """
        Convert the ExploreChatStats instance to a dictionary.

        Args:
            exclude (set[str]): A set of column names to exclude from the dictionary.   

        Returns:
            dict: A dictionary representation of the ExploreChatStats instance.
        """
        exclude = exclude or set()
        exclude.add('chat_internal_id')
        return super().to_dict(exclude)
