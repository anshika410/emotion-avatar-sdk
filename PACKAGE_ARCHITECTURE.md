# Avatar SDK Package Architecture

## Overview
Extract the real-time animated avatar functionality into a reusable NPM package that can be integrated into the AI Interviewer application.

## Scope

**Avatar SDK Responsibilities:**
- Emotion Detection (from LLM text output)
- Avatar Rendering (emotion-based animations)

**NOT included (handled by AI Interviewer):**
- TTS (Text-to-Speech)
- STT (Speech-to-Text)
- VAD (Voice Activity Detection)
- LLM integration

## Package Structure

```
@company/avatar-sdk/
├── src/
│   ├── components/
│   │   ├── AnimatedAvatar.tsx          # Main avatar component
│   │   └── AvatarRenderer.tsx           # Avatar image rendering
│   ├── hooks/
│   │   ├── useEmotionController.ts     # Emotion state management
│   │   └── useAvatarController.ts      # High-level avatar controller
│   ├── services/
│   │   └── emotion/
│   │       ├── emotionPolicy.ts        # Emotion policy engine
│   │       ├── emotionClassifier.ts    # ML emotion classification
│   │       ├── textSignals.ts          # Text signal extraction
│   │       └── speechMetrics.ts        # Speech metrics (optional, for manual input)
│   ├── types/
│   │   └── emotion.ts                 # Emotion types
│   └── index.ts                        # Main export file
├── assets/
│   ├── listening.webp
│   ├── speaking-edited.webp
│   ├── ballbounce.webp
│   ├── regular-thinking.webp
│   ├── glassadjustment.webp
│   └── bubblepop.webp
├── package.json
├── tsconfig.json
├── vite.config.ts                      # Build configuration
├── README.md
└── LICENSE
```

## Public API

### Main Component: AnimatedAvatar

```typescript
interface AnimatedAvatarProps {
  /** Text from the AI/LLM for emotion analysis */
  aiMessage?: string;
  
  /** Text from the user for emotion analysis */
  userMessage?: string;
  
  /** Whether to enable automatic emotion detection */
  emotionDetection?: boolean;
  
  /** Whether to enable automatic animations */
  autoAnimate?: boolean;
  
  /** Speaking state from parent (TTS status) */
  isSpeaking?: boolean;
  
  /** Listening state from parent (STT status) */
  isListening?: boolean;
  
  /** Custom emotion state override (for manual control) */
  overrideEmotion?: EmotionState;
  
  /** Callback when avatar emotion changes */
  onEmotionChange?: (emotion: EmotionState, intensity: number) => void;
  
  /** Custom avatar images (optional) */
  customImages?: Partial<Record<EmotionState, string>>;
  
  /** Size of the avatar in pixels */
  size?: number;
  
  /** CSS class name for styling */
  className?: string;
}
```

### Hook: useAvatarController

```typescript
interface UseAvatarControllerProps {
  isSpeaking?: boolean;
  isListening?: boolean;
  onEmotionChange?: (emotion: EmotionState, intensity: number) => void;
}

function useAvatarController(props: UseAvatarControllerProps) {
  return {
    emotionState: EmotionState,
    intensity: number,
    setEmotion: (emotion: EmotionState) => void,
    analyzeEmotion: (text: string) => Promise<EmotionState>,
  };
}
```

## Integration Example

```typescript
import { AnimatedAvatar } from "@company/avatar-sdk";

function InterviewScreen() {
  const [aiResponse, setAiResponse] = useState("");
  const [userText, setUserText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  return (
    <AnimatedAvatar
      aiMessage={aiResponse}
      userMessage={userText}
      emotionDetection={true}
      autoAnimate={true}
      isSpeaking={isSpeaking}
      isListening={isListening}
      onEmotionChange={(emotion, intensity) => {
        console.log(`Avatar emotion: ${emotion}, intensity: ${intensity}`);
      }}
    />
  );
}
```

## Key Features

1. **Emotion-Driven Animations**
   - 6 emotion states: LISTEN, SPEAK_NEUTRAL, ENCOURAGE, THINK, CAUTION, CELEBRATE
   - Real-time emotion detection from LLM text output
   - ML-based emotion classification using DistilBERT
   - Intensity-based visual effects (opacity, scale, brightness)

2. **Text-Based Emotion Analysis**
   - Analyzes LLM responses to determine appropriate avatar emotion
   - Rule-based sentiment analysis (STAR framework, sentiment valence)
   - ML emotion classification (6 Ekman emotions)
   - Debounced analysis for performance

3. **Avatar Rendering**
   - Smooth transitions between emotion states
   - Intensity-based visual effects
   - Customizable avatar images
   - Responsive to speaking/listening states from parent

## Dependencies

### Peer Dependencies (must be installed by consumer)
- react: ^18.0.0 || ^19.0.0
- react-dom: ^18.0.0 || ^19.0.0

### Regular Dependencies (bundled with package)
- @huggingface/transformers: ^3.8.1 (for ML emotion classification)

## Build Configuration

- **Bundler**: Vite with library mode
- **Output Formats**: ESM, CJS
- **TypeScript**: Full type definitions
- **Tree Shaking**: Optimized for minimal bundle size
- **Asset Handling**: Avatar images bundled

## Migration Strategy

1. Create new package repository
2. Extract avatar-related files
3. Refactor to remove application-specific dependencies
4. Create public API layer
5. Set up build configuration
6. Test in isolation
7. Publish to NPM
8. Update AI Interviewer app to use package
9. Remove avatar code from original repo
