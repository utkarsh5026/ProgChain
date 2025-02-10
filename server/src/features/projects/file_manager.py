import csv
import aiofiles
from typing import Optional
from pathlib import Path
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders.text import TextLoader
from langchain_community.document_loaders.csv_loader import CSVLoader
from langchain_community.document_loaders.html import UnstructuredHTMLLoader


BASE_FILE_DIR = Path(__file__).parent.parent.parent.parent / "project_files"
BASE_FILE_DIR.mkdir(parents=True, exist_ok=True)


class FileLoader:

    def __init__(self,
                 chunk_size: Optional[int] = 1000,
                 chunk_overlap: Optional[int] = 200,
                 encoding: Optional[str] = "utf-8") -> None:
        """
        Initialize the FileLoader with customizable parameters.

        Args:
            chunk_size: Size of text chunks for splitting documents
            chunk_overlap: Overlap between chunks to maintain context
            encoding: File encoding to use when reading files
        """
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.encoding = encoding

        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size,
            chunk_overlap=self.chunk_overlap,
        )

        self.loader_registry = {
            # Text-based files
            ".txt": self._load_text,
            ".log": self._load_text,

            ".csv": self._load_csv,
            ".html": self._load_html,

            # Code files
            ".py": self._load_code,
            ".js": self._load_code,
            ".java": self._load_code,
            ".cpp": self._load_code,

            ".c": self._load_code,
            ".h": self._load_code,
            ".css": self._load_code,
            ".sql": self._load_code,
        }

    def _load_text(self, file_path: Path) -> list[Document]:
        """Load text files using LangChain's TextLoader."""
        loader = TextLoader(str(file_path), encoding=self.encoding)
        return self.text_splitter.split_documents(loader.load())

    def _load_csv(self, file_path: Path) -> list[Document]:
        """
        Load CSV files with enhanced metadata and structure preservation.
        """
        loader = CSVLoader(
            str(file_path),
            encoding=self.encoding,
            csv_args={
                "delimiter": ",",
                "quotechar": '"',
                "doublequote": True
            }
        )
        documents = loader.load()
        with open(file_path, 'r', encoding=self.encoding) as f:
            reader = csv.reader(f)
            headers = next(reader)
            for doc in documents:
                doc.metadata["columns"] = headers

    def _load_code(self, file_path: Path) -> list[Document]:
        """Load code files using LangChain's TextLoader."""

        with open(file_path, 'r', encoding=self.encoding) as f:
            code = f.read()

        meta_data = {
            "is_code": True,
            "prog_lang": file_path.suffix.lstrip("."),
        }

        return self.text_splitter.create_documents([code], metadatas=[meta_data])

    def _load_html(self, file_path: Path) -> list[Document]:
        """Load HTML files using LangChain's UnstructuredHTMLLoader."""
        loader = UnstructuredHTMLLoader(str(file_path), encoding=self.encoding)
        return self.text_splitter.split_documents(loader.load())

    def supports_extension(self, extension: str) -> bool:
        """Check if a file extension is supported."""
        return extension.lower() in self.loader_registry

    @property
    def supported_extensions(self) -> list[str]:
        """Get list of all supported file extensions."""
        return list(self.loader_registry.keys())


async def write_file(file_name: str, file_content: str | bytes, encoding: str = "utf-8") -> str:
    """
        Asynchronously writes file content to the specified file name.
        Depending on the type of file_content provided:
        - If file_content is a str (for text or code file), this method opens the file in text mode ("w") so that
          Python handles the encoding automatically.
        - If file_content is already bytes, or if you prefer manual encoding, you can open the file in binary mode ("wb").
    """
    file_path = BASE_FILE_DIR / file_name

    if isinstance(file_content, str):
        async with aiofiles.open(file_path, mode='w', encoding='utf-8') as file:
            await file.write(file_content)
    else:
        async with aiofiles.open(file_path, mode='wb') as file:
            await file.write(file_content)

    return str(file_path)
