import uuid
from datetime import date, datetime

from pydantic import BaseModel


class PolicyCreate(BaseModel):
    category: str
    name: str
    monthly_premium: float
    status: str = "Active"
    coverage_summary: str | None = None
    deductible: float | None = None
    renews_on: date | None = None


class PolicyUpdate(BaseModel):
    category: str | None = None
    name: str | None = None
    monthly_premium: float | None = None
    status: str | None = None
    coverage_summary: str | None = None
    deductible: float | None = None
    renews_on: date | None = None


class PolicyOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    category: str
    name: str
    monthly_premium: float
    status: str
    coverage_summary: str | None
    deductible: float | None
    renews_on: date | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
