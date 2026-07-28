"use client";

import { motion } from "framer-motion";
import { ChatMessage } from "@/lib/types";
import { CardRenderer } from "./cards/CardRenderer";
import { Presence } from "./Presence";

export function MessageBubble({
  message,
  onQuickReply,
}: {
  message: ChatMessage;
  onQuickReply: (text: string) => void;
}) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`flex gap-4 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {!isUser && (
        <div className="w-10 h-10 rounded-2xl bg-surface border border-surface-line flex items-center justify-center shrink-0 mt-1 shadow-sm">
          <Presence size="sm" />
        </div>
      )}
      <div className={`flex flex-col gap-3 max-w-[85%] sm:max-w-[72%] ${isUser ? "items-end" : "items-start"}`}>
        {message.text && (
          <div
            className={
              isUser
                ? "rounded-[24px] rounded-tr-md bg-pine text-paper px-5 py-3 text-sm sm:text-[15px] leading-relaxed shadow-[0_10px_30px_-22px_rgba(37,99,235,0.35)]"
                : "rounded-[24px] bg-surface border border-surface-line px-5 py-3 text-ink text-sm sm:text-[15px] leading-relaxed shadow-[0_10px_30px_-24px_rgba(15,23,42,0.08)]"
            }
          >
            {message.text}
          </div>
        )}

        {message.cards?.map((card, i) => (
          <CardRenderer key={i} card={card} />
        ))}

        {message.quickReplies && message.quickReplies.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {message.quickReplies.map((qr) => (
              <button
                key={qr}
                onClick={() => onQuickReply(qr)}
                className="text-xs sm:text-sm px-3.5 py-2 rounded-full border border-surface-line bg-paper text-ink-soft hover:border-pine hover:text-pine transition-colors"
              >
                {qr}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
