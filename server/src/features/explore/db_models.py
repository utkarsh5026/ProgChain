from config.db import Base
from sqlalchemy import Column, Integer, String, JSON, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone


class ExploreChat(Base):
    __tablename__ = "explore_chats"

    chat_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    chat_topic = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    chat_messages = relationship("ExploreChatMessage", back_populates="chat")

    def __repr__(self):
        return f"<ExploreChat(chat_id={self.chat_id})>"


class ExploreChatMessage(Base):
    __tablename__ = "explore_chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_question = Column(String, nullable=False)
    assistant_answer = Column(String, nullable=False)
    chat_id = Column(Integer, ForeignKey("explore_chats.chat_id"),
                     nullable=False, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    chat = relationship("ExploreChat", back_populates="chat_messages")

    def __repr__(self):
        return f"<ExploreChatMessage(id={self.id}, chat_id={self.chat_id})>"
