from fastapi import APIRouter
from .topic import router as topics_router

router = APIRouter(prefix="/infinity", tags=["Topic"])
router.include_router(topics_router)

__all__ = ["router"]
