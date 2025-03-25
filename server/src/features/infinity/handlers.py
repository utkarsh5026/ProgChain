from fastapi import APIRouter, Depends, Query, Path, Body, BackgroundTasks, HTTPException, status
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

from config.models import Model
from fastapi_components import BaseContentGenerateRequest

router = APIRouter(prefix="/infinity", tags=["infinity"])


class ModeResponse(BaseModel):
    """Response model for mode information."""
    id: str = Field(description="The unique identifier for the mode")
    mode_type: str = Field(description="The type of mode")
    name: str = Field(description="The name of the mode")
    description: str = Field(description="A short description of the mode")
    metadata: dict[str, Any] = Field(
        default_factory=dict,
        description="Additional metadata about the mode")
