import React from "react";
import { AuthContext } from "@/App";

const BASE = (import.meta.env.VITE_API_URL || "http://localhost:4000/api").replace(/\/+$/, "");

export async function loginApi(username: string): Promise<{ token: string; role: "admin" | "user"; name?: string }>{
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username })
  });

  if (!res.ok) {
    let msg = `Login failed (${res.status})`;
    try {
      const j = await res.json();
      if (j?.error) msg = j.error;
    } catch {}
    throw new Error(msg);
  }

  return (await res.json()) as { token: string; role: "admin" | "user"; name?: string };
}

export function useAuthActions() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthActions must be used within AuthContext provider");
  }

  async function login(username: string) {
    const { token, role } = await loginApi(username);
    ctx.login(token, role);
    return { token, role };
  }

  function logout() {
    ctx.logout();
  }

  return { login, logout, token: ctx.token, role: ctx.role };
}

export function setTokenLocal(token: string | null) {
  if (token) localStorage.setItem("wimdoc:token", token);
  else localStorage.removeItem("wimdoc:token");
}

export function getTokenLocal(): string | null {
  return localStorage.getItem("wimdoc:token");
}