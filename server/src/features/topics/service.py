from loguru import logger

from .models import SubTopic, BaseTopic, TopicChain
from .topics import TopicNameGenerator, TopicsGenerator
from config.models import Model
from cachetools import LFUCache
from typing import AsyncGenerator
from fastapi_components import BaseContentGenerateRequest



class TopicService:

    def __init__(self) -> None:
        self.cache = LFUCache(maxsize=100)

    async def __create_topic_chain(self, topic_name: str) -> str:
        tg = await TopicsGenerator.create(topic_name)
        self.cache[tg.topic_chain_id] = tg
        return tg.topic_chain_id

    async def create_topic_chain(self, topic_name: str) -> str:
        t_id = await self.__create_topic_chain(topic_name)
        return t_id

    async def __load_topic_chain(self, topic_chain_public_id: str) -> str:
        tg = self.cache.get(topic_chain_public_id)
        if not tg:
            tg = await TopicsGenerator.load(topic_chain_public_id)
            self.cache[topic_chain_public_id] = tg
        return tg

    @classmethod
    async def _generate(cls, tg: TopicsGenerator, path: list[str], model_name: Model) -> AsyncGenerator[dict, None]:
        async for topics_dict in tg.generate_topics(path, model_name):
            yield topics_dict

    async def start_generation(self, topic: BaseContentGenerateRequest) -> AsyncGenerator[dict, None]:
        tg = await self.__create_topic_chain(topic_name=topic.question)
