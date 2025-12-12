import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "success"
    | "warning"
    | "destructive"
    | "subtle"
    | "outline";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const base =
    "inline-flex items-center px-3 py-[3px] text-xs font-medium rounded-full transition select-none";

  const variants: Record<string, string> = {
    default:
      "bg-black/10 dark:bg-white/10 text-black dark:text-white",

    success:
      "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20",

    warning:
      "bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/20",

    destructive:
      "bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/20",

    subtle:
      "bg-black/5 dark:bg-white/10 text-black/70 dark:text-white/70",

    outline:
      "border border-black/20 dark:border-white/20 text-black dark:text-white",
  };

  return (
    <div className={cn(base, variants[variant], className)} {...props} />
  );
}