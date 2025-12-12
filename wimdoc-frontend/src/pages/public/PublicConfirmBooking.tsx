import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import { formatDateTime } from "@/lib/utils";

export default function PublicConfirmBooking() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const slotId = state?.slotId;
  const doctor = state?.doctor;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!slotId || !doctor) {
    return (
      <div className="p-6 text-black dark:text-white">
        Something went wrong — missing booking info.
        <button className="underline ml-2" onClick={() => navigate("/public")}>
          Go Home
        </button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim()) {
      setError("Please fill in your name and email.");
      return;
    }

    setLoading(true);

    try {
      const booking = await api.post("/bookings", {
        slot_id: slotId,
        user_name: name.trim(),
        user_email: email.trim(),
      });

      navigate("/public/booking-success", {
        state: {
          booking,
          doctor,
        },
      });
    } catch (err: any) {
      setError(err?.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container page-fade max-w-xl mx-auto">

      {/* HEADER */}
      <div className="text-center mt-6 mb-8">
        <h1 className="text-2xl font-bold text-black dark:text-white">
          Confirm Your Appointment
        </h1>
        <p className="text-black/60 dark:text-white/60 mt-2">
          You’re booking with <strong>{doctor.name}</strong>
        </p>
      </div>

      {/* SLOT SUMMARY BOX */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          p-6 mb-8 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-xl
          border border-black/5 dark:border-white/10 shadow
        "
      >
        <div className="font-semibold text-black dark:text-white text-lg">
          Appointment Details
        </div>

        <div className="mt-3 text-black/70 dark:text-white/60">
          <div><strong>Doctor:</strong> {doctor.name}</div>
          <div className="mt-1">
            <strong>Time:</strong>{" "}
            {formatDateTime(state?.startTime || doctor.start_time || "your selected slot")}
          </div>
        </div>
      </motion.div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="
          p-6 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-xl
          border border-black/5 dark:border-white/10 shadow space-y-6
        "
      >
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-black dark:text-white mb-1">
            Your Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Arjun Kumar"
            className="
              w-full p-3 rounded-lg
              bg-white dark:bg-white/10
              border border-black/10 dark:border-white/10
              focus:outline-none focus:ring-2 focus:ring-emerald-400
              transition
            "
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-black dark:text-white mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            placeholder="arjun@example.com"
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full p-3 rounded-lg
              bg-white dark:bg-white/10
              border border-black/10 dark:border-white/10
              focus:outline-none focus:ring-2 focus:ring-sky-400
              transition
            "
          />
        </div>

        {/* Error */}
        {error && <div className="text-sm text-rose-600">{error}</div>}

        {/* Submit */}
        <button
          disabled={loading}
          className={`
            w-full py-3 rounded-xl font-semibold text-white 
            bg-gradient-to-r from-emerald-400 to-sky-400
            hover:opacity-90 active:scale-[0.97] transition
            ${loading && "opacity-50 cursor-not-allowed"}
          `}
        >
          {loading ? "Booking…" : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
}