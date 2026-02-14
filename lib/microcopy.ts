export const MICROCOPY = {
  // Landing page
  hero: {
    title: "never leave 'em on read again",
    subtitle: "your AI wingman that passes the vibe check every time",
    cta: "unlock your rizz",
  },

  // Video section
  video: {
    heading: "see it in action ⚡",
    subtitle: "watch how easy it is to level up your game",
  },

  // Auth
  auth: {
    signupTitle: "join the squad",
    loginTitle: "welcome back bestie!",
    emailLabel: "drop your email",
    emailPlaceholder: "you@example.com",
    passwordLabel: "secret code",
    passwordPlaceholder: "keep it safe",
    signupButton: "let's go 🚀",
    loginButton: "log me in",
    switchToLogin: "already familiar?",
    switchToSignup: "new vibe?",
    loginLink: "hop in",
    signupLink: "join up",
  },

  // Main app
  app: {
    title: "rizzlet",
    subtitle: "ai textual chemistry consultant",
    chatPlaceholder: "paste the chat here...\n\nThem: u up?\nYou: ...",
    selectTone: "vibe check ✨",
    generateButton: "let him cook 🍳",
    generating: "cooking up some gas... 🔥",
    regenerate: "reroll that 🎲",
    copyButton: "yoink",
    copied: "no cap 🧢",
    emptyState: "dry dry text area... paste something!",
    imageUpload: "scan da chat 📸",
    extractingText: "reading receipts... 🧐",
  },

  // Tone descriptions
  tones: {
    safe: {
      label: "wholesome / friendly",
      emoji: "🌱",
      description: "friendly, low stakes, safe bet",
    },
    playful: {
      label: "playful / witty",
      emoji: "✨",
      description: "fun, teasing, immaculate vibes",
    },
    flirty: {
      label: "rizz god / flirty",
      emoji: "😏",
      description: "smooth, charming, shoot your shot",
    },
    bold: {
      label: "unhinged / bold",
      emoji: "🔥",
      description: "high risk, high reward",
    },
  },

  // Usage stats
  usage: {
    title: "stats",
    dailyLabel: "today's rizz",
    monthlyLabel: "monthly vibes",
    limitLabel: "limit",
    remaining: (count: number) => `${count} left`,
  },

  // Errors
  errors: {
    generic: "big yikes, something broke",
    network: "wifi acting sus",
    authFailed: "ain't lookin right chief",
    quotaExceeded: "you cooked too hard today. chill till tmrw.",
    emptyConversation: "feed me some text first!",
  },

  // Success messages
  success: {
    accountCreated: "welcome to the club ✨",
    loggedIn: "we back!",
  },
} as const;
