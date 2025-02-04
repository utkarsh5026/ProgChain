from .db_models import ExploreChat, ExploreChatMessage
from config.db import db_session


def create_chat(chat_topic: str) -> int:
    """
    Create a new chat with the specified topic.

    Args:
        chat_topic (str): The topic for the new chat.

    Returns:
        int: The ID of the newly created chat.
    """
    with db_session() as session:
        chat = ExploreChat(chat_topic=chat_topic)
        session.add(chat)
        session.flush()
        chat_id = chat.chat_id
        session.commit()
        return chat_id


def get_chat_messages(chat_id: int):
    """
    Retrieve all messages for a given chat.

    Args:
        chat_id (int): The ID of the chat.

    Returns:
        list[ExploreChatMessage]: A list of chat messages associated with the chat.
    """
    with db_session() as session:
        messages = session.query(ExploreChatMessage).filter(
            ExploreChatMessage.chat_id == chat_id
        ).all()
        return messages


def add_chat_message(chat_id: int, user_question: str, assistant_answer: str):
    """
    Add a new message to an existing chat.

    Args:
        chat_id (int): The ID of the chat.
        user_question (str): The user's question.
        assistant_answer (str): The assistant's answer.

    Returns:
        ExploreChatMessage: The newly created chat message object.
    """
    with db_session() as session:
        message = ExploreChatMessage(
            chat_id=chat_id,
            user_question=user_question,
            assistant_answer=assistant_answer
        )
        session.add(message)
        session.commit()
        return message


def delete_chat(chat_id: int) -> bool:
    """
    Delete a chat from the database.

    Args:
        chat_id (int): The ID of the chat to be deleted.

    Returns:
        bool: True if chat was deleted, False if chat was not found
    """
    with db_session() as session:
        deleted = session.query(ExploreChat).filter(
            ExploreChat.chat_id == chat_id
        ).delete()
        session.commit()
        return deleted > 0


def update_chat_topic(chat_id: int, chat_topic: str):
    """
    Update the topic of an existing chat.

    Args:
        chat_id (int): The ID of the chat to update.
        chat_topic (str): The new chat topic.
    """
    with db_session() as session:
        session.query(ExploreChat).filter(
            ExploreChat.chat_id == chat_id
        ).update({"chat_topic": chat_topic})
        session.commit()


def get_chats():
    """
    Retrieve all chats from the database.

    Returns:
        list[ExploreChat]: A list of all chats in the database.
    """
    with db_session() as session:
        chats = session.query(ExploreChat).all()
        return chats


def chat_exists(chat_id: int) -> bool:
    """
    Check if a chat exists in the database.

    Args:
        chat_id (int): The ID of the chat to check.

    Returns:
        bool: True if chat exists, False otherwise.
    """
    with db_session() as session:
        return session.query(ExploreChat).filter(ExploreChat.chat_id == chat_id).first() is not None
