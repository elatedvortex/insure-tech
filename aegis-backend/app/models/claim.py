import uuid

from sqlalchemy import Float, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.db.types import GUID
from app.models.mixins import TimestampMixin, UUIDMixin


class Claim(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "claims"

    user_id: Mapped[uuid.UUID] = mapped_column(GUID(), ForeignKey("users.id"), nullable=False)
    policy_id: Mapped[uuid.UUID | None] = mapped_column(GUID(), ForeignKey("policies.id"), nullable=True)
    incident_description: Mapped[str] = mapped_column(Text, nullable=False)
    stage: Mapped[str] = mapped_column(String(30), default="Filed")
    estimate: Mapped[float | None] = mapped_column(Float, nullable=True)
    fraud_risk_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    next_step: Mapped[str | None] = mapped_column(Text, nullable=True)

    user = relationship("User", back_populates="claims")
    policy = relationship("Policy", back_populates="claims")
