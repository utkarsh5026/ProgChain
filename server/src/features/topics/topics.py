import json
import logging
from typing import AsyncGenerator, Optional

from langchain_core.prompts import ChatPromptTemplate
from config.models import Model, get_model
from decode import decode_json
from .lang import TopicsManager

# Configure logging
logger = logging.getLogger(__name__)

# Constants
DIFFICULTY_DELIMITER = "###DIFFICULTY_END###"
VALID_DIFFICULTIES = {"Beginner", "Intermediate", "Advanced"}

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

    For each difficulty level, output a JSON object followed by "###DIFFICULTY_END###" delimiter.
    Generate at least 1 topics for each difficulty level in this format:

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


async def parse_chunk(chunk: str) -> Optional[dict]:
    """
    Parse a chunk of text containing topic information in JSON format.

    Args:
        chunk (str): Raw text chunk containing JSON data and difficulty delimiter

    Returns:
        Optional[dict]: Parsed topics dictionary in format {difficulty: [topics]} or None if parsing fails
    """
    try:
        if DIFFICULTY_DELIMITER not in chunk:
            return None

        json_str = chunk.split(DIFFICULTY_DELIMITER)[0].strip()
        parsed = decode_json(json_str)

        if not all(key in parsed for key in ["difficulty", "topics"]):
            logger.warning(f"Missing required fields in parsed JSON: {parsed}")
            return None

        difficulty, topics = parsed["difficulty"], parsed["topics"]

        if difficulty not in VALID_DIFFICULTIES:
            logger.warning(f"Invalid difficulty level: {difficulty}")
            return None

        for topic in topics:
            if not all(key in topic for key in ["topic", "description"]):
                logger.warning(f"Invalid topic structure: {topic}")
                return None

        return {difficulty: topics}

    except ValueError as e:
        logger.error(f"Failed to parse chunk: {e}\nChunk content: {chunk}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error parsing chunk: {e}")
        return None


async def generate_topics(
    path: list[str],
    model_name: Model = Model.GPT_4O_MINI,
) -> AsyncGenerator[dict, None]:
    """
    Generate programming topics based on the given path hierarchy.

    Args:
        path (list[str]): Hierarchical path of topics
        model_name (Model): Language model to use for generation
        output_file (str): Path to save the generated topics JSON
        debug_file (str): Path to save raw model output for debugging

    Yields:
        dict: Generated topics grouped by difficulty level

    Raises:
        ValueError: If path is empty or invalid
    """
    # Validate input
    if not path:
        raise ValueError("Path cannot be empty")

    try:
        llm = get_model(model_name)
        context = '>'.join(path)
        current_topic = path[-1]
        explored = ""  # TODO: Implement explored topics tracking

        chain = topic_generator_template | llm

        buffer = ""
        async for chunk in chain.astream({
            "current_topic": current_topic,
            "context": context,
            "explored_topics": explored
        }):
            buffer += chunk.content
            if parsed := await parse_chunk(buffer):
                difficulty_end_pos = buffer.find(
                    DIFFICULTY_DELIMITER) + len(DIFFICULTY_DELIMITER)
                buffer = buffer[difficulty_end_pos:] if difficulty_end_pos > -1 else buffer

                yield parsed

    except Exception as e:
        logger.error(f"Error generating topics: {e}")
        raise
