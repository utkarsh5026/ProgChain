from fastapi import APIRouter, HTTPException, File, UploadFile
from pydantic import BaseModel, Field
from .service import ProjectService, FileAdd, ProjectCreate


router = APIRouter(prefix="/projects", tags=["projects"])
ps = ProjectService()


class UploadFileRequest(BaseModel):
    project_id: str = Field(..., description="The id of the project")
    file: UploadFile = File(..., description="The file to be uploaded")


@router.post("/create")
async def create_project(project: ProjectCreate):
    try:
        project_id = await ps.create_project(project)
        return project_id
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/upload-file")
async def upload_file(file: UploadFileRequest):
    """
    Receives an uploaded file, reads its contents, and saves it to the 'uploads' directory.
    """
    contents = await file.file.read()
    file_to_add = FileAdd(project_id=file.project_id,
                          file_name=file.file.filename,
                          file_content=contents)
    await ps.handle_file_write(file_to_add)
