from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from .llm import explore_topic as explore_topic_llm

router = APIRouter(prefix="/explore", tags=["explore"])


class TopicExploreRequest(BaseModel):
    topic: str
    depth: str = "comprehensive"
    focus_areas: str = "all"


@router.post("/topic")
async def explore_topic(request: TopicExploreRequest):
    async def stream_topic():
        async for chunk in explore_topic_llm(request.topic):
            yield chunk

    return StreamingResponse(stream_topic(), media_type="text/event-stream", headers={
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
    })
