import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { formatDateTime } from "@/lib/utils";

export default function PublicBookingSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const booking = state?.booking;
  const doctor = state?.doctor;

  if (!booking || !doctor) {
    return (
      <div className="p-6 text-black dark:text-white">
        Missing booking details.
        <button className="underline ml-2" onClick={() => navigate("/public")}>
          Go home
        </button>
      </div>
    );
  }

  return (
    <div className="page-container page-fade text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1.1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="
          mx-auto mb-8 mt-10 h-20 w-20 rounded-full flex items-center justify-center
          bg-emerald-500/20 dark:bg-emerald-500/10 border border-emerald-500/40
        "
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="text-4xl text-emerald-500"
        >
          ✓
        </motion.div>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-black dark:text-white"
      >
        Booking Confirmed!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mt-3 text-black/60 dark:text-white/70 max-w-md mx-auto"
      >
        Your appointment has been successfully scheduled.  
        A doctor somewhere just whispered <i>“nice.”</i>
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="
          mt-10 mb-12 p-6 mx-auto max-w-md rounded-2xl
          bg-white/70 dark:bg-white/5 backdrop-blur-xl
          border border-black/5 dark:border-white/10 shadow
          text-left space-y-3
        "
      >
        <div className="text-lg font-semibold text-black dark:text-white">
          Appointment Details
        </div>

        <div className="text-black/70 dark:text-white/60">
          <strong>Doctor:</strong> {doctor.name}
        </div>

        <div className="text-black/70 dark:text-white/60">
          <strong>Specialization:</strong> {doctor.specialization || "General Medicine"}
        </div>

        <div className="text-black/70 dark:text-white/60">
          <strong>When:</strong> {formatDateTime(booking.start_time)}
        </div>

        <div className="text-black/70 dark:text-white/60">
          <strong>Status:</strong> {booking.status}
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="flex flex-col items-center gap-4 mb-16"
      >
        <button
          onClick={() => navigate("/public/my-bookings")}
          className="
            px-8 py-3 rounded-xl font-semibold text-white
            bg-gradient-to-r from-emerald-400 to-sky-400
            hover:opacity-90 active:scale-[0.97] transition
          "
        >
          View My Bookings
        </button>

        <button
          onClick={() => navigate("/public/doctors")}
          className="text-sm underline text-black/60 dark:text-white/60"
        >
          Book Another Appointment
        </button>
      </motion.div>
    </div>
  );
}