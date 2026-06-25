# @anshika.t/avatar-sdk

A real-time animated avatar SDK for React that detects emotion from LLM and user text, and renders a responsive avatar accordingly. Runs entirely in the browser using a bundled ONNX model — no server calls, no external API.

---

## How it works

Text from your LLM or user is analyzed by a quantized BERT model (bundled inside the package) running locally via WebAssembly. The model classifies the text into one of 13 emotions, which are then mapped to one of 6 avatar states. The avatar renders a `.webp` animation frame that matches the detected emotion.

```
LLM response / user message
        ↓
BERT ONNX model (runs in browser via WASM)
        ↓
13-class emotion → 6 avatar states
        ↓
Animated .webp avatar
```

---

## Requirements

- React 18 or 19
- A Vite-based app (Next.js works too — see notes below)

---

## Installation

<!-- For locally installation -   clone the repo first then on the same location create another folder for testing  -->

npm install ../emotion-avatar-sdk/anshika.t-avatar-sdk-0.0.2.tgz

```bash
npm install @anshika.t/avatar-sdk
```

Then install the required peer dependencies if you don't have them already:

```bash
npm install @huggingface/transformers onnxruntime-web
```

---

## Consumer app setup

### 1. Add avatar assets to your public folder

The package does not bundle avatar images. Place your `.webp` files in your app's `public/avatars/` folder using these exact filenames:

```
public/
└── avatars/
    ├── listening.webp
    ├── speaking-edited.webp
    ├── ballbounce.webp
    ├── regular-thinking.webp
    ├── glassadjustment.webp
    └── bubblepop.webp
```

These map to the six avatar emotion states:

| File | Emotion state | Triggered by |
|---|---|---|
| `listening.webp` | LISTEN | Default / idle |
| `speaking-edited.webp` | SPEAK_NEUTRAL | `isSpeaking: true` |
| `ballbounce.webp` | ENCOURAGE | Joy, love, desire |
| `regular-thinking.webp` | THINK | Surprise, confusion |
| `glassadjustment.webp` | CAUTION | Anger, fear, sadness, disgust |
| `bubblepop.webp` | CELEBRATE | Manual override |

### 2. Update your Vite config

Add this to your app's `vite.config.ts` to prevent Vite from trying to bundle the ONNX WebAssembly runtime:

```ts
export default defineConfig({
  optimizeDeps: {
    exclude: ["onnxruntime-web"],
  },
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
});
```

The `Cross-Origin-*` headers are required for `SharedArrayBuffer`, which the ONNX WASM backend uses internally.

### 3. Warm up the model on app mount

The first time the model loads it takes 300–800ms. Call `warmUpEmotionClassifier()` once when your app starts so the model is ready before the user sends their first message:

```tsx
import { warmUpEmotionClassifier } from "@anshika.t/avatar-sdk";
import { useEffect } from "react";

export function App() {
  useEffect(() => {
    warmUpEmotionClassifier().catch(console.warn);
  }, []);

  return <YourApp />;
}
```

---

## Basic usage

```tsx
import { AnimatedAvatar } from "@anshika.t/avatar-sdk";

export function ChatUI() {
  const [llmResponse, setLlmResponse] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  return (
    <div>
      <AnimatedAvatar
        aiMessage={llmResponse}
        userMessage={userMessage}
        isSpeaking={isSpeaking}
        isListening={isListening}
        size={260}
      />
    </div>
  );
}
```

The avatar automatically:
- Switches to `SPEAK_NEUTRAL` while TTS is playing (`isSpeaking: true`)
- Switches to `LISTEN` while STT is active (`isListening: true`)
- Analyzes `aiMessage` and `userMessage` for emotion when they change

---

## Props

### `<AnimatedAvatar />`

| Prop | Type | Default | Description |
|---|---|---|---|
| `aiMessage` | `string` | `""` | Latest text from the LLM. Analyzed for emotion automatically. |
| `userMessage` | `string` | `""` | Latest text from the user. Analyzed for emotion automatically. |
| `isSpeaking` | `boolean` | `false` | Pass your TTS speaking state. Sets avatar to SPEAK_NEUTRAL. |
| `isListening` | `boolean` | `false` | Pass your STT listening state. Sets avatar to LISTEN. |
| `emotionDetection` | `boolean` | `true` | Enable or disable automatic ML emotion analysis. |
| `autoAnimate` | `boolean` | `true` | Enable or disable automatic state transitions. |
| `overrideEmotion` | `EmotionState` | — | Manually force a specific avatar state. |
| `onEmotionChange` | `(emotion, intensity) => void` | — | Callback fired whenever the avatar emotion changes. |
| `emotionImages` | `Partial<Record<EmotionState, string>>` | — | Override individual or all avatar image paths. |
| `size` | `number` | `260` | Avatar size in pixels (width and height). |
| `className` | `string` | `""` | CSS class applied to the outer container div. |

---

## Custom image paths

If your assets are in a different location than `public/avatars/`, import `DEFAULT_AVATAR_IMAGES` and override just the paths you need:

```tsx
import { AnimatedAvatar, DEFAULT_AVATAR_IMAGES, EmotionState } from "@anshika.t/avatar-sdk";

<AnimatedAvatar
  aiMessage={llmResponse}
  emotionImages={{
    ...DEFAULT_AVATAR_IMAGES,
    [EmotionState.CELEBRATE]: "/my-path/custom-celebrate.webp",
  }}
/>
```

Or override all paths at once:

```tsx
import { EmotionState } from "@anshika.t/avatar-sdk";

const myImages: Record<EmotionState, string> = {
  [EmotionState.LISTEN]:        "/my-path/idle.webp",
  [EmotionState.SPEAK_NEUTRAL]: "/my-path/talking.webp",
  [EmotionState.ENCOURAGE]:     "/my-path/happy.webp",
  [EmotionState.THINK]:         "/my-path/thinking.webp",
  [EmotionState.CAUTION]:       "/my-path/cautious.webp",
  [EmotionState.CELEBRATE]:     "/my-path/celebrate.webp",
};

<AnimatedAvatar aiMessage={llmResponse} emotionImages={myImages} />
```

---

## Manual emotion control

Disable automatic detection and drive the avatar state yourself:

```tsx
import { AnimatedAvatar, EmotionState } from "@anshika.t/avatar-sdk";

<AnimatedAvatar
  emotionDetection={false}
  autoAnimate={false}
  overrideEmotion={EmotionState.CELEBRATE}
/>
```

---

## Using hooks directly

If you need more control, use the hooks instead of `AnimatedAvatar`:

```tsx
import {
  useEmotionController,
  useAvatarController,
  EmotionState,
} from "@anshika.t/avatar-sdk";

// Higher-level: full emotion pipeline with debouncing and warm-up
const { emotionState, intensity, analyzeText } = useEmotionController({
  aiMessage,
  userMessage,
  isSpeaking,
  isListening,
});

// Lower-level: manual emotion setting + on-demand analysis
const { emotionState, intensity, setEmotion, analyzeEmotion } = useAvatarController({
  isSpeaking,
  isListening,
  onEmotionChange: (emotion, intensity) => console.log(emotion, intensity),
});
```

---

## Using the classifier directly

```tsx
import {
  classifyEmotion,
  warmUpEmotionClassifier,
  isEmotionClassifierReady,
  disposeEmotionClassifier,
} from "@anshika.t/avatar-sdk";

// Warm up on mount
await warmUpEmotionClassifier();

// Classify any text
const result = await classifyEmotion("I just solved a really tough bug!");
console.log(result);
// {
//   topEmotion: "happiness",
//   confidence: 0.94,
//   scores: { happiness: 0.94, neutral: 0.03, ... },
//   inferenceMs: 42
// }

// Check if model is ready (sync)
if (isEmotionClassifierReady()) { ... }

// Clean up when done (e.g. on unmount)
await disposeEmotionClassifier();
```

---

## Emotion states

```ts
enum EmotionState {
  LISTEN        = "LISTEN",         // idle / waiting
  SPEAK_NEUTRAL = "SPEAK_NEUTRAL",  // TTS active
  ENCOURAGE     = "ENCOURAGE",      // happiness, love, desire
  THINK         = "THINK",          // surprise, confusion
  CAUTION       = "CAUTION",        // anger, fear, sadness, disgust, shame, guilt, sarcasm
  CELEBRATE     = "CELEBRATE",      // manual override / special moments
}
```

### Model emotion → avatar state mapping

| Model output | Avatar state |
|---|---|
| happiness, love, desire | ENCOURAGE |
| anger, fear, sadness, disgust, shame, guilt, sarcasm | CAUTION |
| surprise, confusion | THINK |
| neutral | LISTEN |

---

## Next.js usage

Add the following to `next.config.js` to handle the ONNX WASM files:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

---

## Exports

```ts
// Components
export { AnimatedAvatar } from "./components/AnimatedAvatar";
export { AvatarRenderer } from "./components/AvatarRenderer";

// Hooks
export { useAvatarController } from "./hooks/useAvatarController";
export { useEmotionController } from "./hooks/useEmotionController";

// Constants
export { DEFAULT_AVATAR_IMAGES } from "./constants/defaultImages";

// Services
export { warmUpEmotionClassifier } from "./services/emotion/emotionClassifier";
export { isEmotionClassifierReady } from "./services/emotion/emotionClassifier";
export { classifyEmotion } from "./services/emotion/emotionClassifier";
export { disposeEmotionClassifier } from "./services/emotion/emotionClassifier";
export { extractTextSignals } from "./services/emotion/textSignals";
export { extractTextSignalsWithML } from "./services/emotion/textSignals";

// Types
export type { AnimatedAvatarProps } from "./components/AnimatedAvatar";
export type { UseAvatarControllerProps, AvatarControllerReturn } from "./hooks/useAvatarController";
export type { EmotionState, EmotionOutput, TextSignals, EmotionLabel } from "./types/emotion";
```

---

## License

MIT © Anshika-Tripathi