from typing import Optional
from pydantic import BaseModel
from config.models import get_model
from langchain_core.prompts import PromptTemplate
from .db_ops import get_problem_by_id
from langchain_core.messages import AIMessage
from pydantic import ValidationError


class SolutionConfig(BaseModel):
    prog_lang: str
    model: str
    problem_id: str | int
    additional_context: Optional[str] = None


class SolutionResponse(BaseModel):
    code: str
    time_complexity: str
    space_complexity: str


async def generate_code_solution(config: SolutionConfig):
    problem = get_problem_by_id(config.problem_id)

    if problem is None:
        raise ValueError(f"Problem with id {config.problem_id} not found")

    prompt = PromptTemplate.from_template("""You are an expert {prog_lang} programmer helping with coding interviews. 
Given the following LeetCode problem, provide a solution that follows these requirements:

Problem Title: {title}
Description: {description}
Tags: {tags}
Additional Context: {context}

Requirements:
1. Provide the solution in valid {prog_lang} syntax
2. Time complexity should be expressed in single-word Big O notation (e.g., O(1), O(n), O(logn), O(nlogn))
3. Space complexity should be expressed in single-word Big O notation
4. Format your response as a JSON object with these exact keys:
   - code: The complete solution code as a string
   - time_complexity: The time complexity in single-word notation
   - space_complexity: The space complexity in single-word notation

Important:
- Only provide the JSON response, no additional explanations
- Ensure the code is complete and runnable
- Use proper indentation in the code
- Include necessary imports
- Make the code as efficient as possible

Return your response in this exact format:
{{
    "code": "your complete code here",
    "time_complexity": "O(?)",
    "space_complexity": "O(?)"
}}""")

    model = get_model(config.model)

    chain = prompt | model

    result = await chain.ainvoke({
        "prog_lang": config.prog_lang,
        "title": problem.name,
        "description": problem.description,
        "tags": problem.tags,
        "context": config.additional_context or ""
    })

    if isinstance(result, AIMessage):
        result = result.content

    try:
        solution = SolutionResponse.model_validate_json(result)
        return solution
    except ValidationError as e:
        raise ValueError(
            f"Failed to parse LLM response into expected format: {e}"
        )
