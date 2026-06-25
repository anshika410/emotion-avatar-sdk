// Main export file for Avatar SDK
export { AnimatedAvatar } from "./components/AnimatedAvatar";
export { AvatarRenderer } from "./components/AvatarRenderer";
export { useAvatarController } from "./hooks/useAvatarController";
export { useEmotionController } from "./hooks/useEmotionController";

// Types
export type {
  AnimatedAvatarProps,
} from "./components/AnimatedAvatar";

export type {
  UseAvatarControllerProps,
  AvatarControllerReturn,
} from "./hooks/useAvatarController";

export { EmotionState } from "./types/emotion";

export type {
  EmotionOutput,
  TextSignals,
} from "./types/emotion";

// Services
export {
  warmUpEmotionClassifier,
  isEmotionClassifierReady,
  classifyEmotion,
  disposeEmotionClassifier,
} from "./services/emotion/emotionClassifier";

export {
  extractTextSignals,
  extractTextSignalsWithML,
} from "./services/emotion/textSignals";
