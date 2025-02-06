from langchain_core.prompts import ChatPromptTemplate
from config.models import Model, get_model
from pydantic import BaseModel, Field
from typing import AsyncGenerator

from decode import decode_json


class Question(BaseModel):
    question_text: str = Field(description="The actual question text")
    user_assesment: str = Field(
        description="Brief explanation of what this question assesses")


question_generator_template = ChatPromptTemplate.from_messages([
    ("system", """You are an experienced technical interviewer with deep knowledge across various programming and software engineering domains.

    Topic: {topic}
    Context: {context}

    Generate interview questions for each difficulty level that:
    1. Are specifically related to the current topic
    2. Test different aspects (theoretical knowledge, practical application, problem-solving)
    3. Include a mix of question types (open-ended, scenario-based, coding challenges)

    For each difficulty level, output a JSON object followed by "###DIFFICULTY_END###" delimiter.
    Generate at least 3 questions for each difficulty level in this format:

    {{"difficulty": "Beginner", "questions": [
        {{"question": "Question text",
         "type": "Question type",
         "assessment": "What this question assesses"
        }},
        ...
    ]}}###DIFFICULTY_END###

    {{"difficulty": "Intermediate", "questions": [
        {{"question": "Question text",
         "type": "Question type",
         "assessment": "What this question assesses"
        }},
        ...
    ]}}###DIFFICULTY_END###

    {{"difficulty": "Advanced", "questions": [
        {{"question": "Question text",
         "type": "Question type",
         "assessment": "What this question assesses"
        }},
        ...
    ]}}###DIFFICULTY_END###

    Ensure each JSON object is valid and complete before the delimiter."""),
    ("human", "Generate questions for {topic}")
])

DIFFICULTY_DELIMITER = "###DIFFICULTY_END###"


async def parse_chunk(chunk: str) -> dict | None:
    try:
        if DIFFICULTY_DELIMITER not in chunk:
            return None
        json_str = chunk.split(DIFFICULTY_DELIMITER)[0].strip()
        parsed = decode_json(json_str)
        difficulty, questions = parsed["difficulty"], parsed["questions"]

        return {
            difficulty: questions
        }
    except ValueError:
        print(chunk)
        return None


async def generate_interview_questions(topic: str, context: str, model_name: str = Model.GPT_4O_MINI.value) -> AsyncGenerator[dict, None]:
    if not topic:
        raise ValueError("Topic is required")

    llm = get_model(model_name)
    chain = question_generator_template | llm

    buffer = ""

    with open("interview_questions.txt", "w") as f:
        f.write("")

    async for chunk in chain.astream({"topic": topic, "context": context}):
        buffer += chunk.content
        if parsed := await parse_chunk(buffer):

            difficulty_end_pos = buffer.find(
                DIFFICULTY_DELIMITER) + len(DIFFICULTY_DELIMITER)
            buffer = buffer[difficulty_end_pos:] if difficulty_end_pos > -1 else buffer

            with open("interview_questions.txt", "a") as f:
                import json
                f.write(json.dumps(parsed))

            yield parsed
