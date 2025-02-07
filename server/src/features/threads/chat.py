from core import BaseChatSystem, ChatConfig, ChatGenerateOpions
from core.vector.store import VectorDB
from langchain_core.prompts import ChatPromptTemplate
from typing import Optional, AsyncGenerator
from .models import ThreadContentChat, create_chat, get_thread_content


class ThreadIDChatError(Exception):
    def __init__(self, thread_content_id: int):
        super().__init__(f"Thread content with id {
            thread_content_id} not found")


class ThreadIDChat(BaseChatSystem):
    @classmethod
    async def create(cls, thread_content_id: int) -> "ThreadIDChat":
        try:
            thread_content = await get_thread_content(thread_content_id)
            return cls(
                thread_content_id=thread_content_id,
                initial_context=thread_content.content
            )
        except Exception:
            raise ThreadIDChatError(thread_content_id)

    def __init__(self,
                 thread_content_id: int,
                 prompt: Optional[ChatPromptTemplate] = None,
                 vector_db: Optional[VectorDB] = None,
                 config: Optional[ChatConfig] = None,
                 initial_context: str = "") -> None:

        super().__init__(prompt, vector_db, config, initial_context)
        self.thread_content_id = thread_content_id

    async def stream_chat(self, question: str, options: ChatGenerateOpions) -> AsyncGenerator[ThreadContentChat, None]:
        model, extra_instructions = options.model, options.extra_instructions
        contents = []
        try:
            async for chunk in self.generate_response(
                question=question,
                model=model,
                extra_instructions=extra_instructions
            ):
                yield chunk
                contents.append(chunk)

        finally:
            self._stop_generation = False
            await create_chat(
                content_id=self.thread_content_id,
                user_question=question,
                ai_answer="".join(contents)
            )
