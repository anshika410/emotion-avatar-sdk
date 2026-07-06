# @anshika.t/avatar-sdk

A React SDK for real‑time animated avatars powered by **on‑device emotion classification**.  
It analyses user or AI messages, detects the underlying emotion, and renders a corresponding avatar animation—all inside your browser, with no external API calls.

> **📦 Note**: This package is **not yet published on npm**. To use or test it, clone the repository and install it locally (see [Local Installation](#-local-installation-for-testing) below).

---

## ✨ Features

- **Real‑time emotion classification** – uses a lightweight DistilBERT model (via Transformers.js + ONNX Runtime) running locally.
- **10 emotion states** – mapped from model labels to distinct avatar expressions (happy, sad, angry, surprised, encourage, caution, think, celebrate, neutral listening, neutral speaking).
- **Smooth transitions** – avatar image changes are throttled to **800 ms** to avoid flickering and ensure a polished UX.
- **Flexible asset loading** – default avatar images are bundled locally, but you can override individual emotions or load all assets from Hugging Face.
- **Complete React hooks** – `useAvatarController` gives you full control over emotion analysis, state, and image resolution.
- **No server required** – everything runs client‑side; the model is cached in IndexedDB after the first load (~17 MB).
- **Designed for integration** – works with any chat UI, LLM, STT, or TTS system (these are **not** included).

---

## 📦 Installation

### Using the package locally (for testing)

Since the SDK is not yet published to npm, you need to install it from your local clone:

1. **Clone the repository**  
   ```bash
   git clone https://github.com/anshika410/emotion-avatar-sdk.git 
   cd avatar-sdk
   ```

2. **Install dependencies and build**  
   ```bash
   npm install
   npm run build          # or whatever build script is defined
   ```

3. **Install the local package in your application**  
   In your *application’s* root directory, run:
   ```bash
   npm install /path/to/avatar-sdk
   ```
   Or, if you want to keep it linked for development:
   ```bash
   npm link /path/to/avatar-sdk
   ```

   > **Tip**: Using `npm install ../avatar-sdk` with a relative path is often the simplest.

4. **Install peer dependencies** in your application (if not already present):
   ```bash
   npm install react react-dom @huggingface/transformers onnxruntime-web
   ```

Now you can import `AnimatedAvatar` from `@anshika.t/avatar-sdk` as shown in the examples below.

---

## ⚙️ Additional Setup

The SDK uses `onnxruntime-web` for inference. You must copy the ONNX runtime WASM files into your public directory.

1. Inside your project, create a folder: `public/ort/`
2. Copy the necessary `.wasm` files from `node_modules/onnxruntime-web/dist/` into that folder.

Example:

```text
public/
└── ort/
    ├── ort-wasm-simd-threaded.wasm
    ├── ort-wasm-simd.wasm
    └── ...
```

The SDK will look for these files at the `/ort/` path. If you serve them from a different location, you can configure it via the Transformers.js `env`:

```ts
import { env } from '@huggingface/transformers';
env.backends.onnx.wasm!.wasmPaths = '/your-custom-path/';
```

---

## 🚀 Quick Start

The simplest way to get started is to import the component and pass your transcript and speaking/listening states.

```tsx
import { AnimatedAvatar } from '@anshika.t/avatar-sdk';

function App() {
  // These would typically come from your STT and TTS systems
  const [transcript, setTranscript] = useState('');          // final user text
  const [interimTranscript, setInterimTranscript] = useState(''); // real‑time partial
  const [fullCaption, setFullCaption] = useState('');        // AI message
  const [isListening, setIsListening] = useState(false);
  const [isActuallyPlaying, setIsActuallyPlaying] = useState(false); // AI speaking

  return (
    <AnimatedAvatar
      aiMessage={fullCaption}
      userMessageInterim={interimTranscript.trim()}
      userMessageFinal={transcript.trim()}
      emotionDetection={true}
      autoAnimate={true}
      isSpeaking={isActuallyPlaying}
      isListening={isListening}
    />
  );
}
```

---

## 💬 Using `userMessageInterim` & `userMessageFinal`

The SDK gives you **complete flexibility** in how you feed user text. You are **not required** to use both props.

| Prop | Purpose | When to use |
|------|---------|-------------|
| `userMessageInterim` | Analysed in real time as the text changes | Pass **partial / live** transcripts from your STT engine here. The avatar reacts instantly to every keystroke or speech chunk. |
| `userMessageFinal` | Analysed only when this specific prop changes | Pass **final / committed** transcripts here (e.g., when a sentence is completed or the user stops speaking). |

**You can choose any of these three approaches:**

1. **Use only `userMessageInterim`** (simplest)  
   Pass your entire user transcript (partial + final) here. The avatar updates reactively on every change.

2. **Use both** (recommended for advanced STT)  
   Send real‑time partial results to `userMessageInterim` for instant feedback, and the final confirmed transcript to `userMessageFinal` for a more accurate definitive analysis. The SDK handles both independently and applies the latest emotion.

3. **Use only `userMessageFinal`**  
   Leave `userMessageInterim` empty and pass the final text only when it's ready. The avatar will update once per user turn.

Pick the method that best fits your Speech‑to‑Text (STT) pipeline—the SDK works seamlessly with all of them.

---

## 🧩 Component Props (`AnimatedAvatar`)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `aiMessage` | `string` | `""` | Text from the AI – triggers emotion analysis when `isSpeaking` and `autoAnimate` are true. |
| `userMessageInterim` | `string` | `""` | Partial / real‑time user transcript. Analysed on every change. **Can be used alone** for all user input. |
| `userMessageFinal` | `string` | `""` | Final / committed user transcript. Analysed when this prop changes. **Optional** – use only if you need to separate partial and final transcripts. |
| `emotionDetection` | `boolean` | `true` | Enable/disable emotion analysis. |
| `autoAnimate` | `boolean` | `true` | Automatically update avatar when emotion changes. |
| `isSpeaking` | `boolean` | `false` | Set to `true` when the AI is speaking – avatar goes to `SPEAK_NEUTRAL`. |
| `isListening` | `boolean` | `false` | Set to `true` when the system is listening – avatar goes to `LISTEN`. |
| `overrideEmotion` | `EmotionState` | `undefined` | Manually force a specific emotion (overrides analysis). |
| `onEmotionChange` | `(emotion: EmotionState) => void` | `undefined` | Callback fired whenever the emotion changes. |
| `emotionImages` | `Partial<Record<EmotionState, string>>` | `undefined` | Custom image URLs for any emotion – merges with defaults. |
| `onInitialized` | `(isInitialized: boolean) => void` | `undefined` | Callback when the avatar and model are ready. |
| `size` | `number` | `260` | Diameter of the avatar (px). |
| `className` | `string` | `""` | Additional CSS class for the container. |

---

## 😊 Emotion States & Image Mapping

The SDK uses the following `EmotionState` enum. Each state is tied to a specific avatar image (defaults are bundled locally).

```ts
enum EmotionState {
  LISTEN,          // listening / idle
  SPEAK_NEUTRAL,   // speaking without strong emotion
  ENCOURAGE,       // positive, supportive
  THINK,           // thinking / confused
  CAUTION,         // concerned / warning
  CELEBRATE,       // excited, joyful
  HAPPY,           // happiness
  SAD,             // sadness
  ANGRY,           // anger / disgust
  SURPRISED        // surprise
}
```

**Model label → EmotionState mapping** (from `useAvatarController`):

| Model Label     | Mapped EmotionState |
|-----------------|----------------------|
| happiness       | `HAPPY`              |
| love / desire   | `ENCOURAGE`          |
| anger / disgust | `ANGRY`              |
| fear            | `CAUTION`            |
| sadness         | `SAD`                |
| surprise        | `SURPRISED`          |
| shame / guilt   | `CAUTION`            |
| confusion       | `THINK`              |
| sarcasm         | `CAUTION`            |
| *others*        | `LISTEN` / fallback  |

---

## 🖼️ Customising Avatar Images

You can override images for one or more emotions using the `emotionImages` prop:

```tsx
<AnimatedAvatar
  emotionImages={{
    [EmotionState.HAPPY]: '/my-happy-avatar.png',
    [EmotionState.SAD]: '/my-sad-avatar.png',
  }}
/>
```

These URLs are merged with the default set. By default, the SDK uses **local assets** (bundled WebP files) – it **does not** fetch them from Hugging Face unless you explicitly set `loadAssetsLocally={false}` in the `useAvatarController` hook.

---

## ⏱️ Smooth Transitions (800 ms Throttle)

To avoid rapid, jarring image changes, the `AvatarRenderer` enforces a **minimum delay of 800 ms** between emotion‑driven image swaps. This ensures a pleasant viewing experience, especially during fast‑paced conversations.

---

## 🧠 Advanced Usage: `useAvatarController`

For full control, you can use the hook directly:

```tsx
import { useAvatarController } from '@anshika.t/avatar-sdk';

const {
  emotionState,
  intensity,
  setEmotion,
  analyzeEmotion,
  isInitialized,
  resolvedBlobImages,
} = useAvatarController({
  isSpeaking,
  isListening,
  onEmotionChange,
  emotionImages,
  loadAssetsLocally: true,   // default: local assets
});
```

- `analyzeEmotion(text)` – runs the ML classifier and returns a `Promise<EmotionState>`.
- `setEmotion(state)` – manually set the emotion.
- `resolvedBlobImages` – the final image URLs (blob or local) for each emotion.

---

## 🏗️ Architecture Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                    Your Application                         │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │   LLM   │  │  Chat UI │  │   STT    │  │    TTS    │  │
│  └─────────┘  └──────────┘  └──────────┘  └───────────┘  │
│                         │                                  │
│                         ▼                                  │
│              ┌─────────────────────┐                       │
│              │   AnimatedAvatar    │                       │
│              │  (React Component)  │                       │
│              └─────────────────────┘                       │
│                         │                                  │
│   ┌─────────────────────┼─────────────────────┐           │
│   ▼                     ▼                     ▼           │
│ ┌──────────┐   ┌─────────────────┐   ┌──────────────────┐ │
│ │ Avatar   │   │ Emotion         │   │ Asset Resolver   │ │
│ │ Renderer │   │ Classifier      │   │ (local / remote) │ │
│ └──────────┘   │ (DistilBERT     │   └──────────────────┘ │
│                │  + ONNX)        │                        │
│                └─────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure (SDK internals)

```text
src/
├── components/
│   ├── AnimatedAvatar.tsx      # main component
│   └── AvatarRenderer.tsx      # image rendering with throttling
├── hooks/
│   ├── useAvatarController.ts  # core logic (emotion, assets, state)
│   └── useEmotionController.ts # (legacy / optional)
├── services/emotion/
│   ├── emotionClassifier.ts    # Transformers.js pipeline wrapper
│   └── textSignals.ts          # rule-based + ML signal extraction
├── constants/
│   └── defaultImages.ts        # default local & remote asset URLs
├── types/
│   ├── emotion.ts              # EmotionState, EmotionLabel, TextSignals
│   └── assets.d.ts             # Webpack image imports
└── assets/                     # bundled WebP avatar images
    ├── listening.webp
    ├── speaking-edited.webp
    ├── ballbounce.webp
    ├── regular-thinking.webp
    ├── glassadjustment.webp
    ├── bubblepop.webp
    ├── Zoe_happy.webp
    ├── Zoe_sad.webp
    ├── Zoe_disgust.webp
    └── Zoe_surprise.webp
```

---

## 💡 What's Included / Not Included

**✅ Included**
- Emotion detection (rule‑based + ML)
- DistilBERT model (loaded via Hugging Face, cached locally)
- Avatar rendering with 10 emotion states
- 800 ms transition throttling
- Custom image overrides
- React hooks for advanced use

**❌ Not Included**
- Chat UI components
- Any LLM integration
- Speech‑to‑Text / Text‑to‑Speech
- Voice Activity Detection
- Backend services
- Authentication
