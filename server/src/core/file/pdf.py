from io import BytesIO
from PyPDF2 import PdfReader
from PyPDF2.types import OutlineType
from langchain_core.documents import Document
from logging import getLogger
from typing import Optional, Any
from pydantic import BaseModel, Field

logger = getLogger(__name__)


class PDFOutline(BaseModel):
    title: str = Field(description="The title of the outline item")
    page_number: int = Field(description="The page number of the outline item")
    children: list["PDFOutline"] = Field(
        description="A list of child outline items"
    )


class PDFOutlineError(Exception):
    """Custom exception for PDF outline processing errors."""
    pass


class PDFProcessor:
    """
    A class to process PDF documents and extract structured content based on outlines.

    Attributes:
        reader (PdfReader): The PDF reader instance
        outline_tree (List[Dict[str, Any]]): Processed outline tree structure
    """

    def __init__(self, pdf_bytes: bytes):
        """
        Initialize PDFProcessor with PDF content.

        Args:
            pdf_bytes: Raw PDF content as bytes

        Raises:
            ValueError: If PDF lacks an outline
            PDFOutlineError: If initialization fails
        """

        try:
            pdf_file = BytesIO(pdf_bytes)
            self.reader = PdfReader(pdf_file)

            if not hasattr(self.reader, "outline") or self.reader.outline is None:
                raise ValueError("PDF does not contain an outline/bookmarks.")

            self.outline_tree = self._build_outline_tree(self.reader.outline)
        except Exception as e:
            logger.error(f"Error initializing PDFProcessor: {e}")
            raise PDFOutlineError(f"Error processing PDF outline: {e}") from e

    def _build_outline_tree(self, outline: OutlineType):
        """
        Recursively builds a hierarchical outline tree.

        Args:
            outline: PDF outline/bookmarks structure

        Returns:
            List of dictionaries representing the outline hierarchy

        Raises:
            PDFOutlineError: If outline processing fails
        """

        tree: list[PDFOutline] = []
        try:
            for item in outline:
                if isinstance(item, list):
                    if tree:
                        tree[-1].setdefault("children", []).extend(
                            self._build_outline_tree(item)
                        )
                else:
                    page_number = self._get_page_number(item)
                    if page_number is not None:
                        node = PDFOutline(
                            title=item.title,
                            page_number=page_number,
                            children=[]
                        )
                        tree.append(node)

            return tree
        except Exception as e:
            logger.error(f"Failed to build outline tree: {str(e)}")
            raise PDFOutlineError(
                f"Failed to build outline tree: {str(e)}") from e

    def _extract_page_range_text(self, start_page: int, end_page: int) -> str:
        """
        Extracts text from a range of PDF pages.
        Args:
            start_page: Starting page number
            end_page: Ending page number

        Returns:
            Concatenated text from the page range
        """
        text_parts = []
        for page_index in range(start_page, end_page):
            try:
                page = self.reader.pages[page_index]
                page_text = page.extract_text()
                if page_text:
                    text_parts.append(page_text)
            except Exception as e:
                logger.warning(
                    f"Failed to extract text from page {page_index}: {str(e)}")
        return "\n".join(text_parts)

    def _extract_leaf_documents(
        self,
        outline_nodes: list[dict[str, Any]],
        default_end: int,
        hierarchy: Optional[list[str]] = None
    ) -> list[Document]:
        """
        Recursively extracts text from leaf nodes in the outline tree.

        Args:
            outline_nodes: List of outline node dictionaries
            default_end: Default ending page number
            hierarchy: Current hierarchy path (optional)

        Returns:
            List of Document objects representing leaf sections

        Raises:
            PDFOutlineError: If text extraction fails
        """

        hierarchy = hierarchy or []
        docs: list[Document] = []

        try:
            for idx, node in enumerate(outline_nodes):
                start_page = node["page_number"]
                end_page = (outline_nodes[idx + 1]["page_number"]
                            if idx + 1 < len(outline_nodes) else default_end)

                current_hierarchy = hierarchy + [node["title"]]

                if node["children"]:
                    docs.extend(self._extract_leaf_documents(
                        node["children"],
                        default_end=end_page,
                        hierarchy=current_hierarchy
                    ))
                else:
                    section_text = self._extract_page_range_text(
                        start_page=start_page,
                        end_page=end_page
                    )
                    doc = Document(
                        page_content=section_text,
                        metadata={
                            "hierarchy": current_hierarchy,
                            "start_page": start_page,
                            "end_page": end_page
                        }
                    )
                    docs.append(doc)

        except Exception as e:
            logger.error(f"Failed to extract leaf documents: {str(e)}")
            raise PDFOutlineError(
                f"Failed to extract leaf documents: {str(e)}") from e

    def extract_leaf_sections(self) -> list[Document]:
        """
        Extracts all leaf sections from the PDF with hierarchical metadata.

        Returns:
            List of Document objects representing leaf sections

        Raises:
            PDFOutlineError: If processing fails
        """
        try:
            return self._extract_leaf_documents(
                self.outline_tree,
                default_end=len(self.reader.pages)
            )
        except Exception as e:
            logger.error(f"Failed to extract leaf sections: {str(e)}")
            raise PDFOutlineError(
                f"Failed to extract leaf sections: {str(e)}") from e


def extract_sections_from_pdf(pdf_bytes: bytes) -> list[Document]:
    """
    Wrapper function for backward compatibility.

    Args:
        pdf_bytes: PDF file content as bytes

    Returns:
        List of Document objects representing leaf sections
    """
    processor = PDFProcessor(pdf_bytes)
    return processor.extract_leaf_sections()
