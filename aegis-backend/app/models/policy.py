import uuid
from datetime import date

from sqlalchemy import Date, Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.db.types import GUID
from app.models.mixins import TimestampMixin, UUIDMixin


class Policy(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "policies"

    user_id: Mapped[uuid.UUID] = mapped_column(GUID(), ForeignKey("users.id"), nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    monthly_premium: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="Active")
    coverage_summary: Mapped[str | None] = mapped_column(String(500), nullable=True)
    deductible: Mapped[float | None] = mapped_column(Float, nullable=True)
    renews_on: Mapped[date | None] = mapped_column(Date, nullable=True)

    user = relationship("User", back_populates="policies")
    claims = relationship("Claim", back_populates="policy")
