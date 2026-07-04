"""Auth service — OTP-based email authentication."""
import uuid
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    generate_otp,
    hash_otp,
    hash_token,
    verify_otp,
)
from app.models.user import OtpCode, RefreshToken, User


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


def _ensure_utc(dt: datetime) -> datetime:
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


async def send_otp(email: str, db: AsyncSession) -> dict:
    """Generate and (in production) send an OTP; in dev return it directly."""
    recent = await db.execute(
        select(OtpCode)
        .where(OtpCode.email == email)
        .order_by(OtpCode.created_at.desc())
        .limit(1)
    )
    last = recent.scalars().first()
    if last is not None:
        elapsed = (_utc_now() - _ensure_utc(last.created_at)).total_seconds()
        if elapsed < settings.OTP_RESEND_COOLDOWN_SECONDS:
            wait = int(settings.OTP_RESEND_COOLDOWN_SECONDS - elapsed)
            raise HTTPException(
                status_code=429,
                detail=f"Please wait {wait}s before requesting another code",
            )

    # Expire old OTPs for this email
    result = await db.execute(
        select(OtpCode).where(OtpCode.email == email, OtpCode.consumed == False)  # noqa: E712
    )
    for old in result.scalars().all():
        old.consumed = True

    code = generate_otp(settings.OTP_LENGTH)
    now = _utc_now()
    otp = OtpCode(
        email=email,
        code_hash=hash_otp(code),
        expires_at=now + timedelta(minutes=settings.OTP_EXPIRE_MINUTES),
        attempts=0,
        consumed=False,
        created_at=now,
    )
    db.add(otp)
    await db.commit()

    # TODO: integrate real email sending (SendGrid / SES) here.
    # For dev we just return the code so the frontend can display it.
    dev_hint = code if settings.ENVIRONMENT == "development" else None
    return {"message": "OTP sent", "dev_code": dev_hint}


async def verify_otp_and_login(email: str, code: str, db: AsyncSession) -> dict:
    """Verify OTP, upsert user, return token pair."""
    result = await db.execute(
        select(OtpCode)
        .where(OtpCode.email == email, OtpCode.consumed == False)  # noqa: E712
        .order_by(OtpCode.created_at.desc())
    )
    otp_record = result.scalars().first()

    if otp_record is None:
        raise HTTPException(status_code=400, detail="No active OTP for this email")

    if _utc_now() > _ensure_utc(otp_record.expires_at):
        raise HTTPException(status_code=400, detail="OTP has expired")

    if otp_record.attempts >= settings.OTP_MAX_ATTEMPTS:
        raise HTTPException(status_code=429, detail="Too many attempts")

    otp_record.attempts += 1

    if not verify_otp(code, otp_record.code_hash):
        await db.commit()
        raise HTTPException(status_code=400, detail="Invalid OTP")

    otp_record.consumed = True

    # Upsert user
    from app.services import onboarding_service

    user_result = await db.execute(select(User).where(User.email == email))
    user = user_result.scalar_one_or_none()
    if user is None:
        user = User(email=email, is_active=True)
        db.add(user)
        await db.flush()
        await onboarding_service.seed_demo_data_if_empty(user.id, db)

    # Issue tokens
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
    await db.commit()

    return {
        "access_token": access_token,
        "refresh_token": raw_refresh,
        "token_type": "bearer",
    }


async def refresh_access_token(raw_refresh: str, db: AsyncSession) -> dict:
    """Exchange a valid refresh token for a new access token."""
    token_hash = hash_token(raw_refresh)
    result = await db.execute(
        select(RefreshToken).where(
            RefreshToken.token_hash == token_hash,
            RefreshToken.revoked == False,  # noqa: E712
        )
    )
    record = result.scalar_one_or_none()

    if record is None or _utc_now() > _ensure_utc(record.expires_at):
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    # Rotate: revoke old, issue new
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
    await db.commit()
    return {"access_token": new_access, "refresh_token": new_raw_refresh, "token_type": "bearer"}


async def logout(raw_refresh: str, db: AsyncSession) -> None:
    """Revoke a refresh token."""
    token_hash = hash_token(raw_refresh)
    result = await db.execute(
        select(RefreshToken).where(RefreshToken.token_hash == token_hash)
    )
    record = result.scalar_one_or_none()
    if record:
        record.revoked = True
        await db.commit()
