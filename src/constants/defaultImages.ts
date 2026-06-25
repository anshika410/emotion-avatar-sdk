import { EmotionState } from "../types/emotion";

export const DEFAULT_AVATAR_IMAGES: Record<EmotionState, string> = {
  [EmotionState.LISTEN]:        "/assets/listening.webp",
  [EmotionState.SPEAK_NEUTRAL]: "/assets/speaking-edited.webp",
  [EmotionState.ENCOURAGE]:     "/assets/ballbounce.webp",
  [EmotionState.THINK]:         "/assets/regular-thinking.webp",
  [EmotionState.CAUTION]:       "/assets/glassadjustment.webp",
  [EmotionState.CELEBRATE]:     "/assets/bubblepop.webp",
};