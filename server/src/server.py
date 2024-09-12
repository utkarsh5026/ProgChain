from config.fast import app
import uvicorn
from config.openai import llm
from handlers.topics import router as topics_router
from handlers.explore import router as explore_router
from handlers.interview import router as interview_router

app.include_router(topics_router)
app.include_router(explore_router)
app.include_router(interview_router)
