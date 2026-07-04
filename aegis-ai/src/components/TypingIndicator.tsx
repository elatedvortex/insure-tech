import { Presence } from "./Presence";

export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 rounded-full bg-surface border border-surface-line flex items-center justify-center shrink-0">
        <Presence size="sm" active />
      </div>
      <div className="flex items-center gap-1 pt-2.5">
        <span className="w-1.5 h-1.5 rounded-full bg-sage animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-sage animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-sage animate-bounce" />
      </div>
    </div>
  );
}
