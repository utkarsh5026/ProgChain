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


answer_prompt_template = """
You are an expert in technical interviews with deep knowledge across various programming and software engineering domains. Your task is to provide a comprehensive answer to the given interview question, along with guidance on how to effectively respond in an interview setting. Format your response in Markdown.

Question: {question}

Please provide:
1. A detailed technical explanation of the answer, covering:
   - Key concepts and principles
   - Relevant examples or use cases
   - Any important nuances or edge cases

2. Interview response strategy:
   - How to structure the answer effectively
   - Key points to emphasize
   - Common pitfalls to avoid
   - Any follow-up questions the interviewer might ask

Format your response as follows:

## Technical Explanation

[Provide the detailed technical explanation here, using Markdown formatting for headers, code blocks, lists, etc.]

## Interview Response Strategy

[Provide the interview response strategy here, using Markdown formatting]

{format_instructions}
"""


answer_schemas = [
    ResponseSchema(name="answer",
                   description="Markdown-formatted content containing the technical explanation and interview strategy")
]

answer_output_parser = StructuredOutputParser.from_response_schemas(
    answer_schemas)
answer_format_instructions = answer_output_parser.get_format_instructions()


answer_prompt = PromptTemplate(
    template=answer_prompt_template,
    input_variables=["question"],
    partial_variables={"format_instructions": answer_format_instructions}
)


answer_chain = answer_prompt | llm | answer_output_parser


async def generate_answer(question):
    llm_input = {"question": question}
    response = await answer_chain.ainvoke(llm_input)
    return response
