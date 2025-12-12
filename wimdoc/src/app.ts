import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./modules/auth/auth.routes.js";
import doctorRoutes from "./modules/doctors/doctor.routes.js";
import slotRoutes from "./modules/slots/slot.routes.js";
import bookingRoutes from "./modules/bookings/booking.routes.js";
import debugRoutes from "./modules/debug/debug.routes.js";

console.log("app.ts loaded");

const app = express();

// Security middleware
app.use(helmet());

// CORS — allow your frontend
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Request logging
app.use(morgan("dev"));

// JSON & form parsing
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (_req, res) => {
  res.json({ status: "ok", service: "wimdoc-backend" });
});

// Route mount points
app.use("/auth", authRoutes);
app.use("/doctors", doctorRoutes);
app.use("/slots", slotRoutes);
app.use("/bookings", bookingRoutes);
app.use("/debug", debugRoutes);

// Global error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("GLOBAL ERROR:", err);

  return res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    details: err.details || null,
  });
});

export default app;