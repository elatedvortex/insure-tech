"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp } from "lucide-react";
import { Presence } from "../Presence";

export function QuickAsk() {
  const [value, setValue] = useState("");
  const router = useRouter();

  function go() {
    if (!value.trim()) return;
    router.push(`/advisor?q=${encodeURIComponent(value.trim())}`);
  }

  return (
    <div className="sticky bottom-4 sm:bottom-6 mt-10">
      <div className="max-w-2xl mx-auto rounded-full bg-surface/90 backdrop-blur-xl border border-surface-line shadow-[0_8px_30px_-10px_rgba(11,15,19,0.25)] px-3 py-2 flex items-center gap-2">
        <Presence size="sm" className="ml-1.5" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && go()}
          placeholder="Ask Aegis anything..."
          className="flex-1 bg-transparent text-sm py-2 placeholder:text-sage/70 focus:outline-none"
        />
        <button
          onClick={go}
          disabled={!value.trim()}
          aria-label="Send"
          className="w-9 h-9 rounded-full bg-pine text-paper flex items-center justify-center transition-transform hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 shrink-0"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
