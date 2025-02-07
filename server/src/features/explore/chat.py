from typing import Optional
from asyncio import create_task, Lock

from typing import AsyncGenerator
from core.chat.chat import ChatConfig
from core.vector.store import VectorDB
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from core import ChatGenerateOpions, BaseChatSystem
from .db_models import get_chat_messages, add_chat_message, create_empty_chat, update_chat_topic

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
    async def create(cls, chat_id: Optional[int] = None):
        if chat_id is None:
            chat_id = await create_empty_chat()

        initial_context = await cls.create_context(chat_id)
        return cls(
            chat_id=chat_id,
            prompt=ChatPromptTemplate.from_messages([
                ("system", cls.system_prompt),
                ("human", "{input}"),
                MessagesPlaceholder(variable_name="relevant_history")
            ]),
            initial_context=initial_context
        )

    def __init__(self, chat_id: int,  prompt: ChatPromptTemplate, vector_db: Optional[VectorDB] = None, config: Optional[ChatConfig] = None, initial_context: str = "") -> None:
        super().__init__(prompt, vector_db, config, initial_context)
        self.chat_id = chat_id
        self.topic = None
        self.lock = Lock()

    async def generate_answer(self, message: str, options: ChatGenerateOpions) -> AsyncGenerator[str, None]:
        """
        Generate an answer for a given question with optional extra instructions.

        This method performs the following steps:
          1. Composes a formatted input by combining the question and any extra instructions.
          2. Retrieves relevant conversation history from the vector store.
          3. Constructs a chain by combining the chat prompt, the selected model, and an output parser.
          4. Streams response chunks asynchronously while accumulating the full response.
          5. Saves the complete interaction to the vector store.

        Parameters:
          message: The user's question or prompt.
          model: The language model to use for generating the answer (defaults to GPT_4O).
          extra_instructions: Additional instructions to tailor the response.

        Returns:
          An asynchronous generator that yields parts of the generated answer as they are produced.
        """
        model, extra_instructions = options.model, options.extra_instructions
        machine_answer = []
        try:
            async for chunk in self.generate_response(message, model, extra_instructions):
                machine_answer.append(chunk)
                yield chunk
        finally:
            if self.topic is None:
                create_task(self._set_chat_topic(message))
            assistant_answer = "".join(machine_answer)
            create_task(
                add_chat_message(self.chat_id, message, assistant_answer)
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
            ("system", "You are a helpful assistant that determines the topic of a question. Only give the topic, no other text."),
            ("human", "Question: {question}"),
        ])
        small_model = get_model(Model.GPT_4O_MINI.value)
        chain = prompt | small_model | StrOutputParser()
        self.topic = await chain.ainvoke({"question": question})
        await update_chat_topic(self.chat_id, self.topic)

    @classmethod
    async def create_context(cls, chat_id: int) -> str:
        chat_messages = await get_chat_messages(chat_id)
        context = ""
        for message in chat_messages:

            uq = message.user_question
            aq = message.assistant_answer
            context += f"User: {uq}\nAssistant: {aq}\n"

        return cls.system_prompt + "\n\n" + context
