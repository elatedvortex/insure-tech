import asyncio
import os

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient

# Use an isolated SQLite file for tests before importing the app.
os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///./pytest_aegis.db")
os.environ.setdefault("ENVIRONMENT", "development")

from app.db.session import create_all_tables, engine  # noqa: E402
from main import app  # noqa: E402


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(autouse=True)
async def reset_db():
    await create_all_tables()
    yield
    async with engine.begin() as conn:
        from app.db.base import Base
        import app.db.all_models  # noqa: F401

        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


async def _login(client: AsyncClient, email: str = "demo@example.com") -> str:
    res = await client.post(
        "/api/v1/auth/register",
        json={"email": email, "password": "correct-password", "name": "Demo User"},
    )
    if res.status_code == 409:
        res = await client.post(
            "/api/v1/auth/login",
            json={"email": email, "password": "correct-password"},
        )
    assert res.status_code == 200
    return res.json()["access_token"]


@pytest.mark.asyncio
async def test_healthz(client: AsyncClient):
    res = await client.get("/healthz")
    assert res.status_code == 200
    data = res.json()
    assert data["database"] == "up"


@pytest.mark.asyncio
async def test_password_login_and_demo_portfolio(client: AsyncClient):
    token = await _login(client)
    headers = {"Authorization": f"Bearer {token}"}

    policies = await client.get("/api/v1/policies/", headers=headers)
    assert policies.status_code == 200
    assert len(policies.json()) >= 2

    score = await client.get("/api/v1/protection/", headers=headers)
    assert score.status_code == 200
    assert score.json()["overall"] > 0


@pytest.mark.asyncio
async def test_forgot_password_reset_and_login(client: AsyncClient):
    await client.post(
        "/api/v1/auth/register",
        json={"email": "reset@example.com", "password": "old-password"},
    )
    forgot = await client.post(
        "/api/v1/auth/password/forgot",
        json={"email": "reset@example.com"},
    )
    assert forgot.status_code == 200
    token = forgot.json()["reset_token"]
    assert token

    reset = await client.post(
        "/api/v1/auth/password/reset",
        json={"token": token, "password": "new-password"},
    )
    assert reset.status_code == 200

    login = await client.post(
        "/api/v1/auth/login",
        json={"email": "reset@example.com", "password": "new-password"},
    )
    assert login.status_code == 200


@pytest.mark.asyncio
async def test_development_oauth_login_seeds_account_data(client: AsyncClient):
    login = await client.post(
        "/api/v1/auth/oauth",
        json={"provider": "google", "email": "google@example.com", "name": "Google User"},
    )
    assert login.status_code == 200
    headers = {"Authorization": f"Bearer {login.json()['access_token']}"}

    policies = await client.get("/api/v1/policies/", headers=headers)
    assert policies.status_code == 200
    assert len(policies.json()) >= 2


@pytest.mark.asyncio
async def test_conversation_advisor_with_cards(client: AsyncClient):
    token = await _login(client, email="advisor@example.com")
    headers = {"Authorization": f"Bearer {token}"}

    created = await client.post("/api/v1/conversations/", headers=headers)
    assert created.status_code == 201
    conv_id = created.json()["id"]

    msg = await client.post(
        f"/api/v1/conversations/{conv_id}/messages",
        headers=headers,
        json={"text": "What's my protection score?"},
    )
    assert msg.status_code == 200
    messages = msg.json()["messages"]
    assistant = [m for m in messages if m["role"] == "assistant"][-1]
    assert assistant["cards"]
    assert assistant["cards"][0]["kind"] == "protection-score"
