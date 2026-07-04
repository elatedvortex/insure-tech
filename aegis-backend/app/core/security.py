import hashlib
import secrets
from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

# ---------------------------------------------------------------------------
# Password / OTP hashing (bcrypt for passwords, sha256 for OTPs)
# ---------------------------------------------------------------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain: str) -> str:
    return pwd_context.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def hash_otp(code: str) -> str:
    """SHA-256 hex digest — fast & good enough for short-lived numeric OTPs."""
    return hashlib.sha256(code.encode()).hexdigest()


def verify_otp(code: str, code_hash: str) -> bool:
    return hash_otp(code) == code_hash


def generate_otp(length: int = 6) -> str:
    """Return a zero-padded numeric OTP of the given length."""
    return str(secrets.randbelow(10**length)).zfill(length)


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


# ---------------------------------------------------------------------------
# JWT
# ---------------------------------------------------------------------------
def create_access_token(subject: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode(
        {"sub": subject, "exp": expire, "type": "access"},
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM,
    )


def create_refresh_token() -> str:
    """Return a cryptographically random opaque token (store its hash in DB)."""
    return secrets.token_urlsafe(48)


def decode_access_token(token: str) -> str:
    """Return subject (user id) or raise JWTError."""
    payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    if payload.get("type") != "access":
        raise JWTError("wrong token type")
    sub = payload.get("sub")
    if sub is None:
        raise JWTError("missing sub")
    return sub
