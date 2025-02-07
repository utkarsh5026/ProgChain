from config.fast import app
from features import topics_router, interview_router, explore_router, threads_router
from dotenv import load_dotenv

load_dotenv()


app.include_router(topics_router)
app.include_router(interview_router)
app.include_router(explore_router)
app.include_router(threads_router)
