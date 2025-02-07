from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os
from enum import Enum

load_dotenv()

gpt_4o_mini = ChatOpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    model_name="gpt-4o-mini",
    temperature=0.0,
    max_tokens=None,
    max_retries=3,
    request_timeout=30.0,
)


gpt_4o = ChatOpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    model_name="gpt-4o",
    temperature=0.0,
    max_tokens=None,
    max_retries=3,
    request_timeout=30.0,
)


class Model(Enum):
    """Enumeration for available models."""
    GPT_4O_MINI = "gpt-4o-mini"
    GPT_4O = "gpt-4o"


def get_models_available():
    """Returns a list of available model names."""
    return [Model.GPT_4O_MINI.value, Model.GPT_4O.value]


def get_model(model: str | None = None):
    """Retrieves the ChatOpenAI model instance based on the provided model name.

    Args:
        model (str): The name of the model to retrieve.

    Raises:
        ValueError: If the provided model name is invalid.

    Returns:
        ChatOpenAI: The corresponding ChatOpenAI model instance.
    """
    if model == Model.GPT_4O_MINI.value:
        return gpt_4o_mini
    elif model == Model.GPT_4O.value:
        return gpt_4o
    return gpt_4o
