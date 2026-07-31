# emotion-avatar-sdk

A React SDK that renders a real‑time, emotion‑aware animated avatar.  
The avatar’s expression automatically updates based on conversation state, AI responses, and user transcripts.  
Emotion detection runs **entirely in the browser** using an on‑device ONNX model – no backend is required.

---

## Features

- 🎭 Real‑time avatar animation  
- 🔍 Automatic emotion detection from user transcripts  
- ⚡ On‑device inference (ONNX + Hugging Face tokenizer)  
- 🔌 Works with any STT, TTS, or LLM pipeline  
- 🖼️ All avatar assets are **embedded in the bundle** – no external image loading  
- 🎨 Easy styling via CSS classes or inline styles  

---

## Installation

```bash
npm install emotion-avatar-sdk
```

The SDK uses `react` and `react-dom` (peer dependencies) as well as  
`@huggingface/transformers` and `onnxruntime-web`.  
If they aren’t already installed, add them to your project:

```bash
npm install react react-dom @huggingface/transformers onnxruntime-web
```

---

## Quick Start

```tsx
import { AnimatedAvatar } from "emotion-avatar-sdk";

function ChatInterface() {
  return (
    <AnimatedAvatar
      aiMessage={currentAiText}
      userMessageInterim={liveTranscript}
      userMessageFinal={finalTranscript}
      isSpeaking={aiIsSpeaking}
      isListening={userIsSpeaking}
    />
  );
}
```

The SDK automatically:

- Initializes the emotion model (download, cache, and warm‑up)  
- Detects emotions from transcripts  
- Updates the avatar expression in real time  
- Handles speaking and listening states  

> While the model loads, a **loading indicator** is shown – no extra code required.

---

## Integration Guide

Provide these values from your application:

| Prop                 | Description                                              |
| -------------------- | -------------------------------------------------------- |
| `aiMessage`          | Current AI response text                                 |
| `userMessageInterim` | Live/partial transcript from your STT system             |
| `userMessageFinal`   | Final transcript after the user stops speaking           |
| `isSpeaking`         | `true` while the AI is speaking (TTS active)             |
| `isListening`        | `true` while the user is speaking (STT listening)        |

### Transcript Handling

The SDK supports three common workflows:

- **Live only** – pass `userMessageInterim` continuously  
- **Final only** – pass `userMessageFinal` after the utterance completes  
- **Both (recommended)** – pass both props for immediate reactions and accurate final emotions  

---

## Styling

Match the avatar to your design with three styling hooks:

```tsx
<AnimatedAvatar
  containerClassName="rounded-xl border shadow-lg"   // outer wrapper
  avatarClassName="rounded-full"                      // the <img> element
  style={{ width: "180px", height: "180px" }}         // inline styles (highest priority)
/>
```

---

## Component Props

| Prop                 | Type                             | Default     | Description                                                 |
| -------------------- | -------------------------------- | ----------- | ----------------------------------------------------------- |
| `aiMessage`          | `string`                         | `""`        | Current AI response                                         |
| `userMessageInterim` | `string`                         | `""`        | Live/partial transcript                                     |
| `userMessageFinal`   | `string`                         | `""`        | Final transcript                                            |
| `isSpeaking`         | `boolean`                        | `false`     | AI is currently speaking (TTS active)                       |
| `isListening`        | `boolean`                        | `false`     | User is speaking (STT listening)                            |
| `containerClassName` | `string`                         | `undefined` | CSS class for the outer wrapper                             |
| `avatarClassName`    | `string`                         | `undefined` | CSS class for the avatar image                              |
| `style`              | `React.CSSProperties`            | `undefined` | Inline styles (merged with default)                         |
| `onInitialized`      | `(initialized: boolean) => void` | `undefined` | Called when the emotion model is ready                      |
| `onEmotionDebug`     | `(info: EmotionDebugInfo) => void`| `undefined` | Debug callback – fires after each emotion analysis          |

---

## How It Works – At a Glance

1. **Transcript arrives** → rule‑based analysis extracts valence and keyword cues  
2. **Stream buffer** decides when enough new text has accumulated to call the model  
3. **ONNX inference** runs an encoder‑classifier model (28 emotion labels)  
4. **Lexical correction** adjusts scores for negation and contrast (e.g. “not disappointed”)  
5. **Smoothing** blends the last few predictions to avoid flickering  
6. **Emotion mapping** resolves the top label into a base mascot key, then picks the correct speaking/static image – all from bundled data‑URIs

---

## Asset Management – No Setup Required

Avatar images are **compiled directly into the SDK** as base64 strings.  
There is **no** `public/assets` folder to copy, no runtime image downloads, and no fallback logic to configure.  
Everything works out of the box.

---

## Peer Dependencies

Make sure these are installed in your project:

- `react` ≥ 18  
- `react-dom` ≥ 18  
- `@huggingface/transformers` (for the tokenizer)  
- `onnxruntime-web` (for inference)

---

## Responsibilities

### ✅ SDK Responsibilities

- Avatar rendering and animation  
- Emotion detection (rule‑based + ONNX model)  
- Model loading, caching, and warm‑up  
- Asset management (images embedded in bundle)  

### 🧩 Consumer Responsibilities

- Speech‑to‑Text integration  
- Text‑to‑Speech integration  
- LLM / chatbot integration  
- Conversation state management  
- Chat UI layout  

---

## Further Reading

Detailed architecture, the full emotion pipeline, and the emotion‑to‑mascot mapping are documented in **`PACKAGE_ARCHITECTURE.md`** (available in the repository).

---

## License

AGPL‑3.0‑or‑later
