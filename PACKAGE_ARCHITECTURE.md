# Package Architecture

## Overview

`@navgurukul/emotion-avatar-sdk` is a React SDK that renders a real‑time, emotion‑aware animated avatar.  

It analyses conversation state and user transcripts to select the most appropriate avatar expression.  
Emotion detection runs entirely in the browser using an ONNX‑based encoder‑classifier model (with a Hugging Face tokenizer) and bundled lexicons.  

Avatar image assets are compiled directly into the SDK bundle as base64 data‑URIs – no runtime image fetching is required.  

The SDK is designed to integrate with any conversational AI application and remains independent of the consumer’s STT, TTS, or LLM implementation.

---

# High‑Level Architecture

```
                  Consumer Application
                           │
                           │
    aiMessage, user transcripts, speaking/listening state
                           │
                           ▼
                 AnimatedAvatar Component
                           │
                           ▼
               useAvatarController Hook
                 │                    │
                 │                    │
                 ▼                    ▼
       Emotion Classification     Asset Resolution
                 │                    │
                 ▼                    ▼
          ONNX Model + Lexicon    Base64 Data‑URIs
                 │                    │
                 └────────────┬───────┘
                              │
                              ▼
                      AvatarRenderer
                              │
                              ▼
                      Animated Avatar
```

---

# Project Structure

```
src
│   index.ts
│
├───components
│       AnimatedAvatar.tsx
│       AvatarRenderer.tsx
│
├───constants
│       defaultImages.ts
│       emotionAssetData.ts
│       emotionAssets.ts
│
├───hooks
│       useAvatarController.ts
│
├───services
│   └───emotion
│           emotionStreamProcessor.ts
│           onnxRuntime.ts
│
└───types
        assets.d.ts
```

---

# Component Layer

## AnimatedAvatar

`AnimatedAvatar` is the public entry point of the SDK. It:

* Receives conversation state from the consumer application (`aiMessage`, `userMessageInterim`, `userMessageFinal`, `isSpeaking`, `isListening`)
* Calls `useAvatarController` to drive emotion analysis and state management
* Schedules emotion updates based on incoming messages:
  * For **AI messages**: analyses the full sentence and resets to neutral after 1 second of silence
  * For **interim user transcripts**: analyses when the chunk exceeds 2 words or 16 characters, and triggers a reset of the stream processor after 5 seconds of inactivity
  * For **final user transcripts**: analyses immediately and forces a return to neutral after 2 seconds
* Manages the loading state – displays a placeholder avatar with a bouncing‑dots indicator while the model is initialising
* Delegates rendering to `AvatarRenderer`

## AvatarRenderer

`AvatarRenderer` is a pure presentation component. It:

* Receives an `emotionId` string (a 28‑label model emotion, a base mascot key, or a legacy `EmotionState`)
* Resolves the appropriate base64 data‑URI (via `getMascotAssetUrl`) – speaking variants are automatically selected when `isSpeaking` is `true`
* Renders the avatar image with user‑provided styling (`className`, `style`)
* Applies default presentation (rounded container, shadow, white background)

No emotion analysis or business logic exists in this component.

---

# Hook Layer

## useAvatarController

This hook owns the core logic. It:

* **Initialises the emotion classifier** – warms up the ONNX model (tokenizer + encoder + classifier) and sets `isInitialized` when ready.
* **Loads avatar assets** – assets are already embedded in the bundle; no runtime loading occurs.
* **Manages emotion state** – exposes `emotionId` (the resolved base mascot key) and `setEmotion` for manual overrides.
* **Analyses incoming transcripts** – `analyzeEmotion` calls the full processing pipeline (`processAndClassify`), which combines rule‑based extraction with ONNX inference, applies lexical corrections, and smooths predictions.
* **Responds to speaking / listening states** – sets the emotion to `"neutral-focused"` when the AI is speaking, `"listening"` when the user is speaking, and `"neutral"` when idle – but these can be overridden by transcript‑based emotions.
* **Cleans up** – disposes the ONNX model when the component unmounts.

The hook exposes only the state required by `AnimatedAvatar`.

---

# Emotion Processing Pipeline

The SDK processes text in multiple stages before updating the avatar.

```
Incoming Transcript (interim or final)
        │
        ▼
Rule‑Based Analysis (valence, token count, …)
        │
        ▼
Stream Buffer & Chunk Selection (contrast‑aware)
        │
        ▼
ONNX Inference (encoder + classifier)
        │
        ▼
Lexical Correction (negation / contrast applied to scores)
        │
        ▼
Smoothing (rolling window of 4 predictions)
        │
        ▼
Top Emotion Selection (threshold / contrast‑shift logic)
        │
        ▼
Base Mascot Key Resolution
        │
        ▼
Speaking Asset Selection (if isSpeaking)
        │
        ▼
Data‑URI (base64 image)
```

### Stream Buffer

A chunk buffer (`pendingBuffer`) ensures that only meaningful transcript growth triggers a model call:  
* A chunk is sent when it contains > 2 words or > 15 characters of *new* text since the last send.  
* Contrast markers (e.g. “but”, “however”) close the preceding clause immediately, flushing it to the model and clearing the smoothing history on the next turn – this allows mid‑utterance emotional reversals (like “…but now I’m anxious”) to be detected.

### Lexical Correction

After the model produces raw per‑label scores, the system applies the same negation/contrast analysis to the chunk itself, nudging the probabilities away from labels that conflict with the resolved valence. This stops cases where the model outputs `disappointment` for “I’m not disappointed”.

### Smoothing

A FIFO queue of up to 4 predictions is kept. The emitted emotion is the element‑wise average of the queue; a switch to a new top label only occurs if the gap exceeds a tiny threshold, or if a contrast shift was detected.

---

# Emotion Mapping

The ONNX classifier emits 28 GoEmotions labels. Each label maps to a **base mascot key**. When the avatar is in a speaking state, a separate **speaking asset** is chosen.

### 28‑Label → Base Mascot Key

| Model emotions                             | Base mascot key |
|--------------------------------------------|------------------|
| love                                       | love‑strong      |
| caring, desire                             | gentle‑love      |
| joy, amusement, excitement                 | happy‑strong     |
| pride                                      | celebration      |
| admiration, approval, optimism, relief, gratitude | happy‑gentle |
| neutral                                    | neutral          |
| curiosity, confusion                       | thinking         |
| realization, surprise                      | surprise         |
| anger, annoyance                           | anger            |
| disapproval, disgust                       | disgust          |
| fear, nervousness, embarrassment           | fear             |
| sadness, disappointment                    | sad‑gentle       |
| grief, remorse                             | sad‑strong       |

### Speaking Assets

- **happy‑strong**, **happy‑gentle**, **love‑strong**, **gentle‑love**, **surprise**, **celebration** → `speaking_happy`
- **sad‑strong** → `sad‑speaking‑strong` (falls back to `sad‑speaking_gentle`)
- **sad‑gentle** → `sad‑speaking_gentle`
- All other base keys (thinking, anger, disgust, fear, shoked) → `speaking_neutral`

Legacy `EmotionState` values (LISTEN, HAPPY, …) pass through a legacy‑to‑model‑emotion map before being resolved to the same base mascot keys. Matching is case‑insensitive.

---

# Asset Management

Avatar images are **embedded at build time** as base64 data‑URIs inside the `emotionAssetData.ts` file. The script `scripts/generate-asset-map.js` reads the contents of `public/assets/` and produces a TypeScript file that maps each filename (without extension) to its corresponding `data:image/webp;base64,…` string.

At runtime, the function `getMascotAssetUrl` simply looks up the appropriate base64 URI – there are no network requests for images, no fallback logic, and no consumer‑side asset path configuration. This guarantees that the avatar displays instantly once the SDK bundle loads, with no dependency on external servers or image loading states.

---

# Model Management

Emotion detection uses a two‑stage ONNX model hosted on Hugging Face (`YashM21/Encoder-Decoder-INT4`). The SDK loads:

* **Tokenizer** – from `@huggingface/transformers` (AutoTokenizer, pulled from the same HF repo).
* **Encoder** – `embedder_v2b_q4.onnx` (quantised to INT4).
* **Classifier head** – `head_goemotions.onnx`.
* **Thresholds** – `thresholds.json`.

All remote fetches are cached in the browser’s Cache Storage (cache name `emotion-onnx-cache-v1`) to avoid re‑downloading across page reloads.

On initialisation:

1. The tokenizer is loaded and cached.
2. The two `.onnx` files and `thresholds.json` are fetched and stored in Cache Storage.
3. ONNX Runtime inference sessions are created with graph optimisation level `"all"`.
4. A warm‑up inference is run to compile the WASM graph and avoid cold‑start latency on the first real input.

A singleton `ONNXEmotionModel` instance (`defaultPredictor`) is reused across the application. It implements an LRU result cache (to skip redundant inferences) and a concurrency scheduler (max 1 concurrent inference, max queue depth 50). The model is disposed when the component unmounts.

---

# Avatar State Flow

The avatar’s visual emotion is determined by the **last analysed transcript** or **conversation state**.

* If the AI is currently speaking (`isSpeaking = true`) and no transcript analysis is in progress, the avatar shows `neutral-focused`.
* If the user is speaking (`isListening = true`) without a recent analysis, the avatar shows `listening`.
* When a **final or interim transcript** arrives, emotion analysis runs and the avatar switches to the detected emotion, overriding the listening state.
* After a period of silence (1 second for AI messages, 2 seconds for final user transcripts), the emotion resets to `neutral`.
* During long periods of idle (no transcripts), the avatar returns to `neutral`.

Thus, the avatar reacts to the content of the conversation, not just binary speaking/listening flags.

---

# Styling

The SDK exposes styling through three mechanisms.

### Container Styling
Applied to the outer wrapper via `containerClassName`.

### Avatar Styling
Applied directly to the avatar image via `avatarClassName`.

### Inline Styling
Passed through the standard React `style` prop, merged with the default presentation styles. Inline styles have the highest priority.

---

# Public API

The SDK intentionally exposes a minimal public API.

**Component**: `AnimatedAvatar`

**Props**:
- `aiMessage`
- `userMessageInterim`
- `userMessageFinal`
- `isSpeaking`
- `isListening`
- `containerClassName`
- `avatarClassName`
- `style`
- `onInitialized`
- `onEmotionDebug`

All emotion processing, asset resolution, model initialisation, and rendering remain internal.

---

# Build Output

```
dist/
├── index.js        (ES Module)
├── index.cjs       (CommonJS)
└── index.d.ts      (TypeScript declarations)
```

Base64‑encoded avatar assets are inlined inside the JavaScript bundle – there is no separate `assets/` folder at runtime. The build includes everything needed to render the avatar with zero additional network requests.

---

# Responsibilities

### SDK Responsibilities
- Emotion detection (rule‑based + ONNX model)
- Avatar rendering
- Avatar asset management (bundled base64 images)
- Model loading and caching
- Emotion state smoothing and contrast‑aware transitions

### Consumer Responsibilities
- Speech‑to‑Text integration
- Text‑to‑Speech integration
- LLM integration
- Conversation management
- UI layout

---

# Design Principles

- Browser‑only execution – no backend dependencies
- Minimal API surface – just one component and a handful of props
- Automatic model initialisation (download, cache, warm‑up)
- Assets baked into the bundle – no runtime image fetching, no fallback complexity
- Smooth, debounced avatar transitions resistant to noise and brief emotional spikes
- Framework‑independent conversation pipeline – works with any STT / TTS / LLM stack
- Easy integration into existing React applications