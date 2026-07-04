from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    PROJECT_NAME: str = "Aegis API"
    API_V1_PREFIX: str = "/api/v1"

    # SQLite for zero-setup local dev; set DATABASE_URL in .env for Postgres in prod
    DATABASE_URL: str = "sqlite+aiosqlite:///./aegis.db"

    JWT_SECRET: str = "dev-secret-change-me-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    OTP_EXPIRE_MINUTES: int = 10
    OTP_LENGTH: int = 6
    OTP_MAX_ATTEMPTS: int = 5
    OTP_RESEND_COOLDOWN_SECONDS: int = 30

    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    ENVIRONMENT: str = "development"


settings = Settings()
