from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from lang.quiz import QuizGenerate
from lang.sanitize import is_prog_topic
from lang.quiz import generate_quiz as generate_quiz_lang, QuizQuestion


router = APIRouter(prefix="/quiz", tags=["quiz"])


class QuizGenerateResponse(BaseModel):
    topic: str
    questions: list[QuizQuestion]


def read_test_quiz():
    import json
    with open("test/quiz.json", "r") as f:
        return json.load(f)


@router.post("/generate")
async def generate_quiz(quiz: QuizGenerate):
    # topic = quiz.topic
    # is_prog, sanitized_topic = await is_prog_topic(topic)
    # if not is_prog:
    #     raise HTTPException(
    #         status_code=status.HTTP_400_BAD_REQUEST,
    #         detail="Topic is not related to programming",
    #     )

    # quiz.topic = sanitized_topic
    # quiz = read_test_quiz()
    # quiz["topic"] = sanitized_topic
    quiz = read_test_quiz()
    return quiz
