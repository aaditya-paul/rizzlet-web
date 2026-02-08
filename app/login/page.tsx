"use client";

import { useState } from "react";
import { MICROCOPY } from "@/lib/microcopy";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || MICROCOPY.errors.authFailed);
      }

      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || MICROCOPY.errors.authFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="text-2xl font-bold text-gradient block text-center mb-8"
        >
          rizzlet
        </Link>

        <div className="card">
          <h1 className="text-2xl font-bold mb-6">
            {MICROCOPY.auth.loginTitle}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {MICROCOPY.auth.emailLabel}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder={MICROCOPY.auth.emailPlaceholder}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {MICROCOPY.auth.passwordLabel}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder={MICROCOPY.auth.passwordPlaceholder}
                required
              />
            </div>

            {error && (
              <div className="text-[var(--error)] text-sm text-center p-3 bg-red-500 bg-opacity-10 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? "..." : MICROCOPY.auth.loginButton}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            {MICROCOPY.auth.switchToSignup}{" "}
            <Link
              href="/signup"
              className="text-[var(--primary)] hover:underline"
            >
              {MICROCOPY.auth.signupLink}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
