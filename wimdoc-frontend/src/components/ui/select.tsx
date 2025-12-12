import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface Option {
  label: string;
  value: string | number;
}

interface SelectProps {
  value: string | number | undefined;
  onChange: (val: string | number) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
}

export function Select({
  value,
  onChange,
  options,
  placeholder = "Select…",
  className,
}: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  // Close when clicking outside
  React.useEffect(() => {
    const handle = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handle);
    return () => document.removeEventListener("click", handle);
  }, []);

  const selected = options.find((opt) => opt.value === value);

  return (
    <div
      ref={ref}
      className={cn("relative w-full text-sm", className)}
    >
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="
          w-full px-3 py-2 rounded-lg flex items-center justify-between
          bg-white dark:bg-white/10
          text-black dark:text-white
          border border-black/10 dark:border-white/10
          hover:bg-black/5 dark:hover:bg-white/20
          transition
        "
      >
        <span className={selected ? "" : "text-black/40 dark:text-white/40"}>
          {selected ? selected.label : placeholder}
        </span>

        <ChevronDown
          size={16}
          className={cn(
            "transition",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="
              absolute left-0 right-0 mt-2 z-40
              rounded-lg overflow-hidden shadow-lg
              backdrop-blur-xl
              bg-white/80 dark:bg-black/40
              border border-black/10 dark:border-white/10
            "
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className="
                  w-full text-left px-3 py-2 text-sm
                  hover:bg-black/5 dark:hover:bg-white/10
                  text-black dark:text-white transition
                "
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}