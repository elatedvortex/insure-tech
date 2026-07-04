"""
Context-aware advisor stub ? mirrors the frontend advisor-engine intents but
enriches replies with the user's real policies, claims, and protection score.
"""
from __future__ import annotations

import re
import uuid
from dataclasses import dataclass, field
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.claim import Claim
from app.models.conversation import Message
from app.models.policy import Policy
from app.models.protection_score import ProtectionScore


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


def _detect_intent(text: str) -> str:
    t = text.lower()
    if re.search(r"\b(car|vehicle|drive|motor|auto)\b", t) and re.search(
        r"\b(bought|new|got|purchase)\b", t
    ):
        return "new_car"
    if re.search(r"\b(accident|crash|dent|collision|scratch)\b", t):
        return "claim_incident"
    if re.search(r"\b(score|protection score)\b", t):
        return "protection_score"
    if re.search(r"\bclaim status\b|\bmy claim\b|\btrack\b.*\bclaim\b", t):
        return "claim_status"
    if re.search(r"\b(policy|policies|cover|coverage)\b", t):
        return "policies"
    if re.search(r"\b(recommend|suggest|gap)\b", t):
        return "recommendations"
    if re.search(r"\b(hi|hello|hey|start)\b", t):
        return "greeting"
    if re.search(r"\bclaim\b", t):
        return "claim_general"
    if re.search(r"\byes\b", t):
        return "affirm"
    return "unknown"


def _policy_summary_card(ctx: UserContext) -> dict[str, Any] | None:
    active = [p for p in ctx.policies if p.status == "Active"]
    if not active:
        return None
    lines = [f"{p.name} ({p.category}) ? ${p.monthly_premium:.0f}/mo" for p in active[:4]]
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


def get_advisor_response(
    user_text: str,
    history: list[Message],
    ctx: UserContext,
) -> AdvisorResponse:
    intent = _detect_intent(user_text)
    last_assistant = next((m for m in reversed(history) if m.role == "assistant"), None)
    last_text = (last_assistant.text or "") if last_assistant else ""

    if intent == "affirm" and "everyone okay" in last_text.lower():
        claim = ctx.claims[0] if ctx.claims else None
        if claim:
            return AdvisorResponse(
                text=(
                    "Good ? that's what matters most. I've pulled up your open claim "
                    "and here's the latest status."
                ),
                cards=[_claim_status_card(claim)],
                quick_replies=["Check claim status", "Talk to a human", "What's covered?"],
            )

    if intent == "protection_score":
        score = ctx.protection.overall if ctx.protection else None
        lead = (
            f"Your protection score is {score}/100. Here's how you're covered by category."
            if score is not None
            else "Here's your protection breakdown based on active policies."
        )
        return AdvisorResponse(
            text=lead,
            cards=[_protection_card(ctx)],
            quick_replies=["Show gaps", "Recommend coverage", "View policies"],
        )

    if intent == "claim_status":
        if not ctx.claims:
            return AdvisorResponse(
                text="You don't have any claims on file yet. Want to start one?",
                quick_replies=["File a new claim", "View policies", "Not now"],
            )
        return AdvisorResponse(
            text="Here's your most recent claim:",
            cards=[_claim_status_card(ctx.claims[0])],
            quick_replies=["File another claim", "View all policies"],
        )

    if intent == "policies":
        active = [p for p in ctx.policies if p.status == "Active"]
        if not active:
            return AdvisorResponse(
                text="You don't have active policies yet. I can recommend starter coverage if you'd like.",
                quick_replies=["Show recommendations", "Get a quote", "Not now"],
            )
        names = ", ".join(p.name for p in active[:3])
        card = _policy_summary_card(ctx)
        return AdvisorResponse(
            text=f"You have {len(active)} active polic{'y' if len(active) == 1 else 'ies'}: {names}.",
            cards=[card] if card else [],
            quick_replies=["Add coverage", "Protection score", "File a claim"],
        )

    if intent == "recommendations":
        missing = {"Life", "Home", "Travel", "Vehicle", "Health", "Business"} - {
            p.category for p in ctx.policies if p.status == "Active"
        }
        if not missing:
            return AdvisorResponse(
                text="You're well covered across major categories. Want a deeper review or a better rate?",
                quick_replies=["Compare plans", "Protection score", "Not now"],
            )
        cat = sorted(missing)[0]
        card_cat = CATEGORY_TO_CARD.get(cat, cat)
        return AdvisorResponse(
            text=f"Based on your portfolio, {cat} coverage would strengthen your protection score.",
            cards=[
                {
                    "kind": "recommendation",
                    "category": card_cat,
                    "title": f"{cat} protection plan",
                    "reasoning": f"You have active policies but no dedicated {cat} cover yet.",
                    "monthlyPremium": 45.0 if cat == "Travel" else 85.0,
                    "coverage": f"Core {cat.lower()} risks with flexible deductibles.",
                }
            ],
            quick_replies=["Get a quote", "Tell me more", "Not now"],
        )

    if intent == "new_car":
        return AdvisorResponse(
            text="Congratulations on the new car. Is it mainly for daily commuting or occasional use?",
            quick_replies=["Daily commuting", "Occasional use", "Just show me options"],
        )

    if intent == "claim_incident":
        return AdvisorResponse(
            text="I'm sorry to hear that ? let's get this sorted. First: is everyone okay?",
            quick_replies=["Yes, everyone's safe", "Someone's hurt"],
        )

    if intent == "claim_general":
        return AdvisorResponse(
            text=(
                "I can help you file a claim or check an existing one. "
                "Describe what happened, or pick an option below."
            ),
            quick_replies=["File a new claim", "Check claim status", "Cancel"],
        )

    if intent == "greeting":
        return AdvisorResponse(
            text=(
                "Hi! I'm Aegis, your AI insurance advisor. "
                "I can help with policies, claims, recommendations, and your protection score. "
                "What would you like to do?"
            ),
            cards=[_protection_card(ctx)] if ctx.policies else [],
            quick_replies=["View my policies", "File a claim", "My protection score"],
        )

    return AdvisorResponse(
        text=(
            "I'm here for anything insurance-related ? claims, policies, "
            "recommendations, or your protection score. What should we look at?"
        ),
        quick_replies=["Policies", "Claims", "Protection score", "Recommendations"],
    )
