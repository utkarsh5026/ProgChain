from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Union
from enum import Enum
from langchain.output_parsers import PydanticOutputParser
from langchain.prompts import PromptTemplate
from config.openai import llm


class DifficultyLevel(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class QuestionType(str, Enum):
    SINGLE_CORRECT = "single_correct"
    MULTI_CORRECT = "multi_correct"


class QuestionCategory(str, Enum):
    CONCEPTUAL = "conceptual"
    ANALYTICAL = "analytical"
    CODE_COMPREHENSION = "code_comprehension"
    DEBUGGING = "debugging"
    BEST_PRACTICES = "best_practices"
    PROBLEM_SOLVING = "problem_solving"


class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_answers: List[int]
    difficulty: str
    question_type: str
    category: str


class QuizQuestions(BaseModel):
    questions: List[QuizQuestion] = Field(...,
                                          description="List of quiz questions")


class QuizGenerate(BaseModel):
    topic: str
    levels: List[DifficultyLevel]
    count: int
    instructions: Optional[str] = None

    @field_validator('levels')
    def validate_levels(cls, levels):
        if not levels:
            raise ValueError("At least one difficulty level must be provided")
        if len(levels) != len(set(levels)):
            raise ValueError("Duplicate difficulty levels are not allowed")
        return levels


    @field_validator('count')
    def validate_count(cls, count):
        if count <= 0:
            raise ValueError("Count must be a positive integer")
        return count


# Create a PydanticOutputParser for QuizQuestions
parser = PydanticOutputParser(pydantic_object=QuizQuestions)


quiz_generation_prompt = PromptTemplate(
    template="""
Generate a programming quiz on the topic of "{topic}" with the following specifications:

1. Total number of questions: {count}
2. Difficulty level(s): {levels}
3. Include both single-correct and multi-correct questions
4. Cover various aspects of programming knowledge and skills

For each question, provide:
1. The question text
2. A list of 4 options
3. The correct answer(s) (index or indices of correct option(s))
4. The difficulty level (EASY, MEDIUM, or HARD)
5. The question type (SINGLE_CORRECT or MULTI_CORRECT)
6. The question category (CONCEPTUAL, ANALYTICAL, CODE_COMPREHENSION, DEBUGGING, BEST_PRACTICES, or PROBLEM_SOLVING)

Ensure that the questions are diverse and cover various aspects of the programming topic. The difficulty levels should be appropriately challenging for the specified level(s). Include a mix of the question categories as described earlier.

Additional instructions: {instructions}

{format_instructions}
""",
    input_variables=["topic", "count", "levels", "instructions"],
    partial_variables={"format_instructions": parser.get_format_instructions()}
)


def generate_quiz_prompt(quiz_params: QuizGenerate) -> str:
    return quiz_generation_prompt.format(
        topic=quiz_params.topic,
        count=quiz_params.count,
        levels=", ".join(level.value for level in quiz_params.levels),
        instructions=quiz_params.instructions or "No additional instructions."
    )


# Example usage:
chain = quiz_generation_prompt | llm | parser


async def generate_quiz(quiz_params: QuizGenerate) -> QuizQuestions:
    result = None
    try:
        result = await chain.ainvoke({
            "topic": quiz_params.topic,
            "count": quiz_params.count,
            "levels": quiz_params.levels,
            "instructions": quiz_params.instructions
        })
        print(result)
    except Exception as e:
        print(e)
    return result
