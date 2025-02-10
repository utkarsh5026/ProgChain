from datetime import datetime
from hashlib import sha256
from pydantic import BaseModel, Field
from .file_manager import FileLoader, write_file
from .models import add_file_to_project, create_project


class FileAdd(BaseModel):
    project_id: int = Field(
        description="The ID of the project to add the file to")
    file_name: str = Field(
        description="The name of the file to add")
    file_content: bytes = Field(
        description="The content of the file to add")


class ProjectCreate(BaseModel):
    name: str = Field(
        description="The name of the project to create")
    description: str = Field(
        description="The description of the project to create")


class ProjectService:

    def __init__(self) -> None:
        pass

    async def create_project(self, project: ProjectCreate) -> int:
        project = await create_project(project.name, project.description)
        return project.id

    async def handle_file_write(self, file_add: FileAdd):
        file_name = file_add.file_name
        file_content = file_add.file_content
        unique_file_name = self.create_unique_file_name_hash(file_name)
        file_path = await write_file(unique_file_name, file_content)
        await add_file_to_project(file_add.project_id, file_name, file_path)

    @classmethod
    def create_unique_file_name_hash(cls, file_name: str) -> str:
        """
        Create a unique file name by appending a timestamp to the original file name.
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        file_hash = sha256(file_name.encode()).hexdigest()
        return f"{file_hash}_{timestamp}"
