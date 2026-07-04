"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Mic, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { Presence } from "./Presence";

const PROMPTS = [
  "I bought my first car.",
  "I am getting married.",
  "I need health insurance.",
  "I lost my phone.",
  "I am travelling next week.",
  "My father needs medical coverage.",
  "I started a business.",
];

const PLACEHOLDERS = [
  "How can I help protect you today?",
  "Tell me about a life change…",
  "What would you like to protect?",
  "Ask me anything about coverage…",
];

export function ConversationalHero() {
  const [value, setValue] = useState("");
  const [listening, setListening] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Cycle placeholder text
  useEffect(() => {
    const t = setInterval(() => {
      if (!focused) setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS.length);
    }, 3200);
    return () => clearInterval(t);
  }, [focused]);

  function go(text: string) {
    if (!text.trim()) return;
    router.push(`/advisor?q=${encodeURIComponent(text.trim())}`);
  }

  function handleMic() {
    setListening(true);
    setTimeout(() => {
      setListening(false);
      inputRef.current?.focus();
    }, 1600);
  }

  return (
    <section className="relative flex flex-col items-center justify-center px-6 pt-28 pb-24 sm:pt-40 sm:pb-32 overflow-hidden">

      {/* Multi-layer ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-[radial-gradient(circle,var(--pine)/6%_0%,transparent_65%)]" />
        <div className="absolute left-[30%] top-[20%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,var(--clay)/4%_0%,transparent_70%)]" />
        <div className="absolute right-[20%] top-[40%] w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,var(--pine-bright)/3%_0%,transparent_70%)]" />
      </div>

      {/* Eyebrow badge */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-pine/30 bg-pine/5 backdrop-blur-sm"
      >
        <Sparkles className="w-3.5 h-3.5 text-pine" />
        <span className="font-mono text-[11px] tracking-widest uppercase text-pine font-medium">
          AI Protection Advisor · Aegis
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-pine animate-breathe" />
      </motion.div>

      {/* Hero heading */}
      <motion.h1
        initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ type: "spring", stiffness: 90, damping: 18, delay: 0.08 }}
        className="font-display text-[clamp(2.6rem,7vw,5.5rem)] font-semibold tracking-tight text-center leading-[1.04] max-w-4xl"
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-br from-ink via-ink to-ink-soft">
          Insurance that thinks
        </span>
        <br />
        <span className="relative inline-block">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pine via-pine-bright to-pine">
            before you do.
          </span>
          {/* Underline accent */}
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-pine/60 via-pine to-pine/60 origin-left"
          />
        </span>
      </motion.h1>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
        className="mt-6 text-base sm:text-lg text-sage max-w-lg text-center leading-relaxed"
      >
        Ask in plain language. Get honest, personalised coverage guidance — no forms, no jargon.
      </motion.p>

      {/* Input card */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 90, damping: 18, delay: 0.3 }}
        className="w-full max-w-2xl mt-12 relative"
      >
        {/* Glow ring on focus */}
        <div
          className={`absolute inset-0 rounded-[28px] transition-all duration-500 pointer-events-none ${
            focused
              ? "shadow-[0_0_0_3px_var(--pine)/30,0_20px_60px_-10px_var(--pine)/20]"
              : "shadow-[0_8px_32px_-4px_rgba(0,0,0,0.12)]"
          }`}
        />

        <div
          className={`relative rounded-[28px] border-2 transition-all duration-300 p-2 pl-5 ${
            focused
              ? "bg-surface border-pine/40 dark:bg-surface"
              : "bg-surface border-surface-line"
          }`}
        >
          <div className="flex items-end gap-3">
            <Presence active={listening} className="mb-[14px] shrink-0" />
            <div className="flex-1 relative">
              <AnimatePresence mode="wait">
                {!value && !focused && (
                  <motion.span
                    key={placeholderIdx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-0 top-[18px] text-sage/60 text-base sm:text-lg pointer-events-none select-none"
                  >
                    {PLACEHOLDERS[placeholderIdx]}
                  </motion.span>
                )}
              </AnimatePresence>
              <textarea
                ref={inputRef}
                rows={1}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  // Auto-grow
                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    go(value);
                  }
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder=""
                className="w-full resize-none bg-transparent py-[18px] text-base sm:text-lg text-ink focus:outline-none leading-relaxed"
                style={{ maxHeight: 128 }}
              />
            </div>

            <div className="flex gap-2 pb-2 shrink-0">
              <button
                onClick={handleMic}
                aria-label="Speak instead of typing"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                  listening
                    ? "bg-clay text-paper shadow-[0_0_0_4px_var(--clay)/20]"
                    : "bg-paper-dim text-ink-soft hover:text-pine hover:bg-paper hover:shadow-sm"
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                onClick={() => go(value)}
                aria-label="Send message"
                disabled={!value.trim()}
                className="w-10 h-10 rounded-full bg-pine text-paper flex items-center justify-center transition-all duration-200 hover:bg-pine-deep hover:scale-105 active:scale-95 disabled:opacity-25 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-[0_2px_8px_var(--pine)/30]"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Prompt chips */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        className="mt-7 flex flex-wrap justify-center gap-2 max-w-2xl"
      >
        {PROMPTS.map((p, i) => (
          <motion.button
            key={p}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 16, delay: 0.6 + i * 0.04 }}
            onClick={() => go(p)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            className="text-[13px] px-4 py-2 rounded-full border border-surface-line bg-surface/60 backdrop-blur-sm text-ink-soft hover:border-pine/50 hover:text-pine hover:bg-pine/5 transition-all duration-200"
          >
            {p}
          </motion.button>
        ))}
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="mt-14 flex items-center gap-8 sm:gap-12"
      >
        {[
          { label: "Policies analysed", value: "12,000+" },
          { label: "Average savings", value: "28%" },
          { label: "Claims supported", value: "3,400+" },
        ].map(({ label, value: v }) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <span className="font-display text-2xl sm:text-3xl font-semibold text-ink">{v}</span>
            <span className="text-[11px] uppercase tracking-wider text-sage font-mono">{label}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
