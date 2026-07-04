"use client";

import { cn } from "@/lib/utils";

export function Presence({
  active = false,
  size = "md",
  className,
}: {
  active?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  return (
    <span className={cn("relative inline-flex items-center justify-center", className)}>
      <span
        className={cn(
          "absolute rounded-full bg-pine-bright blur-md animate-breathe",
          sizes[size],
          active && "scale-125"
        )}
        style={{ width: "300%", height: "300%" }}
      />
      <span
        className={cn(
          "relative rounded-full bg-pine-bright",
          sizes[size],
          active && "animate-pulse"
        )}
      />
    </span>
  );
}
