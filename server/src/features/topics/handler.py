from loguru import logger

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from fastapi_components import stream_response, BaseContentGenerateRequest


from .lang import TopicNode
from .topics import generate_topics as generate_topics_lang
from .service import TopicService
import json

router = APIRouter(
    prefix="/topics",
    tags=["topics"],
)


class TopicGenerateRequest(BaseContentGenerateRequest):
    topic_chain_id: str


class TopicResponse(BaseModel):
    conversation_id: str
    current_path: str
    available_topics: dict[str, list[TopicNode]]


@router.post("/generate")
async def generate_topics(request: TopicGenerateRequest):
    logger.info(f"Recieved request {request.model_dump_json(indent=4)}")
    topics_path = request.topic_path.split(">")
    current_path = " > ".join(topics_path)

    async def topic_stream():
        try:
            async for topics_dict in generate_topics_lang(topics_path, request.model):
                response = TopicResponse(
                    conversation_id=request.conversation_id or "",
                    current_path=current_path,
                    available_topics=topics_dict
                )
                json_str = json.dumps(response.model_dump())
                yield f"data: {json_str}\n\n"
        except Exception as e:
            error_msg = json.dumps({"error": str(e)})
            yield f"data: {error_msg}\n\n"

    return StreamingResponse(
        topic_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )


@router.post("/create-topic-chain")
async def create_topic_chain(request: BaseContentGenerateRequest):
    topic_service = TopicService()
    return await topic_service.create_topic_chain(request.topic_path)
