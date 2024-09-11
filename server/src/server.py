from config.fast import app
import uvicorn
from config.openai import llm
from handlers.topics import router as topics_router

app.include_router(topics_router)
