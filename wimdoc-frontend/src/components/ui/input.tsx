import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          `
          w-full px-3 py-2 rounded-lg text-sm
          bg-white dark:bg-white/10
          text-black dark:text-white
          border border-black/10 dark:border-white/10
          placeholder:text-black/40 dark:placeholder:white/40

          focus:outline-none focus:ring-2 
          focus:ring-emerald-400 dark:focus:ring-emerald-500

          transition
        `,
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";