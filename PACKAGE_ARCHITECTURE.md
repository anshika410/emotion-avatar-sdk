# Package Architecture

## Overview

`@anshika.t/avatar-sdk` is a zero-server, browser-native React SDK. It takes text input from an LLM or user, runs emotion classification locally using a quantized BERT model via WebAssembly, and renders an animated avatar that reflects the detected emotional state in real time.

The package ships no avatar images. It ships only JS, types, and the ONNX model. Avatar `.webp` files are provided by the consumer and served from their own public folder.

---

## Directory structure

```
emotion-avatar-sdk/
│
├── models/
│   └── onnx/                         # Bundled into dist/ at build time
│       ├── config.json               # Model architecture + 13-label id2label map
│       ├── model.onnx                # Full precision model
│       ├── model_int8.onnx           # Quantized model (used at runtime)
│       ├── special_tokens_map.json
│       ├── tokenizer_config.json
│       ├── tokenizer.json
│       └── vocab.txt
│
├── src/
│   ├── components/
│   │   ├── AnimatedAvatar.tsx        # Main consumer-facing component
│   │   └── AvatarRenderer.tsx        # Pure rendering — img tag + transition logic
│   │
│   ├── constants/
│   │   └── defaultImages.ts          # Default /avatars/*.webp path map
│   │
│   ├── hooks/
│   │   ├── useAvatarController.ts    # Lightweight hook — emotion state + analyzeEmotion
│   │   └── useEmotionController.ts   # Full hook — debouncing, warm-up, dispose
│   │
│   ├── services/
│   │   └── emotion/
│   │       ├── emotionClassifier.ts  # ONNX pipeline singleton + public classifier API
│   │       └── textSignals.ts        # Rule-based + ML hybrid text analysis
│   │
│   ├── types/
│   │   └── emotion.ts                # All shared types and enums
│   │
│   └── index.ts                      # Public API — all exports
│
├── vite.config.ts
├── tsconfig.json
├── package.json
├── README.md
└── PACKAGE_ARCHITECTURE.md
```

---

## Data flow

```
Consumer app
    │
    │  aiMessage, userMessage, isSpeaking, isListening
    ▼
AnimatedAvatar                          (src/components/AnimatedAvatar.tsx)
    │
    ├──► useAvatarController            (src/hooks/useAvatarController.ts)
    │         │
    │         │  text
    │         ▼
    │    extractTextSignalsWithML       (src/services/emotion/textSignals.ts)
    │         │
    │         │  rule-based signals (instant)
    │         │  + ML emotion (async)
    │         ▼
    │    classifyEmotion                (src/services/emotion/emotionClassifier.ts)
    │         │
    │         │  ONNX pipeline (WASM, singleton)
    │         ▼
    │    EmotionLabel (13 classes)
    │         │
    │         │  mapped to
    │         ▼
    │    EmotionState (6 states)
    │         │
    │         ▼
    │    emotionState + intensity
    │
    └──► AvatarRenderer                 (src/components/AvatarRenderer.tsx)
              │
              │  emotionImages[emotionState]  →  resolved URL
              ▼
         <img src={url} />              (consumer's public/avatars/*.webp)
```

---

## Layers

### Component layer — `src/components/`

**`AnimatedAvatar.tsx`** is the single entry point for most consumers. It:
- Accepts all props and merges `emotionImages` overrides with `DEFAULT_AVATAR_IMAGES`
- Wires `useAvatarController` for state management
- Responds to `isSpeaking` and `isListening` to override emotion state from parent TTS/STT
- Responds to `overrideEmotion` for manual control
- Passes a fully resolved image map down to `AvatarRenderer`

**`AvatarRenderer.tsx`** is a pure rendering component. It:
- Accepts a fully resolved `Record<EmotionState, string>` image map — no path logic lives here
- Preloads all emotion images on mount to eliminate flicker on state transitions
- Applies CSS transitions for opacity, scale, and brightness driven by `intensity`
- Tracks `isVideoSwitching` to expose a `loading` class during image swaps

### Hook layer — `src/hooks/`

Two hooks are provided at different levels of abstraction.

**`useAvatarController`** is the lighter hook used internally by `AnimatedAvatar`. It:
- Manages `emotionState` and `intensity` as local state
- Exposes `setEmotion` for manual overrides
- Exposes `analyzeEmotion(text)` which calls `extractTextSignalsWithML` and maps the result to an `EmotionState`
- Handles speaking/listening state via `useEffect`

**`useEmotionController`** is the fuller hook for consumers who want direct access to the emotion pipeline without using `AnimatedAvatar`. It adds:
- ML classifier warm-up on mount and dispose on unmount
- 1000ms debounce between ML inference calls (`ML_DEBOUNCE_MS`) to prevent flooding
- In-flight guard (`mlInferenceInFlightRef`) so concurrent messages don't race
- Separate `useEffect` blocks for `aiMessage` and `userMessage`

Use `useAvatarController` when building on top of `AnimatedAvatar`. Use `useEmotionController` when building a fully custom rendering layer.

### Service layer — `src/services/emotion/`

**`textSignals.ts`** provides two functions:

`extractTextSignals(text)` — synchronous, rule-based only, returns in under 1ms:
- `contentCompleteness` — scores 0–1 based on STAR framework marker detection (situation, task, action, result keywords)
- `sentimentValence` — scores -1 to +1 based on a curated positive/negative word set

`extractTextSignalsWithML(text)` — async, runs both rule-based and ML:
- Calls `classifyEmotion` from the classifier
- Merges ML results (`modelEmotion`, `modelConfidence`, `emotionScores`) into the base signals
- Returns the full `TextSignals` object

**`emotionClassifier.ts`** manages the ONNX pipeline as a module-level singleton:
- `getClassifier()` is private — initializes the pipeline on first call, returns the cached instance on subsequent calls, handles concurrent calls via a shared `loadPromise`
- The model path is resolved at runtime using `import.meta.url` so it always points to `dist/models/onnx/` relative to the installed package location
- `warmUpEmotionClassifier()` — runs a no-op inference to initialize the WASM runtime
- `classifyEmotion(text)` — runs inference, returns top emotion + all 13 scores + confidence + timing
- `disposeEmotionClassifier()` — tears down the pipeline and resets all singleton state
- `isEmotionClassifierReady()` — sync boolean check for the loaded state

### Types — `src/types/emotion.ts`

Single source of truth for all shared types:

```ts
enum EmotionState {
  LISTEN, SPEAK_NEUTRAL, ENCOURAGE, THINK, CAUTION, CELEBRATE
}

type EmotionLabel =
  "sadness" | "anger" | "love" | "surprise" | "fear" | "happiness" |
  "neutral" | "disgust" | "shame" | "guilt" | "confusion" | "desire" | "sarcasm"

interface EmotionOutput {
  state: EmotionState;
  intensity: number;        // 0–1, drives CSS opacity/scale/brightness
}

interface TextSignals {
  contentCompleteness: number;          // 0–1, STAR markers
  sentimentValence: number;             // -1 to +1
  modelEmotion: EmotionLabel | null;    // null until ML runs
  modelConfidence: number;              // 0–1
  emotionScores: Partial<Record<EmotionLabel, number>>;
}
```

`EmotionLabel` is defined here and imported everywhere else. It is not duplicated in `emotionClassifier.ts`.

### Constants — `src/constants/`

**`defaultImages.ts`** exports `DEFAULT_AVATAR_IMAGES`, a `Record<EmotionState, string>` mapping each state to a `/avatars/*.webp` path. This is the convention consumers follow when placing files in their `public/` folder. It is merged with any `emotionImages` prop overrides inside `AnimatedAvatar`.

---

## Model

The bundled model is a fine-tuned BERT for sequence classification with the following configuration:

| Property | Value |
|---|---|
| Architecture | BertForSequenceClassification |
| Hidden size | 256 |
| Attention heads | 4 |
| Hidden layers | 4 |
| Max position embeddings | 512 |
| Labels | 13 |
| Runtime | ONNX via `@huggingface/transformers` (WASM backend) |
| Quantization | INT8 (`model_int8.onnx`) |
| Inference time | ~30–80ms after warm-up on desktop |

### Label mapping

| ID | Label | Avatar state |
|---|---|---|
| 0 | sadness | CAUTION |
| 1 | anger | CAUTION |
| 2 | love | ENCOURAGE |
| 3 | surprise | THINK |
| 4 | fear | CAUTION |
| 5 | happiness | ENCOURAGE |
| 6 | neutral | LISTEN |
| 7 | disgust | CAUTION |
| 8 | shame | CAUTION |
| 9 | guilt | CAUTION |
| 10 | confusion | THINK |
| 11 | desire | ENCOURAGE |
| 12 | sarcasm | CAUTION |

---

## Build

The package is built with Vite in library mode.

```
src/index.ts
    │
    ▼
Vite (library mode)
    ├── dist/index.js          # ES module
    ├── dist/index.cjs         # CommonJS
    ├── dist/index.d.ts        # Rolled-up type declarations
    └── dist/models/onnx/      # Copied by vite-plugin-static-copy
```

`vite-plugin-static-copy` copies `models/` into `dist/models/` at build time. The `assets/` folder is not part of the package — avatar images are the consumer's responsibility.

Peer dependencies (`react`, `react-dom`, `@huggingface/transformers`, `onnxruntime-web`) are externalized and not bundled.

---

## Key design decisions

**Model path via `import.meta.url`** — the model path is resolved relative to the emitted JS file using `new URL("../models/onnx/", import.meta.url).href`. This means the path is always correct regardless of where the consumer installs the package or what their base URL is.

**Singleton pipeline** — the ONNX pipeline is initialized once per page load and reused. Initializing it per component mount would cause repeated 300–800ms load delays and wasted memory.

**No bundled avatar images** — `.webp` files are excluded from the package entirely. This keeps the package small, gives consumers full control over asset hosting and CDN caching, and avoids base64 bloat in the bundle.

**Dual hook design** — `useAvatarController` is kept minimal for use inside `AnimatedAvatar`. `useEmotionController` adds production-grade concerns (debouncing, in-flight guards, lifecycle management) for consumers building custom UIs on top of the emotion pipeline.

**`DEFAULT_AVATAR_IMAGES` as a named export** — rather than baking the default paths silently into the component, they are exported as a constant. Consumers can spread and override individual entries, or ignore the defaults entirely and pass a complete custom map.