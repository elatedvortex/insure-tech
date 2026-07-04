import uuid
from datetime import datetime, timezone

from sqlalchemy.orm import Mapped, mapped_column
from app.db.types import GUID


class UUIDMixin:
    id: Mapped[uuid.UUID] = mapped_column(
        GUID(), primary_key=True, default=uuid.uuid4
    )


class TimestampMixin:
    from sqlalchemy import DateTime
    created_at: Mapped[datetime] = mapped_column(
        __import__("sqlalchemy").DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at: Mapped[datetime] = mapped_column(
        __import__("sqlalchemy").DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
