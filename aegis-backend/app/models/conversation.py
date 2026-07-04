import uuid

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy import JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.db.types import GUID
from app.models.mixins import TimestampMixin, UUIDMixin


class Conversation(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "conversations"

    user_id: Mapped[uuid.UUID] = mapped_column(GUID(), ForeignKey("users.id"), nullable=False)
    summary: Mapped[str | None] = mapped_column(String(500), nullable=True)

    user = relationship("User", back_populates="conversations")
    messages = relationship(
        "Message", back_populates="conversation", cascade="all, delete-orphan", order_by="Message.created_at"
    )


class Message(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "messages"

    conversation_id: Mapped[uuid.UUID] = mapped_column(
        GUID(), ForeignKey("conversations.id"), nullable=False
    )
    role: Mapped[str] = mapped_column(String(20), nullable=False)
    text: Mapped[str] = mapped_column(Text, nullable=False)
    cards: Mapped[list | None] = mapped_column(JSON, nullable=True)
    quick_replies: Mapped[list | None] = mapped_column(JSON, nullable=True)

    conversation = relationship("Conversation", back_populates="messages")
