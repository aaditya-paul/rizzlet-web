"use client";

import { useState, useEffect } from "react";
import { MICROCOPY } from "@/lib/microcopy";
import { useRouter } from "next/navigation";

type ToneMode = "safe" | "playful" | "flirty" | "bold";

interface Reply {
  text: string;
  tone: ToneMode;
  confidence: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [conversation, setConversation] = useState("");
  const [selectedTone, setSelectedTone] = useState<ToneMode>("playful");
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
    } else {
      setToken(storedToken);
    }
  }, [router]);

  const parseConversation = (text: string) => {
    const lines = text.split("\n").filter((line) => line.trim());
    const messages = [];

    for (const line of lines) {
      if (
        line.toLowerCase().startsWith("them:") ||
        line.toLowerCase().startsWith("other:")
      ) {
        messages.push({
          sender: "other" as const,
          text: line.substring(line.indexOf(":") + 1).trim(),
        });
      } else if (
        line.toLowerCase().startsWith("you:") ||
        line.toLowerCase().startsWith("me:")
      ) {
        messages.push({
          sender: "user" as const,
          text: line.substring(line.indexOf(":") + 1).trim(),
        });
      }
    }

    return messages;
  };

  const handleGenerate = async () => {
    if (!conversation.trim()) {
      setError(MICROCOPY.errors.emptyConversation);
      return;
    }

    setLoading(true);
    setError("");
    setReplies([]);

    try {
      const messages = parseConversation(conversation);

      const response = await fetch(
        "http://localhost:5000/api/replies/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            conversation: { messages },
            tone: selectedTone,
            count: 3,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(MICROCOPY.errors.quotaExceeded);
        }
        throw new Error(data.error || MICROCOPY.errors.generic);
      }

      setReplies(data.replies);
    } catch (err: any) {
      setError(err.message || MICROCOPY.errors.network);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  if (!token) return null;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--background)] sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-gradient">rizzlet</div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            log out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {MICROCOPY.app.title}
          </h1>
          <p className="text-gray-400">{MICROCOPY.app.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Input */}
          <div className="space-y-4">
            <textarea
              value={conversation}
              onChange={(e) => setConversation(e.target.value)}
              placeholder={MICROCOPY.app.chatPlaceholder}
              className="input-field min-h-[300px] resize-none font-mono text-sm"
            />

            {/* Tone Selector */}
            <div>
              <label className="block text-sm font-medium mb-3">
                {MICROCOPY.app.selectTone}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(MICROCOPY.tones) as ToneMode[]).map((tone) => {
                  const toneData = MICROCOPY.tones[tone];
                  return (
                    <button
                      key={tone}
                      onClick={() => setSelectedTone(tone)}
                      className={`tone-btn ${selectedTone === tone ? "active" : ""}`}
                    >
                      <span className="text-xl">{toneData.emoji}</span>
                      <div className="text-left flex-1">
                        <div className="font-medium text-sm">
                          {toneData.label}
                        </div>
                        <div className="text-xs text-gray-400">
                          {toneData.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading
                ? MICROCOPY.app.generating
                : MICROCOPY.app.generateButton}
            </button>

            {error && (
              <div className="text-[var(--error)] text-sm text-center p-3 bg-red-500 bg-opacity-10 rounded-lg">
                {error}
              </div>
            )}
          </div>

          {/* Right: Replies */}
          <div>
            <label className="block text-sm font-medium mb-3">replies</label>
            <div className="space-y-3">
              {replies.length === 0 && !loading && (
                <div className="card text-center text-gray-500 py-12">
                  {MICROCOPY.app.emptyState}
                </div>
              )}

              {loading && (
                <div className="card text-center py-12">
                  <div className="animate-pulse">✨</div>
                  <p className="text-gray-400 mt-2">
                    {MICROCOPY.app.generating}
                  </p>
                </div>
              )}

              {replies.map((reply, index) => (
                <div
                  key={index}
                  className="card hover:border-[var(--primary)] transition-colors"
                >
                  <p className="text-sm leading-relaxed mb-3">{reply.text}</p>
                  <button
                    onClick={() => handleCopy(reply.text, index)}
                    className="text-xs text-[var(--primary)] hover:text-[var(--primary-dark)] font-medium"
                  >
                    {copiedIndex === index
                      ? MICROCOPY.app.copied
                      : MICROCOPY.app.copyButton}
                  </button>
                </div>
              ))}

              {replies.length > 0 && !loading && (
                <button
                  onClick={handleGenerate}
                  className="btn-secondary w-full"
                >
                  {MICROCOPY.app.regenerate}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
