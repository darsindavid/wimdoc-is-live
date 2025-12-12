import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./App";
import "./styles/globals.css";
import "./styles/premium-bg.css";
import "./index.css"; // keep if needed
import { AuthProvider } from "@/hooks/useAuth";
import { BackgroundDoodles } from "@/components/layout/BackgroundDoodles";

// A wrapper to ensure theme is applied BEFORE React renders
function ThemeHydrator({ children }: { children: React.ReactNode }) {
  React.useLayoutEffect(() => {
    try {
      const saved = localStorage.getItem("wimdoc:theme");
      if (saved === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    } catch {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return <>{children}</>;
}

// Root Component
function Root() {
  return (
    <ThemeHydrator>
      {/* Global Ambient Visual Layer */}
      <div className="premium-bg -z-30">
        <div className="particle-field">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${6 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
        <div className="sweep-bg"></div>
      </div>

      {/* Animated Gradient Blobs */}
      <BackgroundDoodles />

      {/* Main Application Router */}
      <AuthProvider>
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
</AuthProvider>
    </ThemeHydrator>
  );
}
// Mount into DOM
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
