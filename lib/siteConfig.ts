/**
 * Centralized Site Configuration
 * Edit this file to update SEO, metadata, and URLs across the entire app
 */

export const siteConfig = {
  name: "Rizzlet",
  title: "Rizzlet - AI-Powered Reply Generator",
  description:
    "Generate perfect replies with AI. Whether you need safe, playful, flirty, or bold responses, Rizzlet helps you craft the perfect message every time.",
  tagline: "Generate Replies That Actually Work",

  // URLs
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",

  // Social & Contact
  links: {
    twitter: "https://twitter.com/rizzlet",
    github: "https://github.com/yourusername/rizzlet",
  },

  // SEO Keywords
  keywords: [
    "AI reply generator",
    "conversation starter",
    "flirty responses",
    "text message helper",
    "AI chat assistant",
    "dating messages",
    "reply suggestions",
  ],

  // Open Graph
  ogImage: "/og-image.png",

  // Theme
  themeColor: "#8b5cf6", // --color-primary
};

export type SiteConfig = typeof siteConfig;
