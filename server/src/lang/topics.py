from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
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
    """
)


class TopicRequest(BaseModel):
    main_topic: str
    context: str = ""


class TopicList(BaseModel):
    beginner: list[str] = Field(description="List of beginner topics")
    intermediate: list[str] = Field(description="List of intermediate topics")
    advanced: list[str] = Field(description="List of advanced topics")


topic_chain = topic_generator_template | llm


def parse_topics(text):
    # Split the text into sections
    sections = re.split(r'###\s+(\w+):', text)

    # Remove the first empty element
    sections = sections[1:]

    result = {}
    for i in range(0, len(sections), 2):
        level = sections[i].strip().lower()
        topics = sections[i+1].strip().split('\n')

        # Clean up each topic
        cleaned_topics = [topic.strip().replace('**', '')
                          for topic in topics if topic.strip()]

        result[level] = cleaned_topics

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
        print("result_content")
        print(result_content)
        return parse_topics(result_content)
    except Exception as e:
        print(f"Error generating topics: {e}")
        return {}
