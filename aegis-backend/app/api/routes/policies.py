import uuid

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.policy import PolicyCreate, PolicyOut, PolicyUpdate
from app.services import policy_service

router = APIRouter()


@router.get("/", response_model=list[PolicyOut], summary="List all policies")
async def list_policies(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await policy_service.list_policies(current_user.id, db)


@router.post("/", response_model=PolicyOut, status_code=status.HTTP_201_CREATED, summary="Create policy")
async def create_policy(
    body: PolicyCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await policy_service.create_policy(body, current_user.id, db)


@router.get("/{policy_id}", response_model=PolicyOut, summary="Get policy by ID")
async def get_policy(
    policy_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await policy_service.get_policy(policy_id, current_user.id, db)


@router.patch("/{policy_id}", response_model=PolicyOut, summary="Update policy")
async def update_policy(
    policy_id: uuid.UUID,
    body: PolicyUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await policy_service.update_policy(policy_id, body, current_user.id, db)


@router.delete("/{policy_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete policy")
async def delete_policy(
    policy_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await policy_service.delete_policy(policy_id, current_user.id, db)
