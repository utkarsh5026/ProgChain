from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from config.models import Model, get_model
from .lang import TopicsManager
import json
from typing import AsyncGenerator

manager = TopicsManager()
DIFFICULTY_DELIMITER = "###DIFFICULTY_END###"

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

    For each difficulty level, output a JSON object followed by "###DIFFICULTY_END###" delimiter.
    Generate at least 6 topics for each difficulty level in this format:

    {{"difficulty": "Beginner", "topics": [
        {{"topic": "Topic Name", "description": "Topic Description"}},
        ...
    ]}}###DIFFICULTY_END###

    {{"difficulty": "Intermediate", "topics": [
        {{"topic": "Topic Name", "description": "Topic Description"}},
        ...
    ]}}###DIFFICULTY_END###

    {{"difficulty": "Advanced", "topics": [
        {{"topic": "Topic Name", "description": "Topic Description"}},
        ...
    ]}}###DIFFICULTY_END###

    Focus on discovering novel but relevant subtopics that expand the learner's understanding. 
    Ensure each JSON object is valid and complete before the delimiter."""),
    ("human", "Generate topics for {current_topic}")
])


def parse_json(chunk: str) -> dict | None:
    start = chunk.find('{')
    end = chunk.rfind('}')
    if start == -1 or end == -1:
        raise ValueError("Invalid JSON")
    json_str = chunk[start:end + 1]
    return json.loads(json_str)


async def parse_chunk(chunk: str) -> dict | None:
    try:
        if DIFFICULTY_DELIMITER not in chunk:
            return None
        json_str = chunk.split(DIFFICULTY_DELIMITER)[0].strip()
        parsed = parse_json(json_str)
        difficulty, topics = parsed["difficulty"], parsed["topics"]

        return {
            difficulty: topics
        }
    except ValueError:
        print(chunk)
        return None


async def generate_topics(path: list[str], model_name: Model = Model.GPT_4O_MINI) -> AsyncGenerator[dict, None]:
    if path is None or len(path) == 0:
        raise ValueError("Path is required")

    llm = get_model(model_name)
    context = '>'.join(path)
    current_topic = path[-1]
    explored = ""

    chain = topic_generator_template | llm
    with open("topics.json", "w") as f:
        f.write("")

    buffer = ""
    async for chunk in chain.astream({"current_topic": current_topic,
                                      "context": context,
                                      "explored_topics": explored}):

        buffer += chunk.content
        with open("topics.txt", "a") as f:
            f.write(chunk.content)
        if parsed := await parse_chunk(buffer):
            with open("topics.json", "a") as f:
                f.write(json.dumps(parsed))
                f.write("\n")
            difficulty_end_pos = buffer.find(
                DIFFICULTY_DELIMITER) + len(DIFFICULTY_DELIMITER)
            buffer = buffer[difficulty_end_pos:] if difficulty_end_pos > -1 else buffer
            yield parsed
