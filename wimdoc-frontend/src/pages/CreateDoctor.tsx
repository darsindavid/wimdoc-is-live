import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function CreateDoctor() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [bio, setBio] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      setError("Doctor name is required.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await api.post("/doctors", {
        name: name.trim(),
        specialization: specialization.trim() || null,
        bio: bio.trim() || null,
      });

      setSuccess(true);

      setTimeout(() => navigate("/doctors"), 800);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to create doctor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container page-fade max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-black dark:text-white mb-2">
        Add a New Doctor
      </h1>
      <p className="text-black/60 dark:text-white/60 mb-8">
        Give your legendary doctor a name, a specialty, and a story.
      </p>

      <form
        onSubmit={handleSubmit}
        className="
          p-6 rounded-2xl
          bg-white/70 dark:bg-white/5 backdrop-blur-xl
          border border-black/5 dark:border-white/10
          shadow-md space-y-6
        "
      >

        {/* Name */}
        <div>
          <label className="block mb-1 text-sm font-medium text-black dark:text-white">
            Doctor Name
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Dr. Meera Raman"
            className="
              w-full p-3 rounded-lg
              bg-white dark:bg-white/10
              border border-black/10 dark:border-white/10
              focus:outline-none focus:ring-2 focus:ring-emerald-400
              transition
            "
          />
        </div>

        {/* Specialization */}
        <div>
          <label className="block mb-1 text-sm font-medium text-black dark:text-white">
            Specialization (optional)
          </label>
          <input
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            placeholder="Cardiology, Neurology, Dermatology..."
            className="
              w-full p-3 rounded-lg
              bg-white dark:bg-white/10
              border border-black/10 dark:border-white/10
              focus:outline-none focus:ring-2 focus:ring-sky-400
              transition
            "
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block mb-1 text-sm font-medium text-black dark:text-white">
            Bio / Short Description
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Dr. Meera has 12+ years of medical experience and a talent for calming panicked patients with terrible jokes."
            rows={5}
            className="
              w-full p-3 rounded-lg
              bg-white dark:bg-white/10
              border border-black/10 dark:border-white/10
              focus:outline-none focus:ring-2 focus:ring-purple-400
              transition
            "
          />
        </div>

        {/* Error */}
        {error && (
          <div className="text-sm text-rose-600">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="p-3 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-sm animate-pulse">
            Doctor created successfully! Redirecting…
          </div>
        )}

        {/* Submit Button */}
        <button
          disabled={loading}
          className={cn(
            "w-full py-3 rounded-xl font-semibold text-white",
            "bg-gradient-to-r from-emerald-400 to-sky-400",
            "hover:opacity-90 transition active:scale-[0.98]",
            loading && "opacity-50 cursor-not-allowed"
          )}
        >
          {loading ? "Saving..." : "Create Doctor"}
        </button>
      </form>
    </div>
  );
}