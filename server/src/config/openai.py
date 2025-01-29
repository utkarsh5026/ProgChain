from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os


load_dotenv()

openai_api_key = os.getenv("OPENAI_API_KEY")

llm = ChatOpenAI(
    openai_api_key=openai_api_key,
    model_name="gpt-4o-mini",
    temperature=0.0,
    max_tokens=None,
    max_retries=3,
    request_timeout=30.0,
)
