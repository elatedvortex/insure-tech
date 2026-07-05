"""Conversation service — threads, messages, and context-aware advisor replies."""
import asyncio
import json
import uuid
from collections.abc import AsyncIterator

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.conversation import Conversation, Message
from app.services import advisor_engine


def _summary_from_text(text: str, max_len: int = 120) -> str:
    cleaned = " ".join(text.split())
    if len(cleaned) <= max_len:
        return cleaned
    return cleaned[: max_len - 1] + "…"


async def list_conversations(user_id: uuid.UUID, db: AsyncSession) -> list[Conversation]:
    result = await db.execute(
        select(Conversation)
        .where(Conversation.user_id == user_id)
        .order_by(Conversation.created_at.desc())
    )
    return list(result.scalars().all())


async def get_conversation(
    conv_id: uuid.UUID, user_id: uuid.UUID, db: AsyncSession
) -> Conversation:
    result = await db.execute(
        select(Conversation)
        .where(Conversation.id == conv_id, Conversation.user_id == user_id)
        .options(selectinload(Conversation.messages))
    )
    conv = result.scalar_one_or_none()
    if conv is None:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conv


async def _generate_reply(
    user_id: uuid.UUID, text: str, history: list[Message], db: AsyncSession
) -> advisor_engine.AdvisorResponse:
    ctx = await advisor_engine.load_user_context(user_id, db)
    return await advisor_engine.get_advisor_response(text, history, ctx)


async def create_conversation(user_id: uuid.UUID, db: AsyncSession) -> Conversation:
    conv = Conversation(user_id=user_id)
    db.add(conv)
    await db.flush()

    reply = await _generate_reply(user_id, "hello", [], db)
    greeting = Message(
        conversation_id=conv.id,
        role="assistant",
        text=reply.text,
        cards=reply.cards or None,
        quick_replies=reply.quick_replies or None,
    )
    db.add(greeting)
    conv.summary = _summary_from_text(reply.text)
    await db.commit()
    return await get_conversation(conv.id, user_id, db)


async def send_message(
    conv_id: uuid.UUID, user_id: uuid.UUID, text: str, db: AsyncSession
) -> Conversation:
    conv = await get_conversation(conv_id, user_id, db)
    history = list(conv.messages)

    user_msg = Message(
        conversation_id=conv.id,
        role="user",
        text=text,
        cards=None,
        quick_replies=None,
    )
    db.add(user_msg)
    await db.flush()

    reply = await _generate_reply(user_id, text, history, db)
    ai_msg = Message(
        conversation_id=conv.id,
        role="assistant",
        text=reply.text,
        cards=reply.cards or None,
        quick_replies=reply.quick_replies or None,
    )
    db.add(ai_msg)
    conv.summary = _summary_from_text(text)
    await db.commit()

    return await get_conversation(conv_id, user_id, db)


async def stream_message_events(
    conv_id: uuid.UUID, user_id: uuid.UUID, text: str, db: AsyncSession
) -> AsyncIterator[str]:
    """
    SSE event stream compatible with the Next.js /api/chat route:
    token chunks, then cards, quickReplies, and done.
    Persists user + assistant messages when the stream completes.
    """
    conv = await get_conversation(conv_id, user_id, db)
    history = list(conv.messages)

    user_msg = Message(
        conversation_id=conv.id,
        role="user",
        text=text,
        cards=None,
        quick_replies=None,
    )
    db.add(user_msg)
    conv.summary = _summary_from_text(text)
    await db.flush()

    reply = await _generate_reply(user_id, text, history, db)
    words = reply.text.split()

    await asyncio.sleep(0.35)

    for i, word in enumerate(words):
        chunk = word if i == 0 else f" {word}"
        yield f"data: {json.dumps({'type': 'token', 'value': chunk})}\n\n"
        await asyncio.sleep(0.02 + (i % 3) * 0.008)

    ai_msg = Message(
        conversation_id=conv.id,
        role="assistant",
        text=reply.text,
        cards=reply.cards or None,
        quick_replies=reply.quick_replies or None,
    )
    db.add(ai_msg)
    await db.commit()

    if reply.cards:
        yield f"data: {json.dumps({'type': 'cards', 'value': reply.cards})}\n\n"
    if reply.quick_replies:
        yield f"data: {json.dumps({'type': 'quickReplies', 'value': reply.quick_replies})}\n\n"
    yield f"data: {json.dumps({'type': 'done'})}\n\n"
