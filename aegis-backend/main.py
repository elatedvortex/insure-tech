from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text

from app.core.config import settings
from app.api.routes import auth, users, policies, claims, conversations, documents, notifications, recommendations, protection


from app.db.session import create_all_tables, engine

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create all DB tables (idempotent — safe for SQLite & Postgres)
    await create_all_tables()
    yield
    # Shutdown


app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    docs_url=f"{settings.API_V1_PREFIX}/docs",
    redoc_url=f"{settings.API_V1_PREFIX}/redoc",
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "message": "Validation failed"},
    )


# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
PREFIX = settings.API_V1_PREFIX

app.include_router(auth.router,            prefix=f"{PREFIX}/auth",            tags=["auth"])
app.include_router(users.router,           prefix=f"{PREFIX}/users",           tags=["users"])
app.include_router(policies.router,        prefix=f"{PREFIX}/policies",        tags=["policies"])
app.include_router(claims.router,          prefix=f"{PREFIX}/claims",          tags=["claims"])
app.include_router(conversations.router,   prefix=f"{PREFIX}/conversations",   tags=["conversations"])
app.include_router(documents.router,       prefix=f"{PREFIX}/documents",       tags=["documents"])
app.include_router(notifications.router,   prefix=f"{PREFIX}/notifications",   tags=["notifications"])
app.include_router(recommendations.router, prefix=f"{PREFIX}/recommendations", tags=["recommendations"])
app.include_router(protection.router,      prefix=f"{PREFIX}/protection",      tags=["protection"])


@app.get("/healthz", tags=["health"])
async def health():
    db_ok = True
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
    except Exception:
        db_ok = False
    status_code = 200 if db_ok else 503
    body = {
        "status": "ok" if db_ok else "degraded",
        "database": "up" if db_ok else "down",
        "environment": settings.ENVIRONMENT,
    }
    return JSONResponse(content=body, status_code=status_code)
