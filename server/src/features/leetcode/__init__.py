from .handler import router as leetcode_router
from .vector_store import leetcode_vector_store
from logging import getLogger

logger = getLogger(__name__)


async def initialize_leetcode():
    if not leetcode_vector_store.vector_store:
        logger.info("Initializing leetcode vector store")
        await leetcode_vector_store.create_vector_store()


__all__ = ["leetcode_router", "initialize_leetcode"]
