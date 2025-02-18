import time
from datetime import datetime
from typing import Optional, AsyncGenerator, Callable

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from pydantic import BaseModel, Field

from core.vector.store import VectorDB
from config.models import get_model, Model


class ChatGenerateOptions(BaseModel):
    """Configuration options for generating chat responses."""

    question: str
    """The user's current question that the assistant will respond to."""

    model: Optional[str] = Model.GPT_4O_MINI.value
    """The specific model to be utilized for generating responses in the chat."""

    extra_instructions: Optional[str] = ""
    """Any additional instructions or context that should be considered when generating the response."""


class ResponseMetadata(BaseModel):
    """Metadata associated with a chat response."""

    timestamp: datetime = Field(default_factory=datetime.now)
    """The exact date and time when the response was generated, useful for tracking and logging purposes."""

    model_name: str = Model.GPT_4O_MINI.value
    """The specific name of the model that generated the response, allowing for identification of the model's 
    capabilities and characteristics."""

    latency: float = 0.0
    """The time taken (in seconds) to generate the response, which can be used to assess performance and 
    responsiveness."""

    response_tokens: int = 0
    """The number of tokens in the generated response itself, providing insight into the length and detail of the 
    answer."""

    prompt_tokens: int = 0
    """The number of tokens in the prompt, which can be used to analyze the cost of the request."""


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

    DEFAULT_BUFFER_SIZE = 100

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

    @classmethod
    def _create_default_prompt(cls) -> ChatPromptTemplate:
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
            options: ChatGenerateOptions
    ) -> AsyncGenerator[tuple[str, ResponseMetadata], None]:
        """

        Generate a context-aware response that builds upon previous interactions.

        Parameters:
            options: The chat generation options including the model name and extra instructions.
        """
        start_time = time.time()
        metadata = ResponseMetadata(
            timestamp=datetime.now(),
            model_name=get_model(model=options.model).model_name,
            latency=0.0,
            response_tokens=0,
            prompt_tokens=len(options.question) +
            len(options.extra_instructions)
        )
        async for chunk in self._generate_text(options):
            metadata.latency = time.time() - start_time
            metadata.response_tokens = len(chunk)
            yield chunk, metadata

    def stop_generation(self) -> None:
        """Stop the current response generation process."""
        self._stop_generating = True

    async def clear_context(self, initial_context: Optional[str] = None) -> None:
        """
        Reset the conversation context, optionally providing new initial context.
        """
        await self.vector_db.clear(initial_context)

    async def _generate_text(self, options: ChatGenerateOptions) -> \
            AsyncGenerator[str, None]:
        """
        Generate a text response using the specified model and extra instructions.
        Implements buffering to optimize chunk processing.
        """
        model = get_model(model=options.model)
        buffer = ""

        try:
            chain_input = await self._prepare_chain_input(options)
            chain = self.prompt | model | self.output_parser
            self._stop_generation = False

            async for chunk in chain.astream(chain_input):
                if self._stop_generation:
                    if buffer:
                        yield buffer
                    break

                buffer += chunk
                if len(buffer) >= self.DEFAULT_BUFFER_SIZE:
                    yield buffer
                    buffer = ""

            if buffer:
                yield buffer

        finally:
            self._stop_generation = False

    async def _prepare_chain_input(self, options: ChatGenerateOptions) -> dict:
        """
        Prepare the input for the chain.
        """
        relevant_history = await self.vector_db.query_history(options.question)
        return {
            "input": options.question,
            "relevant_history": relevant_history,
            "instructions": options.extra_instructions
        }
