"""Policy service — CRUD operations for insurance policies."""
import uuid

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.policy import Policy
from app.schemas.policy import PolicyCreate, PolicyUpdate


async def list_policies(user_id: uuid.UUID, db: AsyncSession) -> list[Policy]:
    result = await db.execute(select(Policy).where(Policy.user_id == user_id))
    return list(result.scalars().all())


async def get_policy(policy_id: uuid.UUID, user_id: uuid.UUID, db: AsyncSession) -> Policy:
    result = await db.execute(
        select(Policy).where(Policy.id == policy_id, Policy.user_id == user_id)
    )
    policy = result.scalar_one_or_none()
    if policy is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    return policy


async def create_policy(data: PolicyCreate, user_id: uuid.UUID, db: AsyncSession) -> Policy:
    policy = Policy(user_id=user_id, **data.model_dump())
    db.add(policy)
    await db.commit()
    await db.refresh(policy)
    return policy


async def update_policy(
    policy_id: uuid.UUID, data: PolicyUpdate, user_id: uuid.UUID, db: AsyncSession
) -> Policy:
    policy = await get_policy(policy_id, user_id, db)
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(policy, field, value)
    await db.commit()
    await db.refresh(policy)
    return policy


async def delete_policy(policy_id: uuid.UUID, user_id: uuid.UUID, db: AsyncSession) -> None:
    policy = await get_policy(policy_id, user_id, db)
    await db.delete(policy)
    await db.commit()
