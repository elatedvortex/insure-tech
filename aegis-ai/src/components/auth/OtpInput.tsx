"use client";

import { useRef, useState, useEffect } from "react";

export function OtpInput({
  length = 6,
  onComplete,
}: {
  length?: number;
  onComplete: (code: string) => void;
}) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  function setDigit(i: number, digit: string) {
    const next = [...values];
    next[i] = digit;
    setValues(next);
    if (digit && i < length - 1) refs.current[i + 1]?.focus();
    if (next.every((d) => d !== "")) onComplete(next.join(""));
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !values[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(length).fill("");
    pasted.split("").forEach((d, i) => (next[i] = d));
    setValues(next);
    const lastIndex = Math.min(pasted.length, length) - 1;
    refs.current[lastIndex]?.focus();
    if (pasted.length === length) onComplete(pasted);
  }

  return (
    <div className="flex gap-2.5 justify-center">
      {values.map((v, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={v}
          onChange={(e) => {
            const digit = e.target.value.replace(/\D/g, "").slice(-1);
            setDigit(i, digit);
          }}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          inputMode="numeric"
          maxLength={1}
          aria-label={`Digit ${i + 1}`}
          className="w-11 h-11 sm:w-12 sm:h-14 text-center text-xl font-mono rounded-xl border border-surface-line bg-paper text-ink focus:outline-none focus:border-pine transition-colors"
        />
      ))}
    </div>
  );
}
