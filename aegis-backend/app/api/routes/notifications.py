import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.notification import NotificationOut
from app.services import notification_service

router = APIRouter()


@router.get("/", response_model=list[NotificationOut], summary="List notifications")
async def list_notifications(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await notification_service.list_notifications(current_user.id, db)


@router.post("/{notif_id}/read", response_model=NotificationOut, summary="Mark notification as read")
async def mark_read(
    notif_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await notification_service.mark_read(notif_id, current_user.id, db)


@router.post("/read-all", summary="Mark all notifications as read")
async def mark_all_read(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    count = await notification_service.mark_all_read(current_user.id, db)
    return {"marked_read": count}
