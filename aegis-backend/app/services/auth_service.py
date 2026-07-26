"""Auth service for password, refresh-token, and reset-password flows."""

import uuid
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    create_url_token,
    hash_password,
    hash_token,
    verify_password,
)
from app.models.audit_log import AuditLog
from app.models.user import RefreshToken, User


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


def _ensure_utc(dt: datetime) -> datetime:
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


async def _audit(
    db: AsyncSession,
    action: str,
    user_id: uuid.UUID | None = None,
    meta: dict | None = None,
) -> None:
    try:
        db.add(AuditLog(user_id=user_id, action=action, metadata_json=meta or {}))
    except Exception:
        pass


async def _get_user_by_email(email: str, db: AsyncSession) -> User | None:
    result = await db.execute(select(User).where(User.email == email.lower()))
    return result.scalar_one_or_none()


async def _seed_if_needed(user: User, db: AsyncSession) -> None:
    from app.services import onboarding_service

    await onboarding_service.seed_demo_data_if_empty(user.id, db)


async def _issue_tokens(user: User, db: AsyncSession, action: str, meta: dict | None = None) -> dict:
    await _seed_if_needed(user, db)

    access_token = create_access_token(str(user.id))
    raw_refresh = create_refresh_token()
    now = _utc_now()
    db.add(
        RefreshToken(
            user_id=user.id,
            token_hash=hash_token(raw_refresh),
            expires_at=now + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
            revoked=False,
            created_at=now,
        )
    )
    await _audit(db, action, user_id=user.id, meta=meta)
    await db.commit()
    return {
        "access_token": access_token,
        "refresh_token": raw_refresh,
        "token_type": "bearer",
    }


async def register_with_password(
    email: str,
    password: str,
    name: str | None,
    db: AsyncSession,
) -> dict:
    normalized = email.lower()
    user = await _get_user_by_email(normalized, db)

    if user and user.password_hash:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account already exists for this email. Please sign in.",
        )

    if user is None:
        user = User(email=normalized, name=name, is_active=True)
        db.add(user)
    else:
        user.name = name or user.name

    user.password_hash = hash_password(password)
    user.is_active = True
    user.reset_token_hash = None
    user.reset_token_expires_at = None
    await db.flush()
    return await _issue_tokens(user, db, "auth.signup", {"email": normalized, "method": "password"})


async def login_with_password(email: str, password: str, db: AsyncSession) -> dict:
    normalized = email.lower()
    user = await _get_user_by_email(normalized, db)

    if user is None or not user.password_hash or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account is disabled.",
        )

    return await _issue_tokens(user, db, "auth.login", {"email": normalized, "method": "password"})




async def request_password_reset(email: str, db: AsyncSession) -> dict:
    normalized = email.lower()
    user = await _get_user_by_email(normalized, db)
    raw_token: str | None = None

    if user is not None:
        raw_token = create_url_token()
        user.reset_token_hash = hash_token(raw_token)
        user.reset_token_expires_at = _utc_now() + timedelta(minutes=settings.PASSWORD_RESET_EXPIRE_MINUTES)
        await _audit(db, "auth.password_reset_requested", user_id=user.id, meta={"email": normalized})
        await db.commit()

        if settings.RESEND_API_KEY:
            try:
                import resend

                resend.api_key = settings.RESEND_API_KEY
                reset_url = f"{settings.FRONTEND_URL.rstrip('/')}/login?reset={raw_token}"
                resend.Emails.send(
                    {
                        "from": "BestPolicy Security <onboarding@resend.dev>",
                        "to": normalized,
                        "subject": "Reset your BestPolicy password",
                        "html": f"<p>Use this secure link to reset your password:</p><p><a href=\"{reset_url}\">Reset password</a></p>",
                    }
                )
            except Exception:
                pass
    else:
        await db.commit()

    return {
        "message": "If that email exists, a password reset link has been sent.",
        "reset_token": raw_token if settings.ENVIRONMENT == "development" else None,
    }


async def reset_password(raw_token: str, password: str, db: AsyncSession) -> dict:
    token_hash = hash_token(raw_token)
    result = await db.execute(select(User).where(User.reset_token_hash == token_hash))
    user = result.scalar_one_or_none()

    if user is None or not user.reset_token_expires_at or _utc_now() > _ensure_utc(user.reset_token_expires_at):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset link is invalid or expired.",
        )

    user.password_hash = hash_password(password)
    user.reset_token_hash = None
    user.reset_token_expires_at = None
    user.is_active = True
    await _audit(db, "auth.password_reset_completed", user_id=user.id)
    await db.commit()
    return {"message": "Password updated. You can sign in now."}


async def refresh_access_token(raw_refresh: str, db: AsyncSession) -> dict:
    token_hash = hash_token(raw_refresh)
    result = await db.execute(
        select(RefreshToken).where(
            RefreshToken.token_hash == token_hash,
            RefreshToken.revoked == False,  # noqa: E712
        )
    )
    record = result.scalar_one_or_none()

    if record is None or _utc_now() > _ensure_utc(record.expires_at):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token. Please log in again.",
        )

    record.revoked = True
    user_id = record.user_id
    new_access = create_access_token(str(user_id))
    new_raw_refresh = create_refresh_token()
    now = _utc_now()
    db.add(
        RefreshToken(
            user_id=user_id,
            token_hash=hash_token(new_raw_refresh),
            expires_at=now + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
            revoked=False,
            created_at=now,
        )
    )

    await _audit(db, "auth.token_refresh", user_id=user_id)
    await db.commit()

    return {
        "access_token": new_access,
        "refresh_token": new_raw_refresh,
        "token_type": "bearer",
    }


async def logout(raw_refresh: str, db: AsyncSession) -> None:
    token_hash = hash_token(raw_refresh)
    result = await db.execute(select(RefreshToken).where(RefreshToken.token_hash == token_hash))
    record = result.scalar_one_or_none()
    if record:
        record.revoked = True
        await _audit(db, "auth.logout", user_id=record.user_id)
        await db.commit()
