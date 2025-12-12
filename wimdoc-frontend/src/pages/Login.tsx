import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { BackgroundDoodles } from "@/components/layout/BackgroundDoodles";

export default function Login() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      auth.login(data.token, data.role, data.username);

      navigate(data.role === "admin" ? "/" : "/public");
    } catch (e: any) {
      setErr(e.message);
    }

    setLoading(false);
  }

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <BackgroundDoodles />

      <div className="w-[95%] max-w-md bg-white/70 dark:bg-white/10 
        backdrop-blur-xl border border-black/10 dark:border-white/10 
        shadow-2xl rounded-3xl p-8 flex flex-col">

        <h1 className="text-3xl font-bold text-black dark:text-white text-center">
          Login to <span className="text-emerald-500">WIMDOC</span>
        </h1>

        <form className="flex flex-col gap-4 mt-6" onSubmit={handleLogin}>
          
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 rounded-lg bg-white dark:bg-white/10 border border-black/10 dark:border-white/10"
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-lg bg-white dark:bg-white/10 border border-black/10 dark:border-white/10"
          />

          {err && <div className="text-red-500 text-sm">{err}</div>}

          <button
            disabled={loading}
            className="w-full py-3 bg-emerald-500 rounded-xl text-white font-bold"
          >
            {loading ? "Checking..." : "Login"}
          </button>

        </form>
      </div>
    </div>
  );
}
