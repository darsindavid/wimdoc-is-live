import type { Request, Response, NextFunction } from "express";
import { verifyJWT } from "./jwt.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
    role: "admin" | "user";
    iat?: number;
    exp?: number;
  };
}

/* -------------------------------------------------------
   Extract token from "Authorization: Bearer <token>"
-------------------------------------------------------- */
function extractToken(req: Request): string | null {
  const header = req.headers.authorization ?? null;
  if (!header) return null;

  const parts = header.split(" ");
  if (parts.length !== 2) return null;

  return parts[1] ?? null;
}


/* -------------------------------------------------------
   Core token validation used by both middlewares
-------------------------------------------------------- */
function decodeAndAttach(
  req: AuthenticatedRequest,
  res: Response
): AuthenticatedRequest | null {
  const token = extractToken(req);

  if (!token) {
    res.status(401).json({ error: "Missing Bearer token" });
    return null;
  }

  const decoded = verifyJWT(token);

  if (!decoded) {
    res.status(401).json({ error: "Invalid or expired token" });
    return null;
  }

  req.user = decoded;
  return req;
}

/* -------------------------------------------------------
   Middleware: Require any authenticated user
-------------------------------------------------------- */
export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const result = decodeAndAttach(req, res);
  if (!result) return;

  next();
}

/* -------------------------------------------------------
   Middleware: Admin-only access
-------------------------------------------------------- */
export function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const result = decodeAndAttach(req, res);
  if (!result) return;

  if (req.user!.role !== "admin") {
    return res.status(403).json({
      error: "Access denied. Admin role required.",
    });
  }

  next();
}
