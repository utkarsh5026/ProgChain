from langchain_core.prompts import PromptTemplate
from langchain.output_parsers import StructuredOutputParser, ResponseSchema
from config.openai import llm

prompt_template = """
You are an expert programming tutor. Given the following programming question, provide a detailed technical explanation and solution, followed by 5 related follow-up questions.

Question: {question}

Please structure your response as follows:
1. Detailed explanation and solution in as much detail as possible
2. List of 10 related follow-up questions

{format_instructions}
"""


response_schemas = [
    ResponseSchema(name="explanation",
                   description="Detailed technical explanation and solution to the programming question"),
    ResponseSchema(name="follow_up_questions",
                   description="List of 10 related follow-up questions")
]

output_parser = StructuredOutputParser.from_response_schemas(response_schemas)
format_instructions = output_parser.get_format_instructions()


prompt = PromptTemplate(
    template=prompt_template,
    input_variables=["question"],
    partial_variables={"format_instructions": format_instructions}
)


chain = prompt | llm | output_parser


async def generate_programming_qa(question):
    response = await chain.ainvoke({"question": question})
    return response
