import json

from fastapi import APIRouter
from typing import Optional
from fastapi.responses import StreamingResponse
from .llm import generate_interview_questions
from pydantic import BaseModel, Field
from config.models import Model


router = APIRouter(prefix="/interview", tags=["interview"])


class TopicRequest(BaseModel):
    topic: str = Field(
        description="The topic to generate interview questions for")
    context: Optional[str] = Field(
        default="",
        description="The context of the topic, if applicable")


@router.post("/questions")
async def interview(topic: TopicRequest):
    async def stream_questions():
        async for question in generate_interview_questions(topic.topic, topic.context):
            data = {
                "topic": topic.topic,
                "questions": question
            }
            yield f"data: {json.dumps(data)}\n\n"

    return StreamingResponse(stream_questions(), media_type="text/event-stream", headers={
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
    })
