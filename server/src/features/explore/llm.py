from typing import AsyncGenerator
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from config.models import Model, get_model
from langchain_core.output_parsers import StrOutputParser
from .vector import VectorStoreManager


class ResearchAssistant:
    """
    ResearchAssistant is an advanced tool for deep technical exploration.
    
    It helps users understand complex technical topics by providing clear, detailed, and accurate explanations,
    along with thought-provoking follow-up questions to deepen understanding.
    
    The assistant uses a chat prompt template combined with contextual history from its vector store to generate
    informative and well-structured responses.
    """
    system_prompt = """You are an advanced research assistant specializing in deep technical exploration. 
Your role is to help users understand complex technical topics by providing clear, detailed, and accurate explanations.

Feel free to structure your response in the way that best suits the topic and the user's needs. You can include:
- Explanations and definitions
- Technical details and examples
- Practical applications
- Code snippets when relevant
- Diagrams or visual descriptions when helpful
- Common pitfalls and best practices

At the end of your response, always include:
3 to 4 thought-provoking questions that will deepen the user's understanding of this topic. These questions should:
- Progress from fundamental concepts to advanced applications
- Help explore edge cases and important considerations
- Encourage critical thinking about the topic
"""

    def __init__(self) -> None:
        """
        Initialize the ResearchAssistant instance.
        
        Sets up the chat prompt template, which includes:
          - A system message defining the assistant's behavior.
          - A placeholder for the user's input.
          - A placeholder for relevant conversation history.
          
        Also initializes the vector store manager to handle historical interactions.
        """
        self.chat_prompt = ChatPromptTemplate.from_messages([
            ("system", self.system_prompt),
            ("human", "{input}"),
            MessagesPlaceholder(variable_name="relevant_history")
        ])
        self.vector_store = VectorStoreManager()

    async def generate_answer(self, message: str, model: str = Model.GPT_4O.value, extra_instructions: str = "") -> AsyncGenerator[str, None]:
        """
        Generate an answer for a given question with optional extra instructions.
        
        This method performs the following steps:
          1. Composes a formatted input by combining the question and any extra instructions.
          2. Retrieves relevant conversation history from the vector store.
          3. Constructs a chain by combining the chat prompt, the selected model, and an output parser.
          4. Streams response chunks asynchronously while accumulating the full response.
          5. Saves the complete interaction to the vector store.
        
        Parameters:
          message: The user's question or prompt.
          model: The language model to use for generating the answer (defaults to GPT_4O).
          extra_instructions: Additional instructions to tailor the response.
          
        Returns:
          An asynchronous generator that yields parts of the generated answer as they are produced.
        """
        chain = self.chat_prompt | get_model(model) | StrOutputParser()
        formatted_input = f"Question: {message}\n{extra_instructions}"
        relevant_history = await self.vector_store.get_relevant_history(formatted_input)

        print("relevant_history", relevant_history)

        response_chunks = []

        async for chunk in chain.astream({
            "input": formatted_input,
            "relevant_history": relevant_history
        }):
            response_chunks.append(chunk)
            yield chunk

        full_response = "".join(response_chunks)
        await self.vector_store.add_interaction(human_msg=message, ai_msg=full_response)

    async def clear_history(self):
        """
        Clear all stored conversation history.
        
        This method deletes all previous interactions from the vector store,
        effectively resetting the assistant's memory.
        """
        await self.vector_store.clear()
