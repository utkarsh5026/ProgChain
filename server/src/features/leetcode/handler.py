from fastapi import APIRouter, Query
from typing import List
from .vector_store import leetcode_vector_store
from .db_ops import get_problems_by_filter, FilterForProblem, SortOrder
from .soution import generate_code_solution, SolutionConfig

router = APIRouter(prefix="/leetcode", tags=["leetcode"])


@router.get("/search")
async def search_problems(prompt: str):
    result = await leetcode_vector_store.search_problems(prompt)
    return {"problems": result}


@router.get("/problems")
async def get_problems(
    tags: List[str] = Query(default=[]),
    difficulty: List[str] = Query(default=[]),
    acceptance_sort: SortOrder = Query(default=SortOrder.NONE),
    limit: int = Query(default=40, ge=1),
    page: int = Query(default=1, ge=1)
):
    filter_params = FilterForProblem(
        tags=tags,
        difficulty=difficulty,
        acceptance_sort=acceptance_sort,
        limit=limit,
        page=page
    )
    return {"problems": get_problems_by_filter(filter_params)}


@router.post("/solution")
async def generate_solution(config: SolutionConfig):
    return await generate_code_solution(config)
