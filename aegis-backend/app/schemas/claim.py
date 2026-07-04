import uuid
from datetime import datetime

from pydantic import BaseModel


class ClaimCreate(BaseModel):
    policy_id: uuid.UUID | None = None
    incident_description: str


class ClaimUpdate(BaseModel):
    stage: str | None = None
    estimate: float | None = None
    fraud_risk_score: float | None = None
    next_step: str | None = None


class ClaimOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    policy_id: uuid.UUID | None
    incident_description: str
    stage: str
    estimate: float | None
    fraud_risk_score: float | None
    next_step: str | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
