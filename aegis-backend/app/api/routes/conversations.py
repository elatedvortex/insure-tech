import uuid

from fastapi import APIRouter, Depends, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.conversation import ConversationOut, ConversationSummaryOut, SendMessage
from app.services import conversation_service

router = APIRouter()


@router.get("/", response_model=list[ConversationSummaryOut], summary="List conversations")
async def list_conversations(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await conversation_service.list_conversations(current_user.id, db)


@router.post(
    "/",
    response_model=ConversationOut,
    status_code=status.HTTP_201_CREATED,
    summary="Start a new conversation",
)
async def create_conversation(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await conversation_service.create_conversation(current_user.id, db)


@router.get("/{conv_id}", response_model=ConversationOut, summary="Get conversation with messages")
async def get_conversation(
    conv_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await conversation_service.get_conversation(conv_id, current_user.id, db)


@router.post("/{conv_id}/messages", response_model=ConversationOut, summary="Send a message")
async def send_message(
    conv_id: uuid.UUID,
    body: SendMessage,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await conversation_service.send_message(conv_id, current_user.id, body.text, db)


@router.post(
    "/{conv_id}/messages/stream",
    summary="Send a message and stream the advisor reply (SSE)",
)
async def stream_message(
    conv_id: uuid.UUID,
    body: SendMessage,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    generator = conversation_service.stream_message_events(
        conv_id, current_user.id, body.text, db
    )
    return StreamingResponse(
        generator,
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"},
    )
