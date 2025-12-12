import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

type Doctor = {
  id: number;
  name: string;
  specialization?: string | null;
  bio?: string | null;
};

export default function PublicDoctors() {
  const navigate = useNavigate();
  const location = useLocation();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  const query = new URLSearchParams(location.search);
  const departmentFilter = query.get("department");

  // ---------------------------------------------------------------------------
  // LOAD DOCTORS
  // ---------------------------------------------------------------------------
  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const list = await api.get("/doctors");
        if (mounted) setDoctors(list || []);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false };
  }, []);

  // ---------------------------------------------------------------------------
  // FILTERING
  // ---------------------------------------------------------------------------
  const filtered = useMemo(() => {
    if (!departmentFilter) return doctors;
    return doctors.filter((d) =>
      (d.specialization || "").toLowerCase() === departmentFilter.toLowerCase()
    );
  }, [doctors, departmentFilter]);

  // ---------------------------------------------------------------------------
  // UI
  // ---------------------------------------------------------------------------
  return (
    <div className="page-container page-fade">

      {/* HEADER */}
      <div className="text-center mt-6 mb-10">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Our Doctors
        </h1>

        {departmentFilter && (
          <p className="text-black/60 dark:text-white/60 mt-2">
            Showing specialists in <span className="font-medium">{departmentFilter}</span>
          </p>
        )}
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center text-black dark:text-white">Loading doctors…</div>
      )}

      {/* EMPTY */}
      {!loading && filtered.length === 0 && (
        <div className="text-center text-black/60 dark:text-white/60 p-10">
          No doctors found for this department.  
          <br />
          <span className="text-sm">
            (Translation: Everyone in this department is currently overbooked or hiding.)
          </span>
        </div>
      )}

      {/* DOCTOR CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
        <AnimatePresence>
          {filtered.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/public/doctors/${doc.id}`)}
              className="
                p-6 rounded-2xl cursor-pointer
                bg-white/70 dark:bg-white/5 backdrop-blur-xl
                border border-black/5 dark:border-white/10 shadow
                hover:scale-[1.02] transition
                flex flex-col gap-3
              "
            >
              <div className="text-xl font-semibold text-black dark:text-white">
                {doc.name}
              </div>

              <div className="text-sm text-black/60 dark:text-white/60">
                {doc.specialization || "General Medicine"}
              </div>

              <div className="text-xs text-black/40 dark:text-white/40 leading-relaxed line-clamp-3">
                {doc.bio || "This doctor is mysterious. Their bio has not been written yet."}
              </div>

              <div className="mt-3 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                View Profile →
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}