from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from features.leetcode import initialize_leetcode
from contextlib import asynccontextmanager
from .db import init_db
import os
from dotenv import load_dotenv

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    print(os.getenv("OPENAI_API_KEY"))
    yield


app = FastAPI(debug=True, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
