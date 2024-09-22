from pydantic import BaseModel
import json
import os


PROBLEMS_FILE_NAME = 'leetcode_problems.json'


class ProblemsResult(BaseModel):
    problems: list[dict]
    total: int
    page: int
    limit: int
    total_pages: int


def load_problems() -> list:
    file_path = os.path.join(os.path.dirname(
        __file__), '..', '..', 'data', PROBLEMS_FILE_NAME)
    with open(file_path, 'r') as file:
        data = json.load(file)

    return data


def filter_problem_names(probs: list[dict]):
    problem_names = []
    for problem in probs:
        if 'problem' in problem:
            problem_name = problem['problem']
            parts = problem_name.split('.')

            if len(parts) > 1:
                problem_names.append(parts[1].strip())

    return problem_names


def filter_problems(probs: list[dict], page: int, limit: int):
    start_index = (page - 1) * limit
    end_index = start_index + limit
    paginated_problems = probs[start_index:end_index]
    total_problems = len(probs)
    total_pages = (total_problems + limit - 1) // limit

    return ProblemsResult(
        problems=paginated_problems,
        total=total_problems,
        page=page,
        limit=limit,
        total_pages=total_pages
    )


problems = load_problems()
problem_names = filter_problem_names(problems)
