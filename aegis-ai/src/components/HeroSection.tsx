"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, Mic, ArrowUp, PhoneCall, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { Presence } from "./Presence";

const PROMPTS = [
  "I need health insurance for my family.",
  "Compare the best term life plans.",
  "What motor insurance should I get?",
  "Help me check my claim settlement ratio.",
  "My employer cover isn't enough.",
  "I want to plan retirement with insurance.",
];

const PLACEHOLDERS = [
  "How can I protect my family today?",
  "Ask me about health, life or motor...",
  "Tell me about your insurance needs...",
  "What coverage gap should I fix first?",
];

const STATS = [
  { value: 50000, suffix: "+", label: "Policies Analysed" },
  { value: 98, suffix: "%", label: "Claim Support Rate" },
  { value: 4.9, suffix: "/5", label: "Customer Rating", decimals: 1 },
];

// Animated neural-network SVG lines for the hero background
function AINetworkLines() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.055]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="ng1" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FC8019" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FC8019" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Node lines */}
      <line x1="10%" y1="20%" x2="35%" y2="45%" stroke="#FC8019" strokeWidth="1" />
      <line x1="35%" y1="45%" x2="60%" y2="30%" stroke="#FC8019" strokeWidth="1" />
      <line x1="60%" y1="30%" x2="85%" y2="55%" stroke="#FC8019" strokeWidth="1" />
      <line x1="35%" y1="45%" x2="55%" y2="70%" stroke="#FC8019" strokeWidth="1" />
      <line x1="55%" y1="70%" x2="80%" y2="80%" stroke="#FC8019" strokeWidth="1" />
      <line x1="20%" y1="65%" x2="55%" y2="70%" stroke="#FC8019" strokeWidth="0.8" />
      <line x1="60%" y1="30%" x2="70%" y2="10%" stroke="#FC8019" strokeWidth="0.8" />
      <line x1="10%" y1="20%" x2="20%" y2="65%" stroke="#FC8019" strokeWidth="0.6" />
      {/* Nodes */}
      {[
        ["10%", "20%"], ["35%", "45%"], ["60%", "30%"],
        ["85%", "55%"], ["55%", "70%"], ["80%", "80%"],
        ["20%", "65%"], ["70%", "10%"],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3.5" fill="#FC8019" opacity="0.8" />
      ))}
    </svg>
  );
}

function CountUp({ end, suffix = "", decimals = 0 }: { end: number; suffix?: string; decimals?: number }) {
  const [value, setValue] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) { setValue(end); return; }
    let frame = 0;
    const duration = 1600;
    const start = performance.now();
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((end * eased).toFixed(decimals)));
      if (progress < 1) frame = window.requestAnimationFrame(tick);
    }
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [end, reduced, decimals]);

  return (
    <span className="font-display text-3xl sm:text-4xl font-bold text-ink">
      {decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString("en-IN")}{suffix}
    </span>
  );
}

export function HeroSection() {
  const [value, setValue] = useState("");
  const [listening, setListening] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [focused, setFocused] = useState(false);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const router = useRouter();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const t = setInterval(() => {
      if (!focused) setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(t);
  }, [focused]);

  function go(text: string) {
    if (!text.trim()) return;
    router.push(`/advisor?q=${encodeURIComponent(text.trim())}`);
  }

  function handleMic() {
    setListening(true);
    setTimeout(() => { setListening(false); inputRef.current?.focus(); }, 1600);
  }

  function handlePointerMove(e: React.MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setPointer({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  return (
    <section
      id="hero"
      onMouseMove={reduced ? undefined : handlePointerMove}
      onMouseLeave={() => setPointer({ x: 0, y: 0 })}
      className="relative flex flex-col items-center justify-center px-6 pt-24 pb-20 sm:pt-36 sm:pb-28 overflow-hidden min-h-[92vh]"
    >
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-[radial-gradient(circle,rgba(252,128,25,0.22)_0%,transparent_55%)]" />
        <div className="absolute left-[10%] top-[8%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(20,25,39,0.08)_0%,transparent_60%)]" />
        <div className="absolute right-[8%] top-[30%] w-[380px] h-[380px] rounded-full bg-[radial-gradient(circle,rgba(255,186,71,0.20)_0%,transparent_65%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[400px] bg-[radial-gradient(ellipse_at_bottom,rgba(237,137,54,0.12),transparent_55%)]" />
        {!reduced && (
          <div
            className="absolute inset-0 opacity-80 transition-opacity duration-200"
            style={{
              background: `radial-gradient(380px circle at ${pointer.x}px ${pointer.y}px, rgba(252,128,25,0.14), transparent 62%)`,
            }}
          />
        )}
        <AINetworkLines />
      </div>

      {/* AI badge */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={reduced ? { duration: 0.01 } : { type: "spring", stiffness: 120, damping: 18 }}
        className="flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-pine/30 bg-pine/5 backdrop-blur-sm"
      >
        <Sparkles className="w-3.5 h-3.5 text-pine" />
        <span className="font-mono text-[11px] tracking-widest uppercase text-pine font-medium">
          AI Insurance Advisor · India&apos;s Smartest Platform
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-pine animate-breathe" />
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={reduced ? false : { opacity: 0, y: 28, filter: "blur(14px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={reduced ? { duration: 0.01 } : { type: "spring", stiffness: 90, damping: 18, delay: 0.08 }}
        className="font-display text-[clamp(2.8rem,7.5vw,5.8rem)] font-bold tracking-tight text-center leading-[1.03] max-w-5xl"
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-br from-ink via-ink to-ink/70">
          The Smarter Way to
        </span>
        <br />
        <span className="relative inline-block">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pine-deep via-pine to-pine-bright">
            Choose Insurance
          </span>
          <motion.span
            initial={reduced ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={reduced ? { duration: 0.01 } : { delay: 0.65, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-pine/60 via-pine to-pine/60 origin-left"
          />
        </span>
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        initial={reduced ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduced ? { duration: 0.01 } : { type: "spring", stiffness: 100, damping: 20, delay: 0.22 }}
        className="mt-6 text-base sm:text-xl text-ink-soft max-w-2xl text-center leading-relaxed"
      >
        Helping thousands of Indians choose the <strong className="text-ink font-semibold">right policy</strong> using AI, transparency and expert guidance.{" "}
        <span className="text-pine font-medium">Not just the cheapest—the best.</span>
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduced ? { duration: 0.01 } : { delay: 0.34 }}
        className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center"
      >
        <motion.button
          whileHover={reduced ? undefined : { y: -2, scale: 1.02, boxShadow: "0 20px 50px -18px rgba(252,128,25,0.5)" }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push("/protection/health")}
          className="btn-primary text-base px-8 py-3.5 flex items-center gap-2"
          id="hero-compare-cta"
          aria-label="Compare Policies"
        >
          Compare Policies
          <ArrowRight className="w-4 h-4" />
        </motion.button>

        <motion.button
          whileHover={reduced ? undefined : { y: -2, scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push("/advisor")}
          className="flex items-center gap-2 px-8 py-3.5 rounded-full border border-surface-line bg-surface/70 backdrop-blur-sm text-ink font-semibold text-base hover:border-pine/40 hover:bg-pine/5 transition-all duration-200"
          id="hero-expert-cta"
          aria-label="Talk to an Expert"
        >
          <PhoneCall className="w-4 h-4 text-pine" />
          Talk to an Expert
        </motion.button>
      </motion.div>

      {/* AI Input Box */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={reduced ? { duration: 0.01 } : { type: "spring", stiffness: 90, damping: 18, delay: 0.38 }}
        className="w-full max-w-2xl mt-14 relative"
      >
        <div
          className={`absolute inset-0 rounded-[30px] transition-all duration-500 pointer-events-none ${
            focused
              ? "shadow-[0_0_0_3px_rgba(252,128,25,0.3),0_28px_80px_-24px_rgba(252,128,25,0.22)]"
              : "shadow-[0_18px_60px_-24px_rgba(20,25,39,0.14)]"
          }`}
        />
        <div
          className={`relative rounded-[30px] border-2 transition-all duration-300 p-2 pl-5 ${
            focused
              ? "bg-white/97 border-pine/40"
              : "bg-gradient-to-br from-white to-[#fff6ee] border-[#f0ddd0]"
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
                    transition={{ duration: 0.28 }}
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
                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); go(value); }
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder=""
                aria-label="Ask your insurance question"
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
                    ? "bg-clay text-paper shadow-[0_0_0_4px_rgba(252,128,25,0.2)]"
                    : "bg-paper-dim text-ink-soft hover:text-pine hover:bg-paper hover:shadow-sm"
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                onClick={() => go(value)}
                aria-label="Get AI recommendation"
                disabled={!value.trim()}
                className="w-10 h-10 rounded-full bg-pine text-paper flex items-center justify-center transition-all duration-200 hover:bg-pine-deep hover:scale-105 active:scale-95 disabled:opacity-25 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-[0_2px_8px_rgba(252,128,25,0.3)]"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Prompt Chips */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduced ? { duration: 0.01 } : { delay: 0.6, duration: 0.5 }}
        className="mt-6 flex flex-wrap justify-center gap-2 max-w-2xl"
      >
        {PROMPTS.map((p, i) => (
          <motion.button
            key={p}
            initial={reduced ? false : { opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={reduced ? { duration: 0.01 } : { type: "spring", stiffness: 180, damping: 16, delay: 0.65 + i * 0.05 }}
            onClick={() => go(p)}
            whileHover={reduced ? undefined : { y: -2 }}
            whileTap={{ scale: 0.96 }}
            className="text-[13px] px-4 py-2 rounded-full border border-surface-line bg-surface/60 backdrop-blur-sm text-ink-soft hover:border-pine/50 hover:text-pine hover:bg-pine/5 transition-all duration-200"
          >
            {p}
          </motion.button>
        ))}
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduced ? { duration: 0.01 } : { delay: 1.0, duration: 0.6 }}
        className="mt-16 flex items-center gap-10 sm:gap-16 flex-wrap justify-center"
      >
        {STATS.map(({ value: v, suffix, label, decimals }, i) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <CountUp end={v} suffix={suffix} decimals={decimals ?? 0} />
            <span className="text-[11px] uppercase tracking-wider text-sage font-mono">{label}</span>
          </div>
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-ink-soft/40"
      >
        <span className="text-[10px] uppercase tracking-widest font-mono">Scroll</span>
        <motion.div
          animate={reduced ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
