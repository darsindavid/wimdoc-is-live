import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { cn, formatDate } from "@/lib/utils";

// Simple inline icon for metrics
const MetricIcon = ({ path }: { path: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-7 h-7 opacity-90"
  >
    <path d={path} />
  </svg>
);

interface Stats {
  total_doctors: number;
  total_slots: number;
  total_bookings: number;
  todays_bookings: number;
}

// Floating animated blob component
const Blob = ({
  className,
  delay = 0,
  duration = 16,
}: {
  className: string;
  delay?: number;
  duration?: number;
}) => (
  <div
    className={cn(
      "absolute rounded-full blur-3xl opacity-30 pointer-events-none",
      className
    )}
    style={{
      animation: `floaty ${duration}s ease-in-out infinite`,
      animationDelay: `${delay}s`,
    }}
  />
);

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadStats() {
    try {
      const res = await api.get("/debug/stats");
      setStats(res);
    } catch (err) {
      console.error("Dashboard stats error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  const cards = [
    {
      label: "Total Doctors",
      value: stats?.total_doctors ?? "--",
      icon: "M12 12a4 4 0 10.001-8.001A4 4 0 0012 12zM4 20a8 8 0 0116 0v1H4v-1z",
      color: "from-emerald-300/40 to-emerald-500/20",
      text: "text-emerald-800 dark:text-emerald-200",
      note: "highly qualified & caffeinated ☕",
    },
    {
      label: "Total Slots",
      value: stats?.total_slots ?? "--",
      icon: "M7 10h10v2H7zM3 5v16h18V5H3z",
      color: "from-sky-300/40 to-sky-500/20",
      text: "text-sky-800 dark:text-sky-200",
      note: "freshly generated, lovingly crafted",
    },
    {
      label: "Total Bookings",
      value: stats?.total_bookings ?? "--",
      icon: "M4 6h16M4 12h16M4 18h16",
      color: "from-purple-300/40 to-purple-500/20",
      text: "text-purple-800 dark:text-purple-200",
      note: "drama-free scheduling success ✨",
    },
    {
      label: "Today’s Bookings",
      value: stats?.todays_bookings ?? "--",
      icon: "M5 3h14v4H5zM5 9h14v12H5z",
      color: "from-pink-300/40 to-pink-500/20",
      text: "text-pink-800 dark:text-pink-200",
      note: "people are feeling optimistic today 💖",
    },
  ];

  return (
    <div className="dashboard-container relative overflow-hidden p-6 flex flex-col gap-10">

      <Blob className="w-60 h-60 bg-emerald-300 top-10 left-20" duration={22} />
      <Blob className="w-72 h-72 bg-sky-400 bottom-20 right-10" duration={25} delay={4} />
      <Blob className="w-52 h-52 bg-pink-300 top-1/3 right-1/3" duration={18} delay={2} />

      <div className="relative">
        <h1 className="text-3xl font-bold text-black dark:text-white tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-black/50 dark:text-white/40 mt-1">
          System status as of {formatDate(new Date())}.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 relative">

        {cards.map((c, i) => (
          <div
            key={c.label}
            className={cn(
              "p-6 rounded-2xl transition-all duration-500 shadow-md border",
              "bg-white/60 dark:bg-white/5 backdrop-blur-xl",
              "hover:shadow-xl hover:scale-[1.02]",
              "border-black/5 dark:border-white/10",
              `bg-gradient-to-br ${c.color}`
            )}
            style={{ animation: `fadeIn 0.6s ease ${i * 0.1}s both` }}
          >
            <div className="flex items-center gap-4">
              <MetricIcon path={c.icon} />

              <div>
                <div className={cn("text-xl font-semibold", c.text)}>
                  {loading ? "--" : c.value}
                </div>
                <div className="text-sm text-black/50 dark:text-white/50">
                  {c.label}
                </div>
              </div>
            </div>

            <div className="text-xs mt-3 text-black/40 dark:text-white/40 italic">
              {c.note}
            </div>
          </div>
        ))}
      </div>
      <div
        className="
          rounded-2xl p-6
          bg-white/60 dark:bg-white/5 backdrop-blur-xl
          border border-black/5 dark:border-white/10
          shadow-md
          relative
        "
      >
        <h2 className="text-xl font-bold text-black dark:text-white">
          Activity Snapshot
        </h2>

        <p className="text-black/50 dark:text-white/40 text-sm mt-1 mb-6">
          “A quiet hospital is a happy hospital.” — ancient proverb*
        </p>

        <ul className="space-y-4">
          <li className="flex items-center gap-3">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="text-black/70 dark:text-white/70">
              System running smoothly.
            </span>
          </li>

          <li className="flex items-center gap-3">
            <span className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></span>
            <span className="text-black/70 dark:text-white/70">
              All booking services are online.
            </span>
          </li>

          <li className="flex items-center gap-3">
            <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></span>
            <span className="text-black/70 dark:text-white/70">
              Doctors are being their legendary selves today 💫
            </span>
          </li>
        </ul>

        <p className="text-[10px] text-black/40 dark:text-white/30 mt-6">
          *Probably not that ancient.
        </p>
      </div>
    </div>
  );
}