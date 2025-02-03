from langchain_core.prompts import ChatPromptTemplate
from config.models import Model, get_model
from langchain_core.output_parsers import StrOutputParser
# Define the system prompt for a research assistant
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

prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human",
     "Research Topic: {input}\nExploration Depth: {depth}\nFocus Areas: {focus_areas}")
])


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
    chain = prompt | get_model(model_name) | StrOutputParser()

    async for chunk in chain.astream({
        "input": topic,
        "depth": depth,
        "focus_areas": focus_areas,
    }):
        yield chunk
