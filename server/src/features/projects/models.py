from config.db import Base
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from datetime import datetime, timezone
from sqlalchemy.orm import relationship
from config.db import db_session


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    vector_db_path = Column(String)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    chats = relationship("ProjectChats", back_populates="project")
    files = relationship("ProjectFiles", back_populates="project")


class ProjectChats(Base):
    __tablename__ = "project_chats"
    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    chat_topic = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    project = relationship("Project", back_populates="chats")
    messages = relationship("ProjectChatMessages", back_populates="chat")


class ProjectFiles(Base):
    __tablename__ = "project_files"
    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    file_name = Column(String, nullable=False)
    file_path = Column(String, nullable=False, index=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    project = relationship("Project", back_populates="files")


class ProjectChatMessages(Base):
    __tablename__ = "project_chat_messages"

    id = Column(Integer, primary_key=True)
    chat_id = Column(Integer, ForeignKey("project_chats.id"))
    project_files_used = Column(JSON, nullable=False)
    message = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    chat = relationship("ProjectChats", back_populates="messages")


async def create_project(title: str, description: str) -> Project:
    async with db_session() as session:
        project = Project(title=title, description=description)
        session.add(project)
        await session.commit()
        return project


async def get_project_by_id(project_id: int) -> Project:
    async with db_session() as session:
        project = session.query(Project).filter(
            Project.id == project_id).first()
        return project


async def add_file_to_project(project_id: int, user_file_name: str, file_path: str) -> ProjectFiles:
    async with db_session() as session:
        file = ProjectFiles(project_id=project_id,
                            file_name=user_file_name,
                            file_path=file_path)
        session.add(file)
        await session.commit()
        return file
