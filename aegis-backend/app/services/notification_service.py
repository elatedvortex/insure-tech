"""Notification service."""
import uuid

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.notification import Notification


async def list_notifications(user_id: uuid.UUID, db: AsyncSession) -> list[Notification]:
    result = await db.execute(
        select(Notification)
        .where(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
    )
    return list(result.scalars().all())


async def mark_read(notif_id: uuid.UUID, user_id: uuid.UUID, db: AsyncSession) -> Notification:
    result = await db.execute(
        select(Notification).where(
            Notification.id == notif_id, Notification.user_id == user_id
        )
    )
    notif = result.scalar_one_or_none()
    if notif is None:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.read = True
    await db.commit()
    await db.refresh(notif)
    return notif


async def mark_all_read(user_id: uuid.UUID, db: AsyncSession) -> int:
    result = await db.execute(
        select(Notification).where(
            Notification.user_id == user_id, Notification.read == False  # noqa: E712
        )
    )
    notifs = result.scalars().all()
    for n in notifs:
        n.read = True
    await db.commit()
    return len(notifs)
