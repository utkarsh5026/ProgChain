from langchain import PromptTemplate
from langchain.output_parsers import StructuredOutputParser, ResponseSchema
from config.openai import llm


# Define the prompt template
prompt_template = """
You are an experienced technical interviewer with deep knowledge across various programming and software engineering domains. Your task is to generate a set of interview questions based on the given topic and context. These questions should be designed to assess a candidate's knowledge, problem-solving skills, and ability to think critically about the subject matter.

Topic: {topic}
Context: {context}

Please generate 10 interview questions that meet the following criteria:
1. Vary in difficulty (include easy, medium, and challenging questions)
2. Cover different aspects of the topic (theoretical knowledge, practical application, problem-solving, etc.)
3. Include a mix of question types (multiple-choice, open-ended, scenario-based, coding challenges)
4. Be clear, concise, and unambiguous
5. Encourage the candidate to demonstrate depth of knowledge and critical thinking

For each question, also provide:
- The type of question (e.g., multiple-choice, open-ended, scenario-based, coding challenge)
- The difficulty level (easy, medium, hard)
- A brief explanation of what the question is assessing

Structure your response as follows:
1. Question 1
   Type: [Question Type]
   Difficulty: [Difficulty Level]
   Assessment: [Brief explanation of what this question assesses]

2. Question 2
   Type: [Question Type]
   Difficulty: [Difficulty Level]
   Assessment: [Brief explanation of what this question assesses]

... and so on for all 10 questions.

{format_instructions}
"""

response_schemas = [
    ResponseSchema(
        name="questions", description="List of 10 interview questions with their types, difficulty levels, and assessments")
]


output_parser = StructuredOutputParser.from_response_schemas(response_schemas)
format_instructions = output_parser.get_format_instructions()

# Create the prompt
prompt = PromptTemplate(
    template=prompt_template,
    input_variables=["topic", "context"],
    partial_variables={"format_instructions": format_instructions}
)

chain = prompt | llm | output_parser


async def generate_interview_questions(topic, context):
    llm_input = {"topic": topic, "context": context}
    response = await chain.ainvoke(llm_input)
    return response
