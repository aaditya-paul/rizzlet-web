"use client";

import { useState } from "react";
import { MICROCOPY } from "@/lib/microcopy";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

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
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#0a0a0f]">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[20%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <Link
            href="/"
            className="text-4xl font-black text-white tracking-tighter inline-block mb-3"
          >
            rizzlet
          </Link>
          <p className="text-gray-400 font-medium text-sm tracking-wide uppercase">
            Start Cooking 👨‍🍳
          </p>
        </div>

        <Card className="border-t border-white/10 shadow-2xl shadow-black/50">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
              <span className="text-xl">✨</span>
            </div>
            <h1 className="text-2xl font-bold text-white">
              {MICROCOPY.auth.loginTitle}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label={MICROCOPY.auth.emailLabel}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={MICROCOPY.auth.emailPlaceholder}
              required
            />

            <Input
              label={MICROCOPY.auth.passwordLabel}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={MICROCOPY.auth.passwordPlaceholder}
              required
            />

            {error && (
              <div className="text-[var(--color-error)] text-sm text-center p-3 bg-red-500/10 border border-red-500/20 rounded-xl font-medium animate-pulse">
                {error}
              </div>
            )}

            <Button
              type="submit"
              isLoading={loading}
              className="w-full text-lg shadow-xl shadow-purple-500/30"
            >
              {loading ? "..." : MICROCOPY.auth.loginButton}
            </Button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-8 font-medium">
            {MICROCOPY.auth.switchToSignup}{" "}
            <Link
              href="/signup"
              className="text-[var(--color-accent-pink)] hover:text-white hover:underline transition-colors font-bold"
            >
              {MICROCOPY.auth.signupLink}
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
