from langchain_core.documents import Document
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from .db_ops import get_all_problems
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()


class LeetCodeVectorStore:

    def __init__(self, index_path: str = "faiss_index"):
        key = os.getenv("OPENAI_API_KEY")
        if not key:
            raise ValueError("OPENAI_API_KEY is not set")
        self.embeddings = OpenAIEmbeddings(api_key=key)
        self.index_path = Path(index_path).resolve()
        self.vector_store = None

        if os.path.exists(self.index_path):
            self.vector_store = FAISS.load_local(
                self.index_path,
                self.embeddings,
                allow_dangerous_deserialization=True
            )

    async def initialize(self):
        """Initialize the vector store asynchronously"""
        if os.path.exists(self.index_path):
            self.vector_store = await FAISS.aloads_local(
                self.index_path,
                self.embeddings
            )

    async def create_vector_store(self):

        try:
            problems = get_all_problems()
            print(f"Number of problems: {len(problems)}")

            documents: list[Document] = []
            for prob in problems:
                tag_names = [tag.name for tag in prob.tags]
                context = f"""LeetCode Problem:
    Title: {prob.name}
    Difficulty: {prob.difficulty}
    Acceptance Rate: {prob.acceptance_rate}%
    Tags: {', '.join(tag_names)}
    Description: {prob.description}
    """
                doc = Document(
                    page_content=context,
                    metadata={
                        "title": prob.name,
                        "difficulty": prob.difficulty,
                        "acceptance_rate": prob.acceptance_rate,
                        "tags": tag_names
                    }
                )
                documents.append(doc)

            print(f"Number of documents: {len(documents)}")
            self.vector_store = await FAISS.afrom_documents(
                documents,
                self.embeddings,
            )
            await self.vector_store.save_local(self.index_path)
            print("Vector store created successfully")

        except Exception as e:
            print(f"Error creating vector store: {e.with_traceback}")

    async def search_problems(self, prompt: str, k: int = 5):
        """
        Search for LeetCode problems similar to the given prompt.

        Args:
            prompt (str): The search query or description
            k (int): Number of results to return (default: 5)

        Returns:
            list: List of documents with their similarity scores
        """
        if not self.vector_store:
            raise ValueError(
                "Vector store not initialized. Call initialize() first.")

        return await self.vector_store.asimilarity_search_with_relevance_scores(prompt, k=k)


leetcode_vector_store = LeetCodeVectorStore()
