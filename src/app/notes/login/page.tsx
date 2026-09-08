"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NotesLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/notes/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      router.push("/notes");
    } catch {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="type-heading-1 text-[var(--text-main)] mb-3">
            Notes
          </h1>
          <p className="type-body text-[var(--text-muted)]">
            Private workspace
          </p>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block type-ui text-[var(--text-main)] mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-md type-body text-[var(--text-main)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                placeholder="your@email.com"
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block type-ui text-[var(--text-main)] mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-md type-body text-[var(--text-main)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="p-4 border border-red-300 rounded-md bg-[var(--bg-primary)]">
                <p className="type-ui text-red-500 text-sm">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-[var(--accent)] text-white type-ui rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
