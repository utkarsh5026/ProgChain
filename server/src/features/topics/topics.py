from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from config.models import Model, get_model
from .lang import TopicsManager
import json
from typing import AsyncGenerator

manager = TopicsManager()

topic_generator_template = ChatPromptTemplate.from_messages([
    ("system", """You are an expert at creating comprehensive programming topic hierarchies.
    Current Topic: {current_topic}
    Previously Explored Topics: {explored_topics}
    Context: {context}

    Generate new programming topics that:
    1. Are logically related to the current topic
    2. Haven't been covered in the previously explored topics
    3. Provide a natural progression in complexity
    4. Include both breadth and depth of knowledge

    For each topic, provide:
    - The difficulty level (Beginner, Intermediate, Advanced)
    - A short description of the topic

    Format the response as a json object with the following structure, Generate at least 6 topics for each difficulty level:
    {{
        "Beginner": [
            {{"topic": "Topic Name", "description": "Topic Description"}},
            ...
        ],
        "Intermediate": [
            {{"topic": "Topic Name", "description": "Topic Description"}},
            ...
        ],
        "Advanced": [
            {{"topic": "Topic Name", "description": "Topic Description"}},
            ...
        ]
    }}

    Focus on discovering novel but relevant subtopics that expand the learner's understanding. Don't add anything extra content"""),
    ("human", "Generate topics for {current_topic}")
])


def parse_topic_response(response: str) -> dict[str, list[dict[str, str]]]:
    try:
        return json.loads(response)
    except json.JSONDecodeError:
        start = response.find('{')
        end = response.rfind('}')

        if start == -1 or end == -1:
            raise ValueError("No valid JSON object found in response")

        json_str = response[start:end + 1]
        return json.loads(json_str)


async def generate_topics(path: list[str], model_name: Model = Model.GPT_4O_MINI) -> AsyncGenerator[dict, None]:
    if path is None or len(path) == 0:
        raise ValueError("Path is required")

    llm = get_model(model_name)
    context = '>'.join(path)
    current_topic = path[-1]
    explored = ""

    chain = topic_generator_template | llm | JsonOutputParser()
    result = await chain.ainvoke({"current_topic": current_topic,
                                 "context": context,
                                  "explored_topics": explored})
    return result
