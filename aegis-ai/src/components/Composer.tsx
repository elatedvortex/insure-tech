"use client";

import { useRef, useState } from "react";
import { ArrowUp, Mic, Paperclip, X } from "lucide-react";

export function Composer({
  onSend,
  disabled,
}: {
  onSend: (text: string, files?: File[]) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [listening, setListening] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  function submit() {
    if (!value.trim() && files.length === 0) return;
    onSend(value.trim(), files);
    setValue("");
    setFiles([]);
    if (textRef.current) textRef.current.style.height = "auto";
  }

  function handleMic() {
    setListening(true);
    setTimeout(() => {
      setListening(false);
      textRef.current?.focus();
    }, 1400);
  }

  return (
    <div className="border-t border-surface-line/60 bg-paper/90 backdrop-blur-xl px-4 sm:px-6 py-4">
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2 max-w-3xl mx-auto">
          {files.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-xs bg-surface border border-surface-line rounded-full pl-3 pr-1.5 py-1"
            >
              <span className="text-ink-soft max-w-[140px] truncate">{f.name}</span>
              <button
                onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                className="w-4 h-4 rounded-full bg-surface-line flex items-center justify-center"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="max-w-3xl mx-auto flex items-end gap-2 rounded-3xl bg-surface/70 border border-surface-line px-3 py-2">
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => setFiles((prev) => [...prev, ...Array.from(e.target.files || [])])}
        />
        <button
          onClick={() => fileRef.current?.click()}
          aria-label="Attach a file"
          className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-sage hover:text-pine transition-colors"
        >
          <Paperclip className="w-4 h-4" />
        </button>
        <textarea
          ref={textRef}
          rows={1}
          value={value}
          disabled={disabled}
          onChange={(e) => {
            setValue(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Message Aegis..."
          className="flex-1 resize-none bg-transparent py-2 text-sm sm:text-[15px] placeholder:text-sage/70 focus:outline-none max-h-32 disabled:opacity-50"
        />
        <button
          onClick={handleMic}
          aria-label="Speak instead of typing"
          className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center transition-colors ${
            listening ? "bg-clay text-paper" : "text-sage hover:text-pine"
          }`}
        >
          <Mic className="w-4 h-4" />
        </button>
        <button
          onClick={submit}
          disabled={disabled || (!value.trim() && files.length === 0)}
          aria-label="Send message"
          className="w-9 h-9 shrink-0 rounded-full bg-pine text-paper flex items-center justify-center transition-transform hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>
      <p className="text-center text-[11px] text-sage mt-2 font-mono">
        Aegis can make mistakes. Recommendations are guidance, not a binding quote.
      </p>
    </div>
  );
}
