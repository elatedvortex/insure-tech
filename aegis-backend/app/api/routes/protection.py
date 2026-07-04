from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.protection import ProtectionScoreOut
from app.services import protection_service

router = APIRouter()


@router.get("/", response_model=ProtectionScoreOut, summary="Get current protection score")
async def get_score(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await protection_service.get_or_create_score(current_user.id, db)


@router.post("/recalculate", response_model=ProtectionScoreOut, summary="Recalculate protection score")
async def recalculate(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await protection_service.recalculate_score(current_user.id, db)
