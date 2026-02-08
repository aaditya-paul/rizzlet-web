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

      // Set extracted text to conversation textarea
      setConversation(data.text);

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
            {/* Image Upload Section */}
            {imagePreview ? (
              <div className="card relative">
                <img
                  src={imagePreview}
                  alt="Screenshot preview"
                  className="w-full rounded-lg"
                />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleProcessImage}
                    disabled={ocrLoading}
                    className="btn-primary flex-1"
                  >
                    {ocrLoading ? "extracting text..." : "✨ extract text"}
                  </button>
                  <button onClick={clearImage} className="btn-secondary">
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <div className="card border-dashed border-2 border-[var(--border)] text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer block py-4"
                >
                  <div className="text-3xl mb-2">📸</div>
                  <p className="text-sm text-gray-400">
                    click to upload or paste a screenshot
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    (Ctrl+V or Cmd+V to paste)
                  </p>
                </label>
              </div>
            )}

            <textarea
              value={conversation}
              onChange={(e) => setConversation(e.target.value)}
              onPaste={handlePaste}
              placeholder="Paste your chat here (WhatsApp, Discord, etc.) - AI will automatically parse it!"
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
