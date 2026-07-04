import uuid

from sqlalchemy import Boolean, Float, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.db.types import GUID
from app.models.mixins import TimestampMixin, UUIDMixin


class Recommendation(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "recommendations"

    user_id: Mapped[uuid.UUID] = mapped_column(GUID(), ForeignKey("users.id"), nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    reasoning: Mapped[str] = mapped_column(Text, nullable=False)
    monthly_premium: Mapped[float | None] = mapped_column(Float, nullable=True)
    dismissed: Mapped[bool] = mapped_column(Boolean, default=False)
    accepted: Mapped[bool] = mapped_column(Boolean, default=False)

    user = relationship("User", back_populates="recommendations")
