from typing import AsyncGenerator
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from config.models import Model, get_model
from langchain_core.output_parsers import StrOutputParser
from pydantic import BaseModel
from .vector import VectorStoreManager


class ResearchAssistant:
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

    def __init__(self) -> None:
        self.chat_prompt = ChatPromptTemplate.from_messages([
            ("system", self.system_prompt),
            ("human", "{input}"),
            MessagesPlaceholder(variable_name="relevant_history")
        ])
        self.vector_store = VectorStoreManager()

    async def generate_answer(self, message: str, model: str = Model.GPT_4O.value, extra_instructions: str = "") -> AsyncGenerator[str, None]:
        chain = self.chat_prompt | get_model(model) | StrOutputParser()
        formatted_input = f"Question: {message}\n{extra_instructions}"
        relevant_history = await self.vector_store.get_relevant_history(formatted_input)

        print("relevant_history", relevant_history)

        response_chunks = []

        async for chunk in chain.astream({
            "input": formatted_input,
            "relevant_history": relevant_history
        }):
            response_chunks.append(chunk)
            yield chunk

        full_response = "".join(response_chunks)
        await self.vector_store.add_interaction(human_msg=message, ai_msg=full_response)

    async def clear_history(self):
        await self.vector_store.clear()


assistant = ResearchAssistant()


async def explore_topic(
    topic: str,
    depth: str = "comprehensive",
    focus_areas: str = "all",
    model_name: str = Model.GPT_4O.value
):
    """
    Explore a topic in depth with the research assistant, with streaming support

    Args:
        topic (str): The main topic or question to explore
        depth (str): Desired depth of exploration
        focus_areas (str): Specific aspects or areas to focus on
        model_name (str): The model to use for generation

    Returns:
        AsyncGenerator: Yields chunks of the response as they become available
    """

    async for chunk in assistant.generate_answer(
        message=topic,
        model=model_name,
        extra_instructions=f"Depth: {depth}\nFocus Areas: {focus_areas}"
    ):
        yield chunk
