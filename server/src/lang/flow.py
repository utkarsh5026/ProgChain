from config.openai import llm
from langchain_core.prompts import PromptTemplate
from langchain.output_parsers import ResponseSchema, StructuredOutputParser


prompt_template = """
You are an expert programming instructor. Given the following programming topic or concept, create a flowchart that explains the key concepts and their relationships. Provide the flowchart data in a structured format that can be easily converted into a visual representation. Include a difficulty level for each concept.

Programming Topic: {topic}

Please structure your response as follows:
1. Brief overview of the concept (2-3 sentences)
2. List of nodes, where each node represents a concept or step, including:
   - Unique identifier (e.g., "node1", "node2", etc.)
   - Label (short description of the concept)
   - Details (longer explanation, if necessary)
   - Difficulty (Beginner, Intermediate, or Advanced)
3. List of edges, representing relationships between nodes, including:
   - Source node identifier
   - Target node identifier
   - Label (description of the relationship)

{format_instructions}
"""


response_schemas = [
    ResponseSchema(
        name="overview", description="Brief overview of the programming concept in 2-3 sentences"),
    ResponseSchema(
        name="nodes", description="List of nodes, each with 'id', 'label', 'details', and 'difficulty'"),
    ResponseSchema(
        name="edges", description="List of edges, each with 'source', 'target', and 'label'")
]


output_parser = StructuredOutputParser.from_response_schemas(response_schemas)
format_instructions = output_parser.get_format_instructions()


prompt = PromptTemplate(
    template=prompt_template,
    input_variables=["topic"],
    partial_variables={"format_instructions": format_instructions}
)

chain = prompt | llm | output_parser


async def generate_flowchart(topic: str):
    return await chain.ainvoke({"topic": topic})
