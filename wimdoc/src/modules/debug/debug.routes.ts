import { Router } from "express";
import { db } from "../../core/db.js";

const router = Router();

/* -------------------------------------------------------
   SAFETY: Disable debug routes in production
-------------------------------------------------------- */
router.use((req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({
      error: "Debug routes are disabled in production",
    });
  }
  next();
});

/* -------------------------------------------------------
   POST /api/debug/generate-slots
   Generates 50 fresh 1-hour slots for doctor_id=1
-------------------------------------------------------- */
router.post("/generate-slots", async (_req, res) => {
  try {
    const slots: any[] = [];

    let start = new Date("2025-12-12T04:30:00.000Z");

    for (let i = 0; i < 50; i++) {
      const end = new Date(start.getTime() + 60 * 60 * 1000); // +1 hour

      const result = await db.query(
        `
        INSERT INTO slots (doctor_id, start_time, end_time, is_booked)
        VALUES ($1, $2, $3, FALSE)
        RETURNING *
        `,
        [1, start, end]
      );

      slots.push(result.rows[0]);
      start = end;
    }

    res.json({ created: slots.length, slots });
  } catch (err: any) {
    console.error("⚠️ Debug generate error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* -------------------------------------------------------
   POST /api/debug/reset-all
   Unbooks all slots + Deletes all bookings
-------------------------------------------------------- */
router.post("/reset-all", async (_req, res) => {
  try {
    await db.query("UPDATE slots SET is_booked = FALSE");
    await db.query("DELETE FROM bookings");

    res.json({
      message: "System reset: all bookings deleted, all slots reset",
    });
  } catch (err: any) {
    console.error("⚠️ Debug reset error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* -------------------------------------------------------
   GET /api/debug/stats
   Summary used by Admin Dashboard widgets
-------------------------------------------------------- */
router.get("/stats", async (_req, res) => {
  try {
    const doctors = await db.query("SELECT COUNT(*) FROM doctors");
    const slots = await db.query("SELECT COUNT(*) FROM slots");
    const bookings = await db.query("SELECT COUNT(*) FROM bookings");

    const today = await db.query(`
      SELECT COUNT(*) 
      FROM bookings 
      WHERE created_at::date = CURRENT_DATE
    `);

    res.json({
      total_doctors: Number(doctors.rows[0].count),
      total_slots: Number(slots.rows[0].count),
      total_bookings: Number(bookings.rows[0].count),
      todays_bookings: Number(today.rows[0].count),
    });
  } catch (err: any) {
    console.error("⚠️ Debug stats error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

/* -------------------------------------------------------
   EXTRA: GET /api/debug/ping-db
   Confirms DB connection health
-------------------------------------------------------- */
router.get("/ping-db", async (_req, res) => {
  try {
    await db.query("SELECT 1");
    res.json({ db: "ok" });
  } catch (err: any) {
    res.status(500).json({ db: "error", details: err.message });
  }
});

/* -------------------------------------------------------
   EXTRA: GET /api/debug/all
   Returns EVERYTHING — doctors, slots, bookings
   Useful for full system inspection
-------------------------------------------------------- */
router.get("/all", async (_req, res) => {
  try {
    const doctors = await db.query("SELECT * FROM doctors ORDER BY id ASC");
    const slots = await db.query("SELECT * FROM slots ORDER BY start_time ASC");
    const bookings = await db.query("SELECT * FROM bookings ORDER BY created_at DESC");

    res.json({
      doctors: doctors.rows,
      slots: slots.rows,
      bookings: bookings.rows,
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch debug data" });
  }
});

export default router;