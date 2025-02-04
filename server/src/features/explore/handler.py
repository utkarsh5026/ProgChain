from typing import Optional

from fastapi import status, APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from pydantic import BaseModel, Field
from .llm import explore_topic as explore_topic_llm
from config.models import Model
from .service import ResearchAssistantService, TopicQuestion

service = ResearchAssistantService()

router = APIRouter(prefix="/explore", tags=["explore"])


class TopicExploreRequest(BaseModel):
    topic: str
    depth: str = "comprehensive"
    focus_areas: str = "all"


class AskQuestionRequest(BaseModel):
    question: str = Field(description="The question to ask the model")
    chat_id: int = Field(description="The chat id to add the question to")
    model: Optional[str] = Field(description="The model to use",
                                 default=Model.GPT_4O.value)
    extra_instructions: Optional[str] = Field(
        description="Extra instructions to pass to the model", default="")


class ChatNotFoundError(HTTPException):
    def __init__(self, chat_id: int):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND,
                         detail=f"Chat with id {chat_id} not found")


@router.post("/topic")
async def explore_topic(request: TopicExploreRequest):
    async def stream_response():
        async for chunk in service.start_exploration(request.topic):
            if (isinstance(chunk, int)):
                yield f"chatID: {chunk}\n\n"
            else:
                yield chunk

    return StreamingResponse(stream_response(), media_type="text/event-stream", headers={
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
    })


@router.post("/question")
async def ask_question(question_request: AskQuestionRequest):
    question, model_name, extra_instructions = question_request.question, question_request.model, question_request.extra_instructions
    tq = TopicQuestion(
        question=question,
        model_name=model_name,
        extra_instructions=extra_instructions
    )

    async def stream_response():
        async for chunk in service.ask_question(question_request.chat_id, tq):
            yield chunk

    return StreamingResponse(stream_response(), media_type="text/event-stream", headers={
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
    })


@router.get("/chats")
async def get_all_chats():
    try:
        chats = await service.get_all_chats()
        return chats
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=str(e))


@router.delete("/chat/{chat_id}")
async def delete_chat(chat_id: int):
    try:
        deleted = service.delete_chat(chat_id)
        if not deleted:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail="Chat not found")
        return {"message": "Chat deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/chats/{chat_id}")
async def get_chat_for_id(chat_id: int):
    try:
        chat = get_chat_messages(chat_id)
        if chat is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail="Chat not found")
        return chat
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=str(e))
