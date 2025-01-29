from fastapi import APIRouter
from models.leetcode import problem_names, problems, filter_problems
router = APIRouter(prefix="/leetcode", tags=["leetcode"])


@router.get("/search")
async def search_problems(query: str):
    cnt = 0
    result = []
    for problem in problem_names:
        if cnt >= 10:
            break
        if query.lower() in problem.lower():
            result.append(problem)
            cnt += 1
    return {"problems": result}


@router.get("/problems")
async def get_problems(limit: int = 20, page: int = 1):
    filtered_problems = filter_problems(problems, page, limit)
    return filtered_problems
