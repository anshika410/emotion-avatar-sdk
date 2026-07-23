import { EmotionState } from "../types/emotion";

/** Default emotion IDs for Zoe Mascot web component */
export const DEFAULT_AVATAR_EMOTIONS: Record<EmotionState, string> = {
  [EmotionState.LISTEN]: "listening",
  [EmotionState.SPEAK_NEUTRAL]: "neutral-focused",
  [EmotionState.ENCOURAGE]: "desire-encourage",
  [EmotionState.THINK]: "neutral-present",
  [EmotionState.CAUTION]: "anger-acknowledge",
  [EmotionState.CELEBRATE]: "happy-celebrate",
  [EmotionState.HAPPY]: "happy-warm",
  [EmotionState.SAD]: "sadness-concern",
  [EmotionState.ANGRY]: "disgust-recognize",
  [EmotionState.SURPRISED]: "surprise-notice",
  [EmotionState.SHOCK]: "fear-reassure",
  [EmotionState.CONFUSE]: "confusion-curious",
};