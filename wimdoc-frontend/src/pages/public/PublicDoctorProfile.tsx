import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { motion } from "framer-motion";

type Doctor = {
  id: number;
  name: string;
  specialization?: string | null;
  bio?: string | null;
};

export default function PublicDoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  // ---------------------------------------------------------------------------
  // LOAD DOCTOR
  // ---------------------------------------------------------------------------
  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const all = await api.get("/doctors");
        const match = all.find((d: Doctor) => d.id === Number(id));

        if (mounted) setDoctor(match || null);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false };
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 text-black dark:text-white">
        Loading doctor profile…
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="p-6 text-black dark:text-white">
        Doctor not found.
        <button
          className="ml-2 underline"
          onClick={() => navigate("/public/doctors")}
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="page-container page-fade">

      {/* HEADER / HERO */}
      <div className="relative mb-12 pt-10 pb-16 rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-300/30 to-sky-300/20 dark:from-emerald-500/10 dark:to-sky-500/10 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow">

        {/* FLOATING BLOB */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.1, opacity: 0.4 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute -top-20 -left-16 h-64 w-64 rounded-full bg-emerald-400/40 blur-3xl"
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ delay: 0.2, duration: 1.2 }}
          className="absolute -bottom-16 -right-20 h-72 w-72 rounded-full bg-sky-400/40 blur-3xl"
        />

        {/* CONTENT */}
        <div className="relative px-8 text-center">

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-black dark:text-white"
          >
            {doctor.name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-black/70 dark:text-white/60 mt-2 text-lg"
          >
            {doctor.specialization || "General Medicine"}
          </motion.div>

        </div>
      </div>

      {/* DETAILS */}
      <div className="max-w-2xl mx-auto text-center mb-12 px-4">

        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-black/70 dark:text-white/70 leading-relaxed"
        >
          {doctor.bio ||
            "This doctor has no official bio yet. But they probably save lives, drink coffee, and say 'just relax' before doing something painful."}
        </motion.p>

        {/* CTA */}
        <motion.button
          onClick={() => navigate(`/public/doctors/${doctor.id}/slots`)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="
            mt-8 px-8 py-3 rounded-xl font-semibold text-white
            bg-gradient-to-r from-emerald-400 to-sky-400
            hover:opacity-90 transition active:scale-[0.97]
          "
        >
          View Available Slots
        </motion.button>
      </div>
    </div>
  );
}
