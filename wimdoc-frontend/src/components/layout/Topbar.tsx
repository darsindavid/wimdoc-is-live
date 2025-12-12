import React from "react";
import { ThemeContext, AuthContext } from "@/App";

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
    className="text-black dark:text-white transition-transform duration-300 group-hover:scale-110"
    fill="currentColor"
  >
    <path d={path} />
  </svg>
);

export default function Topbar() {
  const theme = React.useContext(ThemeContext);
  const auth = React.useContext(AuthContext);

  return (
    <header
      className="
        topbar
        w-full h-[70px]
        bg-white/60 dark:bg-[#0c111a]/40
        backdrop-blur-xl
        border-b border-black/5 dark:border-white/10
        shadow-sm
        flex items-center justify-between
        px-6
        relative
        z-20
      "
    >
      {/* ----------------------------------------------------
         Left: Greeting + Micro tagline
      ---------------------------------------------------- */}
      <div className="flex flex-col">
        <div className="font-semibold text-black dark:text-white text-[17px] tracking-wide">
          Welcome back, Admin 👋
        </div>

        <div className="text-xs text-black/50 dark:text-white/40 mt-[1px]">
          Making people healthier… one pixel at a time ✨
        </div>
      </div>

      <div className="flex items-center gap-4">

        <button
          onClick={theme.toggleTheme}
          className="
            group w-10 h-10 rounded-xl
            flex items-center justify-center
            bg-black/5 dark:bg-white/10
            hover:bg-black/10 dark:hover:bg-white/20
            transition-all duration-300
          "
        >
          <Icon
            size={19}
            path={
              theme.theme === "light"
                ? "M6.76 4.84l-1.8-1.79L3.17 4.83l1.79 1.8L6.76 4.84zM1 13h3v-2H1v2zm10 9h2v-3h-2v3z"
                : "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
            }
          />
        </button>

        <div
          className="
            group
            flex items-center gap-3
            px-3 py-2
            bg-black/5 dark:bg-white/5
            rounded-xl
            cursor-pointer
            hover:bg-black/10 dark:hover:bg-white/10
            transition-all duration-300
          "
        >
          <div
            className="
              w-9 h-9 rounded-full
              bg-gradient-to-br from-emerald-300 to-sky-300
              flex items-center justify-center
              text-black font-semibold
              shadow
              group-hover:scale-105
              transition-all duration-300
            "
          >
            A
          </div>

          <div className="leading-tight">
            <div className="text-sm font-semibold text-black dark:text-white">
              Admin
            </div>
            <div className="text-[11px] text-black/50 dark:text-white/40 -mt-[2px]">
              logged in
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}