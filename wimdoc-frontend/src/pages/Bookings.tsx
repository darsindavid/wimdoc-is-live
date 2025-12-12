import React, { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { cn, formatDateTime } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type Booking = {
  id: number;
  slot_id: number;
  doctor_id: number;
  doctor_name?: string;
  user_name?: string;
  user_email?: string;
  created_at: string;
  status: "PENDING" | "CONFIRMED" | "FAILED";
  start_time: string;
  end_time: string;
};

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "PENDING" | "CONFIRMED" | "FAILED">("all");
  const [doctorFilter, setDoctorFilter] = useState<number | "all">("all");

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const data = await api.get("/bookings");
        if (mounted) setBookings(data || []);
      } catch (err: any) {
        setError(err?.message || "Failed to load bookings.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false };
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Cancel/delete this booking?")) return;
    try {
      await api.delete(`/bookings/${id}`);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      alert(err?.message || "Failed to delete booking.");
    }
  }

  const doctorList = useMemo(() => {
    const map = new Map<number, string>();
    bookings.forEach((b) => {
      if (b.doctor_id && b.doctor_name) {
        map.set(b.doctor_id, b.doctor_name);
      }
    });
    return Array.from(map.entries());
  }, [bookings]);

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const q = search.trim().toLowerCase();

      const matchesSearch =
        !q ||
        b.doctor_name?.toLowerCase().includes(q) ||
        b.user_name?.toLowerCase().includes(q) ||
        b.user_email?.toLowerCase().includes(q) ||
        b.status.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "all" || b.status === statusFilter;

      const matchesDoctor =
        doctorFilter === "all" || b.doctor_id === doctorFilter;

      return matchesSearch && matchesStatus && matchesDoctor;
    });
  }, [bookings, search, doctorFilter, statusFilter]);

  function statusColor(status: Booking["status"]) {
    if (status === "CONFIRMED") return "text-emerald-600 dark:text-emerald-400";
    if (status === "FAILED") return "text-rose-600 dark:text-rose-400";
    return "text-yellow-600 dark:text-yellow-400"; // pending
  }

  function statusBadge(status: Booking["status"]) {
    if (status === "CONFIRMED") return "bg-emerald-500/10";
    if (status === "FAILED") return "bg-rose-500/10";
    return "bg-yellow-500/10";
  }

  return (
    <div className="page-container page-fade">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">All Bookings</h1>
          <p className="text-sm text-black/60 dark:text-white/60 mt-1">
            View and manage every booking in the system — yes, you are basically the CEO.
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

        {/* Search */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, doctor…"
          className="p-3 rounded-lg bg-white dark:bg-white/10 border border-black/10 dark:border-white/10"
        />

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="p-3 rounded-lg bg-white dark:bg-white/10 border border-black/10 dark:border-white/10"
        >
          <option value="all">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="FAILED">Failed</option>
        </select>

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
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-black dark:text-white">Loading bookings…</div>
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
          No bookings found for your filters.
        </div>
      )}

      {/* BOOKINGS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <AnimatePresence>
          {filtered.map((b) => (
            <motion.div
              key={b.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="
                p-5 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-xl
                border border-black/5 dark:border-white/10 shadow
                flex justify-between items-start
              "
            >
              <div className="space-y-1">
                <div className="font-semibold text-black dark:text-white">
                  {b.user_name || "Unknown User"}
                </div>

                {b.user_email && (
                  <div className="text-sm text-black/60 dark:text-white/60">
                    {b.user_email}
                  </div>
                )}

                <div className="text-sm text-black/60 dark:text-white/60">
                  Doctor: {b.doctor_name || "Unknown"}
                </div>

                <div className="text-sm text-black/60 dark:text-white/60">
                  {formatDateTime(b.start_time)}
                </div>

                <div
                  className={cn(
                    "text-xs inline-block mt-1 px-2 py-1 rounded-md",
                    statusColor(b.status),
                    statusBadge(b.status)
                  )}
                >
                  {b.status}
                </div>
              </div>

              <button
                onClick={() => handleDelete(b.id)}
                className="
                  px-4 py-2 rounded-lg
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