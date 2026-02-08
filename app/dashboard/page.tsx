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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [lastMessageWasUser, setLastMessageWasUser] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
    } else {
      setToken(storedToken);
    }
  }, [router]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of Array.from(items)) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          setImageFile(file);
          const reader = new FileReader();
          reader.onload = (e) => setImagePreview(e.target?.result as string);
          reader.readAsDataURL(file);
        }
        break;
      }
    }
  };

  const handleProcessImage = async () => {
    if (!imageFile) return;

    setOcrLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch("http://localhost:5000/api/ocr/extract", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process image");
      }

      // Vision AI returns structured conversation
      if (data.conversation && data.conversation.messages) {
        // Format messages as text for the textarea
        const formattedText = data.conversation.messages
          .map((msg: any) => {
            const speaker = msg.sender === "user" ? "You" : "Them";
            return `${speaker}: ${msg.text}`;
          })
          .join("\n");

        setConversation(formattedText);

        // Auto-set checkbox based on who sent last message
        setLastMessageWasUser(data.lastMessageWasUser || false);
      }

      // Clear image
      setImageFile(null);
      setImagePreview(null);
    } catch (err: any) {
      setError(err.message || "Failed to extract text from image");
    } finally {
      setOcrLoading(false);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
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
      // Send raw conversation text - let AI parse it
      const response = await fetch(
        "http://localhost:5000/api/replies/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            conversationText: conversation, // Send raw text
            lastMessageWasUser: lastMessageWasUser, // Conversation perspective
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
      <header className="border-b border-[var(--border)] bg-[#050511]/80 backdrop-blur-md sticky top-0 z-10 supports-[backdrop-filter]:bg-opacity-60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-extrabold text-gradient tracking-tight">
            rizzlet
          </div>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-gray-400 hover:text-white transition opacity-70 hover:opacity-100"
          >
            log out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter text-white drop-shadow-lg">
            {MICROCOPY.app.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-medium max-w-2xl mx-auto">
            {MICROCOPY.app.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Input */}
          <div className="space-y-4">
            {/* Image Upload Section */}
            {imagePreview ? (
              <div className="card relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <img
                  src={imagePreview}
                  alt="Screenshot preview"
                  className="w-full rounded-xl"
                />
                <div className="flex gap-2 mt-4 relative z-10">
                  <button
                    onClick={handleProcessImage}
                    disabled={ocrLoading}
                    className="btn-primary flex-1 text-sm py-2"
                  >
                    {ocrLoading ? "reading receipts... 🧐" : "✨ scan da chat"}
                  </button>
                  <button
                    onClick={clearImage}
                    className="btn-secondary py-2 px-3 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <div className="card border-dashed border-2 border-white/10 hover:border-violet-500/50 hover:bg-white/5 transition-all duration-300 text-center group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer block py-8"
                >
                  <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                    📸
                  </div>
                  <p className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                    {MICROCOPY.app.imageUpload}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    (Ctrl+V to paste)
                  </p>
                </label>
              </div>
            )}

            <textarea
              value={conversation}
              onChange={(e) => setConversation(e.target.value)}
              onPaste={handlePaste}
              placeholder={MICROCOPY.app.chatPlaceholder}
              className="input-field min-h-[300px] resize-none font-mono text-sm leading-relaxed"
            />

            {/* Last Message Context */}
            <div className="flex items-center gap-4 p-4 card rounded-2xl border-white/5 bg-white/5">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  id="lastMessageCheck"
                  checked={lastMessageWasUser}
                  onChange={(e) => setLastMessageWasUser(e.target.checked)}
                  className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-white/20 transition-all checked:border-violet-500 checked:bg-violet-500 hover:border-violet-400"
                />
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <label
                htmlFor="lastMessageCheck"
                className="cursor-pointer select-none flex-1"
              >
                <div className="font-bold text-sm text-gray-200">
                  I sent the last message
                </div>
                <div className="text-xs text-gray-400 mt-1 font-medium">
                  {lastMessageWasUser
                    ? "✨ Generating follow-up messages to continue the vibe"
                    : "↩️ Generating replies to respond to them"}
                </div>
              </label>
            </div>

            {/* Tone Selector */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-3 ml-1 uppercase tracking-wider text-xs">
                {MICROCOPY.app.selectTone}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(MICROCOPY.tones) as ToneMode[]).map((tone) => {
                  const toneData = MICROCOPY.tones[tone];
                  const isSelected = selectedTone === tone;
                  return (
                    <button
                      key={tone}
                      onClick={() => setSelectedTone(tone)}
                      className={`tone-btn group relative overflow-hidden ${isSelected ? "active ring-2 ring-violet-500/50" : "opacity-80 hover:opacity-100"}`}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-r from-violet-500/10 to-pink-500/10 opacity-0 transition-opacity duration-300 ${isSelected ? "opacity-100" : "group-hover:opacity-100"}`}
                      />
                      <span className="text-2xl filter drop-shadow-md transform group-hover:scale-110 transition-transform duration-300">
                        {toneData.emoji}
                      </span>
                      <div className="text-left flex-1 relative z-10">
                        <div
                          className={`font-bold text-sm ${isSelected ? "text-white" : "text-gray-300"}`}
                        >
                          {toneData.label}
                        </div>
                        <div className="text-[10px] text-gray-500 font-medium tracking-tight">
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
              className={`btn-primary w-full text-lg shadow-lg shadow-violet-500/20 ${loading ? "animate-pulse" : "hover:shadow-pink-500/30"}`}
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
          <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-300 mb-2 ml-1 uppercase tracking-wider text-xs">
              the sauce 🥫
            </label>
            <div className="space-y-4">
              {replies.length === 0 && !loading && (
                <div className="card text-center text-gray-500 py-20 border-dashed border-2 border-white/5 bg-white/5 mx-auto flex flex-col items-center justify-center">
                  <div className="text-4xl mb-4 opacity-50 grayscale">🍽️</div>
                  <p className="text-lg font-medium text-gray-400">
                    {MICROCOPY.app.emptyState}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    I'm starving here, fam.
                  </p>
                </div>
              )}

              {loading && (
                <div className="card text-center py-20 animate-pulse-glow border-violet-500/30">
                  <div className="text-5xl mb-4 animate-bounce">👨‍🍳</div>
                  <p className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-500 font-bold text-xl">
                    {MICROCOPY.app.generating}
                  </p>
                </div>
              )}

              {replies.map((reply, index) => (
                <div
                  key={index}
                  className="card group hover:border-pink-500/40 hover:bg-white/10 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-white/20 bg-white/5 px-2 py-1 rounded-full">
                      {reply.tone}
                    </span>
                  </div>
                  <p className="text-lg leading-relaxed mb-4 text-gray-100 font-medium">
                    {reply.text}
                  </p>
                  <div className="flex justify-between items-center mt-2 border-t border-white/5 pt-3">
                    <div className="flex gap-1">
                      {Array.from({
                        length: Math.min(
                          5,
                          Math.ceil((reply.confidence || 0.8) * 5),
                        ),
                      }).map((_, i) => (
                        <span key={i} className="text-xs">
                          🔥
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => handleCopy(reply.text, index)}
                      className="text-xs bg-white/10 hover:bg-violet-500 hover:text-white text-gray-300 px-3 py-1.5 rounded-full font-bold transition-all transform active:scale-95 flex items-center gap-2"
                    >
                      {copiedIndex === index ? (
                        <>✅ {MICROCOPY.app.copied}</>
                      ) : (
                        <>📋 {MICROCOPY.app.copyButton}</>
                      )}
                    </button>
                  </div>
                </div>
              ))}

              {replies.length > 0 && !loading && (
                <button
                  onClick={handleGenerate}
                  className="btn-secondary w-full hover:bg-white/5 hover:text-pink-400 hover:border-pink-500/50 transition-all py-3 font-bold tracking-wide"
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
