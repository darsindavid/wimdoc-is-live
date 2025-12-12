import type { Request, Response } from "express";
import {
  getAllBookings,
  createBookingForSlot
} from "./booking.service.js";

/* -------------------------------------------------------
   GET /api/bookings
-------------------------------------------------------- */
export async function fetchBookings(req: Request, res: Response) {
  try {
    const bookings = await getAllBookings();
    res.json(bookings);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
}

/* -------------------------------------------------------
   POST /api/bookings
   Body: { slot_id: number, user_name?: string }
-------------------------------------------------------- */
export async function createBooking(req: Request, res: Response) {
  try {
    const { slot_id, user_name } = req.body;

    if (!slot_id) {
      return res.status(400).json({ error: "slot_id is required" });
    }

    const booking = await createBookingForSlot(
      Number(slot_id),
      user_name ?? null
    );

    res.json(booking);
  } catch (err: any) {
    if (err.code === "SLOT_ALREADY_BOOKED") {
      return res.status(409).json({ error: "This slot is already booked" });
    }

    if (err.code === "SLOT_NOT_FOUND") {
      return res.status(404).json({ error: "Slot not found" });
    }

    return res.status(500).json({ error: "Failed to create booking" });
  }
}