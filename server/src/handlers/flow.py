from fastapi import APIRouter, Request
from lang.flow import generate_flowchart

router = APIRouter(
    prefix="/flow",
    tags=["flow"],
)


@router.post("/")
async def create_flowchart(request: Request):
    data = await request.json()
    topic = data.get("topic")
    return await generate_flowchart(topic)
