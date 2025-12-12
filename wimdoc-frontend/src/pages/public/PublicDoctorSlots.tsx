import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type Slot = {
  id: number;
  doctor_id: number;
  start_time: string;
  end_time: string;
  is_booked: boolean;
};

type Doctor = {
  id: number;
  name: string;
  specialization?: string | null;
};

export default function PublicDoctorSlots() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);

  // ---------------------------------------------------------------------------
  // LOAD DOCTOR + SLOTS
  // ---------------------------------------------------------------------------
  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const docs = await api.get("/doctors");
        const found = docs.find((x: any) => x.id === Number(id));
        if (mounted) setDoctor(found || null);

        const slotData = await api.get(`/slots?doctor_id=${id}`);
        if (mounted) setSlots(slotData || []);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false };
  }, [id]);

  // ---------------------------------------------------------------------------
  // UI
  // ---------------------------------------------------------------------------
  if (loading) {
    return <div className="p-6 text-black dark:text-white">Loading slots…</div>;
  }

  if (!doctor) {
    return (
      <div className="p-6 text-black dark:text-white">
        Doctor not found.
        <button className="ml-2 underline" onClick={() => navigate("/public/doctors")}>
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="page-container page-fade">
      {/* HEADER */}
      <div className="text-center mt-6 mb-10">
        <h1 className="text-2xl font-bold text-black dark:text-white">
          Available Slots for {doctor.name}
        </h1>
        <p className="text-black/60 dark:text-white/60 mt-1">
          {doctor.specialization || "General Medicine"}
        </p>
      </div>

      {/* EMPTY */}
      {!loading && slots.length === 0 && (
        <div className="text-center p-10 text-black/60 dark:text-white/60">
          No slots available.
          <div className="text-xs mt-1">
            (Maybe the doctor is busy saving the world. Try later!)
          </div>
        </div>
      )}

      {/* SLOTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-10">
        <AnimatePresence>
          {slots.map((slot, index) => (
            <motion.div
              key={slot.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                p-5 rounded-2xl backdrop-blur-xl shadow
                border border-black/5 dark:border-white/10
                ${slot.is_booked
                  ? "bg-rose-200/40 dark:bg-rose-500/10"
                  : "bg-white/70 dark:bg-white/5"
                }
                cursor-pointer transition hover:scale-[1.02]
              `}
              onClick={() => {
                if (!slot.is_booked) {
                  navigate("/public/confirm-booking", {
                    state: { slotId: slot.id, doctor }
                  });
                }
              }}
            >
              <div className="font-semibold text-black dark:text-white">
                {formatDateTime(slot.start_time)}
              </div>

              <div className="text-sm text-black/60 dark:text-white/60 mt-1">
                Ends {formatDateTime(slot.end_time)}
              </div>

              {slot.is_booked ? (
                <div className="mt-2 text-rose-600 dark:text-rose-400 text-xs font-medium">
                  Booked
                </div>
              ) : (
                <div className="mt-2 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                  Available — tap to book
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}