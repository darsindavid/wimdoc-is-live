import { Router } from "express";
import {
  fetchBookings,
  createBooking
} from "./booking.controller.js";

const router = Router();

router.get("/", fetchBookings);

router.post("/", createBooking);

router.get("/user/:name", async (req, res) => {
  try {
    const name = req.params.name;
    const result = await req.app.locals.db.query(
      `
      SELECT 
        b.id, b.slot_id, b.user_name, b.status, b.created_at,
        s.start_time, s.end_time,
        d.name AS doctor_name
      FROM bookings b
      LEFT JOIN slots s ON s.id = b.slot_id
      LEFT JOIN doctors d ON d.id = s.doctor_id
      WHERE LOWER(b.user_name) = LOWER($1)
      ORDER BY b.created_at DESC
      `,
      [name]
    );

    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch user bookings" });
  }
});

export default router;
