from pydantic import BaseModel, Field
from config.models import get_model, Model
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from typing import AsyncGenerator


class TopicGenerate(BaseModel):
    topic_content: str = Field(
        description="The topic content to generate content for")
    current_idx: int = Field(description="The current index of the content")


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

        Structure your response in markdown format with the following sections:
        # [Title: Specific concept being covered]
        ## Core Concept
        [Central idea being explored]
        
        ## Detailed Explanation
        [Comprehensive technical explanation with detailed insights]
        
        ## Practical Example
        [Concrete example or demonstration]
        
        ## Key Insights
        - [Important observation 1]
        - [Important observation 2]
        
        ## Practical Applications
        - [Real-world application 1]
        - [Real-world application 2]
        
        ## Related Concepts to Explore
        - [Next concept 1]
        - [Next concept 2]

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

    def generate_content(self, topic: str, depth_level: str, model: str = Model.GPT_4O_MINI.value) -> str:
        print(f"Generating content for {topic} at depth {depth_level}")
        print(f"Previous concepts: {self.previous_concepts}")
        try:

            focus_area = self.__get_focus_area(depth_level)
            parser = StrOutputParser()
            chain = self.content_prompt | get_model(model) | parser

            content = chain.invoke(
                {"topic": topic,
                 "previous_concepts": self.previous_concepts,
                 "depth_level": depth_level,
                 "focus_area": focus_area})
            return content
        except Exception as e:
            raise e

    async def generate_content_stream(self, topic: str, current_idx: int, model: str = Model.GPT_4O_MINI.value) -> AsyncGenerator[TopicGenerate, None]:
        batch_size = 3
        depth_level = self.determine_depth_level(current_idx)
        for i in range(batch_size):
            content = self.generate_content(topic, depth_level, model)
            core_concept = content.split("## Core Concept")[
                1].split("##")[0].strip()
            self.previous_concepts.add(core_concept)
            yield TopicGenerate(topic_content=content, current_idx=current_idx + i)
