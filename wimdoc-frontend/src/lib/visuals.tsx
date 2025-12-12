// src/lib/visuals.tsx
import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";

/**
 * StudioVisuals:
 * Lightweight ambient layer. This file includes visual components you can use in pages
 * but it does not auto-mount heavy animations globally. Use StudioVisuals only if you
 * want the ambient canvas (not recommended for every page).
 */

export function StudioVisuals() {
  return (
    <>
      <AmbientBlobs />
      <SubtleCanvas />
    </>
  );
}

/* -----------------------
   AmbientBlobs: 3 soft blobs at edges (non-intrusive)
   ----------------------- */
export function AmbientBlobs() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <motion.div
        aria-hidden
        initial={{ opacity: 0.9 }}
        animate={{ y: [0, -12, 6, 0], x: [0, 6, -4, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: 520,
          height: 520,
          left: -80,
          top: -40,
          borderRadius: "50%",
          background: "radial-gradient(circle at 30% 30%, rgba(162,234,212,0.48), rgba(162,234,212,0.16) 35%, transparent 65%)",
          filter: "blur(64px)"
        }}
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0.85 }}
        animate={{ y: [0, 22, -8, 0], x: [0, -6, 4, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: 520,
          height: 520,
          right: -100,
          bottom: -30,
          borderRadius: "50%",
          background: "radial-gradient(circle at 50% 40%, rgba(227,217,255,0.42), rgba(227,217,255,0.12) 35%, transparent 65%)",
          filter: "blur(64px)"
        }}
      />
    </div>
  );
}

/* -----------------------
   SubtleCanvas: light confetti-style micro particles (very low frequency)
   ----------------------- */
export function SubtleCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    let raf: number | null = null;
    let particles: any[] = [];

    const spawn = (x: number, y: number, n = 8) => {
      for (let i = 0; i < n; i++) {
        particles.push({
          x, y,
          vx: (Math.random() - 0.5) * 2.4,
          vy: (Math.random() - 0.5) * 1.2 - 0.6,
          size: 4 + Math.random() * 6,
          life: 40 + Math.random() * 80,
          color: ["rgba(159,134,255,0.95)", "rgba(162,234,212,0.95)", "rgba(255,137,200,0.95)"][Math.floor(Math.random() * 3)]
        });
      }
    };

    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.02; p.life--;
        ctx.globalAlpha = Math.max(0, p.life / 100);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        if (p.life <= 0) particles.splice(i, 1);
      }

      if (Math.random() < 0.003) spawn(Math.random() * w, Math.random() * h * 0.5, 6);

      raf = requestAnimationFrame(loop);
    };

    loop();
    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("resize", onResize); if (raf) cancelAnimationFrame(raf); };
  }, []);

  return <canvas ref={ref} style={{ position: "fixed", inset: 0, zIndex: -20, pointerEvents: "none" }} />;
}

/* -----------------------
   UI primitives
   ----------------------- */

export function GlassCard({ children, className = "", style = {} }: React.PropsWithChildren<{ className?: string; style?: React.CSSProperties }>) {
  return (
    <div className={`studio-glass ${className}`} style={style}>
      {children}
    </div>
  );
}

export function StatCard({ title, value, icon }: { title: string; value: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="studio-stat studio-lift">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="studio-badge">{icon ?? "🩺"}</div>
          <div>
            <div className="text-sm font-semibold text-neutral-700">{title}</div>
            <div className="text-2xl font-bold mt-1 text-neutral-800">{value}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StudioButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button className="studio-btn" onClick={onClick}>
      <motion.span whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.03 }}>{children}</motion.span>
    </button>
  );
}
