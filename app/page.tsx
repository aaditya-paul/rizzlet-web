"use client";

import { MICROCOPY } from "@/lib/microcopy";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-gradient">rizzlet</div>
        <Link href="/login" className="btn-secondary">
          {MICROCOPY.auth.loginLink}
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 flex flex-col items-center justify-center text-center max-w-4xl">
        <div className="space-y-6 mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-gradient glow">
            {MICROCOPY.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
            {MICROCOPY.hero.subtitle}
          </p>
        </div>

        <Link href="/signup" className="btn-primary text-lg">
          {MICROCOPY.hero.cta} →
        </Link>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-20 w-full">
          <div className="card text-left">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-semibold text-lg mb-2">paste your chat</h3>
            <p className="text-gray-400 text-sm">
              copy any conversation and we'll help you figure out what to say
            </p>
          </div>

          <div className="card text-left">
            <div className="text-3xl mb-3">✨</div>
            <h3 className="font-semibold text-lg mb-2">pick your vibe</h3>
            <p className="text-gray-400 text-sm">
              choose from safe, playful, flirty, or bold - whatever fits the
              mood
            </p>
          </div>

          <div className="card text-left">
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="font-semibold text-lg mb-2">get replies</h3>
            <p className="text-gray-400 text-sm">
              get 3 different suggestions you can actually send - one tap to
              copy
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-500 text-sm">
        <p>rizzlet - never leave them on read again</p>
      </footer>
    </div>
  );
}
