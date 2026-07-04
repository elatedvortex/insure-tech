import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class MessageOut(BaseModel):
    id: uuid.UUID
    role: str
    text: str
    cards: list[Any] | None
    quick_replies: list[Any] | None
    created_at: datetime

    model_config = {"from_attributes": True}


class ConversationOut(BaseModel):
    id: uuid.UUID
    summary: str | None
    created_at: datetime
    messages: list[MessageOut] = []

    model_config = {"from_attributes": True}


class ConversationSummaryOut(BaseModel):
    id: uuid.UUID
    summary: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class SendMessage(BaseModel):
    text: str = Field(..., min_length=1, max_length=8000)
