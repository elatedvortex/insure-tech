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
from app.models.audit_log import AuditLog
from app.models.user import OtpCode, RefreshToken, User


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
    """Fire-and-forget audit log entry (errors are swallowed)."""
    try:
        db.add(AuditLog(user_id=user_id, action=action, metadata_json=meta or {}))
    except Exception:
        pass


async def send_otp(email: str, db: AsyncSession) -> dict:
    """Generate and (in production) send an OTP; in dev return it directly."""
    # --- Rate limiting: enforce resend cooldown ---
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

    # --- Expire any unconsumed OTPs for this email ---
    result = await db.execute(
        select(OtpCode).where(OtpCode.email == email, OtpCode.consumed == False)  # noqa: E712
    )
    for old in result.scalars().all():
        old.consumed = True

    # --- Generate new OTP ---
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

    await _audit(db, "otp.requested", meta={"email": email})
    await db.commit()

    # Write OTP to a local file for automated test/login runs (fallback)
    try:
        import os
        workspace_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        with open(os.path.join(workspace_dir, "otp.txt"), "w") as f:
            f.write(code)
    except Exception:
        pass

    # Send the real email using Resend if configured
    if settings.RESEND_API_KEY:
        try:
            import resend
            resend.api_key = settings.RESEND_API_KEY
            
            html_content = f"""
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #111827;">Your Aegis Login Code</h2>
                <p style="color: #4B5563; font-size: 16px;">
                    Here is your temporary login code. It will expire in {settings.OTP_EXPIRE_MINUTES} minutes.
                </p>
                <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #111827;">{code}</span>
                </div>
                <p style="color: #9CA3AF; font-size: 14px;">
                    If you didn't request this code, you can safely ignore this email.
                </p>
            </div>
            """
            
            # Note: On the free tier, you can only send emails from onboarding@resend.dev
            # to the email address you verified on Resend.
            resend.Emails.send({
                "from": "Aegis Security <onboarding@resend.dev>",
                "to": email,
                "subject": f"{code} is your Aegis verification code",
                "html": html_content
            })
        except Exception as e:
            import logging
            logging.error(f"Failed to send Resend email: {e}")

    # For dev we return the code so the frontend can display it.
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
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No active OTP for this email. Please request a new one.",
        )

    if _utc_now() > _ensure_utc(otp_record.expires_at):
        otp_record.consumed = True
        await db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP has expired. Please request a new code.",
        )

    if otp_record.attempts >= settings.OTP_MAX_ATTEMPTS:
        otp_record.consumed = True
        await db.commit()
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many failed attempts. Please request a new code.",
        )

    otp_record.attempts += 1

    if not verify_otp(code, otp_record.code_hash):
        remaining = settings.OTP_MAX_ATTEMPTS - otp_record.attempts
        await db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid code. {remaining} attempt{'s' if remaining != 1 else ''} remaining.",
        )

    otp_record.consumed = True

    # --- Upsert user ---
    from app.services import onboarding_service

    user_result = await db.execute(select(User).where(User.email == email))
    user = user_result.scalar_one_or_none()
    is_new_user = user is None

    if is_new_user:
        user = User(email=email, is_active=True)
        db.add(user)
        await db.flush()

    # Always seed demo data if the user has no policies yet
    # (handles the case of returning users after a DB wipe)
    await onboarding_service.seed_demo_data_if_empty(user.id, db)

    # --- Issue tokens ---
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

    await _audit(
        db,
        "auth.login" if not is_new_user else "auth.signup",
        user_id=user.id,
        meta={"email": email},
    )
    await db.commit()

    return {
        "access_token": access_token,
        "refresh_token": raw_refresh,
        "token_type": "bearer",
    }


async def refresh_access_token(raw_refresh: str, db: AsyncSession) -> dict:
    """Exchange a valid refresh token for a new access + refresh token pair."""
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

    # Rotate: revoke old, issue new pair
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
    """Revoke a refresh token."""
    token_hash = hash_token(raw_refresh)
    result = await db.execute(
        select(RefreshToken).where(RefreshToken.token_hash == token_hash)
    )
    record = result.scalar_one_or_none()
    if record:
        record.revoked = True
        await _audit(db, "auth.logout", user_id=record.user_id)
        await db.commit()
