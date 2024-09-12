from lang.interview import generate_interview_questions, generate_answer
from fastapi import APIRouter, Request

router = APIRouter(prefix="/interview", tags=["interview"])


@router.post("/")
async def interview(request: Request):
    data = await request.json()
    topic = data.get("topic")
    context = data.get("context")
    response = await generate_interview_questions(topic, context)
    return response


@router.post("/answer")
async def answer(request: Request):
    data = await request.json()
    question = data.get("question")
    response = await generate_answer(question)
    return response
