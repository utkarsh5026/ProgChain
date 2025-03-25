from fastapi import APIRouter, HTTPException, status
from features.infinity.services.topics import TopicGeneratorService
from pydantic import BaseModel, Field
from typing import Optional

router = APIRouter(prefix="/topics", tags=["Topic"])

topic_generator = TopicGeneratorService()


class TopicGenerationRequest(BaseModel):
    category_id: str
    count: int = Field(default=30, ge=1, le=100)
    model: Optional[str] = None


@router.post("/generate", status_code=status.HTTP_201_CREATED)
async def generate_initial_topics(request: TopicGenerationRequest):
    """Generate an initial set of topic titles for a category."""
    try:
        topics = await topic_generator.generate_initial_topics(
            category_id=request.category_id,
            count=request.count,
            model_name=request.model
        )

        return {
            "message": f"Successfully generated {len(topics)} topics",
            "topics": topics
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating topics: {str(e)}"
        )
