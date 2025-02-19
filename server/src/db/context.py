import functools
from typing import Callable, TypeVar
from loguru import logger
from .config import AsyncSessionLocal

T = TypeVar('T')


def with_session():
    """
    Decorator that wraps async functions to provide a database session.
    The wrapped function should have 'session' as its first parameter after self (for methods)
    or as its first parameter (for standalone functions).
    """

    def decorator(function: Callable[..., T]) -> Callable[..., T]:
        @functools.wraps(function)
        async def wrapper(*args, **kwargs):
            is_class_method = isinstance(args[0], type)

            async with AsyncSessionLocal() as session:
                try:
                    if is_class_method:
                        cls = args[0]
                        other_args = args[1:]
                        result = await function(cls, session, *other_args, **kwargs)
                    else:
                        result = await function(session, *args, **kwargs)
                    for obj in session.identity_map.values():
                        await session.refresh(obj)

                    session.expunge_all()
                    await session.commit()
                    return result

                except Exception as error:
                    logger.exception(
                        f"Database Operation failed with error:  {error}")
                    await session.rollback()
                    raise

        return wrapper

    return decorator
