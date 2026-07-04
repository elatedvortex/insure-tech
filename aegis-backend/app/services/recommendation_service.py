"""Recommendation service — AI-stub recommendations based on user policies."""
import uuid

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.policy import Policy
from app.models.recommendation import Recommendation
from app.models.user import User


CATEGORY_SUGGESTIONS = {
    "Health": ("Life", "Secure your family's future with term life cover.", 800.0),
    "Vehicle": ("Home", "Protect your home and belongings with comprehensive cover.", 1200.0),
    "Home": ("Travel", "Stay covered on every trip with annual travel insurance.", 350.0),
    "Life": ("Health", "Upgrade your health plan for better outpatient benefits.", 1500.0),
    "Travel": ("Business", "Protect your business assets and liability.", 2500.0),
    "Business": ("Vehicle", "Add a commercial vehicle policy for your fleet.", 900.0),
}


async def list_recommendations(user_id: uuid.UUID, db: AsyncSession) -> list[Recommendation]:
    result = await db.execute(
        select(Recommendation).where(
            Recommendation.user_id == user_id,
            Recommendation.dismissed == False,  # noqa: E712
        )
    )
    return list(result.scalars().all())


async def generate_recommendations(user_id: uuid.UUID, db: AsyncSession) -> list[Recommendation]:
    """
    Stub: look at existing policy categories, suggest complementary ones.
    Replace with a real ML/LLM call in production.
    """
    policies_result = await db.execute(select(Policy).where(Policy.user_id == user_id))
    existing_categories = {p.category for p in policies_result.scalars().all()}

    new_recs: list[Recommendation] = []
    for category in existing_categories:
        suggestion = CATEGORY_SUGGESTIONS.get(category)
        if suggestion is None:
            continue
        rec_category, title, premium = suggestion
        if rec_category in existing_categories:
            continue  # already covered

        # Check we haven't already created this recommendation
        existing = await db.execute(
            select(Recommendation).where(
                Recommendation.user_id == user_id,
                Recommendation.category == rec_category,
                Recommendation.dismissed == False,  # noqa: E712
                Recommendation.accepted == False,  # noqa: E712
            )
        )
        if existing.scalar_one_or_none() is not None:
            continue

        rec = Recommendation(
            user_id=user_id,
            category=rec_category,
            title=title,
            reasoning=f"You have {category} cover but lack complementary {rec_category} protection.",
            monthly_premium=premium,
        )
        db.add(rec)
        new_recs.append(rec)

    await db.commit()
    return await list_recommendations(user_id, db)


async def act_on_recommendation(
    rec_id: uuid.UUID, action: str, user_id: uuid.UUID, db: AsyncSession
) -> Recommendation:
    if action not in ("accept", "dismiss"):
        raise HTTPException(status_code=422, detail="action must be 'accept' or 'dismiss'")

    result = await db.execute(
        select(Recommendation).where(
            Recommendation.id == rec_id, Recommendation.user_id == user_id
        )
    )
    rec = result.scalar_one_or_none()
    if rec is None:
        raise HTTPException(status_code=404, detail="Recommendation not found")

    if action == "accept":
        rec.accepted = True
    else:
        rec.dismissed = True

    await db.commit()
    await db.refresh(rec)
    return rec
