import uuid

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.claim import ClaimCreate, ClaimOut, ClaimUpdate
from app.services import claim_service

router = APIRouter()


@router.get("/", response_model=list[ClaimOut], summary="List all claims")
async def list_claims(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await claim_service.list_claims(current_user.id, db)


@router.post("/", response_model=ClaimOut, status_code=status.HTTP_201_CREATED, summary="File a claim")
async def create_claim(
    body: ClaimCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await claim_service.create_claim(body, current_user.id, db)


@router.get("/{claim_id}", response_model=ClaimOut, summary="Get claim by ID")
async def get_claim(
    claim_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await claim_service.get_claim(claim_id, current_user.id, db)


@router.patch("/{claim_id}", response_model=ClaimOut, summary="Update claim details")
async def update_claim(
    claim_id: uuid.UUID,
    body: ClaimUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await claim_service.update_claim(claim_id, body, current_user.id, db)


@router.post("/{claim_id}/advance", response_model=ClaimOut, summary="Advance claim to next stage")
async def advance_claim_stage(
    claim_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await claim_service.advance_stage(claim_id, current_user.id, db)
