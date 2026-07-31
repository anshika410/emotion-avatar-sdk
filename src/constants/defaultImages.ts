import { EmotionState } from "../types/emotion";
import { resolveBaseMascotKey } from "./emotionAssets";

/** Default emotion IDs / mascot keys for Zoe Mascot */
export const DEFAULT_AVATAR_EMOTIONS: Record<EmotionState, string> = {
  [EmotionState.LISTEN]: "thinking",
  [EmotionState.SPEAK_NEUTRAL]: "thinking",
  [EmotionState.ENCOURAGE]: "Love-Strong",
  [EmotionState.THINK]: "thinking",
  [EmotionState.CAUTION]: "anger",
  [EmotionState.CELEBRATE]: "happy_strong",
  [EmotionState.HAPPY]: "happy_strong",
  [EmotionState.SAD]: "sad-Strong",
  [EmotionState.ANGRY]: "anger",
  [EmotionState.SURPRISED]: "surprise",
  [EmotionState.SHOCK]: "fear",
  [EmotionState.CONFUSE]: "thinking",
};

export { resolveBaseMascotKey };