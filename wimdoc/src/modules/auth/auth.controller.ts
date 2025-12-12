import type { Request, Response } from "express";
import { findUserByUsername } from "./auth.service.js";
import { comparePassword } from "./auth.service.js";
import { signJWT, verifyJWT } from "./jwt.js";

// ------------------------------
// POST /auth/login
// ------------------------------
export async function login(req: Request, res: Response) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }

  const user = await findUserByUsername(username);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const valid = await comparePassword(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: "Incorrect password" });
  }

  const token = signJWT({
    id: user.id,
    username: user.username,
    role: user.role
  });

  return res.json({
    token,
    role: user.role,
    username: user.username
  });
}

// ------------------------------
// GET /auth/verify
// ------------------------------
export function verifyToken(req: Request, res: Response) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) return res.status(401).json({ error: "Missing token" });

  const decoded = verifyJWT(token);
  if (!decoded) return res.status(401).json({ error: "Invalid token" });

  return res.json({ success: true, user: decoded });
}