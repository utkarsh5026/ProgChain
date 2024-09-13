from config.openai import llm
from langchain_core.prompts import PromptTemplate

prompt = PromptTemplate(
    input_variables=["topic"],
    template="""
    Analyze the following topic and determine if it's related to programming.
    If it's not related to programming, respond with 'No: [reason]'.
    If it is related to programming, sanitize and enhance the topic, making it more specific and correct.
    Then respond with 'Yes: [enhanced topic]'.

    Topic: {topic}

    Response:
    """
)

chain = prompt | llm


async def is_prog_topic(topic: str) -> tuple[bool, str]:
    result = await chain.ainvoke({"topic": topic})
    response = result.content.strip()

    if response.lower().startswith("no:"):
        return False, response[3:].strip()
    elif response.lower().startswith("yes:"):
        return True, response[4:].strip()
    else:
        raise ValueError("Unexpected response format from LLM")
