from .db_models import Problem, Tag
from config.db import db_session
from sqlalchemy.orm import joinedload
from pydantic import BaseModel, Field
from enum import Enum
from typing import List, Optional


class SortOrder(str, Enum):
    ASCENDING = "asc"
    DESCENDING = "desc"
    NONE = "none"


class FilterForProblem(BaseModel):
    tags: List[str] = Field(default_factory=list)
    difficulty: List[str] = Field(default_factory=list)
    acceptance_sort: SortOrder = Field(default=SortOrder.NONE)
    limit: int = Field(default=40, ge=1)
    page: int = Field(default=1, ge=1)

    class Config:
        from_attributes = True


def find_problem_by_name(name: str):
    with db_session() as session:
        return session.query(Problem).filter(Problem.name == name).options(
            joinedload(Problem.tags)
        ).first()


def search_problems_with_name(name: str, limit: int = 10):
    with db_session() as session:
        return session.query(Problem).filter(Problem.name.like(f"%{name}%")).options(
            joinedload(Problem.tags)
        ).limit(limit).all()


def get_problem_by_id(id: int):
    with db_session() as session:
        return session.query(Problem).filter(Problem.id == id).options(
            joinedload(Problem.tags)
        ).first()


def get_problems_by_filter(filter: FilterForProblem):
    """
    Get problems by filter.
    """
    with db_session() as session:
        query = session.query(Problem).options(joinedload(Problem.tags))

        if filter.tags:
            # Filter problems that have ANY of the specified tags
            query = query.filter(Problem.tags.any(Tag.name.in_(filter.tags)))

        if filter.difficulty:
            query = query.filter(Problem.difficulty.in_(filter.difficulty))

        if filter.acceptance_sort != SortOrder.NONE:
            if filter.acceptance_sort == SortOrder.ASCENDING:
                query = query.order_by(Problem.acceptance_rate.asc())
            else:  # DESCENDING
                query = query.order_by(Problem.acceptance_rate.desc())

        return query.limit(filter.limit).offset(
            (filter.page - 1) * filter.limit).all()
