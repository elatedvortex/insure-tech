"""Claim service — CRUD with basic AI-stub scoring."""
import uuid

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.claim import Claim
from app.schemas.claim import ClaimCreate, ClaimUpdate


STAGE_FLOW = ["Filed", "Reviewing", "Assessing damage", "Approved", "Paid"]
DENIED = "Denied"


async def list_claims(user_id: uuid.UUID, db: AsyncSession) -> list[Claim]:
    result = await db.execute(select(Claim).where(Claim.user_id == user_id))
    return list(result.scalars().all())


async def get_claim(claim_id: uuid.UUID, user_id: uuid.UUID, db: AsyncSession) -> Claim:
    result = await db.execute(
        select(Claim).where(Claim.id == claim_id, Claim.user_id == user_id)
    )
    claim = result.scalar_one_or_none()
    if claim is None:
        raise HTTPException(status_code=404, detail="Claim not found")
    return claim


async def create_claim(data: ClaimCreate, user_id: uuid.UUID, db: AsyncSession) -> Claim:
    # Stub: basic fraud risk heuristic (length of description as proxy)
    risk = max(0.0, min(1.0, 1.0 - len(data.incident_description) / 1000))
    next_step = "An adjuster will review your claim within 2 business days."
    claim = Claim(
        user_id=user_id,
        fraud_risk_score=round(risk, 3),
        next_step=next_step,
        **data.model_dump(),
    )
    db.add(claim)
    await db.commit()
    await db.refresh(claim)
    return claim


async def update_claim(
    claim_id: uuid.UUID, data: ClaimUpdate, user_id: uuid.UUID, db: AsyncSession
) -> Claim:
    claim = await get_claim(claim_id, user_id, db)
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(claim, field, value)
    await db.commit()
    await db.refresh(claim)
    return claim


async def advance_stage(claim_id: uuid.UUID, user_id: uuid.UUID, db: AsyncSession) -> Claim:
    """Move the claim one step forward in the approval pipeline."""
    claim = await get_claim(claim_id, user_id, db)
    if claim.stage in STAGE_FLOW:
        idx = STAGE_FLOW.index(claim.stage)
        if idx < len(STAGE_FLOW) - 1:
            claim.stage = STAGE_FLOW[idx + 1]
    await db.commit()
    await db.refresh(claim)
    return claim
