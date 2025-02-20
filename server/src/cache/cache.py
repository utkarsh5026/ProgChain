from cachetools import LRUCache
from loguru import logger


class Cache:
    """
    Cache class for caching data.
    """
    _cache = LRUCache[str, int](maxsize=1000)

    @classmethod
    def get(cls, key: str) -> int:
        """
        Get a value from the cache.
        """
        result = cls._cache.get(key)
        if result is None:
            logger.error(f"Cache miss for key: {key}")
        return result

    @classmethod
    def set(cls, key: str, value: int):
        """
        Set a value in the cache.
        """
        cls._cache[key] = value

    @classmethod
    def delete(cls, key: str):
        """
        Delete a value from the cache.
        """
        del cls._cache[key]
