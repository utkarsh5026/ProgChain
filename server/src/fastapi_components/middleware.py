import json
from loguru import logger
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        """
        Logs the request body for debugging purposes.
        """
        try:
            body = await request.body()
            if body:
                content_type = request.headers.get('content-type', '')
                if 'application/json' in content_type:
                    body_json = await request.json()
                    logger.info(
                        f"Request body (JSON):\n{json.dumps(body_json, indent=4)}")
                else:
                    try:
                        body_text = body.decode()
                        logger.info(f"Request body:\n{body_text}")
                    except UnicodeDecodeError:
                        logger.info(f"Request body (bytes):\n{body}")
        except Exception as e:
            logger.warning(f"Could not log request body: {str(e)}")

        response = await call_next(request)
        return response
