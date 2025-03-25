from loguru import logger
from typing import AsyncGenerator, Optional

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from config.models import Model, get_model
from decode import decode_json
from .lang import TopicsManager
from .models import TopicChain, SubTopicType, SubTopic, BaseTopic


DIFFICULTY_DELIMITER = "###DIFFICULTY_END###"
VALID_DIFFICULTIES = {"Beginner", "Intermediate", "Advanced"}
str_parser = StrOutputParser()

manager = TopicsManager()

topic_generator_template = ChatPromptTemplate.from_messages([
    ("system", """You are an expert at creating comprehensive programming topic hierarchies.
    Current Topic: {current_topic}
    Previously Explored Topics: {explored_topics}
    Context: {context}

    Generate new programming topics that:
    1. Are logically related to the current topic
    2. Haven't been covered in the previously explored topics
    3. Provide a natural progression in complexity
    4. Include both breadth and depth of knowledge

    For each difficulty level, output a JSON object followed by "###DIFFICULTY_END###" delimiter.
    Generate at least 1 topics for each difficulty level in this format:

    {{"difficulty": "Beginner", "topics": [
        {{"topic": "Topic Name", "description": "Topic Description"}},
        ...
    ]}}###DIFFICULTY_END###

    {{"difficulty": "Intermediate", "topics": [
        {{"topic": "Topic Name", "description": "Topic Description"}},
        ...
    ]}}###DIFFICULTY_END###

    {{"difficulty": "Advanced", "topics": [
        {{"topic": "Topic Name", "description": "Topic Description"}},
        ...
    ]}}###DIFFICULTY_END###

    Focus on discovering novel but relevant subtopics that expand the learner's understanding. 
    Ensure each JSON object is valid and complete before the delimiter."""),
    ("human", "Generate topics for {current_topic}")
])


class TopicNameGenerator:

    template = ChatPromptTemplate.from_messages([
        ("system", """You are an expert at creating concise and clear programming topic names.
        Given Topic: {current_topic}

        Your task is to:
        1. Create a clear, concise topic name (maximum 5 words)
        2. Maintain the technical accuracy
        3. Use standard programming terminology
        4. Remove unnecessary words and complexity

        Return only the simplified topic name in title case, nothing else."""),
        ("human", "Simplify this topic name: {current_topic}")
    ])

    def __init__(self, topic_name: str) -> None:
        self.topic_name = topic_name

    async def generate(self) -> str:
        """
        Generate a simplified topic name based on the provided topic.

        Returns:
            str: A clear and concise topic name, formatted in title case.

        Raises:
            Exception: If there is an error during the generation process.
        """
        try:
            llm = get_model(Model.GPT_4O_MINI.value)
            chain = self.template | llm | str_parser
            response = await chain.ainvoke({
                "current_topic": self.topic_name,
            })
            return response.strip()
        except Exception as e:
            logger.error(f"Error generating topic name: {e}")
            raise


class TopicsGenerator:

    @classmethod
    async def create(cls, start_topic_name: str):
        clean_name = await TopicNameGenerator(start_topic_name).generate()
        topic_chain = await TopicChain.create(start_topic_name=clean_name)
        return cls(topic_chain.start_topic_name, topic_chain)

    @classmethod
    async def load(cls, topic_chain_id: str):
        topic_chain = await TopicChain.get_by_public_id(topic_chain_id)
        if not topic_chain:
            raise ValueError("Topic chain not found")

        return cls(topic_chain.start_topic_name, topic_chain)

    def __init__(self, topic_name: str, topic_chain: TopicChain) -> None:
        self.topic_name = topic_name
        self.topic_chain = topic_chain

    @property
    def topic_chain_id(self) -> str:
        return self.topic_chain.public_id

    template = ChatPromptTemplate.from_messages([
        ("system", """You are an expert at creating comprehensive programming topic hierarchies.
    Current Topic: {current_topic}
    Context: {context}

    Generate new programming topics that:
    1. Are logically related to the current topic
    2. Haven't been covered in the previously explored topics
    3. Provide a natural progression in complexity
    4. Include both breadth and depth of knowledge

    For each difficulty level, output a JSON object followed by "###DIFFICULTY_END###" delimiter.
    Generate at least 1 topics for each difficulty level in this format:

    {{"difficulty": "Beginner", "topics": [
        {{"topic": "Topic Name", "description": "Topic Description"}},
        ...
    ]}}###DIFFICULTY_END###

    {{"difficulty": "Intermediate", "topics": [
        {{"topic": "Topic Name", "description": "Topic Description"}},
        ...
    ]}}###DIFFICULTY_END###

    {{"difficulty": "Advanced", "topics": [
        {{"topic": "Topic Name", "description": "Topic Description"}},
        ...
    ]}}###DIFFICULTY_END###

    Focus on discovering novel but relevant subtopics that expand the learner's understanding. 
    Ensure each JSON object is valid and complete before the delimiter."""),
        ("human", "Generate topics for {current_topic}")
    ])

    @classmethod
    async def parse_chunk(cls, chunk: str) -> Optional[dict]:
        """
        Parse a chunk of text containing topic information in JSON format.

        Args:
            chunk (str): 
                A raw text chunk that includes JSON data and a difficulty delimiter. 
                This chunk is expected to contain information about programming topics 
                categorized by difficulty levels.

        Returns:
            Optional[dict]: 
                A dictionary containing parsed topics in the format {difficulty: [topics]} 
                where 'difficulty' is a string representing the level (e.g., "Beginner") 
                and 'topics' is a list of topic dictionaries. 
                Returns None if parsing fails due to missing fields or invalid structure.
        """
        try:
            if DIFFICULTY_DELIMITER not in chunk:
                logger.warning("Difficulty delimiter not found in chunk.")
                return None

            json_str = chunk.split(DIFFICULTY_DELIMITER)[0].strip()
            parsed = decode_json(json_str)

            if not all(key in parsed for key in ["difficulty", "topics"]):
                logger.warning(
                    f"Missing required fields in parsed JSON: {parsed}")
                return None

            difficulty, topics = parsed["difficulty"], parsed["topics"]

            if difficulty not in VALID_DIFFICULTIES:
                logger.warning(f"Invalid difficulty level: {difficulty}")
                return None

            for topic in topics:
                if not all(key in topic for key in ["topic", "description"]):
                    logger.warning(f"Invalid topic structure: {topic}")
                    return None

            return {difficulty: topics}

        except ValueError as e:
            logger.error(f"Failed to parse chunk: {e}\nChunk content: {chunk}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error parsing chunk: {e}")
            return None

    async def generate_topics(
        self,
        path: list[str],
        model_name: str = Model.GPT_4O_MINI.value,
    ) -> AsyncGenerator[dict, None]:
        """
        Generate programming topics based on the given path hierarchy.

        Args:
            path (list[str]): 
                A list representing the hierarchical path of topics. 
                Each element in the list corresponds to a level in the topic hierarchy.
            model_name (Model): 
                The language model to use for generating topics. 
                Defaults to Model.GPT_4O_MINI.

        Yields:
            dict: 
                A dictionary of generated topics grouped by difficulty level. 
                Each dictionary contains difficulty levels as keys and lists of topics as values.

        Raises:
            ValueError: 
                If the provided path is empty or invalid, indicating that topic generation cannot proceed.
        """
        if not path:
            raise ValueError("Path cannot be empty")

        try:
            current_topic = path[-1]
            topics_dict = {}
            async for parsed in self._stream_topic_generation(path, model_name):
                for difficulty in VALID_DIFFICULTIES:
                    topics = parsed[difficulty]
                    topics_dict[difficulty] = topics

                yield parsed

            topic_id = await self._save_topic(current_topic)
            await self._save_subtopics(topic_id, topics_dict)

        except Exception as e:
            logger.error(f"Error generating topics: {e}")
            raise

    async def _save_topic(self, topic_name: str) -> str:
        """
        Save a new topic to the database.

        Args:
            topic_name (str): 
                The name of the topic to be saved.

        Returns:
            str: 
                The public ID of the newly created topic.
        """
        topic = await BaseTopic.create(
            name=topic_name,
            topic_chain_public_id=self.topic_chain.public_id
        )
        return topic.public_id

    @classmethod
    async def _save_subtopics(cls, topic_id: str, subtopics: dict):
        """
        Save subtopics associated with a given topic ID.

        Args:
            topic_id (str): 
                The ID of the topic to which the subtopics belong.
            subtopics (dict): 
                A dictionary containing subtopics categorized by difficulty level.

        Raises:
            ValueError: 
                If no topics are found for a specific difficulty level.
        """

        def diff_to_num(diff: str) -> int:
            return {"Beginner": 0, "Intermediate": 1, "Advanced": 2}[diff]

        subtopics_models = []

        for difficulty in VALID_DIFFICULTIES:
            topics = subtopics[difficulty]
            if not topics:
                raise ValueError(
                    f"No topics found for difficulty: {difficulty}")

            for topic in topics:
                subtopic = SubTopicType(
                    topic=topic["topic"],
                    description=topic["description"],
                    difficulty=diff_to_num(difficulty)
                )
                subtopics_models.append(subtopic)

        await SubTopic.batch_create_subtopics(
            subtopics=subtopics_models,
            topic_id=topic_id
        )

    async def _stream_topic_generation(self, path: list[str], model_name: str = Model.GPT_4O_MINI.value):
        """
        Stream the generation of topics based on the provided path and model.

        Args:
            path (list[str]): 
                The hierarchical path of topics to guide the generation process.
            model_name (str): 
                The name of the language model to use for generation. 
                Defaults to Model.GPT_4O_MINI.

        Yields:
            dict: 
                Parsed topics as they are generated, structured by difficulty level.
        """
        llm = get_model(model_name)
        context = '>'.join(path)
        current_topic = path[-1]

        chain = self.template | llm | str_parser
        buffer = ""

        async for chunk in chain.astream({
            "current_topic": current_topic,
            "context": context,
        }):
            buffer += chunk
            if parsed := await self.parse_chunk(buffer):
                difficulty_end_pos = buffer.find(
                    DIFFICULTY_DELIMITER) + len(DIFFICULTY_DELIMITER)
                buffer = buffer[difficulty_end_pos:] if difficulty_end_pos > -1 else buffer
                yield parsed


async def generate_topics():
    pass