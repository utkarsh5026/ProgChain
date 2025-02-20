from fastapi import status, APIRouter, HTTPException
from loguru import logger

from pydantic import Field

from .service import ResearchAssistantService
from core import ChatGenerateOptions
from fastapi_components import stream_response, BaseContentGenerateRequest, ListDataRequest


service = ResearchAssistantService()

router = APIRouter(prefix="/explore", tags=["explore"])


class AskQuestionRequest(BaseContentGenerateRequest):
    chat_id: str = Field(description="The chat id to add the question to")


class ChatNotFoundError(HTTPException):
    def __init__(self, chat_id: int):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND,
                         detail=f"Chat with id {chat_id} not found")


@router.post("/topic")
async def explore_topic(request: BaseContentGenerateRequest):
    async def stream_func():
        options = ChatGenerateOptions(
            question=request.question,
            model=request.model,
            extra_instructions=request.extra_instructions
        )

        logger.info(
            f"Staring exploration with the options: {options.model_dump_json(indent=4)}")
        async for chunk in service.start_exploration(options):
            yield chunk

    return stream_response(stream_func)


@router.post("/question")
async def ask_question(question_request: AskQuestionRequest):
    chat_id = question_request.chat_id

    logger.info(
        f"User asked question {question_request.model_dump_json(indent=2)}")

    async def stream_func():
        async for chunk in service.ask_question(chat_id, question_request):
            yield chunk

    return stream_response(stream_func)


@router.post("/chats/list")
async def get_all_chats(request: ListDataRequest):
    try:
        chats = await service.get_all_chats(request=request)
        return chats
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=str(e))


@router.delete("/chat/{chat_id}")
async def delete_chat(chat_id: str):
    try:
        deleted = await service.delete_chat(chat_id)
        if not deleted:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail="Chat not found")
        return {"message": "Chat deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/chat/{chat_id}")
async def get_chat_for_id(chat_id: str):
    try:
        chat = await service.get_chat(chat_id)
        if chat is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail="Chat not found")

        return {
            "chat": chat,
        }
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=str(e))
