import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { UserCircle2, Trash2, Calendar } from "lucide-react";

type Doctor = {
  id: number;
  name: string;
  specialization?: string | null;
};

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get("/doctors");
        setDoctors(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function deleteDoctor(id: number) {
    if (!confirm("Delete this doctor permanently?")) return;

    try {
      await api.delete(`/doctors/${id}`);
      setDoctors((prev) => prev.filter((d) => d.id !== id));
    } catch (err: any) {
      alert(err?.message || "Failed to delete the doctor.");
    }
  }

  return (
    <div className="page-container page-fade">
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between mt-4 mb-8">
        <h1 className="text-2xl font-bold text-black dark:text-white">
          Doctors
        </h1>

        <button
          onClick={() => navigate("/create-doctor")}
          className="
            px-6 py-2 rounded-xl text-white font-semibold
            bg-gradient-to-r from-emerald-400 to-sky-400
            hover:opacity-90 active:scale-[0.97] transition
          "
        >
          Add Doctor
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-black dark:text-white">Loading doctors…</div>
      )}

      {/* EMPTY STATE */}
      {!loading && doctors.length === 0 && (
        <div className="text-black/60 dark:text-white/60">
          No doctors available. Add one to get started.
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {doctors.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: index * 0.05 }}
              className="
                p-6 rounded-2xl backdrop-blur-xl shadow
                bg-white/70 dark:bg-white/5
                border border-black/5 dark:border-white/10
              "
            >
              {/* HEADER */}
              <div className="flex items-center gap-4">
                <div
                  className="
                    h-14 w-14 rounded-full flex items-center justify-center
                    bg-gradient-to-br from-emerald-400 to-sky-400 text-white shadow
                  "
                >
                  <UserCircle2 size={32} />
                </div>

                <div>
                  <div className="text-lg font-semibold text-black dark:text-white">
                    {doc.name}
                  </div>
                  <div className="text-sm text-black/60 dark:text-white/60">
                    {doc.specialization || "General Medicine"}
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => navigate(`/doctors/${doc.id}/schedule`)}
                  className="
                    flex items-center gap-2 flex-1 justify-center px-4 py-2 rounded-lg
                    bg-emerald-500/10 text-emerald-600 dark:text-emerald-300
                    hover:bg-emerald-500/20 transition
                  "
                >
                  <Calendar size={16} />
                  Manage Slots
                </button>

                <button
                  onClick={() => deleteDoctor(doc.id)}
                  className="
                    flex items-center gap-2 justify-center px-4 py-2 rounded-lg flex-1
                    bg-rose-500/10 text-rose-600 dark:text-rose-300
                    hover:bg-rose-500/20 transition
                  "
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
