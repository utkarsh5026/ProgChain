from loguru import logger
from functools import lru_cache
from typing import AsyncGenerator, Optional
from pydantic import BaseModel, Field

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.callbacks import AsyncCallbackHandler

from config.models import get_model, Model


class TopicGenerate(BaseModel):
    topic: str = Field(description="The topic to generate content for")
    topic_content: str = Field(
        description="The topic content to generate content for")
    current_idx: int = Field(description="The current index of the content")


class ContentGenerator:
    """
    Generates progressive, non-repetitive learning content for any topic.
    """

    def __init__(self, topic: str, batch_size: int = 3, previous_concepts: list[str] = None) -> None:
        """
        Initialize the ContentGenerator with a topic and previous concepts.

        Args:
            topic (str): The topic to generate content for.
            batch_size (int): The number of content chunks to generate at a time.
            previous_concepts (list[str]): A list of previously generated concepts.
        """
        self.topic = topic
        self.batch_size = batch_size
        self.previous_concepts: list[str] = previous_concepts if previous_concepts else []

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

        Use Proper and correct markdown format for the content
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

    @classmethod
    @lru_cache(maxsize=32)
    def determine_depth_level(cls, index: int) -> str:
        """Cache depth level calculations since they're deterministic"""
        if index < 10:
            return "Foundation"
        elif index < 20:
            return "Connection"
        elif index < 30:
            return "Application"
        return "Innovation"

    @classmethod
    def __get_focus_area(cls, depth_level: str) -> str:
        """Determines appropriate focus area based on progress."""
        if depth_level == "Foundation":
            return "core_principles"
        elif depth_level == "Connection":
            return "concept_relationships"
        elif depth_level == "Application":
            return "practical_usage"
        return "advanced_applications"

    @classmethod
    def _extract_concept(cls, content: str) -> str:
        """Extract concept title from content more reliably"""
        try:
            lines = content.split('\n')
            for line in lines:
                if line.startswith('# '):
                    return line.replace('# ', '').strip()
            return "Untitled Concept"
        except Exception:
            return "Untitled Concept"

    async def generate_content_stream(
            self,
            current_idx: int,
            model: str = Model.GPT_4O_MINI.value,
            callback_handler: Optional[AsyncCallbackHandler] = None
    ) -> AsyncGenerator[TopicGenerate, None]:
        """
        Generate content stream with improved error handling and optional callback
        """
        depth_level = self.determine_depth_level(current_idx)
        focus_area = self.__get_focus_area(depth_level)

        for i in range(self.batch_size):
            try:
                logger.info(f"Loaded previous concepts: {self.previous_concepts}")
                chain = self.content_prompt | get_model(
                    model) | StrOutputParser()
                content = await chain.ainvoke({
                    "topic": self.topic,
                    "previous_concepts": self.previous_concepts,
                    "depth_level": depth_level,
                    "focus_area": focus_area
                }, callbacks=[callback_handler] if callback_handler else None)

                concept = self._extract_concept(content)

                yield TopicGenerate(
                    topic=concept,
                    topic_content=content,
                    current_idx=current_idx + i
                )
                self.previous_concepts.append(concept)

            except Exception as e:
                print(f"Error generating content batch {i}: {str(e)}")
                continue
