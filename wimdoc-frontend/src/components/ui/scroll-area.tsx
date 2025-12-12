import * as React from "react";
import { cn } from "@/lib/utils";

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ScrollArea({ className, children, ...props }: ScrollAreaProps) {
  return (
    <div
      className={cn(
        `
        relative overflow-y-auto
        scrollbar-thin
        scrollbar-thumb-black/20 dark:scrollbar-thumb-white/20
        scrollbar-track-transparent
        hover:scrollbar-thumb-black/30 dark:hover:scrollbar-thumb-white/30
        transition
      `,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}