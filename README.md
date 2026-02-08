# Rizzlet Web

Minimal Gen Z-style frontend for Rizzlet AI texting copilot.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📝 Features

- ✨ Minimal, quirky UI with Gen Z vibes
- 💬 Paste conversations and get instant replies
- 🎨 4 tone modes: safe, playful, flirty, bold
- 📋 One-tap copy functionality
- 🌙 Dark theme with purple/pink gradients
- 📱 Mobile-responsive design

## 🏗️ Tech Stack

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- React Hooks

## 📁 Structure

```
app/
├── page.tsx          # Landing page
├── login/            # Login page
├── signup/           # Signup page
├── dashboard/        # Main app (reply generation)
├── layout.tsx        # Root layout
└── globals.css       # Global styles

lib/
└── microcopy.ts      # All UI text (Gen Z style)
```

## 🎨 Design Philosophy

- **Casual, not corporate** - Gen Z microcopy, no tech jargon
- **Minimal & focused** - Only what you need, nothing extra
- **Dark & vibrant** - Purple/pink gradients, smooth interactions
- **Quirky but simple** - Fun without being overwhelming

## 🔗 Backend Connection

Make sure the backend is running on `http://localhost:5000`

## 📱 Pages

- `/` - Landing page
- `/signup` - Create account
- `/login` - Sign in
- `/dashboard` - Main app (generate replies)

## 🎯 Usage

1. Sign up or log in
2. Paste your chat conversation
3. Pick a vibe (tone mode)
4. Get 3 ready-to-send replies
5. Tap to copy and send

---

Built for people who know what they feel but not what to type 💬✨
