from .db import Base
from sqlalchemy import Column, Integer, String


class PromptType(Base):
    __tablename__ = "prompt_types"

    id = Column(Integer, primary_key=True)
