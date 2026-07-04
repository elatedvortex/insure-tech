"""Protection score service — compute and persist per-user score."""
import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.policy import Policy
from app.models.protection_score import ProtectionScore

CATEGORY_WEIGHTS = {
    "Health": 30,
    "Life": 25,
    "Vehicle": 15,
    "Home": 15,
    "Travel": 10,
    "Business": 5,
}


async def get_or_create_score(user_id: uuid.UUID, db: AsyncSession) -> ProtectionScore:
    result = await db.execute(
        select(ProtectionScore).where(ProtectionScore.user_id == user_id)
    )
    score = result.scalar_one_or_none()
    if score is None:
        score = ProtectionScore(user_id=user_id, overall=0, breakdown=[])
        db.add(score)
        await db.commit()
        await db.refresh(score)
    return score


async def recalculate_score(user_id: uuid.UUID, db: AsyncSession) -> ProtectionScore:
    """
    Stub scoring algorithm.
    Each active policy contributes its weight; multiply by status factor.
    """
    policies_result = await db.execute(
        select(Policy).where(Policy.user_id == user_id, Policy.status == "Active")
    )
    active_policies = policies_result.scalars().all()
    covered_categories = {p.category for p in active_policies}

    breakdown = []
    total_weight = sum(CATEGORY_WEIGHTS.values())
    weighted_sum = 0.0

    for cat, weight in CATEGORY_WEIGHTS.items():
        cat_score = 100.0 if cat in covered_categories else 0.0
        weighted_sum += cat_score * weight
        breakdown.append({"label": cat, "score": cat_score, "weight": weight})

    overall = round(weighted_sum / total_weight, 1)

    score = await get_or_create_score(user_id, db)
    score.overall = overall
    score.breakdown = breakdown
    await db.commit()
    await db.refresh(score)
    return score
