import uuid

from sqlalchemy import Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.db.types import FlexJSONB, GUID
from app.models.mixins import TimestampMixin, UUIDMixin


class ProtectionScore(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "protection_scores"

    user_id: Mapped[uuid.UUID] = mapped_column(
        GUID(), ForeignKey("users.id"), unique=True, nullable=False
    )
    overall: Mapped[float] = mapped_column(Float, default=0)
    breakdown: Mapped[list] = mapped_column(FlexJSONB, default=list)

    user = relationship("User", back_populates="protection_score")


class RiskProfile(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "risk_profiles"

    user_id: Mapped[uuid.UUID] = mapped_column(GUID(), ForeignKey("users.id"), nullable=False)
    factors: Mapped[dict] = mapped_column(FlexJSONB, default=dict)
