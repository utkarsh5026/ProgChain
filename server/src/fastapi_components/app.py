import os
from loguru import logger
from dotenv import load_dotenv
from enum import Enum

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError, ResponseValidationError
from contextlib import asynccontextmanager
from db import init_db

from .middleware import RequestLoggingMiddleware


class Environment(Enum):
    DEV = "dev"
    PROD = "production"


load_dotenv()

ENVIRONMENT = Environment(os.getenv("ENVIRONMENT", "dev"))
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "").split(",")


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    debug=ENVIRONMENT == "dev",
    lifespan=lifespan,
    version="1.0.0",
    docs_url=None if ENVIRONMENT == Environment.PROD else "/docs",
    redoc_url=None if ENVIRONMENT == Environment.PROD else "/redoc"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if ENVIRONMENT == Environment.DEV else ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"] if ENVIRONMENT == Environment.DEV else ALLOWED_HOSTS,
)


app.add_middleware(RequestLoggingMiddleware)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error with message: " + str(exc)}
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors()}
    )


@app.exception_handler(ResponseValidationError)
async def response_validation_exception_handler(request: Request, exc: ResponseValidationError):
    logger.error(f"Response validation error: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error with message: " + str(exc)}
    )
