from fastapi_components import fastapi_app
from features import topics_router, interview_router, explore_router, threads_router, projects_router


fastapi_app.include_router(topics_router)
fastapi_app.include_router(interview_router)
fastapi_app.include_router(explore_router)
fastapi_app.include_router(threads_router)
fastapi_app.include_router(projects_router)
