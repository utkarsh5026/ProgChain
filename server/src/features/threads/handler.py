from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import Optional
from config.models import Model
from .service import ThreadService, ThreadGenerate


router = APIRouter(prefix="/threads", tags=["Threads"])

ts = ThreadService()


class BaseThreadRequest(BaseModel):
    model: Optional[str] = Field(
        default=Model.GPT_4O_MINI.value,
        description="The model to use for the thread"
    )
    extra_instructions: Optional[str] = Field(
        default=None,
        description="Extra instructions for the thread"
    )


class ThreadCreateRequest(BaseThreadRequest):
    topic: str = Field(
        description="The topic to generate content for"
    )


class ThreadGetRequest(BaseThreadRequest):
    thread_id: int = Field(
        description="The id of the thread to get"
    )


@router.get("/")
async def get_all_threads():
    try:
        return await ts.get_all_threads()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/{thread_id}")
async def get_thread_contents(thread_id: int):
    try:
        return await ts.get_thread_contents(thread_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/create")
async def create_thread_and_generate_content(request: ThreadCreateRequest):

    topic, model, extra_instructions = request.topic, request.model, request.extra_instructions

    async def stream_content():
        async for content in ts.create_thread(topic, model, extra_instructions):
            yield f"data: {content.model_dump_json()}\n\n"
    return StreamingResponse(stream_content(), media_type="text/event-stream")


@router.post("/generate")
async def generate_content(request: ThreadGetRequest):
    thread_id, model, extra_instructions = request.thread_id, request.model, request.extra_instructions

    async def stream_content():
        async for content in ts.generate_content(ThreadGenerate(thread_id=thread_id,
                                                                model=model, extra_instructions=extra_instructions)):
            yield f"data: {content.model_dump_json()}\n\n"

    return StreamingResponse(stream_content(), media_type="text/event-stream")
