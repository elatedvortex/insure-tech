"""
Context-aware AI advisor using Google Gemini, returning structured responses with dynamic UI cards.
"""
from __future__ import annotations

import json
import logging
import uuid
from dataclasses import dataclass, field
from typing import Any

import google.generativeai as genai
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.config import settings
from app.models.claim import Claim
from app.models.conversation import Message
from app.models.policy import Policy
from app.models.protection_score import ProtectionScore

logger = logging.getLogger(__name__)

if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)


@dataclass
class AdvisorResponse:
    text: str
    cards: list[dict[str, Any]] = field(default_factory=list)
    quick_replies: list[str] = field(default_factory=list)


@dataclass
class UserContext:
    policies: list[Policy]
    claims: list[Claim]
    protection: ProtectionScore | None


CATEGORY_TO_CARD: dict[str, str] = {
    "Vehicle": "Motor",
    "Health": "Health",
    "Home": "Home",
    "Travel": "Travel",
    "Life": "Life",
    "Business": "Business",
}


async def load_user_context(user_id: uuid.UUID, db: AsyncSession) -> UserContext:
    policies = (
        await db.execute(select(Policy).where(Policy.user_id == user_id))
    ).scalars().all()
    claims = (
        await db.execute(
            select(Claim)
            .where(Claim.user_id == user_id)
            .options(selectinload(Claim.policy))
            .order_by(Claim.created_at.desc())
        )
    ).scalars().all()
    protection = (
        await db.execute(select(ProtectionScore).where(ProtectionScore.user_id == user_id))
    ).scalar_one_or_none()
    return UserContext(policies=list(policies), claims=list(claims), protection=protection)


def _policy_summary_card(ctx: UserContext) -> dict[str, Any] | None:
    active = [p for p in ctx.policies if p.status == "Active"]
    if not active:
        return None
    return {
        "kind": "comparison",
        "options": [
            {
                "name": p.name,
                "monthlyPremium": p.monthly_premium,
                "highlights": [p.coverage_summary or p.category],
                "recommended": i == 0,
            }
            for i, p in enumerate(active[:3])
        ],
    }


def _protection_card(ctx: UserContext) -> dict[str, Any]:
    if ctx.protection and ctx.protection.breakdown:
        breakdown = [
            {"label": row.get("label", ""), "score": row.get("score", 0)}
            for row in ctx.protection.breakdown
        ]
        overall = ctx.protection.overall
    else:
        covered = {p.category for p in ctx.policies if p.status == "Active"}
        breakdown = [
            {"label": cat, "score": 100 if cat in covered else 0}
            for cat in ("Health", "Life", "Vehicle", "Home", "Travel")
        ]
        overall = round(sum(b["score"] for b in breakdown) / len(breakdown), 1)

    return {"kind": "protection-score", "overall": overall, "breakdown": breakdown}


def _claim_status_card(claim: Claim) -> dict[str, Any]:
    short_id = str(claim.id).split("-")[0].upper()
    return {
        "kind": "claim-status",
        "claimId": f"CLM-{short_id[:8]}",
        "incident": claim.incident_description[:120],
        "stage": claim.stage,
        "estimate": claim.estimate,
        "nextStep": claim.next_step or "We'll update you as the claim progresses.",
    }


def _recommendation_card(ctx: UserContext) -> dict[str, Any] | None:
    missing = {"Life", "Home", "Travel", "Vehicle", "Health", "Business"} - {
        p.category for p in ctx.policies if p.status == "Active"
    }
    if not missing:
        return None
    cat = sorted(missing)[0]
    card_cat = CATEGORY_TO_CARD.get(cat, cat)
    return {
        "kind": "recommendation",
        "category": card_cat,
        "title": f"{cat} protection plan",
        "reasoning": f"You have active policies but no dedicated {cat} cover yet.",
        "monthlyPremium": 45.0 if cat == "Travel" else 85.0,
        "coverage": f"Core {cat.lower()} risks with flexible deductibles.",
    }


async def get_advisor_response(
    user_text: str,
    history: list[Message],
    ctx: UserContext,
) -> AdvisorResponse:
    if not settings.GEMINI_API_KEY:
        return AdvisorResponse(
            text="I'm here for anything insurance-related! (Please set GEMINI_API_KEY in your .env for the full AI experience.)",
            quick_replies=["Policies", "Claims", "Protection score"]
        )

    # Prepare context for the prompt
    policies_ctx = [{"category": p.category, "name": p.name, "premium": p.monthly_premium} for p in ctx.policies]
    claims_ctx = [{"incident": c.incident_description, "stage": c.stage, "estimate": c.estimate} for c in ctx.claims]
    score_ctx = ctx.protection.overall if ctx.protection else "Unknown"

    system_prompt = f"""You are Aegis, a premium, intelligent AI insurance advisor.
Your goal is to help the user manage their insurance, file claims, and understand their coverage.
Tone: Professional, concise, empathetic, premium. Do not hallucinate policies they don't have.

User Context:
- Active Policies: {json.dumps(policies_ctx)}
- Open Claims: {json.dumps(claims_ctx)}
- Protection Score: {score_ctx}/100

Respond ONLY in valid JSON with exactly this structure:
{{
  "text": "Your conversational reply. Max 2-3 sentences.",
  "intent": "one of: [greeting, policies, claim_status, claim_incident, protection_score, recommendations, unknown]",
  "quick_replies": ["Suggest 1", "Suggest 2", "Suggest 3"]
}}
"""

    gemini_history = []
    for m in history[-10:]:
        role = "user" if m.role == "user" else "model"
        gemini_history.append({"role": role, "parts": [m.text]})

    try:
        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash", 
            system_instruction=system_prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        chat = model.start_chat(history=gemini_history)
        response = await chat.send_message_async(user_text)
        
        data = json.loads(response.text)
        text = data.get("text", "I'm here to help.")
        intent = data.get("intent", "unknown")
        quick_replies = data.get("quick_replies", ["View policies", "Check claims"])
        
        # Attach dynamic UI cards based on Gemini's selected intent
        cards = []
        if intent == "protection_score":
            cards.append(_protection_card(ctx))
        elif intent == "claim_status" and ctx.claims:
            cards.append(_claim_status_card(ctx.claims[0]))
        elif intent == "policies":
            card = _policy_summary_card(ctx)
            if card: cards.append(card)
        elif intent == "greeting" and ctx.policies:
            cards.append(_protection_card(ctx))
        elif intent == "recommendations":
            card = _recommendation_card(ctx)
            if card: cards.append(card)

        return AdvisorResponse(
            text=text,
            cards=cards,
            quick_replies=quick_replies,
        )
        
    except Exception as e:
        logger.error(f"Gemini API error: {e}")
        return AdvisorResponse(
            text="I'm having a little trouble connecting to my AI brain right now. Can we try again?",
            quick_replies=["Try again", "Go to dashboard"]
        )
