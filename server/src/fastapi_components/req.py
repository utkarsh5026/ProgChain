from pydantic import BaseModel, Field, field_validator
from typing import Optional, Union
from datetime import datetime
from config.models import Model


class BaseContentGenerateRequest(BaseModel):
    """
    Base request for content generation.

    Attributes:
        model: The model to use for the thread
        extra_instructions: Extra instructions for the thread
        question: The question to ask the model
    """
    model: Optional[str] = Field(
        default=Model.GPT_4O_MINI.value,
        description="The model to use for the thread"
    )
    extra_instructions: Optional[str] = Field(
        default="",
        description="Extra instructions for the thread"
    )
    question: str = Field(
        description="The question to ask the model",
        min_length=1
    )

    @field_validator("model")
    @classmethod
    def check_model(cls, v):
        for model in Model:
            if model.value == v:
                return model
        raise ValueError(f"Invalid model: {v}")


class ListDataRequest(BaseModel):
    """
    Base request for listing data.

    Attributes:
        timestamp: The timestamp to start the list from in isoformat
        limit: The maximum number of items to return
    """
    timestamp: datetime = Field(
        default=datetime.min,
        description="The timestamp to start the list from in isoformat")
    limit: Optional[int] = Field(
        description="The maximum number of items to return",
        default=10, gt=0)

    @field_validator("timestamp", mode="before")
    @classmethod
    def parse_timestamp(cls, v: Optional[Union[str, datetime]]) -> Optional[datetime]:
        if v is None:
            return datetime.min
        if isinstance(v, datetime):
            return v
        if isinstance(v, str):
            try:
                return datetime.fromisoformat(v)
            except ValueError:
                raise ValueError(f"Invalid timestamp format: {v}")


def check_iso_timestamp(timestamp: str) -> bool:
    try:
        datetime.fromisoformat(timestamp)
        return True
    except ValueError:
        return False
