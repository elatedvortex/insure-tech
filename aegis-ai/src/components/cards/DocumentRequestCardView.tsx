"use client";

import { useRef, useState } from "react";
import { DocumentRequestCard } from "@/lib/types";
import { FileText, Upload, Check } from "lucide-react";

export function DocumentRequestCardView({ card }: { card: DocumentRequestCard }) {
  const [uploaded, setUploaded] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeDoc, setActiveDoc] = useState<string | null>(null);

  function trigger(doc: string) {
    setActiveDoc(doc);
    inputRef.current?.click();
  }

  function handleFile() {
    if (activeDoc) {
      setUploaded((prev) => new Set(prev).add(activeDoc));
    }
  }

  return (
    <div className="rounded-2xl border border-surface-line bg-surface/60 p-5 max-w-md">
      <p className="text-xs text-ink-soft mb-4">{card.reason}</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={handleFile}
      />
      <div className="space-y-2">
        {card.documents.map((doc) => {
          const done = uploaded.has(doc);
          return (
            <button
              key={doc}
              onClick={() => trigger(doc)}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-paper/70 border border-surface-line hover:border-pine transition-colors text-left"
            >
              <div
                className={
                  done
                    ? "w-8 h-8 rounded-lg bg-pine flex items-center justify-center shrink-0"
                    : "w-8 h-8 rounded-lg bg-surface flex items-center justify-center shrink-0"
                }
              >
                {done ? (
                  <Check className="w-4 h-4 text-paper" />
                ) : (
                  <FileText className="w-4 h-4 text-sage" />
                )}
              </div>
              <span className="text-sm text-ink flex-1">{doc}</span>
              {!done && <Upload className="w-3.5 h-3.5 text-sage" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
