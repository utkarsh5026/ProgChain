from .setup import Base, engine
from .chat import Chat, Message

__all__ = ["Base", "Chat", "Message"]

Base.metadata.create_all(engine)
