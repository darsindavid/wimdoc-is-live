import type { Request, Response } from "express";
import {
  getAllSlots,
  getSlotById,
  addSlot,
  updateSlot,
  deleteSlot,
  getAvailableSlots,
  searchSlots,
  getPaginatedSlots
} from "./slot.service.js";

export async function fetchSlots(req: Request, res: Response) {
  try {
    const slots = await getAllSlots();
    return res.json(slots);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

// ------------------------------
// GET /slots/:id
// ------------------------------
export async function fetchSlotById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const slot = await getSlotById(id);

    if (!slot) return res.status(404).json({ error: "Slot not found" });

    return res.json(slot);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

// ------------------------------
// POST /slots
// ------------------------------
export async function createSlot(req: Request, res: Response) {
  try {
    const { doctor_id, start_time, end_time } = req.body;

    if (!doctor_id || !start_time || !end_time) {
      return res
        .status(400)
        .json({ error: "Required: doctor_id, start_time, end_time" });
    }

    const slot = await addSlot({
      doctor_id,
      start_time: new Date(start_time),
      end_time: new Date(end_time)
    });

    return res.status(201).json(slot);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

// ------------------------------
// PUT /slots/:id
// ------------------------------
export async function updateSlotInfo(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    const updated = await updateSlot(id, {
      ...req.body,
      start_time: req.body.start_time ? new Date(req.body.start_time) : undefined,
      end_time: req.body.end_time ? new Date(req.body.end_time) : undefined
    });

    if (!updated) return res.status(404).json({ error: "Slot not found" });

    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

// ------------------------------
// DELETE /slots/:id
// ------------------------------
export async function removeSlot(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const ok = await deleteSlot(id);

    if (!ok) return res.status(404).json({ error: "Slot not found" });

    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

// ------------------------------
// GET /slots/available (Public)
// ------------------------------
export async function fetchAvailableSlots(req: Request, res: Response) {
  try {
    const slots = await getAvailableSlots();
    return res.json(slots);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

// ------------------------------
// GET /slots/search
// ------------------------------
export async function searchSlotsController(req: Request, res: Response) {
  try {
    const doctorId = req.query.doctorId ? Number(req.query.doctorId) : undefined;
    const date = req.query.date ? String(req.query.date) : undefined;
    const onlyAvailable = req.query.onlyAvailable === "true";

    const slots = await searchSlots(doctorId, date, onlyAvailable);

    return res.json(slots);
  } catch (err: any) {
    console.error("Search error:", err);
    return res.status(500).json({ error: err.message });
  }
}

// ------------------------------
// GET /slots/paginated (Admin)
// ------------------------------
export async function fetchPaginatedSlots(req: Request, res: Response) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const sort = (req.query.sort as string) || "start_time";
    const order = (req.query.order as string) === "desc" ? "desc" : "asc";

    const slots = await getPaginatedSlots(page, limit, sort, order);
    return res.json(slots);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}