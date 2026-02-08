export const MICROCOPY = {
  // Landing page
  hero: {
    title: "never leave them on read again",
    subtitle:
      "ai that actually gets your vibe and helps you reply like a real person",
    cta: "get started for free",
  },

  // Auth
  auth: {
    signupTitle: "let's get you set up",
    loginTitle: "welcome back!",
    emailLabel: "your email",
    emailPlaceholder: "you@example.com",
    passwordLabel: "password",
    passwordPlaceholder: "make it good",
    signupButton: "let's go",
    loginButton: "sign me in",
    switchToLogin: "already have an account?",
    switchToSignup: "new here?",
    loginLink: "log in",
    signupLink: "sign up",
  },

  // Main app
  app: {
    title: "what do you need help with?",
    subtitle: "paste your chat and pick a vibe",
    chatPlaceholder:
      "paste your conversation here...\n\nThem: hey what's up?\nYou: not much, wbu?",
    selectTone: "pick your vibe",
    generateButton: "help me reply",
    generating: "cooking up some replies...",
    regenerate: "try again",
    copyButton: "copy",
    copied: "copied!",
    emptyState: "paste in a convo to get started",
  },

  // Tone descriptions
  tones: {
    safe: {
      label: "safe",
      emoji: "🌱",
      description: "friendly & respectful",
    },
    playful: {
      label: "playful",
      emoji: "✨",
      description: "fun & lighthearted",
    },
    flirty: {
      label: "flirty",
      emoji: "😏",
      description: "confident & charming",
    },
    bold: {
      label: "bold",
      emoji: "🔥",
      description: "direct & assertive",
    },
  },

  // Usage stats
  usage: {
    title: "your usage",
    dailyLabel: "today",
    monthlyLabel: "this month",
    limitLabel: "limit",
    remaining: (count: number) => `${count} left`,
  },

  // Errors
  errors: {
    generic: "oops, something went wrong",
    network: "can't reach the server rn",
    authFailed: "hmm, those credentials don't look right",
    quotaExceeded: "you've hit your daily limit. come back tomorrow!",
    emptyConversation: "paste in some messages first",
  },

  // Success messages
  success: {
    accountCreated: "you're in! ✨",
    loggedIn: "welcome back!",
  },
} as const;
