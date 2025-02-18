import asyncio
from typing import Optional, AsyncGenerator
from core.chat.chat import ChatConfig

from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from core import ChatGenerateOptions, BaseChatSystem, VectorDB
from .models import ExploreChat, ExploreChatMessage

from config.models import Model, get_model


class ChatNotFoundError(Exception):

    def __init__(self, chat_id: int):
        self.chat_id = chat_id
        super().__init__(f"Chat with id {chat_id} not found")


class ResearchAssistant(BaseChatSystem):

    """
    ResearchAssistant is an advanced tool for deep technical exploration.


    It helps users understand complex technical topics by providing clear, detailed, and accurate explanations,
    along with thought-provoking follow-up questions to deepen understanding.

    The assistant uses a chat prompt template combined with contextual history from its vector store to generate
    informative and well-structured responses.
    """
    system_prompt = """You are an advanced research assistant specializing in deep technical exploration. 
Your role is to help users understand complex technical topics by providing clear, detailed, and accurate explanations.

Feel free to structure your response in the way that best suits the topic and the user's needs. You can include:
- Explanations and definitions
- Technical details and examples
- Practical applications
- Code snippets when relevant
- Diagrams or visual descriptions when helpful
- Common pitfalls and best practices

At the end of your response, always include:
3 to 4 thought-provoking questions that will deepen the user's understanding of this topic. These questions should:
- Progress from fundamental concepts to advanced applications
- Help explore edge cases and important considerations
- Encourage critical thinking about the topic
"""

    @classmethod
    async def create(cls, chat_id: Optional[str] = None):
        chat = await cls._load_or_create_chat(chat_id)
        initial_context = await cls.create_context(chat.id)
        return cls(
            chat=chat,
            prompt=ChatPromptTemplate.from_messages([
                ("system", cls.system_prompt),
                ("human", "{input}"),
                MessagesPlaceholder(variable_name="relevant_history")
            ]),
            initial_context=initial_context
        )

    @classmethod
    async def _load_or_create_chat(cls, chat_id: Optional[str]) -> ExploreChat:
        if chat_id is None:
            return await ExploreChat.create_empty_chat()
        return await ExploreChat.get_by_public_id(chat_id)

    def __init__(self, chat: ExploreChat,  prompt: ChatPromptTemplate, vector_db: Optional[VectorDB] = None, config: Optional[ChatConfig] = None, initial_context: str = "") -> None:
        super().__init__(prompt, vector_db, config, initial_context)
        self._chat_public_id = chat.public_id
        self._chat_internal_id = chat.id
        self.topic = None
        self.lock = asyncio.Lock()

    async def generate_answer(self, options: ChatGenerateOptions) -> AsyncGenerator[dict, None]:
        """
        Generate an answer for a given question with optional extra instructions.

        This method performs the following steps:
          1. Composes a formatted input by combining the question and any extra instructions.
          2. Retrieves relevant conversation history from the vector store.
          3. Constructs a chain by combining the chat prompt, the selected model, and an output parser.
          4. Streams response chunks asynchronously while accumulating the full response.
          5. Saves the complete interaction to the vector store.

        Parameters:
          options: The chat generation options including the model name and extra instructions.

        Returns:
          An asynchronous generator that yields parts of the generated answer as they are produced.
        """
        machine_answer = []
        chat_public_id = await self._create_empty_chat_message()

        try:
            async for chunk, metadata in self.generate_response(options):
                machine_answer.append(chunk)
                yield {
                    "chat_id": self._chat_public_id,
                    "chat_message_id": chat_public_id,
                    "message": chunk,
                    "llm_metadata": metadata.model_dump()
                }
        finally:
            await self._reflect_db_changes(options.question, machine_answer)

    async def _reflect_db_changes(self, message: str, machine_answer: list[str]):
        """
        Reflects changes in the database by updating the chat topic and the chat message.

        This method ensures that the chat topic is set if it is not already set, and updates the chat message
        with the latest user question and assistant answer.
        """
        if self.topic is None:
            await asyncio.create_task(self._set_chat_topic(message))
        assistant_answer = "".join(machine_answer)
        await asyncio.create_task(
            ExploreChatMessage.update_chat_message(
                self._chat_internal_id,
                user_question=message,
                assistant_answer=assistant_answer
            )
        )

    async def _set_chat_topic(self, question: str) -> str:
        """
        Determine the chat topic based on the provided question.

        Uses a system prompt and a lightweight model to extract a concise topic from the question.

        Args:
            question (str): The user's question.

        Returns:
            str: The determined chat topic.
        """
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a helpful assistant that determines the topic of a question. Only give the topic, "
                       "no other text."),
            ("human", "Question: {question}"),
        ])
        small_model = get_model(Model.GPT_4O_MINI.value)
        chain = prompt | small_model | StrOutputParser()
        self.topic = await chain.ainvoke({"question": question})
        await ExploreChat.update_chat_topic(self._chat_internal_id, self.topic)

    @classmethod
    async def create_context(cls, chat_internal_id: int) -> str:
        """
        Create a context string for the chat based on the internal ID.

        This method retrieves all messages associated with the specified chat and formats them into a context string.
        The context includes the user's questions and the assistant's answers.
        """
        chat_messages = await ExploreChatMessage.get_messages_by_internal_id(chat_internal_id)
        context = ""
        for message in chat_messages:
            uq = message.user_question
            aq = message.assistant_answer
            context += f"User: {uq}\nAssistant: {aq}\n"
        return cls.system_prompt + "\n\n" + context

    async def _create_empty_chat_message(self) -> str:
        """
        Create an empty chat message for the chat.

        This method creates an empty chat message for the chat and returns its public ID.
        """
        return await ExploreChatMessage.create_empty_chat_message(self._chat_internal_id, self._chat_public_id)
