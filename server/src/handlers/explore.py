from lang.explore import generate_programming_qa
from fastapi import APIRouter, Request
from lang.sanitize import process_question

router = APIRouter(prefix="/explore", tags=["explore"])


def read_test_explore():
    import json
    with open("test/test_explore.json", "r") as f:
        return json.load(f)


@router.post("/")
async def explore(request: Request):
    # data = await request.json()
    # question = data.get("question")
    # is_prog, question = await process_question(question)

    # print(question)
    # if not is_prog:
    #     return {"error": "Question is not related to programming"}

    # response = await generate_programming_qa(question)
    response = read_test_explore()
    return response
