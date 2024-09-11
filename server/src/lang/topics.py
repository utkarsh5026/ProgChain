from langchain_core.pydantic_v1 import BaseModel
from langchain_core.prompts import PromptTemplate
from config.openai import llm
from typing import List, Dict
import re

topic_generator_template = PromptTemplate(
    input_variables=["main_topic", "context"],
    template="""
    Generate a comprehensive list of programming topics that cover all the essential concepts related to {main_topic}.
    Context: {context}
    For each difficulty level (Beginner, Intermediate, Advanced), provide 5-8 topics with relevant emojis.
    Ensure the topics progress logically and cover the subject thoroughly for each difficulty level.
    Return the result in the following format:
    Beginner: emoji1 topic1, emoji2 topic2, ...
    Intermediate: emoji1 topic1, emoji2 topic2, ...
    Advanced: emoji1 topic1, emoji2 topic2, ...
    and dont include any other text than the topics and emojis.
    """
)


class TopicRequest(BaseModel):
    main_topic: str
    context: str = ""


class TopicOutput(BaseModel):
    emoji: str
    topic: str


topic_chain = topic_generator_template | llm


def parse_topic_response(response: str) -> Dict[str, List[Dict[str, str]]]:
    """
    Parse the topic response string into a structured dictionary.

    This function takes a string response containing topics categorized by difficulty levels,
    and parses it into a dictionary where each difficulty level is a key, and the value is a
    list of dictionaries containing emojis and topic texts.

    Args:
        response (str): A string containing the topic response, formatted as:
                        "Difficulty: emoji topic, emoji topic, ..."

    Returns:
        Dict[str, List[Dict[str, str]]]: A dictionary where:
            - Keys are difficulty levels (e.g., "beginner", "intermediate", "advanced")
            - Values are lists of dictionaries, each containing:
                - "emoji": The emoji associated with the topic
                - "topic": The text description of the topic

    Example:
        Input: "Beginner: 🐍 Python Basics, 🔢 Variables\nIntermediate: 🔁 Loops, 📚 Functions"
        Output: {
            "beginner": [
                {"emoji": "🐍", "topic": "Python Basics"},
                {"emoji": "🔢", "topic": "Variables"}
            ],
            "intermediate": [
                {"emoji": "🔁", "topic": "Loops"},
                {"emoji": "📚", "topic": "Functions"}
            ]
        }
    """
    result = {}
    lines = response.strip().split('\n')

    for line in lines:
        if line.strip() == "" or ":" not in line.strip():
            continue

        level, topics = line.split(':', 1)
        level = level.strip().lower()
        topic_list = []

        for topic in topics.strip().split(','):
            topic = topic.strip()
            parts = topic.split(' ', 1)

            emoji, topic_text = parts
            topic_list.append({"emoji": emoji, "topic": topic_text.strip()})

        result[level] = topic_list

    return result


def generate_topics(main_topic: str, context: List[str]) -> Dict[str, List[Dict[str, str]]]:
    """
    Generate a list of programming topics based on a main topic and optional context.

    This function uses a language model to generate a comprehensive list of programming topics
    related to the given main topic. The topics are categorized by difficulty level
    (Beginner, Intermediate, Advanced) and include relevant emojis.

    Args:
        main_topic (str): The main programming topic to generate subtopics for.
        context (List[str]): Optional list of context strings to provide additional
                             information for topic generation.

    Returns:
        Dict[str, List[Dict[str, str]]]: A dictionary where keys are difficulty levels
        (beginner, intermediate, advanced) and values are lists of dictionaries.
        Each dictionary in the list contains two keys:
        - "emoji": The emoji associated with the topic.
        - "topic": The text description of the topic.
    """
    context_str = " > ".join(context) if context else "None"
    try:
        result = topic_chain.invoke(input={
            "main_topic": main_topic,
            "context": context_str
        })
        result_content = result.content
        print(result_content)
        return parse_topic_response(result_content)
    except Exception as e:
        print(f"Error generating topics: {e}")
        return {}
