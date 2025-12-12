import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

const ACCESS_SECRET: string = process.env.JWT_ACCESS_SECRET
  || process.env.JWT_SECRET
  || "dev-access-secret";

const REFRESH_SECRET: string = process.env.JWT_REFRESH_SECRET
  || ACCESS_SECRET;

const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || "1h";
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "30d";

export type Role = "admin" | "user";

export interface JwtPayload {
  id: number;
  username: string;
  role: Role;
  iat?: number;
  exp?: number;
}

const accessOptions: SignOptions = { expiresIn: ACCESS_EXPIRES_IN as any };
const refreshOptions: SignOptions = { expiresIn: REFRESH_EXPIRES_IN as any };


export function signAccessToken(payload: Omit<JwtPayload, "iat" | "exp">): string {
  return jwt.sign(payload, ACCESS_SECRET, accessOptions);
}

export function signRefreshToken(payload: Omit<JwtPayload, "iat" | "exp">): string {
  return jwt.sign(payload, REFRESH_SECRET, refreshOptions);
}

export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export const signJWT = signAccessToken;
export const verifyJWT = verifyAccessToken;