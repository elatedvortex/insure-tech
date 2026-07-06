from pydantic import BaseModel, EmailStr, Field


class EmailPasswordLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)


class EmailPasswordRegister(EmailPasswordLogin):
    name: str | None = Field(default=None, max_length=255)


class OAuthLogin(BaseModel):
    provider: str = Field(pattern="^(google|apple)$")
    id_token: str | None = None
    email: EmailStr | None = None
    name: str | None = Field(default=None, max_length=255)


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str = Field(min_length=16)
    password: str = Field(min_length=8, max_length=72)


class MessageResponse(BaseModel):
    message: str
    reset_token: str | None = None


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


class TokenRefreshResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
