import { Router } from "express";

import {
  fetchDoctors,
  fetchDoctorById,
  createDoctor,
  updateDoctorInfo,
  removeDoctor,
  createDoctorSchedule
} from "./doctor.controller.js";

import { requireAdmin } from "../auth/auth.middleware.js";

const router = Router();

// PUBLIC ROUTES
router.get("/", fetchDoctors);
router.get("/:id", fetchDoctorById);

// ADMIN ROUTES
router.post("/", requireAdmin, createDoctor);
router.put("/:id", requireAdmin, updateDoctorInfo);
router.delete("/:id", requireAdmin, removeDoctor);

// Create schedule
router.post("/:id/schedule", requireAdmin, createDoctorSchedule);

export default router;