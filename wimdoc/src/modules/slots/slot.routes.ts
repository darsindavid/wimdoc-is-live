import { Router } from "express";

import {
  fetchSlots,
  fetchSlotById,
  createSlot,
  updateSlotInfo,
  removeSlot,
  fetchAvailableSlots,
  searchSlotsController,
  fetchPaginatedSlots
} from "./slot.controller.js";

import { requireAdmin } from "../auth/auth.middleware.js";

const router = Router();

// PUBLIC ROUTES
router.get("/available", fetchAvailableSlots);
router.get("/search", searchSlotsController);

// Public joined query
router.get("/public", async (req, res) => {
  try {
    const result = await req.app.locals.db.query(`
      SELECT s.*, d.name AS doctor_name
      FROM slots s
      LEFT JOIN doctors d ON d.id = s.doctor_id
      ORDER BY s.start_time ASC
    `);
    return res.json(result.rows);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ADMIN ROUTES
router.get("/", requireAdmin, fetchSlots);
router.get("/:id", requireAdmin, fetchSlotById);
router.post("/", requireAdmin, createSlot);
router.put("/:id", requireAdmin, updateSlotInfo);
router.delete("/:id", requireAdmin, removeSlot);
router.get("/paginated/list", requireAdmin, fetchPaginatedSlots);

export default router;
