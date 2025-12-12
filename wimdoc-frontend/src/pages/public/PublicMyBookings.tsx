import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { formatDateTime } from "@/lib/utils";

type Booking = {
  id: number;
  doctor_name: string;
  doctor_id: number;
  user_email: string;
  user_name: string;
  start_time: string;
  end_time: string;
  status: "PENDING" | "CONFIRMED" | "FAILED";
};

export default function PublicMyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const email = localStorage.getItem("wimdoc:user_email") || null;

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const all = await api.get("/bookings");
        const mine = all.filter((b: Booking) => b.user_email === email);

        if (mounted) setBookings(mine);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false };
  }, [email]);

  async function cancelBooking(id: number) {
    if (!confirm("Cancel this booking?")) return;

    try {
      await api.delete(`/bookings/${id}`);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      alert(err?.message || "Failed to cancel booking.");
    }
  }

  function badgeColor(status: string) {
    switch (status) {
      case "CONFIRMED":
        return "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10";
      case "FAILED":
        return "text-rose-600 dark:text-rose-400 bg-rose-500/10";
      default:
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-500/10";
    }
  }

  if (!email) {
    return (
      <div className="p-6 text-black dark:text-white">
        No email found — please make a booking first.
      </div>
    );
  }

  return (
    <div className="page-container page-fade">
      <div className="text-center mt-6 mb-8">
        <h1 className="text-2xl font-bold text-black dark:text-white">
          My Appointments
        </h1>
        <p className="text-black/60 dark:text-white/60 mt-1">
          Showing bookings for <strong>{email}</strong>
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center text-black dark:text-white">Loading…</div>
      )}

      {/* EMPTY STATE */}
      {!loading && bookings.length === 0 && (
        <div className="text-center text-black/60 dark:text-white/60 p-10">
          You haven't booked anything yet.
          <div className="text-xs mt-1">
            (Your calendar is as empty as my social life.)
          </div>
        </div>
      )}

      {/* BOOKINGS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-10">
        <AnimatePresence>
          {bookings.map((b, index) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: index * 0.05 }}
              className="
                p-5 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-xl
                border border-black/5 dark:border-white/10 shadow
              "
            >
              <div className="font-semibold text-black dark:text-white text-lg">
                {b.doctor_name}
              </div>

              <div className="text-sm text-black/60 dark:text-white/60 mt-1">
                {formatDateTime(b.start_time)}
              </div>

              <div
                className={`
                  inline-block mt-2 px-3 py-1 text-xs rounded-md font-medium
                  ${badgeColor(b.status)}
                `}
              >
                {b.status}
              </div>

              <button
                onClick={() => cancelBooking(b.id)}
                className="
                  mt-4 px-4 py-2 rounded-lg
                  bg-rose-500/10 text-rose-600 dark:text-rose-300
                  hover:bg-rose-500/20 transition
                "
              >
                Cancel
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}