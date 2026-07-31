// Main export file for Avatar SDK
export { AnimatedAvatar } from "./components/AnimatedAvatar";
export { AvatarRenderer } from "./components/AvatarRenderer";

export {
  MODEL_EMOTION_TO_SPEAKING_ASSET,
  BASE_MASCOT_ASSETS,
  SPEAKING_ASSETS,
  resolveBaseMascotKey,
  getMascotAssetUrl,
} from "./constants/emotionAssets";

// Types
export type { AnimatedAvatarProps } from "./components/AnimatedAvatar";

export type { AvatarRendererProps } from "./components/AvatarRenderer";

export type { EmotionDebugInfo } from "./hooks/useAvatarController";
