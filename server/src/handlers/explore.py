from lang.explore import generate_programming_qa
from fastapi import APIRouter, Request

router = APIRouter(prefix="/explore", tags=["explore"])


@router.post("/")
async def explore(request: Request):
    data = await request.json()
    question = data.get("question")
    response = await generate_programming_qa(question)
    return response
