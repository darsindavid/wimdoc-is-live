import type { Request, Response } from "express";

import {
  getAllDoctors,
  getDoctorById,
  addDoctor,
  updateDoctor,
  deleteDoctor,
  generateDoctorSchedule
} from "./doctor.service.js";

// ------------------------------
// GET /doctors
// ------------------------------
export async function fetchDoctors(req: Request, res: Response) {
  try {
    const doctors = await getAllDoctors();
    return res.json(doctors);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch doctors" });
  }
}

// ------------------------------
// GET /doctors/:id
// ------------------------------
export async function fetchDoctorById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const doc = await getDoctorById(id);

    if (!doc) return res.status(404).json({ error: "Doctor not found" });
    return res.json(doc);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

// ------------------------------
// POST /doctors
// ------------------------------
export async function createDoctor(req: Request, res: Response) {
  try {
    const doctor = await addDoctor(req.body);
    return res.status(201).json(doctor);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

// ------------------------------
// PUT /doctors/:id
// ------------------------------
export async function updateDoctorInfo(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const updated = await updateDoctor(id, req.body);

    if (!updated) return res.status(404).json({ error: "Doctor not found" });
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

// ------------------------------
// DELETE /doctors/:id
// ------------------------------
export async function removeDoctor(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const ok = await deleteDoctor(id);

    if (!ok) return res.status(404).json({ error: "Doctor not found" });
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

// ------------------------------
// POST /doctors/:id/schedule
// ------------------------------
export async function createDoctorSchedule(req: Request, res: Response) {
  try {
    const doctorId = Number(req.params.id);
    const { date, startHour, endHour, durationMinutes } = req.body;

    if (!date || startHour == null || endHour == null || !durationMinutes) {
      return res.status(400).json({
        error: "Required fields: date, startHour, endHour, durationMinutes"
      });
    }

    const createdSlots = await generateDoctorSchedule(
      doctorId,
      date,
      startHour,
      endHour,
      durationMinutes
    );

    return res.json({
      success: true,
      created: createdSlots.length,
      slots: createdSlots
    });
  } catch (err: any) {
    console.error("Schedule generation failed → ", err);
    return res.status(500).json({ error: err.message || "Schedule generation failed" });
  }
}