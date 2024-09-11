from fastapi import APIRouter, HTTPException, Request
from lang.topics import generate_topics, TopicRequest


router = APIRouter(prefix="/topics", tags=["topics"])


@router.post("/generate")
async def api_generate_topics(request: Request):
    try:
        data = await request.json()
        context = data.get("context", [])

        if isinstance(context, str):
            context = [context]

        topics = await generate_topics(data['main_topic'], context)
        return {"topics": topics}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
