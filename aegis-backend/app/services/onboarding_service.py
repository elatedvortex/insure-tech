"""Seed demo portfolio data for new users so the API is usable out of the box."""
import uuid
from datetime import date, timedelta

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.claim import Claim
from app.models.notification import Notification
from app.models.policy import Policy
from app.services import protection_service, recommendation_service


async def seed_demo_data_if_empty(user_id: uuid.UUID, db: AsyncSession) -> None:
    """Idempotent: only seeds when the user has no policies yet."""
    count = await db.scalar(
        select(func.count()).select_from(Policy).where(Policy.user_id == user_id)
    )
    if count and count > 0:
        return

    health = Policy(
        user_id=user_id,
        category="Health",
        name="Family Health Plus",
        monthly_premium=89.0,
        status="Active",
        coverage_summary="Hospitalization, OPD, and preventive care for two adults.",
        deductible=500.0,
        renews_on=date.today() + timedelta(days=120),
    )
    vehicle = Policy(
        user_id=user_id,
        category="Vehicle",
        name="Comprehensive Auto",
        monthly_premium=62.0,
        status="Active",
        coverage_summary="Collision, theft, and roadside assistance.",
        deductible=750.0,
        renews_on=date.today() + timedelta(days=45),
    )
    db.add_all([health, vehicle])
    await db.flush()

    db.add(
        Claim(
            user_id=user_id,
            policy_id=vehicle.id,
            incident_description="Minor bike accident ? front wheel and fork damage after avoiding a pothole.",
            stage="Assessing damage",
            estimate=340.0,
            fraud_risk_score=0.12,
            next_step="Repair estimate review within 2 business days.",
        )
    )

    db.add_all(
        [
            Notification(
                user_id=user_id,
                title="Welcome to Aegis",
                body="Your AI advisor is ready. Ask about policies, claims, or your protection score anytime.",
                read=False,
            ),
            Notification(
                user_id=user_id,
                title="Claim update",
                body="We're assessing damage on your recent vehicle claim. We'll notify you when the estimate is confirmed.",
                read=False,
            ),
        ]
    )

    await protection_service.recalculate_score(user_id, db)
    await recommendation_service.generate_recommendations(user_id, db)
