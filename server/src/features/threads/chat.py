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
    @classmethod
    async def create(cls, thread_content_id: str) -> "ThreadIDChat":
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

        super().__init__(prompt, vector_db, config, initial_context)
        self.thread_content_id = thread_content_id

    async def stream_chat(self, options: ChatGenerateOptions) -> AsyncGenerator[dict, None]:
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
