import uuid

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.db.types import FlexJSONB, GUID
from app.models.mixins import TimestampMixin, UUIDMixin


class Document(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "documents"

    user_id: Mapped[uuid.UUID] = mapped_column(GUID(), ForeignKey("users.id"), nullable=False)
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    doc_type: Mapped[str] = mapped_column(String(50), nullable=False)
    storage_key: Mapped[str] = mapped_column(String(500), nullable=False)
    extracted_fields: Mapped[dict | None] = mapped_column(FlexJSONB, nullable=True)
    status: Mapped[str] = mapped_column(String(30), default="Uploaded")

    user = relationship("User", back_populates="documents")
