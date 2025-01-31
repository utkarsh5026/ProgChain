from .handler import router as leetcode_router
from dotenv import load_dotenv
from logging import getLogger

load_dotenv()

logger = getLogger(__name__)


async def initialize_leetcode():
    print("Initializing leetcode")


__all__ = ["leetcode_router", "initialize_leetcode"]
