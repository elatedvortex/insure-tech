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
    otp_res = await client.post("/api/v1/auth/otp/request", json={"email": email})
    assert otp_res.status_code == 200
    code = otp_res.json()["dev_code"]
    verify = await client.post(
        "/api/v1/auth/otp/verify", json={"email": email, "code": code}
    )
    assert verify.status_code == 200
    return verify.json()["access_token"]


@pytest.mark.asyncio
async def test_healthz(client: AsyncClient):
    res = await client.get("/healthz")
    assert res.status_code == 200
    data = res.json()
    assert data["database"] == "up"


@pytest.mark.asyncio
async def test_otp_login_and_demo_portfolio(client: AsyncClient):
    token = await _login(client)
    headers = {"Authorization": f"Bearer {token}"}

    policies = await client.get("/api/v1/policies/", headers=headers)
    assert policies.status_code == 200
    assert len(policies.json()) >= 2

    score = await client.get("/api/v1/protection/", headers=headers)
    assert score.status_code == 200
    assert score.json()["overall"] > 0


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
