from enum import Enum
from pydantic import BaseModel, Field
from typing import Any, ClassVar


class ModeType(str, Enum):
    """Enumeration of all available learning modes."""
    STANDARD = "standard"
    INTERVIEW = "interview"
    FIRST_PRINCIPLES = "principles"
    PRACTICAL = "practical"
    COMPARATIVE = "comparative"
    QUIZ = "quiz"
    VISUAL = "visual"


class ModeConfig(BaseModel):
    """Base configuration model for learning modes."""
    mode_type: ModeType = Field(
        description="The type of mode to use",
        default=ModeType.STANDARD
    )
    name: str = Field(
        description="The name of the mode",
        default="Standard"
    )
    description: str = Field(
        description="A short description of the mode",
        default="Standard mode"
    )
    metadata: dict[str, Any] = Field(
        description="Additional metadata specific to this mode",
        default_factory=dict
    )
    prompt_template: ClassVar[str] = ""

    def get_prompt(
            self,
            topic_title: str,
            difficulty: str,
            category_name: str,
            extra_instructions: str = ""
    ) -> str:
        """Generate a prompt for content creation based on this mode's template."""
        return self.prompt_template.format(
            topic_title=topic_title,
            difficulty=difficulty,
            category_name=category_name,
            extra_instructions=extra_instructions
        )
    
    def serialize(self) -> dict[str, Any]:
        """Serialize the mode configuration to a dictionary."""
        return {
            "mode_type": self.mode_type,
            "name": self.name,
            "description": self.description,
            "metadata": self.metadata
        }
