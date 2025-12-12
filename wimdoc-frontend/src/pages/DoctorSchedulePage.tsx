import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { formatDateTime, cn } from "@/lib/utils";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

type Doctor = {
  id: number;
  name: string;
  specialization?: string | null;
  bio?: string | null;
};

type Slot = {
  id: number;
  doctor_id: number;
  start_time: string;
  end_time: string;
  is_booked: boolean;
};

export default function DoctorSchedulePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);

  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(30);

  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    let mounted = true;

    async function load() {
      try {
        const doctors = await api.get("/doctors");
        const d = doctors.find((x: any) => x.id === Number(id));

        if (mounted) setDoctor(d || null);

        const slotRes = await api.get(`/slots?doctor_id=${id}`);
        if (mounted) setSlots(slotRes || []);
      } catch (err: any) {
        console.error(err);
        if (mounted) setError("Failed to load doctor or schedule.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  async function handleCreateSlot(e: React.FormEvent) {
    e.preventDefault();
    if (!startTime) {
      setError("Start time required.");
      return;
    }
    setError(null);
    setCreating(true);

    try {
      const start = new Date(startTime);
      const end = new Date(start.getTime() + duration * 60000);

      const created = await api.post("/slots", {
        doctor_id: Number(id),
        start_time: start.toISOString(),
        end_time: end.toISOString(),
      });

      setSlots((prev) => [...prev, created]);
      setStartTime("");
    } catch (err: any) {
      setError(err?.message || "Failed to create slot.");
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteSlot(slotId: number) {
    if (!confirm("Delete this slot?")) return;
    try {
      await api.delete(`/slots/${slotId}`);
      setSlots((prev) => prev.filter((s) => s.id !== slotId));
    } catch (err: any) {
      alert(err?.message || "Failed to delete slot.");
    }
  }
  if (loading) {
    return <div className="p-6 text-black dark:text-white">Loading doctor schedule…</div>;
  }

  if (!doctor) {
    return (
      <div className="p-6 text-black dark:text-white">
        Doctor not found.
        <button className="ml-3 underline" onClick={() => navigate("/doctors")}>
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="page-container page-fade max-w-3xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate("/doctors")}
          className="mb-3 underline text-black/60 dark:text-white/60"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold text-black dark:text-white">
          Schedule for {doctor.name}
        </h1>
        <div className="text-black/50 dark:text-white/40 mt-1">
          {doctor.specialization || "General"} — manage timings, availability, and vibes.
        </div>
      </div>
      <form
        onSubmit={handleCreateSlot}
        className="
          p-6 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-xl
          border border-black/5 dark:border-white/10 shadow-md mb-10 space-y-6
        "
      >
        <h2 className="text-lg font-semibold text-black dark:text-white">Create New Slot</h2>

        <div>
          <label className="block mb-1 text-sm font-medium text-black dark:text-white">
            Start Time
          </label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="
              w-full p-3 rounded-lg bg-white dark:bg-white/10
              border border-black/10 dark:border-white/10
              focus:outline-none focus:ring-2 focus:ring-emerald-400
            "
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-black dark:text-white">
            Duration (minutes)
          </label>
          <input
            type="number"
            min={5}
            step={5}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="
              w-full p-3 rounded-lg bg-white dark:bg-white/10
              border border-black/10 dark:border-white/10
              focus:outline-none focus:ring-2 focus:ring-purple-400
            "
          />
        </div>

        {error && <div className="text-sm text-rose-600">{error}</div>}

        <button
          disabled={creating}
          className={cn(
            "w-full py-3 rounded-xl font-semibold text-white",
            "bg-gradient-to-r from-emerald-400 to-sky-400 hover:opacity-90",
            "transition active:scale-[0.98]",
            creating && "opacity-50 cursor-not-allowed"
          )}
        >
          {creating ? "Creating…" : "Add Slot"}
        </button>
      </form>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-black dark:text-white mb-4">
          Existing Slots
        </h2>

        <AnimatePresence>
          {slots.map((slot) => (
            <motion.div
              key={slot.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="
                p-5 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-xl
                border border-black/5 dark:border-white/10 shadow flex items-center justify-between
              "
            >
              <div>
                <div className="font-semibold text-black dark:text-white">
                  {formatDateTime(slot.start_time)}
                </div>
                <div className="text-sm text-black/50 dark:text-white/40">
                  Ends {formatDateTime(slot.end_time)}
                </div>

                {slot.is_booked && (
                  <div className="text-xs mt-1 text-emerald-600 dark:text-emerald-400">
                    ✓ Booked
                  </div>
                )}
              </div>

              <button
                onClick={() => handleDeleteSlot(slot.id)}
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

        {slots.length === 0 && (
          <div className="text-black/50 dark:text-white/50 text-sm">
            No slots created yet. Time to make this doctor productive.
          </div>
        )}
      </div>
    </div>
  );
}