import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel


class DocumentOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    filename: str
    doc_type: str
    storage_key: str
    extracted_fields: dict[str, Any] | None
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}
