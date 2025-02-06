from fastapi import APIRouter, Query
from typing import List
from .db_ops import (get_problems_by_filter,
                     FilterForProblem,
                     SortOrder,
                     get_all_tags,
                     get_problem_cnt,
                     find_problem_by_name)
from .soution import generate_code_solution, SolutionConfig

router = APIRouter(prefix="/leetcode", tags=["leetcode"])
# tags = get_all_tags()
# problem_cnt = get_problem_cnt()


@router.get("/problems")
async def get_problems(
    tags: List[str] = Query(default=[]),
    difficulty: List[str] = Query(default=[]),
    acceptanceSort: SortOrder = Query(default=SortOrder.NONE),
    limit: int = Query(default=40, ge=1),
    page: int = Query(default=1, ge=1),
    firstQuery: bool = Query(default=False)
):
    filter_params = FilterForProblem(
        tags=tags,
        difficulty=difficulty,
        acceptance_sort=acceptanceSort,
        limit=limit,
        page=page,
        first_query=firstQuery
    )
    problems, total_count = get_problems_by_filter(filter_params)
    return {"problems": problems, "total_count": total_count}


@router.post("/solution")
async def generate_solution(config: SolutionConfig):
    return await generate_code_solution(config)


@router.get("/tags")
async def get_tags():
    return [tag.name for tag in tags]


@router.get("/info")
async def get_info():
    return {
        "problem_cnt": problem_cnt,
        "tags": [tag.name for tag in tags],
        "difficulty": ["Easy", "Medium", "Hard"],
        "page_size": 40,
    }


@router.get("/problem/{problem_name}")
async def get_problem(problem_name: str):
    name = " ".join(problem_name.split("_"))
    prob = find_problem_by_name(name)
    return prob
