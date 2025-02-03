from config.fast import app
from features import topics_router, interview_router, leetcode_router, explore_router
from handlers.quiz import router as quiz_router
from handlers.flow import router as flow_router


app.include_router(topics_router)
app.include_router(interview_router)
app.include_router(leetcode_router)
app.include_router(explore_router)
app.include_router(quiz_router)
app.include_router(flow_router)
