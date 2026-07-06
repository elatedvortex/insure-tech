from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import (
    EmailPasswordLogin,
    EmailPasswordRegister,
    ForgotPasswordRequest,
    MessageResponse,
    OAuthLogin,
    RefreshRequest,
    ResetPasswordRequest,
    TokenRefreshResponse,
    TokenResponse,
)
from app.services import auth_service

router = APIRouter()


@router.post("/register", response_model=TokenResponse, summary="Create an email/password account")
async def register(body: EmailPasswordRegister, db: AsyncSession = Depends(get_db)):
    return await auth_service.register_with_password(body.email, body.password, body.name, db)


@router.post("/login", response_model=TokenResponse, summary="Log in with email and password")
async def login(body: EmailPasswordLogin, db: AsyncSession = Depends(get_db)):
    return await auth_service.login_with_password(body.email, body.password, db)


@router.post("/oauth", response_model=TokenResponse, summary="Log in with Google or Apple")
async def oauth_login(body: OAuthLogin, db: AsyncSession = Depends(get_db)):
    return await auth_service.login_with_oauth(
        body.provider,
        db,
        id_token=body.id_token,
        email=body.email,
        name=body.name,
    )


@router.post("/password/forgot", response_model=MessageResponse, summary="Request a password reset")
async def forgot_password(body: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)):
    return await auth_service.request_password_reset(body.email, db)


@router.post("/password/reset", response_model=MessageResponse, summary="Reset password")
async def reset_password(body: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    return await auth_service.reset_password(body.token, body.password, db)


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
