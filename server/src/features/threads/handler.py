from fastapi import FastAPI, HTTPException, APIRouter
from fastapi.responses import StreamingResponse
from .llm import ContentGenerator
router = APIRouter(prefix="/threads", tags=["Threads"])

cg = ContentGenerator()


@router.post("/generate")
async def generate_content(topic: str, current_idx: int):
    async def stream_content():
        async for content in cg.generate_content_stream(topic, current_idx):
            yield content
    return StreamingResponse(stream_content(), media_type="application/json")
