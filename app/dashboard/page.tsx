"use client";

import { useState, useEffect } from "react";
import { MICROCOPY } from "@/lib/microcopy";
import { siteConfig } from "@/lib/siteConfig";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

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
      router.push("/auth");
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

      const response = await fetch(`${siteConfig.apiUrl}/api/ocr/extract`, {
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

      if (data.conversation && data.conversation.messages) {
        const formattedText = data.conversation.messages
          .map((msg: any) => {
            const speaker = msg.sender === "user" ? "You" : "Them";
            return `${speaker}: ${msg.text}`;
          })
          .join("\n");

        setConversation(formattedText);
        setLastMessageWasUser(data.lastMessageWasUser || false);
      }

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
      const response = await fetch(
        `${siteConfig.apiUrl}/api/replies/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            conversationText: conversation,
            lastMessageWasUser: lastMessageWasUser,
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
    <div className="min-h-screen p-4 md:p-8">
      {/* Navbar / Header */}
      <header className="flex justify-between items-center mb-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="text-3xl font-black text-gradient tracking-tighter">
            rizzlet
          </div>
          <span className="bg-white/10 text-xs px-2 py-1 rounded-full text-gray-300 font-mono">
            BETA
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="text-sm font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-wider"
        >
          Log out
        </button>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input & Controls (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Tone Selector Widget */}
          <Card className="hover:border-pink-500/30 transition-colors">
            <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">
              Vibe Check
            </h3>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(MICROCOPY.tones) as ToneMode[]).map((tone) => {
                const toneData = MICROCOPY.tones[tone];
                const isSelected = selectedTone === tone;
                return (
                  <button
                    key={tone}
                    onClick={() => setSelectedTone(tone)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 border ${
                      isSelected
                        ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-lg shadow-purple-500/30 scale-105"
                        : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {toneData.emoji} {toneData.label}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Image Upload Widget */}
          <Card
            className={`relative group overflow-hidden border-dashed ${!imagePreview ? "border-2 border-white/20" : ""}`}
          >
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Upload preview"
                  className="w-full h-64 object-cover rounded-xl opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute  bottom-2 right-2 flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleProcessImage}
                    isLoading={ocrLoading}
                    className=" backdrop-blur-[128px] border-2"
                  >
                    ✨ Scan
                  </Button>
                  <button
                    onClick={clearImage}
                    className="bg-black/50 p-2 rounded-full text-white hover:bg-red-500/80 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block w-full h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors rounded-xl border-2 border-dashed border-white/20">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <div className="text-4xl mb-2">📸</div>
                  <span className="font-bold text-gray-400">
                    Upload Screenshot
                  </span>
                  <span className="text-xs text-gray-600 mt-1">
                    Click to browse files
                  </span>
                </label>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Or click here and paste (Ctrl+V)"
                    onPaste={handlePaste}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-primary)] focus:bg-black/40 focus:ring-1 focus:ring-[var(--color-primary)]/50 transition-all duration-200 text-center text-sm"
                    readOnly
                    onFocus={(e) => {
                      e.target.placeholder = "Paste your image now (Ctrl+V)";
                      e.target.classList.add("animate-pulse");
                    }}
                    onBlur={(e) => {
                      e.target.placeholder = "Or click here and paste (Ctrl+V)";
                      e.target.classList.remove("animate-pulse");
                    }}
                  />
                </div>
              </div>
            )}
          </Card>

          {/* Conversation Input */}
          <Card>
            <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">
              The Tea ☕
            </h3>
            <textarea
              value={conversation}
              onChange={(e) => setConversation(e.target.value)}
              onPaste={handlePaste}
              placeholder="Paste conversation or type here..."
              className="w-full bg-black/20 rounded-xl p-4 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] min-h-[150px] resize-none mb-4"
            />

            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                id="lastMsg"
                checked={lastMessageWasUser}
                onChange={(e) => setLastMessageWasUser(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 text-[var(--color-primary)] focus:ring-[var(--color-primary)] bg-transparent"
              />
              <label
                htmlFor="lastMsg"
                className="text-sm font-medium text-gray-300 cursor-pointer select-none"
              >
                I sent the last message
              </label>
            </div>

            <Button
              onClick={handleGenerate}
              isLoading={loading}
              className="w-full shadow-xl shadow-purple-600/20"
              disabled={!conversation.trim()}
            >
              {MICROCOPY.app.generateButton}
            </Button>

            {error && (
              <p className="text-red-400 text-xs mt-3 text-center animate-pulse">
                {error}
              </p>
            )}
          </Card>
        </div>

        {/* Right Column: Results (lg:col-span-8) */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Promo Banner / Placeholder */}
            {replies.length === 0 && !loading && (
              <div className="md:col-span-2 min-h-[400px] flex items-center justify-center">
                <div className="text-center opacity-50">
                  <div className="text-6xl mb-4 grayscale">👻</div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Ghost Town?
                  </h2>
                  <p className="max-w-md mx-auto text-gray-400">
                    Upload a screenshot or paste a chat to get some rizz. Don't
                    be shy.
                  </p>
                </div>
              </div>
            )}

            {loading && (
              <div className="md:col-span-2 flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-16 h-16 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mb-6" />
                <p className="text-lg font-bold animate-pulse text-[var(--color-secondary)]">
                  Cooking up replies... 🍳
                </p>
              </div>
            )}

            {/* Reply Cards */}
            {replies.map((reply, index) => (
              <div key={index} className="md:col-span-1 group">
                <Card className="h-full flex flex-col justify-between hover:border-[var(--color-secondary)] hover:shadow-2xl hover:shadow-lime-500/10 transition-all duration-500">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs font-black uppercase tracking-widest text-[var(--color-primary)] bg-white/5 px-2 py-1 rounded">
                        {reply.tone}
                      </span>
                      <div className="flex text-xs gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={
                              i < reply.confidence * 5
                                ? "text-[var(--color-secondary)]"
                                : "text-gray-700"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-lg font-medium text-white leading-relaxed">
                      "{reply.text}"
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleCopy(reply.text, index)}
                      className={
                        copiedIndex === index
                          ? "bg-green-500/20 text-green-400 border-green-500/50"
                          : ""
                      }
                    >
                      {copiedIndex === index ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
