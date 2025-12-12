import React, { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { cn, formatDateTime, rid } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type Slot = {
  id: number;
  doctor_id: number;
  doctor_name?: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
};

export default function Slots() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [bookedFilter, setBookedFilter] = useState<"all" | "booked" | "free">("all");
  const [doctorFilter, setDoctorFilter] = useState<number | "all">("all");

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const data = await api.get("/slots");
        if (mounted) setSlots(data || []);
      } catch (err: any) {
        setError(err?.message || "Failed to load slots.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false };
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Delete this slot?")) return;
    try {
      await api.delete(`/slots/${id}`);
      setSlots((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      alert(err?.message || "Failed to delete slot.");
    }
  }

  const doctorList = useMemo(() => {
    const map = new Map<number, string>();
    slots.forEach((s) => {
      if (s.doctor_id && s.doctor_name) {
        map.set(s.doctor_id, s.doctor_name);
      }
    });
    return Array.from(map.entries());
  }, [slots]);

  const filtered = useMemo(() => {
    return slots.filter((s) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        s.doctor_name?.toLowerCase().includes(q) ||
        s.start_time.toLowerCase().includes(q) ||
        s.end_time.toLowerCase().includes(q);

      const matchesBooked =
        bookedFilter === "all" ||
        (bookedFilter === "booked" && s.is_booked) ||
        (bookedFilter === "free" && !s.is_booked);

      const matchesDoctor =
        doctorFilter === "all" || s.doctor_id === doctorFilter;

      return matchesSearch && matchesBooked && matchesDoctor;
    });
  }, [slots, search, doctorFilter, bookedFilter]);

  return (
    <div className="page-container page-fade">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">
            All Slots
          </h1>
          <p className="text-sm text-black/60 dark:text-white/60 mt-1">
            Every appointment slot in one place — admin superpowers unlocked 🔮
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Search */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search doctor, time, date…"
          className="p-3 rounded-lg bg-white dark:bg-white/10 border border-black/10 dark:border-white/10"
        />

        {/* Doctor Filter */}
        <select
          value={doctorFilter}
          onChange={(e) =>
            setDoctorFilter(e.target.value === "all" ? "all" : Number(e.target.value))
          }
          className="p-3 rounded-lg bg-white dark:bg-white/10 border border-black/10 dark:border-white/10"
        >
          <option value="all">All Doctors</option>
          {doctorList.map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>

        {/* Booked Filter */}
        <select
          value={bookedFilter}
          onChange={(e) => setBookedFilter(e.target.value as any)}
          className="p-3 rounded-lg bg-white dark:bg-white/10 border border-black/10 dark:border-white/10"
        >
          <option value="all">All Slots</option>
          <option value="booked">Booked</option>
          <option value="free">Available</option>
        </select>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-black dark:text-white">Loading slots…</div>
      )}

      {/* ERROR */}
      {error && (
        <div className="text-sm text-rose-600 mb-4">{error}</div>
      )}

      {/* EMPTY */}
      {!loading && filtered.length === 0 && (
        <div
          className="
            p-8 rounded-2xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10
            text-center text-black/60 dark:text-white/60
          "
        >
          No slots match your search or filters.
        </div>
      )}

      {/* SLOTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <AnimatePresence>
          {filtered.map((slot) => (
            <motion.div
              key={slot.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="
                p-5 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-xl
                border border-black/5 dark:border-white/10 shadow
                flex justify-between items-center
              "
            >
              <div>
                <div className="font-semibold text-black dark:text-white">
                  {slot.doctor_name || "Unknown Doctor"}
                </div>

                <div className="text-sm text-black/60 dark:text-white/60 mt-1">
                  {formatDateTime(slot.start_time)}
                </div>

                <div className="text-xs mt-1">
                  {slot.is_booked ? (
                    <span className="text-emerald-600 dark:text-emerald-400">
                      ✓ Booked
                    </span>
                  ) : (
                    <span className="text-sky-600 dark:text-sky-400">
                      • Available
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleDelete(slot.id)}
                className="
                  px-4 py-2 rounded-lg
                  bg-rose-500/10 text-rose-600 dark:text-rose-300
                  hover:bg-rose-500/20 transition
                "
              >
                Delete
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}