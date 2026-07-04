"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChatMessage, AnyCard } from "@/lib/types";
import { makeMessage } from "@/lib/advisor-engine";
import { MessageBubble } from "@/components/MessageBubble";
import { TypingIndicator } from "@/components/TypingIndicator";
import { Composer } from "@/components/Composer";
import { Presence } from "@/components/Presence";
import { conversationApi, tokens } from "@/lib/api";
import type { Conversation } from "@/lib/api";

// Convert a backend Conversation message to the frontend ChatMessage shape
function backendMsgToChat(m: {
  id: string;
  role: "user" | "assistant";
  text: string;
  cards?: unknown[] | null;
  quick_replies?: string[] | null;
  created_at: string;
}): ChatMessage {
  return {
    id: m.id,
    role: m.role,
    text: m.text,
    cards: (m.cards ?? undefined) as AnyCard[] | undefined,
    quickReplies: m.quick_replies ?? undefined,
    timestamp: new Date(m.created_at).getTime(),
  };
}

export default function AdvisorClient() {
  const params = useSearchParams();
  const router = useRouter();
  const initialQuery = params.get("q");
  const resumeConvId = params.get("conv");

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [convId, setConvId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const initFired = useRef(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  // ── Bootstrap conversation ──────────────────────────────────────────────

  const bootstrap = useCallback(async () => {
    if (initFired.current) return;
    initFired.current = true;

    // If resuming an existing conversation
    if (resumeConvId) {
      try {
        const conv = await conversationApi.get(resumeConvId);
        setConvId(conv.id);
        setMessages(conv.messages.map(backendMsgToChat));
        return;
      } catch {
        // fall through to create new
      }
    }

    // Create a new conversation
    try {
      const conv = await conversationApi.create();
      setConvId(conv.id);
      // Backend sends a greeting message — load it
      setMessages(conv.messages.map(backendMsgToChat));

      // If there's an initial query from the URL, send it immediately
      if (initialQuery) {
        await sendMessageToBackend(conv.id, initialQuery);
      }
    } catch {
      // Fallback: offline/local mode using the advisor-engine stub
      setMessages([
        makeMessage(
          "assistant",
          "Hi — I'm Aegis. Tell me what's going on and I'll take it from there.",
          undefined,
          ["I bought a car", "I need health insurance", "Check my protection score"],
        ),
      ]);
      if (initialQuery) sendMessageLocal(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  // ── Send to real backend ────────────────────────────────────────────────

  async function sendMessageToBackend(cid: string, text: string) {
    const userMsg = makeMessage("user", text);
    setMessages((prev) => [...prev, userMsg]);
    setThinking(true);

    try {
      const conv = await conversationApi.send(cid, text);
      // Replace all messages with authoritative backend state
      setMessages(conv.messages.map(backendMsgToChat));
    } catch {
      // If backend fails, fall back to streaming local reply
      await sendMessageLocalStream(text);
    } finally {
      setThinking(false);
    }
  }

  // ── Local fallback: stream via Next.js /api/chat ────────────────────────

  async function sendMessageLocalStream(text: string) {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, history: messages }),
    });
    if (!res.body) return;

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let assistantText = "";
    let cards: AnyCard[] | undefined;
    let quickReplies: string[] | undefined;
    const assistantId = Math.random().toString(36).slice(2, 10);
    let started = false;

    setStreaming(true);
    setThinking(false);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop() || "";

      for (const part of parts) {
        if (!part.startsWith("data: ")) continue;
        const payload = JSON.parse(part.slice(6));

        if (payload.type === "token") {
          if (!started) {
            started = true;
            setMessages((prev) => [
              ...prev,
              { id: assistantId, role: "assistant", text: "", timestamp: Date.now() },
            ]);
          }
          assistantText += payload.value;
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, text: assistantText } : m)),
          );
        } else if (payload.type === "cards") {
          cards = payload.value;
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, cards } : m)),
          );
        } else if (payload.type === "quickReplies") {
          quickReplies = payload.value;
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, quickReplies } : m)),
          );
        }
      }
    }
    setStreaming(false);
  }

  function sendMessageLocal(text: string) {
    sendMessageLocalStream(text);
  }

  // ── Main send handler ───────────────────────────────────────────────────

  async function sendMessage(text: string, files?: File[]) {
    if (!text.trim() && (!files || files.length === 0)) return;
    const displayText = text.trim() || `Sent ${files?.length} file(s)`;

    if (convId) {
      await sendMessageToBackend(convId, displayText);
    } else {
      await sendMessageLocalStream(displayText);
    }
  }

  return (
    <div className="flex flex-col h-dvh bg-paper">
      <header className="flex items-center gap-3 px-4 sm:px-6 py-3.5 border-b border-surface-line/60 bg-paper/90 backdrop-blur-xl">
        <button
          onClick={() => router.push("/")}
          aria-label="Back to home"
          className="w-8 h-8 rounded-full flex items-center justify-center text-ink-soft hover:text-pine transition-colors"
        >
          <BackIcon />
        </button>
        <Presence size="sm" active={thinking || streaming} />
        <div>
          <p className="font-display text-base text-ink leading-none">Aegis</p>
          <p className="text-[11px] text-sage mt-0.5">
            {thinking ? "Thinking…" : streaming ? "Responding…" : "Your protection advisor"}
          </p>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide px-4 sm:px-6 py-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} onQuickReply={(t) => sendMessage(t)} />
          ))}
          {thinking && <TypingIndicator />}
        </div>
      </div>

      <Composer onSend={sendMessage} disabled={streaming || thinking} />
    </div>
  );
}

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
