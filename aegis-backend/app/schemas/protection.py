import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel


class BreakdownItem(BaseModel):
    label: str
    score: float
    weight: float | None = None


class ProtectionScoreOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    overall: float
    breakdown: list[Any]
    updated_at: datetime

    model_config = {"from_attributes": True}
