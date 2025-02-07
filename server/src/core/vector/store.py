import asyncio
from typing import List, Optional
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain.memory import VectorStoreRetrieverMemory
from cachetools import TTLCache


class VectorDB:
    """
    A performance-oriented vector database for chat sessions.

    Enhancements include:
      - Caching for query results (using a TTL cache)
      - Scaffold for batch processing and asynchronous record addition
      - Flexibility to switch on memory-based retrieval if needed

    This example demonstrates how you might build on the basic FAISS retriever
    to provide improved performance in a production system.
    """

    def __init__(
        self,
        initial_text: str = "",
        search_k: int = 5,
        chunk_size: int = 1000,
        use_memory: bool = False
    ) -> None:
        """
        Initialize the optimized vector database.

        Args:
            initial_text: An optional initial text to populate the vector store.
            search_k: Number of documents to retrieve.
            chunk_size: Maximum size for text chunks (placeholder for future use).
            use_memory: Whether to utilize a memory retriever.
        """
        self.search_k = search_k
        self.chunk_size = chunk_size
        self.use_memory = use_memory

        self.embeddings = OpenAIEmbeddings()
        self._initialize_vector_store(initial_text)

        self.query_cache = TTLCache(maxsize=100, ttl=60)

    def _initialize_vector_store(self, initial_text: str) -> None:
        """Initialize FAISS vector store and, optionally, the memory retriever."""
        texts = [initial_text] if initial_text else []
        self.vector_store = FAISS.from_texts(
            texts=texts,
            embedding=self.embeddings
        )

        self.retriever = self.vector_store.as_retriever(
            search_kwargs={"k": self.search_k}
        )
        if self.use_memory:
            self.memory = VectorStoreRetrieverMemory(
                retriever=self.retriever,
                return_messages=True,
                memory_key="relevant_history"
            )
        else:
            self.memory = None

    async def query_history(self, query: str) -> List[str]:
        """
        Retrieve relevant messages based on a query.

        Implements caching to avoid repeated expensive searches.
        """
        if not query or not isinstance(query, str):
            raise ValueError("Query must be a non-empty string")

        # Return from cache if available.
        if query in self.query_cache:
            return self.query_cache[query]

        # Retrieve context: either via memory if enabled or a direct similarity search.
        if self.memory:
            memory_vars = self.memory.load_memory_variables({"prompt": query})
            history = memory_vars.get("relevant_history", [])
            result = [h.strip() for h in history] if isinstance(
                history, list) else [history.strip()]
        else:
            docs = self.retriever.get_relevant_documents(query)
            result = [doc.page_content for doc in docs]

        self.query_cache[query] = result
        return result

    async def add_interaction(self, human_msg: str, ai_msg: str) -> None:
        """
        Add a paired human-AI interaction.

        Here we use asynchronous scaffolding, which you could later enhance to process
        multiple interactions in a batch or in parallel.
        """
        if not human_msg or not isinstance(human_msg, str):
            raise ValueError("Human message must be a non-empty string")
        if not ai_msg or not isinstance(ai_msg, str):
            raise ValueError("AI message must be a non-empty string")

        if self.memory:
            await self.memory.asave_context({"input": human_msg}, {"output": ai_msg})

        # Using asyncio.sleep(0) as a placeholder to yield control; in a real-world application,
        # you might batch multiple interactions before writing them.
        await asyncio.sleep(0)
        self.vector_store.add_texts([
            f"Human: {human_msg}",
            f"AI: {ai_msg}"
        ])

    async def add_message(self, message: str, role: Optional[str] = None) -> None:
        """
        Add a single message, optionally tagged with a role.
        """
        if not message or not isinstance(message, str):
            raise ValueError("Message must be a non-empty string")
        full_text = f"{role}: {message}" if role else message

        if self.memory:
            await self.memory.asave_context({"input": full_text}, {"output": ""})
        self.vector_store.add_texts([full_text])

    async def clear(self, initial_text: Optional[str] = None) -> None:
        """
        Clear the vector store and the query cache; reinitialize with an optional new starting text.
        """
        self._initialize_vector_store(initial_text or "")
        self.query_cache.clear()
