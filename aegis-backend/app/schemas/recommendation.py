import uuid
from datetime import datetime

from pydantic import BaseModel


class RecommendationOut(BaseModel):
    id: uuid.UUID
    category: str
    title: str
    reasoning: str
    monthly_premium: float | None
    dismissed: bool
    accepted: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class RecommendationAction(BaseModel):
    action: str  # "accept" | "dismiss"
