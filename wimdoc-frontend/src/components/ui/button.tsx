import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "subtle";
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", loading, disabled, children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-xl font-medium transition active:scale-[0.97] focus:outline-none";

    const variants: Record<string, string> = {
      default:
        "text-white bg-gradient-to-r from-emerald-400 to-sky-400 hover:opacity-90 shadow-md",

      outline:
        "border border-black/10 dark:border-white/20 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10",

      ghost:
        "text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10",

      destructive:
        "text-white bg-rose-500 hover:bg-rose-600 shadow",

      subtle:
        "text-black/80 dark:text-white/80 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20",
    };

    const padding = "px-4 py-2";

    const finalClass = cn(
      base,
      padding,
      variants[variant],
      disabled || loading ? "opacity-50 cursor-not-allowed" : "",
      className
    );

    return (
      <button ref={ref} className={finalClass} disabled={disabled || loading} {...props}>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
