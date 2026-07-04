from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import (
    OtpRequest,
    OtpVerify,
    RefreshRequest,
    TokenRefreshResponse,
    TokenResponse,
)
from app.services import auth_service

router = APIRouter()


@router.post("/otp/request", summary="Request an OTP for email login")
async def request_otp(body: OtpRequest, db: AsyncSession = Depends(get_db)):
    return await auth_service.send_otp(body.email, db)


@router.post("/otp/verify", response_model=TokenResponse, summary="Verify OTP and get tokens")
async def verify_otp(body: OtpVerify, db: AsyncSession = Depends(get_db)):
    return await auth_service.verify_otp_and_login(body.email, body.code, db)


@router.post("/refresh", response_model=TokenRefreshResponse, summary="Refresh access token")
async def refresh(body: RefreshRequest, db: AsyncSession = Depends(get_db)):
    return await auth_service.refresh_access_token(body.refresh_token, db)


@router.post("/logout", summary="Revoke refresh token")
async def logout(
    body: RefreshRequest,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_user),
):
    await auth_service.logout(body.refresh_token, db)
    return {"message": "Logged out"}
