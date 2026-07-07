# Package Architecture

## Overview

`@navgurukul/avatar-sdk` is a React SDK for rendering a real-time emotion-aware animated avatar.

The SDK analyzes conversation state and user transcripts to determine the most appropriate avatar expression. Emotion detection runs entirely in the browser using a Hugging Face Transformers model, while avatar assets are automatically fetched from Hugging Face with local fallbacks for improved reliability.

The SDK is designed to integrate seamlessly with any conversational AI application and remains independent of the consumer's Speech-to-Text (STT), Text-to-Speech (TTS), or LLM implementation.

---

# High-Level Architecture

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
           Hugging Face Model     Avatar Image Loader
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
src/
├── components/
│   ├── AnimatedAvatar.tsx
│   └── AvatarRenderer.tsx
│
├── constants/
│   └── defaultImages.ts
│
├── hooks/
│   └── useAvatarController.ts
│
├── services/
│   └── emotion/
│       ├── emotionClassifier.ts
│       └── textSignals.ts
│
├── types/
│   ├── emotion.ts
│   └── assets.ts
│
└── index.ts
```

---

# Component Layer

## AnimatedAvatar

`AnimatedAvatar` is the public entry point of the SDK.

Responsibilities include:

- Receiving conversation state from the consumer application
- Managing emotion updates
- Initializing avatar assets
- Coordinating avatar rendering
- Exposing styling APIs
- Handling loading state

The component abstracts all internal logic so consumers only need to provide conversation-related props.

---

## AvatarRenderer

`AvatarRenderer` is responsible only for rendering.

Responsibilities include:

- Displaying the current avatar image
- Preloading avatar assets
- Applying image transitions
- Applying user-provided styling
- Updating the rendered avatar when the emotion changes

No emotion analysis or business logic exists in this component.

---

# Hook Layer

## useAvatarController

This hook contains the core logic of the SDK.

Its responsibilities include:

- Initializing the emotion classifier
- Loading avatar assets
- Managing emotion state
- Analyzing incoming transcripts
- Responding to speaking and listening states
- Cleaning up allocated resources

The hook exposes only the state required by `AnimatedAvatar`.

---

# Emotion Processing Pipeline

The SDK processes text in multiple stages before updating the avatar.

```
Incoming Transcript
        │
        ▼
Rule-Based Analysis
        │
        ▼
ML Emotion Classification
        │
        ▼
Prediction Smoothing
        │
        ▼
Emotion Mapping
        │
        ▼
EmotionState
        │
        ▼
Avatar Animation
```

The rule-based analysis extracts lightweight signals such as sentiment and content completeness, while the ML model provides emotion predictions. The SDK smooths consecutive predictions to reduce rapid avatar switching and produce more natural animations.

---

# Emotion Mapping

The emotion classifier predicts one of several emotion labels which are mapped to avatar animation states.

| Model Emotion | Avatar State |
|---------------|--------------|
| happiness | HAPPY |
| love | ENCOURAGE |
| desire | ENCOURAGE |
| anger | CAUTION |
| disgust | ANGRY |
| fear | SHOCK |
| sadness | SAD |
| surprise | SURPRISED |
| confusion | CONFUSE |
| sarcasm | CONFUSE |
| shame | SAD |
| guilt | CAUTION |
| Default / Neutral | LISTEN |

---

# Asset Management

Avatar assets are managed internally by the SDK.

During initialization:

1. The SDK requests avatar images from the Hugging Face repository.
2. Images are converted into Blob URLs for efficient rendering.
3. If a remote asset cannot be loaded, the SDK automatically falls back to the bundled local asset.
4. Images are preloaded before rendering begins to ensure smooth transitions.

Consumers are **not required** to configure asset paths or manage avatar images.

---

# Model Management

Emotion detection is powered by a Hugging Face Transformers model running entirely in the browser.

The SDK automatically:

- Loads the model during initialization
- Performs a warm-up inference
- Reuses a singleton classifier instance
- Disposes resources when no longer required

Browser caching ensures the model is downloaded only once.

---

# Avatar State Flow

The avatar responds to conversation events as follows.

```
                User Starts Speaking
                        │
                        ▼
                  LISTEN State

                User Transcript
                        │
                        ▼
             Emotion Classification
                        │
                        ▼
             Emotion-specific Avatar

                AI Starts Speaking
                        │
                        ▼
               SPEAK_NEUTRAL State

              Conversation Idle
                        │
                        ▼
                  LISTEN State
```

---

# Styling

The SDK exposes styling through three mechanisms.

### Container Styling

Applied to the outer wrapper.

```tsx
containerClassName
```

### Avatar Styling

Applied directly to the avatar image.

```tsx
avatarClassName
```

### Inline Styling

Applied using the standard React `style` prop.

```tsx
style={{
    width: "180px",
    height: "180px"
}}
```

Inline styles have the highest priority and override any class-based styling.

---

# Public API

The SDK intentionally exposes a minimal public API.

## Component

```tsx
AnimatedAvatar
```

## Props

- aiMessage
- userMessageInterim
- userMessageFinal
- isSpeaking
- isListening
- containerClassName
- avatarClassName
- style
- onInitialized

All emotion processing, asset management, rendering, and model initialization remain internal to the SDK.

---

# Build Output

The package is distributed as a standard JavaScript library.

```
dist/
├── index.js
├── index.cjs
├── index.d.ts
└── assets/
```

The package exports both ES Module and CommonJS builds together with TypeScript declarations.

---

# Responsibilities

## SDK Responsibilities

- Emotion detection
- Avatar rendering
- Avatar asset management
- Model loading
- Avatar animation
- Emotion state management

## Consumer Responsibilities

- Speech-to-Text integration
- Text-to-Speech integration
- LLM integration
- Conversation management
- User interface

---

# Design Principles

The SDK has been designed around the following principles:

- Browser-first architecture
- Zero backend dependency
- Minimal public API
- Automatic model initialization
- Automatic asset management
- Smooth avatar transitions
- Framework-independent conversation pipeline
- Easy integration into existing React applications