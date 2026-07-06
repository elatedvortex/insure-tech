from sqlalchemy import inspect, text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings

is_sqlite = settings.DATABASE_URL.startswith("sqlite")
connect_args = {"check_same_thread": False} if is_sqlite else {}

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
    future=True,
    connect_args=connect_args,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise


async def create_all_tables() -> None:
    import app.db.all_models  # noqa: F401
    from app.db.base import Base

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        await conn.run_sync(_sync_auth_columns)


def _sync_auth_columns(sync_conn) -> None:
    inspector = inspect(sync_conn)
    if "users" not in inspector.get_table_names():
        return

    existing = {column["name"] for column in inspector.get_columns("users")}
    datetime_type = "TIMESTAMP WITH TIME ZONE" if sync_conn.dialect.name == "postgresql" else "DATETIME"
    additions = {
        "password_hash": "VARCHAR(255)",
        "reset_token_hash": "VARCHAR(255)",
        "reset_token_expires_at": datetime_type,
    }

    for column, column_type in additions.items():
        if column not in existing:
            sync_conn.execute(text(f"ALTER TABLE users ADD COLUMN {column} {column_type}"))
