from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from lang.quiz import QuizGenerate
from lang.sanitize import is_prog_topic

router = APIRouter(prefix="/quiz", tags=["quiz"])


@router.post("/generate")
async def generate_quiz(quiz: QuizGenerate):
    topic = quiz.topic
    is_prog, sanitized_topic = await is_prog_topic(topic)
    if not is_prog:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Topic is not related to programming",
        )

    return {"topic": sanitized_topic}
