from typing import List, Union, Optional
from langchain.memory import VectorStoreRetrieverMemory
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage, BaseMessage


class VectorStoreManager:
    """Manages vector store operations for conversation history."""

    def __init__(
        self,
        initial_text: str = "System: Conversation Start",
        search_k: int = 5,
        chunk_size: int = 1000
    ) -> None:
        """
        Initialize the vector store manager.

        Args:
            initial_text: Initial text to populate the vector store
            search_k: Number of relevant documents to retrieve
            chunk_size: Maximum size of text chunks
        """
        try:
            self.embeddings = OpenAIEmbeddings()
            self.search_k = search_k
            self.chunk_size = chunk_size

            self._initialize_stores(initial_text)
        except Exception as e:
            raise RuntimeError(f"Failed to initialize vector store: {str(e)}")

    async def get_relevant_history(self, query: str) -> List[BaseMessage]:
        """
        Retrieve relevant conversation history based on query.

        Args:
            query: The search query string

        Returns:
            List of conversation messages

        Raises:
            ValueError: If query is empty or invalid
        """
        if not query or not isinstance(query, str):
            raise ValueError("Query must be a non-empty string")

        try:
            memory_variables = self.memory.load_memory_variables(
                {"prompt": query})
            history = memory_variables["relevant_history"]

            if isinstance(history, str):
                return self._parse_history_string(history)
            return history
        except Exception as e:
            raise RuntimeError(f"Failed to retrieve history: {str(e)}")

    def _parse_history_string(self, history: str) -> List[BaseMessage]:
        """Parse history string into appropriate message type."""
        history = history.strip()
        if history.startswith("System:"):
            return [SystemMessage(content=history[8:].strip())]
        elif history.startswith("Human:"):
            return [HumanMessage(content=history[7:].strip())]
        elif history.startswith("AI:"):
            return [AIMessage(content=history[4:].strip())]
        return [SystemMessage(content=history)]

    async def add_interaction(
        self,
        human_msg: str,
        ai_msg: str,
        validate: bool = True
    ) -> None:
        """
        Add a conversation interaction to the vector store.

        Args:
            human_msg: Human message content
            ai_msg: AI message content
            validate: Whether to validate input messages

        Raises:
            ValueError: If messages are empty or invalid
        """
        if validate:
            if not human_msg or not isinstance(human_msg, str):
                raise ValueError("Human message must be a non-empty string")
            if not ai_msg or not isinstance(ai_msg, str):
                raise ValueError("AI message must be a non-empty string")

        try:
            await self.memory.asave_context({"input": human_msg}, {"output": ai_msg})
            self.vector_store.add_texts(
                [f"Human: {human_msg}", f"AI: {ai_msg}"])
        except Exception as e:
            raise RuntimeError(f"Failed to add interaction: {str(e)}")

    async def clear(self, initial_text: Optional[str] = None) -> None:
        """
        Clear the vector store and reinitialize it.

        Args:
            initial_text: Optional new initial text
        """
        try:
            self._initialize_stores(
                initial_text or "System: Conversation Start"
            )
        except Exception as e:
            raise RuntimeError(f"Failed to clear vector store: {str(e)}")

    def _initialize_stores(self, initial_text: str) -> None:
        """Initialize vector store and memory with given text."""
        self.vector_store = FAISS.from_texts(
            texts=[initial_text],
            embedding=self.embeddings
        )
        self.retriever = self.vector_store.as_retriever(
            search_kwargs={"k": self.search_k}
        )
        self.memory = VectorStoreRetrieverMemory(
            retriever=self.retriever,
            return_messages=True,
            memory_key="relevant_history"
        )
