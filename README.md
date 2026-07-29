# emotion-avatar-sdk

A React SDK for rendering a real-time animated avatar with emotion-aware animations.

The SDK automatically updates avatar expressions based on conversation state, AI responses, and user transcripts. Emotion detection runs entirely in the browser using an on-device Hugging Face model, requiring no backend service.

---

## Features

- Real-time avatar animation
- Automatic emotion detection from user transcripts
- On-device inference using Hugging Face Transformers
- Works with any Speech-to-Text (STT), Text-to-Speech (TTS), or LLM pipeline
- Built-in avatar assets and emotion handling
- Easy customization using CSS classes or inline styles

---

## Installation

Install the SDK:

```bash
npm install emotion-avatar-sdk
```

Install the required peer dependencies if they are not already available in your application.

```bash
npm install react react-dom @huggingface/transformers onnxruntime-web
```

---

## Quick Start

Import the component and provide your application's conversation state.

```tsx
import { AnimatedAvatar } from "emotion-avatar-sdk";

function App() {
  return (
    <AnimatedAvatar
      aiMessage={aiMessage}
      userMessageInterim={interimText}
      userMessageFinal={finalText}
      isSpeaking={isPlaying}
      isListening={isListening}
    />
  );
}
```

The SDK automatically:

- Initializes the emotion model
- Loads avatar assets
- Detects emotions from transcripts
- Updates avatar expressions
- Handles listening and speaking states

---

# Integration Guide

The component expects the following values from your application.

| Prop                 | Description                                                 |
| -------------------- | ----------------------------------------------------------- |
| `aiMessage`          | Current AI response text.                                   |
| `userMessageInterim` | Live or partial transcript from your Speech-to-Text system. |
| `userMessageFinal`   | Final transcript after speech completion.                   |
| `isSpeaking`         | Set to `true` while Text-to-Speech is speaking.             |
| `isListening`        | Set to `true` while Speech-to-Text is listening.            |

Example:

```tsx
<AnimatedAvatar
  aiMessage={aiMessage}
  userMessageInterim={interimText}
  userMessageFinal={finalText}
  isSpeaking={isPlaying}
  isListening={isListening}
/>
```

---

## Transcript Handling

The SDK supports multiple Speech-to-Text workflows.

### Live Transcript Only

Use only `userMessageInterim` if your application continuously streams transcript updates.

### Final Transcript Only

Use only `userMessageFinal` if your application provides the transcript after speech is completed.

### Live + Final Transcript (Recommended)

Provide both `userMessageInterim` and `userMessageFinal`.

This allows the avatar to respond immediately to live speech while updating with the final detected emotion once the transcript is finalized.

---

## Styling

The SDK exposes styling hooks so the avatar can match your application's design.

### Container Styling

Apply styles to the outer container.

```tsx
<AnimatedAvatar containerClassName="rounded-xl border shadow-lg" />
```

### Avatar Styling

Apply styles directly to the avatar image.

```tsx
<AnimatedAvatar avatarClassName="rounded-full" />
```

### Inline Styling

Apply inline styles directly to the avatar.

```tsx
<AnimatedAvatar
  style={{
    width: "180px",
    height: "180px",
    borderRadius: "20px",
    opacity: 1,
  }}
/>
```

> **Note:** Inline styles have the highest priority and override any styles applied through CSS classes.

---

## Component Props

| Prop                 | Type                             | Default     | Description                                                 |
| -------------------- | -------------------------------- | ----------- | ----------------------------------------------------------- |
| `aiMessage`          | `string`                         | `""`        | Current AI response.                                        |
| `userMessageInterim` | `string`                         | `""`        | Live or partial transcript.                                 |
| `userMessageFinal`   | `string`                         | `""`        | Final transcript.                                           |
| `isSpeaking`         | `boolean`                        | `false`     | Indicates whether the AI is currently speaking.             |
| `isListening`        | `boolean`                        | `false`     | Indicates whether the application is currently listening.   |
| `containerClassName` | `string`                         | `undefined` | CSS class applied to the avatar container.                  |
| `avatarClassName`    | `string`                         | `undefined` | CSS class applied to the avatar image.                      |
| `style`              | `React.CSSProperties`            | `undefined` | Inline styles applied to the avatar image.                  |
| `onInitialized`      | `(initialized: boolean) => void` | `undefined` | Callback invoked once the SDK has completed initialization. |

---

## Responsibilities

### Provided by the SDK

- Avatar rendering
- Emotion detection
- Emotion-aware avatar animations
- Model initialization
- Asset loading and management

### Expected from the Consumer Application

- Speech-to-Text integration
- Text-to-Speech integration
- LLM or chatbot integration
- Conversation state management
- Chat interface

---

## Avatar Assets Setup

The SDK requires WebP avatar assets to display emotions. You have two options:

### Option 1: Use Default Assets (Recommended)

Copy the assets from the package to your app's public folder:

```bash
# Create assets folder in your public directory
mkdir -p public/assets

# Copy all WebP files from the package
cp -r node_modules/emotion-avatar-sdk/dist/src/assets/* public/assets/
```

The SDK will automatically load assets from `/assets/` at runtime.

### Option 2: Custom Assets

Place your custom WebP files in `public/assets/` with the following filenames:

**Base Mascot Assets:**
- `Love-Strong.webp`, `gentle-love.webp`, `happy_strong.webp`, `happy_gentle.webp`
- `thinking.webp`, `surprise.webp`, `anger.webp`, `disgust.webp`, `fear.webp`
- `sad-Strong.webp`, `sad-gentle.webp`, `celebration.webp`, `shoked.webp`

**Speaking Assets:**
- `speaking_happy.webp`, `speaking_neutral.webp`, `sad-speaking_gentle.webp`

> **Note:** The SDK expects assets at `/assets/` (relative to your app root). Ensure your WebP files are optimized and under 1MB each for best performance.

## Documentation

The SDK architecture, implementation details, and package structure are documented separately in **`PACKAGE_ARCHITECTURE.md`**.

---

## License

AGPL-3.0-or-later
