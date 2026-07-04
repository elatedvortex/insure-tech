from typing import Any

from pydantic import BaseModel


class BreakdownItem(BaseModel):
    label: str
    score: float


class ProtectionScoreOut(BaseModel):
    overall: float
    breakdown: list[Any]

    model_config = {"from_attributes": True}
