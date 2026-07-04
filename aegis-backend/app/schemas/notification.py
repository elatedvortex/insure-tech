import uuid
from datetime import datetime

from pydantic import BaseModel


class NotificationOut(BaseModel):
    id: uuid.UUID
    title: str
    body: str
    read: bool
    created_at: datetime

    model_config = {"from_attributes": True}
