from asyncio import Lock, create_task
from typing import AsyncGenerator
from pydantic import BaseModel

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

from .db_ops import (create_chat, add_chat_message,
                     delete_chat, get_chats, get_chat_messages)
from .db_models import ExploreChatMessage
from .llm import ResearchAssistant
from config.models import Model, get_model
from .vector import VectorStoreManager


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
    extra_instructions: str = ""


class ResearchAssistantService:
    """
    Service for handling research assistant interactions including starting new explorations,
    asking follow-up questions, managing chat sessions, and retrieving chat history.
    """

    def __init__(self) -> None:
        """
        Initialize the ResearchAssistantService.

        Attributes:
            assistants (dict[int, ResearchAssistant]): Stores active ResearchAssistant instances keyed by chat ID.
            small_model: A lightweight model used for determining chat topics.
            lock: An asyncio Lock to synchronize operations that modify shared resources.
        """
        self.assistants: dict[int, ResearchAssistant] = {}
        self.small_model = get_model(Model.GPT_4O_MINI.value)
        self.lock = Lock()

    async def start_exploration(self, question: str, model_name: str = Model.GPT_4O.value, extra_instructions: str = "") -> AsyncGenerator[str | int, None]:
        """
        Start a new exploration session by generating an answer for the given question.


        This method streams the assistant's answer in chunks, determines a chat topic
        from the question, stores the new chat with its conversation, and registers the assistant.

        Args:
            question (str): The initial question to explore.
            model_name (str): Model to use for generating the answer (default is GPT_4O).
            extra_instructions (str): Additional generation instructions if needed.

        Yields:
            AsyncGenerator[str, None]: Chunks of the generated answer.
        """
        assistant = ResearchAssistant()
        chunks = []
        async for chunk in assistant.generate_answer(question, model_name, extra_instructions):
            chunks.append(chunk)
            yield chunk

        async with self.lock:
            chat_topic = await self._determine_chat_topic(question)
            chat_id = create_chat(chat_topic)
            add_chat_message(chat_id,
                             user_question=question,
                             assistant_answer="".join(chunks))
            self.assistants[chat_id] = assistant

            yield chat_id

    async def ask_question(self, chat_id: int, question: TopicQuestion) -> AsyncGenerator[str, None]:
        """

        Ask a follow-up question within an existing chat session.

        Ensures the chat context is loaded before streaming the response, then logs the new interaction.

        Args:
            chat_id (int): The ID of the existing chat session.
            question (TopicQuestion): The question details including text, model name, and extra instructions.

        Yields:
            AsyncGenerator[str, None]: Chunks of the generated assistant response.
        """
        await self._load_chat_messages(chat_id)
        assistant = self.assistants[chat_id]

        chunks = []
        async for chunk in assistant.generate_answer(question.question, question.model_name, question.extra_instructions):
            chunks.append(chunk)
            yield chunk

        async with self.lock:
            add_chat_message(chat_id,
                             user_question=question.question,
                             assistant_answer="".join(chunks))

    async def delete_chat(self, chat_id: int):
        """
        Delete a chat session.

        Removes the chat from the database and clears the associated assistant instance.

        Args:
            chat_id (int): The ID of the chat session to delete.

        Returns:
            The result of the delete operation.
        """
        deleted = delete_chat(chat_id)
        if chat_id in self.assistants:
            del self.assistants[chat_id]
        return deleted

    async def get_all_chats(self, limit: int = 10, page: int = 1):
        """
        Retrieve all existing chat sessions.

        Returns:
            A list of all chat records.
        """
        return get_chats()

    async def get_chat(self, chat_id: int) -> list[ExploreChatMessage]:
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
        messages = get_chat_messages(chat_id)
        if not messages:
            raise ChatNotExistsError(chat_id)

        # Initiate background loading of chat messages into the vector store.
        create_task(self._load_chat_messages(chat_id))

        return messages

    async def _determine_chat_topic(self, question: str) -> str:
        """
        Determine the chat topic based on the provided question.

        Uses a system prompt and a lightweight model to extract a concise topic from the question.

        Args:
            question (str): The user's question.

        Returns:
            str: The determined chat topic.
        """
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a helpful assistant that determines the topic of a question. Only give the topic, no other text."),
            ("human", "Question: {question}"),
        ])

        chain = prompt | self.small_model | StrOutputParser()
        return await chain.ainvoke({"question": question})

    async def _load_chat_messages(self, chat_id: int):
        """
        Load chat messages and initialize the ResearchAssistant's context for an existing chat.

        Retrieves messages from the database, updates the assistant's vector store for context retrieval,
        and registers the assistant if not already loaded.

        Args:
            chat_id (int): The ID of the chat session.

        Raises:
            ChatNotExistsError: If no messages exist for the given chat_id.
        """
        if chat_id in self.assistants:
            return

        messages = get_chat_messages(chat_id)
        if not messages:
            raise ChatNotExistsError(chat_id)

        assistant = ResearchAssistant()
        assistant.vector_store = VectorStoreManager()

        for message in messages:
            await assistant.vector_store.add_interaction(
                human_msg=message.user_question,
                ai_msg=message.assistant_answer
            )

        self.assistants[chat_id] = assistant
