# Rizzlet

Rizzlet is an AI-powered texting copilot that helps people respond better in dating and social conversations.

## Vision

Many people know *what they feel* but not *what to type*. Rizzlet removes hesitation by turning real conversation context into short, confident, ready-to-send replies.

Rizzlet is built to:
- Keep chats alive when conversations go dry.
- Help users avoid awkward or low-signal responses.
- Recover stalled conversations.
- Start conversations more naturally.
- Smoothly move toward real-life plans.

## Product Principles

1. **Human-first output**: suggestions should sound natural, not robotic.
2. **Context-aware reasoning**: responses should reflect tone, timing, intent, and interest signals.
3. **User control over style**: users choose safe, playful, flirty, or bold tone.
4. **Platform-sensitive communication**: adapt to Tinder, Instagram, WhatsApp, iMessage, and other messaging norms.
5. **Confidence without replacement**: amplify personality, don’t replace it.

## Core Workflow

1. User pastes a chat, uploads messages, or submits screenshots.
2. OCR (when needed) extracts text from screenshots.
3. Backend normalizes conversation history and metadata.
4. AI analyzes emotional tone, flow, and likely intent.
5. System returns multiple reply options with selected tone profile.
6. User sends, edits, or regenerates suggestions.

## MVP Feature Set

- **Reply generation**: short, ready-to-send responses.
- **Tone control**: safe / playful / flirty / bold modes.
- **Conversation rescue**: suggestions for dry or awkward moments.
- **Conversation starters**: first-message and opener suggestions.
- **Ask-out progression**: move from chat to plan naturally.
- **Usage tracking**: request counting, limits, and account usage stats.

## Technical Direction

### Frontend
- Mobile or web client focused on speed and low friction.
- Fast chat input UX with one-tap copy actions.

### Backend
- Authentication and account management.
- Usage tracking and billing readiness.
- API orchestration for OCR + LLM inference.

### AI Layer
- OCR pipeline for screenshot-to-text conversion.
- LLM prompting + safety constraints for style-controlled generation.
- Context scoring for tone, intent, and engagement signals.

### Non-Functional Goals
- Low latency for near real-time reply generation.
- Cost-efficient inference strategy.
- Scalable architecture for growth.

## Roadmap Expansion

After dating use cases, Rizzlet can expand into:
- General social texting.
- Networking and relationship-building messages.
- Professional communication assistance.

## Long-Term Thesis

Rizzlet is more than a reply generator. It is a communication intelligence layer for modern digital conversations.
