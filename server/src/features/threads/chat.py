from loguru import logger
from typing import Optional, AsyncGenerator
from langchain_core.prompts import ChatPromptTemplate

from core import BaseChatSystem, ChatConfig, ChatGenerateOptions, VectorDB
from . import models


class ThreadIDChatError(Exception):
    def __init__(self, thread_content_id: str):
        super().__init__(f"Thread content with id {
            thread_content_id} not found")


class ThreadIDChat(BaseChatSystem):
    """
    ThreadIDChat is a class that manages chat interactions for a specific thread content.

    It allows for the creation of chat instances associated with a thread content ID and facilitates
    streaming chat responses based on user questions.
    """

    @classmethod
    async def create(cls, thread_content_id: str) -> "ThreadIDChat":
        """
        Asynchronously creates a ThreadIDChat instance for the specified thread content ID.

        Args:
            thread_content_id (str): The unique identifier for the thread content.

        Returns:
            ThreadIDChat: An instance of ThreadIDChat initialized with the thread content.

        Raises:
            ThreadIDChatError: If the thread content with the specified ID is not found.
        """
        try:
            thread_content = await models.ThreadContent.get_by_public_id(
                thread_content_id)
            return cls(
                thread_content_id=thread_content_id,
                initial_context=thread_content.content
            )
        except Exception:
            logger.error(
                f"Thread content with id {thread_content_id} not found")
            raise ThreadIDChatError(thread_content_id)

    def __init__(self,
                 thread_content_id: str,
                 prompt: Optional[ChatPromptTemplate] = None,
                 vector_db: Optional[VectorDB] = None,
                 config: Optional[ChatConfig] = None,
                 initial_context: str = "") -> None:
        """
        Initializes a ThreadIDChat instance.

        Args:
            thread_content_id (str): The unique identifier for the thread content.
            prompt (Optional[ChatPromptTemplate]): The prompt template for generating responses.
            vector_db (Optional[VectorDB]): The vector database for chat data.
            config (Optional[ChatConfig]): Configuration options for the chat system.
            initial_context (str): The initial context associated with the thread.
        """
        super().__init__(prompt, vector_db, config, initial_context)
        self.thread_content_id = thread_content_id

    async def stream_chat(self, options: ChatGenerateOptions) -> AsyncGenerator[dict, None]:
        """
        Asynchronously streams chat responses based on the provided options.

        Args:
            options (ChatGenerateOptions): Options for generating chat responses, including the user's question.

        Yields:
            dict: A dictionary containing the content ID, generated content, and associated metadata.
        """
        contents = []
        try:
            async for chunk, metadata in self.generate_response(options):
                contents.append(chunk)
                yield {
                    "content_id": self.thread_content_id,
                    "content": chunk,
                    "metadata": metadata
                }

        finally:
            self.stop_generation()
            await models.ThreadContentChat.create_chat(
                content_public_id=self.thread_content_id,
                user_question=options.question,
                ai_answer="".join(contents)
            )
