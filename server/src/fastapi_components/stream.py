import json
from loguru import logger
from datetime import datetime
from contextlib import asynccontextmanager
from typing import Optional, Callable, AsyncGenerator

from fastapi import HTTPException, status
from fastapi.responses import StreamingResponse


class StreamManager:
    """Manages streaming responses with error handling and cleanup"""

    @staticmethod
    @asynccontextmanager
    async def stream_context():
        try:
            yield
        except Exception as e:
            logger.error(f"Streaming error: {str(e)}")
            yield json.dumps({"error": "Streaming error occurred", "details": str(e)})


async def stream_text_response(stream_function: Callable[[], AsyncGenerator[str, None]]):
    async with StreamManager.stream_context():
        try:
            async for chunk in stream_function():
                try:
                    serialized = json.dumps(
                        chunk,
                        default=lambda o: o.isoformat() if isinstance(o, datetime) else str(o)
                    )
                    yield serialized
                except (TypeError, ValueError) as e:
                    logger.error(f"Serialization error: {str(e)}")
                    yield json.dumps({"error": "Failed to serialize response"})
        except Exception as e:
            logger.error(f"Unexpected streaming error: {str(e)}")
            yield json.dumps({"error": "Internal server error"})


def stream_response(stream_func: Callable[[], AsyncGenerator[str, None]], headers: Optional[dict[str, str]] = None):
    """
    Create a StreamingResponse with configurable options.

    Args:
        stream_func: The streaming function
        headers: Additional headers to include
    """
    default_headers = {
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no",  # Disable proxy buffering
        "Content-Type": "text/event-stream",
    }

    if headers:
        default_headers.update(headers)
    try:
        return StreamingResponse(
            stream_text_response(stream_func),
            media_type="text/event-stream",
            headers=default_headers
        )
    except Exception as e:
        logger.error(f"Error streaming response: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to initialize stream: {e}"
        )
