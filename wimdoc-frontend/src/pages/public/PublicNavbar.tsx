import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export default function PublicNavbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();

  const navItems = [
    { label: "Home", path: "/public" },
    { label: "Doctors", path: "/public/doctors" },
    { label: "My Bookings", path: "/public/my-bookings" },
  ];

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="
        sticky top-0 z-40 w-full backdrop-blur-xl 
        bg-white/70 dark:bg-black/30 
        border-b border-black/5 dark:border-white/10
      "
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* BRAND */}
        <Link
          to="/public"
          className="
            font-bold text-lg text-black dark:text-white
            hover:opacity-80 transition
          "
        >
          WimDoc<span className="text-emerald-500">.</span>
        </Link>

        {/* NAV LINKS */}
        <div className="flex items-center gap-6">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className="
                  relative text-sm font-medium transition
                  text-black/70 dark:text-white/70
                  hover:text-black dark:hover:text-white
                "
              >
                {item.label}

                {active && (
                  <motion.div
                    layoutId="public-nav-active"
                    className="
                      absolute -bottom-1 left-0 right-0 h-[2px] 
                      bg-emerald-400 rounded-full
                    "
                  />
                )}
              </Link>
            );
          })}

          {/* LOGIN / LOGOUT BUTTON */}
          {!auth.isAuthenticated ? (
            <button
              onClick={() => navigate("/login")}
              className="
                px-4 py-2 rounded-lg bg-emerald-500 text-white shadow 
                hover:bg-emerald-600 transition
              "
            >
              Login
            </button>
          ) : (
            <button
              onClick={() => {
                auth.logout();
                navigate("/public");
              }}
              className="
                px-4 py-2 rounded-lg bg-rose-500 text-white shadow
                hover:bg-rose-600 transition
              "
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}