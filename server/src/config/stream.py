from pydantic import BaseModel, Field
from typing import Optional, Callable, AsyncGenerator
from fastapi.responses import StreamingResponse
from .models import Model
import json
from datetime import datetime


class BaseContentGenerateRequest(BaseModel):
    """
    Base request for content generation.

    Attributes:
        model: The model to use for the thread
        extra_instructions: Extra instructions for the thread
        question: The question to ask the model
    """
    model: Optional[str] = Field(
        default=Model.GPT_4O_MINI.value,
        description="The model to use for the thread"
    )
    extra_instructions: Optional[str] = Field(
        default="",
        description="Extra instructions for the thread"
    )
    question: Optional[str] = Field(
        default="",
        description="The question to ask the model"
    )


async def stream_text_response(stream_function: Callable[[], AsyncGenerator[str, None]]):
    async for chunk in stream_function():
        # Use a custom serializer for datetime objects
        yield json.dumps(chunk, default=lambda o: o.isoformat() if isinstance(o, datetime) else o)


def stream_response(stream_func: Callable[[], AsyncGenerator[str, None]]):
    return StreamingResponse(stream_text_response(stream_func), media_type="text/event-stream", headers={
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
    })
