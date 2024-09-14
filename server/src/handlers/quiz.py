from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from lang.quiz import QuizGenerate
from lang.sanitize import is_prog_topic
from lang.quiz import generate_quiz as generate_quiz_lang, QuizQuestion

router = APIRouter(prefix="/quiz", tags=["quiz"])


class QuizGenerateResponse(BaseModel):
    topic: str
    questions: list[QuizQuestion]


@router.post("/generate")
async def generate_quiz(quiz: QuizGenerate):
    topic = quiz.topic
    is_prog, sanitized_topic = await is_prog_topic(topic)
    if not is_prog:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Topic is not related to programming",
        )

    quiz.topic = sanitized_topic
    quiz_generated = await generate_quiz_lang(quiz)

    print("quiz=============================", quiz_generated)
    return {
        "topic": sanitized_topic,
        "questions": quiz_generated.questions
    }
