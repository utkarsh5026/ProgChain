import asyncio
from cachetools import LRUCache
from typing import Optional, AsyncGenerator
from pydantic import BaseModel, Field

from config.models import Model
from core import ChatGenerateOptions
from fastapi_components import ListDataRequest

from . import models, llm, chat


class ThreadGenerate(BaseModel):
    thread_id: str = Field(description="The id of the thread")
    model: str = Field(
        description="The model to use for the thread", default=Model.GPT_4O_MINI.value)
    extra_instructions: Optional[str] = Field(
        description="Extra instructions for the thread")


class Content(BaseModel):
    thread_topic: str = Field(description="The topic of the thread")
    content: str = Field(description="The content of the thread")
    current_idx: int = Field(description="The current index of the content")
    content_id: int = Field(description="The id of the content")


class ThreadGenerateResponse(BaseModel):
    thread_id: int = Field(description="The id of the thread")
    content: Content = Field(description="The content of the thread")


class Thread:
    def __init__(self, topic: str, thread_pid: str, previous_concepts=None) -> None:
        """
        Initialize the Thread with a topic, id, and previous concepts.
        """
        if previous_concepts is None:
            previous_concepts = []
        self.id = thread_pid
        self.topic = topic
        self.content_generator = llm.ContentGenerator(
            topic=topic,
            previous_concepts=previous_concepts
        )
        self.current_idx = 0
        self.is_generating = False
        self.generation_lock = asyncio.Lock()
        self.content_queue = asyncio.Queue()

    async def __create_content_model(self, thread_topic: str, content: str) -> str:
        """
        Create a new ThreadContent instance in the DB asynchronously.
        """
        return await models.ThreadContent.create(
            thread_public_id=self.id,
            topic=thread_topic,
            content=content
        )

    async def generate_content(
            self,
            model: str = Model.GPT_4O_MINI.value,
            extra_instructions: Optional[str] = None
    ) -> AsyncGenerator[Content, None]:
        """
        Generate content asynchronously via the content generator.
        """
        async with self.generation_lock:
            if self.is_generating:
                while True:
                    try:
                        content = await self.content_queue.get()
                        yield content
                    except Exception:
                        break
            else:
                self.is_generating = True
                try:
                    async for data in self.content_generator.generate_content_stream(self.current_idx, model):
                        self.current_idx += 1
                        topic = data.topic
                        content = data.topic_content
                        content_id = await self.__create_content_model(topic, content)

                        content = Content(
                            thread_topic=topic,
                            content=content,
                            current_idx=self.current_idx,
                            content_id=content_id
                        )

                        await self.content_queue.put(content)
                        yield content
                finally:

                    self.is_generating = False
                    while not self.content_queue.empty():
                        self.content_queue.get_nowait()


class ThreadService:
    """
    Service class for managing thread operations, including creation and content generation.
    """

    def __init__(self):
        """
        Initialize the ThreadService with an empty threads dictionary.

        The dictionary maps thread IDs to their corresponding Thread instances.
        """
        self.threads = LRUCache[str, Thread](maxsize=1000)

    async def __create_thread(self, topic: str) -> str:
        """
        Create a new thread entry in the database asynchronously.

        Args:
            topic (str): The topic or title for the new thread.

        Returns:
            int: The unique identifier of the created thread.
        """
        thread_id = await models.Thread.create(topic=topic)
        self.threads[thread_id] = Thread(topic=topic, thread_pid=thread_id)
        return thread_id

    async def __load_thread(self, thread_id: str) -> Thread:
        """
        Load a thread from the database asynchronously.
        """
        thread, contents = await models.Thread.load_thread_contents(thread_public_id=thread_id)
        content_list = [content.content for content in contents]
        self.threads[thread_id] = Thread(
            topic=thread.topic,
            thread_pid=thread_id,
            previous_concepts=content_list
        )
        return self.threads[thread_id]

    async def generate_content(self, thread_generate: ThreadGenerate) -> AsyncGenerator[ThreadGenerateResponse, None]:
        """
        Generate content for a specific thread asynchronously based on given generation parameters.


        This method retrieves the thread using the provided thread ID and then yields content chunks
        as they are generated by the thread's content generator.

        Args:
            thread_generate (ThreadGenerate): An object containing the following attributes:
                - thread_id (int): The ID of the thread for which to generate content.
                - model (str): The model identifier to be used for content generation.
                - extra_instructions (Optional[str]): Additional instructions to guide the content generation.

        Yields:
            ThreadGenerateResponse: A response object containing the thread ID and a generated content chunk.

        Raises:
            ValueError: If the thread associated with the provided thread ID does not exist.
        """
        thread_id = thread_generate.thread_id
        model = thread_generate.model
        extra_instructions = thread_generate.extra_instructions

        if thread_id not in self.threads:
            await self.__load_thread(thread_id)
            return

        content_generator = self.threads[thread_id]
        async for content in content_generator.generate_content(model, extra_instructions):
            yield ThreadGenerateResponse(
                thread_id=thread_id,
                content=content,
            )

    async def create_thread(
            self,
            topic: str,
            model: str = Model.GPT_4O_MINI.value,
            extra_instructions: Optional[str] = None
    ) -> AsyncGenerator[ThreadGenerateResponse, None]:
        """
        Create a new thread in the database and initiate its content generation process asynchronously.

        This method creates a new thread record and then immediately starts generating its content
        using the specified model and any extra instructions provided.

        Args:
            topic (str): The topic or title for the new thread.
            model (str, optional): The model identifier for content generation. Defaults to Model.GPT_4O_MINI.value.
            extra_instructions (Optional[str], optional): Additional instructions for content generation. Defaults to None.

        Yields:
            ThreadGenerateResponse: A response object containing the thread ID and a generated content chunk.
        """
        thread_id = await self.__create_thread(topic)
        thread_generate = ThreadGenerate(
            thread_id=thread_id,
            model=model,
            extra_instructions=extra_instructions
        )
        async for content in self.generate_content(thread_generate):
            yield content

    @classmethod
    async def get_all_threads(cls, request: ListDataRequest) -> list[Thread]:
        """
        Get all threads from the database.
        """
        return await models.Thread.get_pagination(cursor=request.timestamp, limit=request.limit)

    @classmethod
    async def get_thread_contents(cls, thread_id: str, request: ListDataRequest) -> list[dict]:
        """
        Get all contents for a given thread.
        """
        return await get_thread_contents(thread_id)


class ThreadContentChatService:
    """
    Service class for managing thread content operations, including creation and chat.

    This service provides functionalities to handle chat interactions related to thread content.
    It allows for the creation of chat streams, stopping ongoing chats, and retrieving chat history
    for specific thread content.

    Attributes:
        thread_content_chats (LRUCache): A cache to store active chat sessions for quick access.

    Methods:
        stop_chat(thread_content_id: str) -> None:
            Stops the chat generation for the specified thread content ID.

        create_chat_stream(thread_content_id: str, options: ChatGenerateOptions) -> AsyncGenerator:
            Creates a streaming chat generator for the specified thread content ID, yielding chat messages
            as they are generated.

        get_chats_for_thread_content(content_public_id: str) -> list[dict]:
            Retrieves the chat history for the specified thread content ID, returning a list of chat messages
            in dictionary format.
    """

    def __init__(self) -> None:
        """
        Initializes the ThreadContentChatService, setting up the cache for thread content chats.
        """
        self.thread_content_chats: LRUCache[str, chat.ThreadIDChat] = LRUCache(
            maxsize=1000)

    def stop_chat(self, thread_content_id: str) -> None:
        """
        Stops the chat generation for the specified thread content ID.

        Args:
            thread_content_id (str): The ID of the thread content whose chat should be stopped.
        """
        if thread_content_id in self.thread_content_chats:
            self.thread_content_chats[thread_content_id].stop_generation()

    async def __get_chat_generator(self, thread_content_id: str) -> chat.ThreadIDChat:
        """
        Retrieves or creates a chat generator for the specified thread content ID.

        If a chat generator does not already exist in the cache, a new one is created.

        Args:
            thread_content_id (str): The ID of the thread content for which to get the chat generator.

        Returns:
            ThreadIDChat: The chat generator associated with the specified thread content ID.
        """
        if thread_content_id not in self.thread_content_chats:
            new_chat = await chat.ThreadIDChat.create(thread_content_id)
            self.thread_content_chats[thread_content_id] = new_chat
        return self.thread_content_chats[thread_content_id]

    async def create_chat_stream(self, thread_content_id: str, options: ChatGenerateOptions):
        """
        Creates a streaming chat generator for the specified thread content ID.

        This method yields chat messages as they are generated, buffering them until the specified
        buffer size is reached.

        Args:
            thread_content_id (str): The ID of the thread content for which to create the chat stream.
            options (ChatGenerateOptions): Options for generating chat responses.

        Returns:
            AsyncGenerator: An asynchronous generator that yields chat messages.
        """
        chat_generator = await self.__get_chat_generator(thread_content_id)

        async def stream_chat():
            async for chunk in chat_generator.stream_chat(options):
                yield chunk

        return stream_chat

    @classmethod
    async def get_chats_for_thread_content(cls, content_public_id: str) -> list[dict]:
        """
        Retrieves the chat history for the specified thread content ID.

        Args:
            content_public_id (str): The public ID of the thread content for which to retrieve chats.

        Returns:
            list[dict]: A list of chat messages in dictionary format.
        """
        chats = await models.ThreadContent.get_chats(content_public_id)
        return [chat.to_dict() for chat in chats]
