import asyncio
from datetime import datetime
from typing import AsyncGenerator
from pydantic import BaseModel
from cachetools import LFUCache

from .models import ExploreChat, ExploreChatMessage
from .chat import ResearchAssistant
from config.models import Model
from core import ChatGenerateOptions

from fastapi_components import ListDataRequest


class ChatNotExistsError(Exception):
    """
    Exception raised when a chat with the specified ID does not exist.
    """

    def __init__(self, chat_id: int):
        self.chat_id = chat_id
        super().__init__(f"Chat with id {chat_id} does not exist")


class TopicQuestion(BaseModel):
    """
    Data model representing a user's question along with optional model name and extra instructions.
    """
    question: str
    model_name: str = Model.GPT_4O.value
    extra_instructions: str


class ResearchAssistantService:
    """
    Service for handling research assistant interactions including starting new explorations,
    asking follow-up questions, managing chat sessions, and retrieving chat history.
    """

    def __init__(self) -> None:
        """
        Initialize the ResearchAssistantService.
        """
        self.assistants: dict[str, ResearchAssistant] = {}
        self.cache = LFUCache(maxsize=100)

    async def start_exploration(self, topic: ChatGenerateOptions) -> AsyncGenerator[dict, None]:
        """
        Start a new exploration session by generating an answer for the given question.


        This method streams the assistant's answer in chunks, determines a chat topic
        from the question, stores the new chat with its conversation, and registers the assistant.

        Args:
            topic (TopicQuestion): The question details including text, model name, and extra instructions.

        Yields:
            AsyncGenerator[str, None]: Chunks of the generated answer.
        """
        assistant = await ResearchAssistant.create()
        async for chunk in assistant.generate_answer(topic):
            yield chunk

    async def ask_question(self, chat_id: str, options: ChatGenerateOptions) -> AsyncGenerator[str, None]:
        """

        Ask a follow-up question within an existing chat session.

        Ensures the chat context is loaded before streaming the response, then logs the new interaction.

        Args:
            chat_id (int): The ID of the existing chat session.
            options (ChatGenerateOptions): The question details including text, model name, and extra instructions.

        Yields:
            AsyncGenerator[str, None]: Chunks of the generated assistant response.
        """
        await self._load_chat_messages(chat_id)
        assistant = self.cache.get(chat_id)

        async for chunk in assistant.generate_answer(options):
            yield chunk

    async def delete_chat(self, chat_id: str) -> bool:
        """
        Delete a chat session.

        Removes the chat from the database and clears the associated assistant instance.

        Args:
            chat_id (str): The ID of the chat session to delete.

        Returns:
            bool: True if the chat was deleted, False if it does not exist.
        """
        deleted = await ExploreChat.delete(chat_id)
        if chat_id in self.cache:
            del self.cache[chat_id]
        return deleted

    @classmethod
    async def get_all_chats(cls, request: ListDataRequest):
        """
        Retrieve all existing chat sessions.

        Returns:
            A list of all chat records.
        """
        chats = await ExploreChat.get_pagination(cursor=request.timestamp,
                                                 limit=request.limit)

        chats.items = [chat.to_dict() for chat in chats.items]
        return chats

    async def get_chat(self, chat_id: str) -> list[ExploreChatMessage]:
        """
        Retrieve all messages from a specific chat session.

        Loads the chat messages from the database and triggers a background task
        to load the messages into the vector store for context-aware retrieval.

        Args:
            chat_id (int): The ID of the chat session to retrieve.

        Returns:
            list[ExploreChatMessage]: A list of messages from the chat session.

        Raises:
            ChatNotExistsError: If the chat session does not exist.
        """
        messages = await ExploreChatMessage.get_chat_messages(chat_id)
        await asyncio.create_task(self._load_chat_messages(chat_id))
        return messages

    async def _load_chat_messages(self, chat_id: str):
        """
        Load chat messages and initialize the ResearchAssistant's context for an existing chat.

        Retrieves messages from the database, updates the assistant's vector store for context retrieval,
        and registers the assistant if not already loaded.

        Args:
            chat_id (str): The ID of the chat session.

        Raises:
            ChatNotExistsError: If no messages exist for the given chat_id.
        """
        if chat_id in self.cache:
            return
        assistant = await ResearchAssistant.create(chat_id)
        self.cache[chat_id] = assistant
        print(f"Loaded assistant for chat {chat_id}")
