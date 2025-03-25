from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse, Response
from pydantic import Field

from .service import ThreadService, ThreadGenerate, ThreadContentChatService
from fastapi_components import stream_response, BaseContentGenerateRequest
from core import ChatGenerateOptions
from .chat import ThreadIDChatError


stream_media_type = "text/event-stream"
router = APIRouter(prefix="/threads", tags=["Threads"])

ts = ThreadService()
tccs = ThreadContentChatService()


class ThreadCreateRequest(BaseContentGenerateRequest):
    topic: str = Field(
        description="The topic to generate content for"
    )


class ThreadGetRequest(BaseContentGenerateRequest):
    thread_id: int = Field(
        description="The id of the thread to get"
    )


class ThreadChatRequest(BaseContentGenerateRequest):
    thread_content_public_id: str = Field(
        description="The id of the thread content to chat"
    )


@router.get("/chat/{thread_content_id}")
async def get_chats_for_thread_content(thread_content_id: str):
    try:
        chats = await tccs.get_chats_for_thread_content(thread_content_id)
        return {
            "chats": chats
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/chat/stop")
async def stop_chat(thread_content_id: str):
    try:
        tccs.stop_chat(thread_content_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e))
    return Response(status_code=status.HTTP_200_OK, content="Chat stopped")


@router.post("/chat")
async def chat(request: ThreadChatRequest):
    thread_content_id = request.thread_content_public_id
    options = ChatGenerateOptions(
        model=request.model,
        extra_instructions=request.extra_instructions,
        question=request.question
    )
    try:
        stream_chat = await tccs.create_chat_stream(thread_content_id, options)
        return stream_response(stream_chat)
    except ThreadIDChatError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/")
async def get_all_threads():
    try:
        return await ts.get_all_threads()
    except Exception as e:
        print(e)
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
    return StreamingResponse(stream_content(), media_type=stream_media_type)


@router.post("/generate")
async def generate_content(request: ThreadGetRequest):
    thread_id, model, extra_instructions = request.thread_id, request.model, request.extra_instructions

    async def stream_content():
        async for content in ts.generate_content(ThreadGenerate(thread_id=thread_id,
                                                                model=model, extra_instructions=extra_instructions)):
            yield f"data: {content.model_dump_json()}\n\n"

    return StreamingResponse(stream_content(), media_type=stream_media_type)
