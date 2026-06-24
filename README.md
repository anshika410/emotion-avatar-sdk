# @anshika/avatar-sdk

A React SDK for real-time animated avatars with emotion detection and expressive avatar rendering.

## Features

* Real-time animated avatar rendering
* Emotion detection using DistilBERT (Transformers.js)
* 6 emotion states with intensity-based animations
* Smooth emotion transitions
* Custom avatar image support
* React hooks for advanced avatar control
* Designed for integration with existing AI applications
* No built-in chat UI, LLM, STT, or TTS

---

## Installation

### Install the SDK

```bash
npm install @anshika/avatar-sdk
```

### Install Required Peer Dependencies

```bash
npm install react react-dom @huggingface/transformers onnxruntime-web
```

or

```bash
yarn add react react-dom @huggingface/transformers onnxruntime-web
```

---

## Additional Setup

The SDK uses ONNX Runtime Web for browser-based emotion classification.

Copy the ONNX runtime files into your application's public folder:

```text
public/
└── ort/
```

The SDK expects:

```typescript
env.backends.onnx.wasm!.wasmPaths = "/ort/";
```

to resolve correctly at runtime.

---

## Intended Architecture

The SDK is responsible for:

* Emotion detection
* Emotion classification
* Avatar rendering
* Emotion-based avatar animations
* Avatar state management

The consuming application is responsible for:

* LLM integration
* Chat UI
* Speech-to-Text (STT)
* Text-to-Speech (TTS)
* Voice Activity Detection (VAD)
* Application business logic

Example:

```text
AI Interviewer
├── LLM
├── Chat UI
├── STT
├── TTS
└── Avatar SDK
      ├── Emotion Detection
      └── Avatar Rendering
```

---

## Quick Start

```tsx
import { AnimatedAvatar } from "@anshika/avatar-sdk";

function App() {
  return (
    <AnimatedAvatar
      aiMessage={aiResponse}
      userMessage={userInput}
      emotionDetection={true}
      autoAnimate={true}
      isSpeaking={isSpeaking}
      isListening={isListening}
    />
  );
}
```

---

## What's Included

✅ Emotion detection from text

✅ DistilBERT-based emotion classification

✅ Avatar rendering

✅ Smooth avatar state transitions

✅ Custom avatar image support

✅ React hooks for avatar control

---

## What's NOT Included

❌ Chat UI

❌ LLM providers

❌ STT (Speech-to-Text)

❌ TTS (Text-to-Speech)

❌ Voice Activity Detection

❌ Backend services

❌ Authentication

---

## Performance Notes

* Emotion model is downloaded on first use and cached in IndexedDB.
* Initial model download size is approximately 17 MB.
* Subsequent loads use browser cache.
* Emotion inference typically completes in 30–80 ms on desktop devices.

---

## Browser Support

* Chrome / Edge
* Firefox
* Safari
* Modern mobile browsers

---

## License

MIT
