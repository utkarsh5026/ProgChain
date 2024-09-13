from pydantic import BaseModel, field_validator
from typing import List, Optional
from enum import Enum


class DifficultyLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class QuizGenerate(BaseModel):
    topic: str
    levels: List[str]
    instructions: Optional[str] = None

    @field_validator('levels')
    def validate_levels(cls, levels):
        if not levels:
            raise ValueError("At least one difficulty level must be provided")
        if len(levels) != len(set(levels)):
            raise ValueError("Duplicate difficulty levels are not allowed")
        return levels
