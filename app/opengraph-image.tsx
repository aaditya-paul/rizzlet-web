import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/siteConfig";

// Route segment config
export const runtime = "edge";
export const alt = siteConfig.title;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Image generation
export default async function OgImage() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 100%)",
        position: "relative",
      }}
    >
      {/* Background Glow */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "20%",
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          right: "20%",
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            background:
              "linear-gradient(135deg, #8b5cf6 0%, #bef264 50%, #ec4899 100%)",
            backgroundClip: "text",
            color: "transparent",
            letterSpacing: "-0.05em",
            marginBottom: "20px",
          }}
        >
          {siteConfig.name}
        </div>
        <div
          style={{
            fontSize: 36,
            color: "#d1d5db",
            fontWeight: 600,
            textAlign: "center",
            maxWidth: "800px",
          }}
        >
          {siteConfig.tagline}
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
