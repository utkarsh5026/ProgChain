from pydantic import BaseModel, Field
from enum import Enum
from collections import defaultdict


class DifficultyLevel(Enum):
    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"


class TopicNode(BaseModel):
    topic: str
    description: str


Subtopics = dict[str, list[TopicNode]]
TopicChain = str


class TopicHierarchy(BaseModel):
    nodes: dict[TopicChain, Subtopics] = Field(default_factory=dict)

    def get_explored_topics(self, topics_path: list[str]) -> list[str]:
        if len(topics_path) <= 1:
            return []

        topic_path = self.__create_topic_path(topics_path)
        if topic_path not in self.nodes:
            return []

        difficulty_levels = self.nodes[topic_path]
        explored = []
        for difficulty_level in difficulty_levels:
            subtopics = difficulty_levels[difficulty_level]
            explored.extend([subtopic.topic for subtopic in subtopics])

        return explored

    def __create_topic_path(self, topics_path: list[str]) -> str:
        return " > ".join(topics_path)

    def update(self, topics_path: list[str], subtopics: Subtopics) -> None:
        topic_path = self.__create_topic_path(topics_path)
        self.nodes[topic_path] = subtopics


class TopicsManager:

    def __init__(self) -> None:
        self.topic_manager = defaultdict(TopicHierarchy)

    def get_hierarchy(self, conversation_id: str) -> TopicHierarchy | None:
        if conversation_id not in self.topic_manager:
            return None

        return self.topic_manager[conversation_id]

    def create_hierarchy(self, conversation_id: str) -> TopicHierarchy:
        if conversation_id in self.topic_manager:
            return self.topic_manager[conversation_id]

        hierarchy = TopicHierarchy()
        self.topic_manager[conversation_id] = hierarchy
        return hierarchy

    def get_explored_topics(self, conversation_id: str, topics_path: list[str]) -> list[str]:
        if len(topics_path) == 0:
            return []

        hierarchy = self.get_hierarchy(conversation_id)
        if not hierarchy:
            return []

        return hierarchy.get_explored_topics(topics_path)

    def update_explored_topics(self, conversation_id: str, topics_path: list[str]) -> None:
        hierarchy = self.get_hierarchy(conversation_id)
        if not hierarchy:
            return

        hierarchy.update_explored_topics(topics_path)
