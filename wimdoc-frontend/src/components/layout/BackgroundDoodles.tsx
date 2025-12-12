// src/components/layout/BackgroundDoodles.tsx
import { motion } from "framer-motion";
import React from "react";

export function BackgroundDoodles() {
  return (
    <div
      className="
        fixed inset-0 
        -z-20          /* behind premium-bg but still visible */
        pointer-events-none 
        overflow-hidden
      "
    >
      {/* TOP LEFT BLOB */}
      <motion.div
        className="
          absolute -top-32 -left-20 h-80 w-80 rounded-full 
          bg-emerald-400/20 dark:bg-emerald-500/10 blur-3xl
        "
        animate={{ y: [0, 20, -10, 0], x: [0, -10, 5, 0] }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* BOTTOM RIGHT BLOB */}
      <motion.div
        className="
          absolute bottom-0 right-0 h-96 w-96 rounded-full
          bg-sky-400/20 dark:bg-sky-500/10 blur-3xl
        "
        animate={{ y: [0, -25, 10, 0], x: [0, 10, -5, 0] }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* MID PINK BLOB */}
      <motion.div
        className="
          absolute top-1/3 right-1/4 h-64 w-64 rounded-full
          bg-pink-400/20 dark:bg-pink-500/10 blur-3xl
        "
        animate={{ y: [0, 15, -12, 0] }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* SPARKLE TOP RIGHT */}
      <motion.div
        className="absolute top-10 right-10 text-emerald-400/70 dark:text-emerald-300/60 text-xl"
        animate={{
          y: [0, -6, 4, 0],
          rotate: [0, -5, 5, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        ✨
      </motion.div>

      {/* STETHOSCOPE EMOJI FLOATING */}
      <motion.div
        className="absolute bottom-16 left-10 text-sky-400/70 dark:text-sky-300/60 text-xl"
        animate={{
          y: [0, 5, -5, 0],
          rotate: [0, 3, -3, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🩺
      </motion.div>

      {/* HEALTH HEART ICON */}
      <motion.div
        className="absolute top-1/2 left-12 text-pink-400/70 dark:text-pink-300/60 text-xl"
        animate={{
          y: [0, -8, 5, 0],
          rotate: [0, -4, 4, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        ❤️
      </motion.div>
    </div>
  );
}

export default BackgroundDoodles;
