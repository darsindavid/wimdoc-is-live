  import React from "react";
  import { NavLink } from "react-router-dom";
  import { ThemeContext } from "@/App";

  const Icon = ({
    path,
    size = 18,
  }: {
    path: string;
    size?: number;
  }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="transition-transform duration-300 group-hover:scale-[1.15]"
    >
      <path d={path} />
    </svg>
  );

  function NavItem({
    to,
    label,
    icon,
  }: {
    to: string;
    label: string;
    icon: React.ReactNode;
  }) {
    return (
      <NavLink
        to={to}
        className={({ isActive }) =>
          `
          group
          flex items-center gap-3 px-4 py-2 mb-[6px]
          rounded-xl
          transition-all duration-300
          ${isActive
            ? "bg-white/80 dark:bg-white/10 text-black dark:text-white shadow-md"
            : "text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5"
          }
          `
        }
      >
        <div
          className={`
            w-9 h-9 flex items-center justify-center rounded-lg
            transition-all duration-300
            ${
              // active icon background
              true
                ? "bg-accent/20 dark:bg-accent/30"
                : "bg-black/5 dark:bg-white/10"
            }
          `}
        >
          {icon}
        </div>
        <span className="font-medium tracking-wide">{label}</span>
      </NavLink>
    );
  }

  export function Sidebar() {
    const theme = React.useContext(ThemeContext);

    return (
      <aside
        className="
          sidebar
          fixed left-0 top-0 bottom-0
          w-[250px]
          bg-white/60 dark:bg-[#0c111a]/60
          backdrop-blur-xl
          border-r border-black/5 dark:border-white/10
          shadow-lg
          overflow-y-auto
          transition-all duration-500
          flex flex-col
        "
      >
        <div className="px-6 pt-6 pb-4 flex items-center gap-3">
          <div
            className="
              w-12 h-12 rounded-2xl
              bg-gradient-to-br from-emerald-300 to-sky-300
              flex items-center justify-center
              text-black font-black text-xl
              shadow-md
            "
          >
            W
          </div>

          <div>
            <div className="text-lg font-bold text-black dark:text-white">
              WIMDOC
            </div>
            <div className="text-xs text-black/50 dark:text-white/50">
              Admin Control
            </div>
          </div>
        </div>

        <div className="px-4 pb-6 mt-2 flex flex-col">

          <div className="text-xs uppercase tracking-widest text-black/40 dark:text-white/40 mb-3">
            Overview
          </div>

          <NavItem
            to="/"
            label="Dashboard"
            icon={
              <Icon path="M3 13h8V3H3v10zM3 21h8v-6H3v6zM13 21h8V11h-8v10zM13 3v6h8V3h-8z" />
            }
          />

          <div className="text-xs uppercase tracking-widest text-black/40 dark:text-white/40 mt-5 mb-3">
            Doctors
          </div>

          <NavItem
            to="/doctors"
            label="All Doctors"
            icon={
              <Icon path="M12 12a4 4 0 10.001-8.001A4 4 0 0012 12zM4 20a8 8 0 0116 0v1H4v-1z" />
            }
          />

          <NavItem
            to="/create-doctor"
            label="Add Doctor"
            icon={
              <Icon path="M13 11h6v2h-6v6h-2v-6H5v-2h6V5h2v6z" />
            }
          />

          <div className="text-xs uppercase tracking-widest text-black/40 dark:text-white/40 mt-5 mb-3">
            Scheduling
          </div>

          <NavItem
            to="/slots"
            label="Slots"
            icon={
              <Icon path="M7 10h10v2H7zM3 5v16h18V5H3z" />
            }
          />

          <NavItem
            to="/bookings"
            label="Bookings"
            icon={
              <Icon path="M4 6h16M4 12h16M4 18h16" />
            }
          />
        </div>

        <div className="mt-auto p-5 text-xs text-black/40 dark:text-white/40">
          <div className="mb-2">v0.3 • Admin Interface</div>

          <button
            onClick={theme.toggleTheme}
            className="
              mt-2 px-3 py-2 rounded-lg
              bg-black/5 dark:bg-white/5
              hover:bg-black/10 dark:hover:bg-white/10
              transition-all duration-300
              text-black/70 dark:text-white/70
              flex items-center gap-2
            "
          >
            <Icon
              path={
                // sun/moon toggle path
                theme.theme === "light"
                  ? "M6.76 4.84l-1.8-1.79L3.17 4.83l1.79 1.8L6.76 4.84zM1 13h3v-2H1v2zm10 9h2v-3h-2v3z"
                  : "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
              }
            />
            {theme.theme === "light" ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </aside>
    );
  }

  export default Sidebar;