import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.recommendation import RecommendationAction, RecommendationOut
from app.services import recommendation_service

router = APIRouter()


@router.get("/", response_model=list[RecommendationOut], summary="List active recommendations")
async def list_recommendations(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await recommendation_service.list_recommendations(current_user.id, db)


@router.post("/generate", response_model=list[RecommendationOut], summary="Generate AI recommendations")
async def generate(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await recommendation_service.generate_recommendations(current_user.id, db)


@router.post("/{rec_id}/action", response_model=RecommendationOut, summary="Accept or dismiss a recommendation")
async def action(
    rec_id: uuid.UUID,
    body: RecommendationAction,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await recommendation_service.act_on_recommendation(rec_id, body.action, current_user.id, db)
