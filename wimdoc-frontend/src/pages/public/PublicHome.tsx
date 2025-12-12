import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function PublicHome() {
  const navigate = useNavigate();

  const departments = [
    "Cardiology",
    "Dermatology",
    "Pediatrics",
    "Neurology",
    "Orthopedics",
    "General Medicine",
  ];

  return (
    <div className="page-container page-fade">

      <div className="text-center max-w-2xl mx-auto mt-10 mb-10">

        {/* MAIN HERO TEXT */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-black dark:text-white"
        >
          Feeling a little <span className="text-emerald-500">human</span> today?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mt-4 text-black/60 dark:text-white/70 leading-relaxed"
        >
          Book appointments with doctors who (hopefully) won’t judge you
          for Googling your symptoms at 3 AM.
        </motion.p>

        {/* CTA BUTTON */}
        <motion.button
          onClick={() => navigate("/public/doctors")}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="
            mt-8 px-8 py-3 rounded-xl font-semibold text-white
            bg-gradient-to-r from-emerald-400 to-sky-400
            hover:opacity-90 transition active:scale-[0.97]
          "
        >
          Browse Doctors
        </motion.button>
      </div>

      <div className="max-w-xl mx-auto mb-16 grid grid-cols-2 sm:grid-cols-3 gap-4">

        {departments.map((dep, index) => (
          <motion.div
            key={dep}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="
              p-4 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-xl
              border border-black/5 dark:border-white/10 shadow-sm
              text-center cursor-pointer select-none
              hover:scale-[1.03] transition
            "
            onClick={() =>
              navigate(`/public/doctors?department=${encodeURIComponent(dep)}`)
            }
          >
            <div className="font-medium text-black dark:text-white">{dep}</div>
            <div className="text-xs text-black/50 dark:text-white/40 mt-1">
              Explore specialists
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="text-center text-xs text-black/40 dark:text-white/30"
      >
        Made with questionable life choices and coffee.
      </motion.div>
    </div>
  );
}