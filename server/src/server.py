from fastapi_components import fastapi_app as app
from features import (
    topics_router,
    interview_router,
    explore_router,
    threads_router,
    infinity_router
)


app.include_router(topics_router)
app.include_router(interview_router)
app.include_router(explore_router)
app.include_router(threads_router)
app.include_router(infinity_router)
