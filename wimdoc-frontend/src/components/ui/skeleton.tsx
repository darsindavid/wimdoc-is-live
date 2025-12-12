import { cn } from "@/lib/utils";
import React from "react";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        `
        relative overflow-hidden 
        rounded-lg bg-black/10 dark:bg-white/10 
        animate-pulse
      `,
        className
      )}
    />
  );
}