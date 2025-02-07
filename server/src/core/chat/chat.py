from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from pydantic import BaseModel, Field
from typing import Optional, AsyncGenerator, Callable
from core.vector.store import VectorDB
from config.models import get_model, Model


class ChatGenerateOpions(BaseModel):
    model: Optional[str] = Field(
        default=Model.GPT_4O_MINI.value,
        description="The model to use for the chat")
    extra_instructions: Optional[str] = Field(
        default="",
        description="Additional instructions for the chat")


class ChatConfig(BaseModel):
    """Essential configuration settings for the chat system"""
    temperature: float = Field(
        default=0.7, description="Controls response creativity")
    search_k: int = Field(
        default=5, description="Number of context documents to retrieve")
    use_memory: bool = Field(default=True, description="Enable context memory")
    after_generate_success: Optional[Callable[[str], None]] = None


class BaseChatSystem:
    """

    A focused chat system that prioritizes generating high-quality responses
    while maintaining conversation context. This implementation emphasizes
    simplicity and effectiveness in handling technical discussions.
    """

    def __init__(self,
                 prompt: Optional[ChatPromptTemplate] = None,
                 vector_db: Optional[VectorDB] = None,
                 config: Optional[ChatConfig] = None,
                 initial_context: str = "") -> None:
        self.config = config or ChatConfig()

        self.vector_db = vector_db or VectorDB(
            initial_text=initial_context,
            search_k=self.config.search_k,
            use_memory=self.config.use_memory
        )

        self.prompt = prompt or self._create_default_prompt()
        self.output_parser = StrOutputParser()
        self._stop_generating = False

    def _create_default_prompt(self) -> ChatPromptTemplate:
        """
        Create a comprehensive prompt template that guides the model
        in generating high-quality technical responses.
        """

        system_prompt = """You are an expert technical assistant specializing in programming interviews and software development. Your responses should be thorough, accurate, and educational.

Context from Previous Discussions:
{context}

Guidelines for Response:
1. Start with a clear understanding of the question
   - Ask clarifying questions if needed
   - State any assumptions you're making
   - Identify key requirements and constraints

2. Provide comprehensive explanations
   - Break down complex concepts into manageable parts
   - Use practical examples to illustrate points
   - Connect ideas to fundamental principles
   - Include relevant code examples with detailed comments

3. Consider multiple perspectives
   - Present alternative approaches when applicable
   - Discuss trade-offs and their implications
   - Explain why certain solutions are preferred

4. Focus on best practices
   - Emphasize clean code principles
   - Address performance considerations
   - Include error handling and edge cases
   - Consider scalability implications

Current Question: {input}
Additional Instructions: {instructions}

Respond in a way that builds upon our previous discussion while maintaining technical accuracy and educational value."""

        return ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "{input}")
        ])

    async def generate_response(
        self,
        question: str,
        model: Optional[str] = None,
        extra_instructions: str = "",
        buffer_size: int = 10
    ) -> AsyncGenerator[str, None]:
        """

        Generate a context-aware response that builds upon previous interactions.

        Parameters:
            question: The user's current question
            extra_instructions: Additional guidance for response generation
        """

        model = get_model(model=model)

        try:
            relevant_history = await self.vector_db.query_history(question)
            chain_input = {
                "input": question,
                "relevant_history": relevant_history,
                "instructions": extra_instructions
            }

            chain = self.prompt | model | self.output_parser
            self._stop_generation = False
            # buffer = []
            async for chunk in chain.astream(chain_input):
                if self._stop_generation:
                    break

                yield chunk

        finally:
            self._stop_generation = False

    def stop_generation(self) -> None:
        """Stop the current response generation process."""
        self._stop_generation = True

    async def clear_context(self, initial_context: Optional[str] = None) -> None:
        """
        Reset the conversation context, optionally providing new initial context.
        """
        await self.vector_db.clear(initial_context)
