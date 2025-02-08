from pydantic import BaseModel, Field
from typing import Optional, Callable, AsyncGenerator
from fastapi.responses import StreamingResponse
from .models import Model
import json


class BaseContentGenerateRequest(BaseModel):
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
        if isinstance(chunk, str):
            yield f"{chunk}"
        elif isinstance(chunk, dict):
            yield f"{json.dumps(chunk)}"


def stream_response(stream_func: Callable[[], AsyncGenerator[str, None]]):
    return StreamingResponse(stream_text_response(stream_func), media_type="text/event-stream", headers={
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
    })
