from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from .llm import ContentGenerator
router = APIRouter(prefix="/threads", tags=["Threads"])

cg = ContentGenerator()


class ThreadRequest(BaseModel):
    topic: str = Field(description="The topic to generate content for")
    current_idx: int = Field(description="The current index of the content")


@router.post("/generate")
async def generate_content(request: ThreadRequest):
    topic, current_idx = request.topic, request.current_idx

    async def stream_content():
        async for content in cg.generate_content_stream(topic, current_idx):
            data = content.model_dump_json()
            yield f"data: {data}\n\n"
    return StreamingResponse(stream_content(), media_type="text/event-stream")
