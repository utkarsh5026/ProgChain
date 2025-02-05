from pydantic import BaseModel, Field
from config.models import get_model, Model
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from datetime import datetime
from typing import AsyncGenerator


class LearningContent(BaseModel):
    """
    Universal structure for learning content, adaptable to any topic.
    """
    content_id: str = Field(
        description="Unique identifier for this content piece")
    title: str = Field(
        description="Specific concept or topic being covered")

    depth_level: str = Field(
        description="Current depth of exploration in the topic")
    core_concept: str = Field(
        description="The fundamental idea being explored")
    detailed_explanation: str = Field(
        description="Comprehensive explanation of the concept")

    practical_example: str = Field(
        description="Real-world example or demonstration")
    deeper_insights: list[str] = Field(
        description="Advanced observations and connections")
    practical_applications: list[str] = Field(
        description="Ways to apply this knowledge")
    next_concepts: list[str] = Field(
        description="Related concepts to explore next")


class ContentGenerator:
    """
    Generates progressive, non-repetitive learning content for any topic.
    """

    def __init__(self) -> None:
        self.previous_concepts: set[str] = set()
        self.content_prompt = ChatPromptTemplate.from_template("""
        You are an expert educator creating engaging learning content about {topic}.
        Previous concepts covered: {previous_concepts}
        Current exploration depth: {depth_level}
        Focus area: {focus_area}

        Generate new, unique content that builds upon previous knowledge while introducing fresh concepts.
        Ensure the content:
        1. Introduces concepts not previously covered
        2. Makes meaningful connections to prior knowledge
        3. Progresses logically in complexity
        4. Engages through practical examples
        5. Prompts deeper thinking and exploration

        Consider the current depth level:
        - Foundation: Establish core principles and basic understanding
        - Connection: Link concepts and explore relationships
        - Application: Focus on practical usage and real-world applications
        - Innovation: Explore advanced applications and creative combinations

        Provide your response in this JSON format:
        {{
            "content_id": "unique_identifier_string",
            "title": "Specific concept being covered",
            "depth_level": "{depth_level}",
            "core_concept": "Central idea being explored",
            "detailed_explanation": "Comprehensive explanation in user friendly manner in absolute detail (keep it technical and detailed)",
            "practical_example": "Concrete example or demonstration",
            "deeper_insights": ["Key insights and observations"],
            "practical_applications": ["Real-world applications"],
            "next_concepts": ["Related concepts to explore"]
        }}

        Ensure all content is fresh and builds naturally from what's been covered.
        """)

    def determine_depth_level(self, index: int) -> str:
        """Maps content index to appropriate depth level."""
        if index < 10:
            return "Foundation"
        elif index < 20:
            return "Connection"
        elif index < 30:
            return "Application"
        return "Innovation"

    def __get_focus_area(self, depth_level: str) -> str:
        """Determines appropriate focus area based on progress."""
        if depth_level == "Foundation":
            return "core_principles"
        elif depth_level == "Connection":
            return "concept_relationships"
        elif depth_level == "Application":
            return "practical_usage"
        return "advanced_applications"

    def generate_content(self, topic: str, depth_level: str, model: str = Model.GPT_4O_MINI.value) -> LearningContent:
        print(f"Generating content for {topic} at depth {depth_level}")
        print(f"Previous concepts: {self.previous_concepts}")
        try:

            focus_area = self.__get_focus_area(depth_level)
            parser = PydanticOutputParser(pydantic_object=LearningContent)
            chain = self.content_prompt | get_model(model) | parser
            content = chain.invoke(
                {"topic": topic,
                 "previous_concepts": self.previous_concepts,
                 "depth_level": depth_level,
                 "focus_area": focus_area})
            return content
        except Exception as e:
            raise e

    async def generate_content_stream(self, topic: str, current_idx: int, model: str = Model.GPT_4O_MINI.value) -> AsyncGenerator[LearningContent, None]:
        batch_size = 3
        depth_level = self.determine_depth_level(current_idx)
        for _ in range(batch_size):
            content = self.generate_content(topic, depth_level, model)
            self.previous_concepts.add(content.core_concept)
            yield content
