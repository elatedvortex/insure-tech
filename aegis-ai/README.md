# Aegis — AI-First InsurTech Platform (Frontend Prototype)

A working Next.js/TypeScript/Tailwind implementation of the conversational,
AI-first insurance experience: no forms, no menus — the AI drives the journey.

## What's built

- **Homepage** (`/`) — conversational hero where the input *is* the hero
  (no separate headline + search-box template), suggested prompts, how-it-works,
  protection categories, trust section, FAQ.
- **Advisor screen** (`/advisor`) — the core AI workspace. Streams responses
  token-by-token (SSE), renders rich cards inline (recommendations, quotes,
  protection score, claim status, document requests, plan comparisons),
  supports quick-reply buttons, file upload, and a voice-input affordance.
- **Mock AI orchestration layer** (`src/lib/advisor-engine.ts`) — a lightweight
  intent classifier + scripted multi-turn flows standing in for the real
  agent system (Customer Advisor, Policy Recommendation, Claims, etc.).
  It's isolated behind one function so it's a clean seam to swap for a real
  LLM call.
- **Mock streaming API** (`src/app/api/chat/route.ts`) — a real SSE endpoint
  simulating token latency, so the frontend streaming logic is genuine and
  ready to point at a real model.
- Dark/light mode, responsive layout, reduced-motion support, keyboard focus states.

## Design system

Tokens live in `src/app/globals.css` as CSS variables (`--paper`, `--ink`,
`--pine`, `--clay`, `--surface`, etc.), mapped into Tailwind via `@theme inline`.
Palette: warm paper background, deep pine green as the primary/trust color,
a single warm clay accent used sparingly for alerts/recommended badges.
Display type is a serif system stack (Iowan Old Style/Palatino/Georgia
fallback chain); body is a grotesk system stack. Google Fonts aren't fetched
at build time in this sandbox — swap in `next/font/google` (Fraunces + Inter)
once you have network access, the CSS variables are already wired for it.

## Running locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Wiring in a real AI backend

Replace `getAdvisorResponse()` in `src/lib/advisor-engine.ts` and the route
in `src/app/api/chat/route.ts` with a real call to your agent orchestration
layer (e.g. LangGraph agents behind FastAPI). The frontend's streaming
consumption logic in `src/app/advisor/AdvisorClient.tsx` already expects
Server-Sent Events with `token`, `cards`, `quickReplies`, and `done` event
types — keep that contract and the UI needs no changes.

## Where this fits in the bigger platform

This is the frontend slice only. Still to build: FastAPI backend, Postgres
schema, the multi-agent orchestration layer, auth, document intelligence
(OCR/vision), real claims/underwriting logic, and deployment infra — happy
to build any of those next.
