"use client";

import { MICROCOPY } from "@/lib/microcopy";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col selection:bg-purple-500 selection:text-white">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[rgba(15,5,24,0.8)] backdrop-blur-md border-b border-white/5 py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
            <span className="text-3xl">😈</span>
            <span className="text-gradient">rizzlet</span>
          </div>
          <Link href="/auth" className="btn-secondary text-sm backdrop-blur-md">
            {MICROCOPY.auth.loginLink}
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 pt-32 pb-16 flex flex-col items-center justify-center text-center relative z-10">
        {/* Decorative elements behind hero */}
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-purple-600 rounded-full mix-blend-screen filter blur-[80px] opacity-40 animate-pulse"></div>
        <div
          className="absolute bottom-1/3 right-10 w-40 h-40 bg-pink-500 rounded-full mix-blend-screen filter blur-[80px] opacity-40 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="space-y-8 mb-16 max-w-5xl mx-auto relative">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 drop-shadow-2xl">
            never leave 'em <br />
            <span className="text-gradient block mt-2">on read again</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            {MICROCOPY.hero.subtitle}
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/auth" className="btn-primary text-xl px-10 py-5 group">
              {MICROCOPY.hero.cta}
              <span className="inline-block transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 ml-2">
                🚀
              </span>
            </Link>
          </div>
        </div>

        {/* Video Section - Floating Glass */}
        <div className="w-full relative z-20 mb-32 group perspective-1000">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-full bg-purple-500/20 filter blur-[100px] rounded-full z-[-1]"></div>

          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
              <span className="text-yellow-400 text-3xl">⚡</span>
              <span>see it in action</span>
            </h2>
            <p className="text-white/40 text-sm tracking-widest uppercase">
              watch the magic happen
            </p>
          </div>

          <div className="video-container">
            <div className="video-wrapper">
              <video
                controls
                playsInline
                preload="metadata"
                poster="/demo-poster.jpg"
                aria-label="Rizzlet demo video showing how the app works"
                className="cursor-pointer"
              >
                <source src="/demo.mp4" type="video/mp4" />
                Your browser doesn't support video playback.
              </video>
            </div>

            {/* Floating badges around video */}
            <div className="absolute -right-8 top-20 bg-black/80 backdrop-blur-xl border border-white/10 p-3 rounded-2xl shadow-xl animate-[float-slow_5s_ease-in-out_infinite] hidden md:block">
              <span className="text-2xl">🔥</span>
            </div>
            <div className="absolute -left-6 bottom-32 bg-black/80 backdrop-blur-xl border border-white/10 p-3 rounded-2xl shadow-xl animate-[float_6s_ease-in-out_infinite] animation-delay-500 hidden md:block">
              <span className="text-2xl">✨</span>
            </div>
          </div>
        </div>

        {/* Bento Grid Features */}
        <div className="w-full max-w-6xl mx-auto mb-20">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              everything you need to <br />
              <span className="text-purple-400">cook</span> 👨‍🍳
            </h2>
          </div>

          <div className="bento-grid">
            {/* Large Card */}
            <div className="bento-card md:col-span-2 md:row-span-2">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-6 border border-purple-500/30 text-2xl">
                    💬
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Upload Chats</h3>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    Simply paste your dry conversation or upload a screenshot.
                    We'll analyze the context, tone, and vibes instantly.
                  </p>
                </div>
                <div className="mt-8 p-4 bg-black/40 rounded-xl border border-white/5 backdrop-blur-sm">
                  <div className="flex items-start gap-3 opacity-60">
                    <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-2 w-3/4 bg-gray-700 rounded-full"></div>
                      <div className="h-2 w-1/2 bg-gray-700 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tall Card */}
            <div className="bento-card md:row-span-2 bg-gradient-to-b from-white/5 to-transparent">
              <div className="flex flex-col h-full">
                <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center mb-6 border border-pink-500/30 text-2xl">
                  ✨
                </div>
                <h3 className="text-2xl font-bold mb-2">Pick Vibe</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Match the energy. Choose from:
                </p>

                <div className="space-y-3 mt-auto">
                  {["Wholesome 🌱", "Playful 😜", "Rizz God 🫡", "Bold 🔥"].map(
                    (vibe, i) => (
                      <div
                        key={i}
                        className="px-4 py-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors cursor-default text-sm font-medium flex justify-between items-center group"
                      >
                        {vibe}
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                          →
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* Wide Card */}
            <div className="bento-card md:col-span-3">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 text-left">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4 border border-green-500/30 text-2xl">
                    🚀
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Instant Replies</h3>
                  <p className="text-gray-400">
                    Get 3 perfect suggestions tailored to the conversation
                    context. One tap to copy and send.
                  </p>
                </div>
                <div className="flex gap-4">
                  <button className="px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-105 transition-all text-sm font-semibold">
                    Copy Option 1
                  </button>
                  <button className="px-6 py-3 rounded-full bg-purple-600/20 border border-purple-500/50 hover:bg-purple-600/30 hover:scale-105 transition-all text-sm font-semibold text-purple-200">
                    Copy Option 2
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 text-center relative z-10 border-t border-white/5">
        <p className="text-gray-500 text-sm font-light">
          built for the
          <span className="text-purple-400 mx-1">Plot</span>
          by rizzlet
        </p>
      </footer>
    </div>
  );
}
