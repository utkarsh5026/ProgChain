from lang.interview import generate_interview_questions, generate_answer
from fastapi import APIRouter, Request
from lang.interview import Question

router = APIRouter(prefix="/interview", tags=["interview"])


@router.post("/")
async def interview(question: Question):
    return await generate_interview_questions(question)


@router.post("/answer")
async def answer(request: Request):
    data = await request.json()
    question = data.get("question")
    response = await generate_answer(question)
    return response
