import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr


class UserOut(BaseModel):
    id: uuid.UUID
    email: EmailStr
    name: str | None
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    name: str | None = None
