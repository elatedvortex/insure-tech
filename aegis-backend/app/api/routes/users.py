from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserOut, UserUpdate

router = APIRouter()


@router.get("/me", response_model=UserOut, summary="Get current user profile")
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/me", response_model=UserOut, summary="Update current user profile")
async def update_me(
    body: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if body.name is not None:
        current_user.name = body.name
    await db.commit()
    await db.refresh(current_user)
    return current_user
