from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import BaseMessage
from typing import Optional
from config.models import Model
from enum import Enum
from datetime import datetime


class DifficultyLevel(Enum):
    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"


class TopicNode(BaseModel):
    topic: str
    parent_topic: Optional[str] = None
    children: list[str] = Field(default_factory=list)
    difficulty: DifficultyLevel
    description: str
    emoji: str
    explored: bool = False
    last_explored: datetime = Field(default_factory=datetime.now)


class TopicHierarchy(BaseModel):
    nodes: dict[str, TopicNode] = Field(default_factory=dict)
    current_topic: str
    history: list[str] = Field(default_factory=list)

    def add_topic_node(self, topic: str, parent_topic: Optional[str] = None, difficulty: str = "Beginner", emoji: str = "🌟"):
        self.nodes[topic] = TopicNode(
            topic=topic,
            parent_topic=parent_topic, difficulty=difficulty,
            emoji=emoji)
        if parent_topic and parent_topic in self.nodes:
            self.nodes[parent_topic].children.append(topic)

    def goto_topic(self, topic: str):
        if topic in self.nodes:
            self.current_topic = topic
            self.history.append(topic)
        else:
            raise ValueError(f"Topic {topic} not found in hierarchy")

    def go_back(self):
        if self.history:
            self.current_topic = self.history.pop()
        else:
            raise ValueError("No history to go back to")

    def get_current_context(self) -> dict[str, any]:
        if not self.current_topic or self.current_topic not in self.nodes:
            return {}

        current_node = self.nodes[self.current_topic]
        return {
            "current_topic": self.current_topic,
            "parent_topic": current_node.parent,
            "subtopics": current_node.children,
            "difficulty": current_node.difficulty,
            "emoji": current_node.emoji,
            "explored": current_node.explored
        }

    def get_explored_topics(self) -> list[str]:
        return [topic for topic in self.nodes if self.nodes[topic].explored]


class ChatState(BaseModel):
    messages: list[BaseMessage] = Field(default_factory=list)
    next_step: str = Field(default="respond")
    topic_hierarchy: TopicHierarchy = Field(default_factory=TopicHierarchy)
    context: list[str] = Field(default_factory=list)
    current_model: Model = Field(default=Model.GPT_4O_MINI.value)


topic_generator_template = ChatPromptTemplate.from_messages(
    ("system", """You are an expert at creating comprehensive programming topic hierarchies.
    Current Topic: {current_topic}
    Previously Explored Topics: {explored_topics}
    Parent Topic: {parent_topic}
    
    Generate new programming topics that:
    1. Are logically related to the current topic
    2. Haven't been covered in the previously explored topics
    3. Provide a natural progression in complexity
    4. Include both breadth and depth of knowledge
    
    For each topic, provide:
    - A relevant emoji
    - The difficulty level (Beginner, Intermediate, Advanced)
    - A clear connection to the parent topic
    
    Format each topic as: emoji || topic || difficulty || connection_to_parent
    
    Focus on discovering novel but relevant subtopics that expand the learner's understanding."""),
    ("human", "Generate topics for {current_topic}")
)
