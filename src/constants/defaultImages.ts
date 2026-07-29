import { EmotionState } from "../types/emotion";

/** Default emotion IDs for Zoe Mascot web component */
export const DEFAULT_AVATAR_EMOTIONS: Record<EmotionState, string> = {
  [EmotionState.LISTEN]: "listening",
  [EmotionState.SPEAK_NEUTRAL]: "speaking-edited.webp",
  [EmotionState.ENCOURAGE]: "desire",
  [EmotionState.THINK]: "neutral-present",
  [EmotionState.CAUTION]: "anger",
  [EmotionState.CELEBRATE]: "joy",
  [EmotionState.HAPPY]: "joy",
  [EmotionState.SAD]: "sadness",
  [EmotionState.ANGRY]: "anger",
  [EmotionState.SURPRISED]: "surprise",
  [EmotionState.SHOCK]: "fear",
  [EmotionState.CONFUSE]: "confusion",
};

const REPO_ID = "navgurukul-ai/realtime-avatar-animation";
const ASSETS_BASE = `https://huggingface.co/${REPO_ID}/resolve/main/assets`;


export const DEFAULT_AVATAR_IMAGES: Record<EmotionState, string> = {
  [EmotionState.SPEAK_NEUTRAL]: `${ASSETS_BASE}/speaking-edited.webp`,
  [EmotionState.LISTEN]: "",
  [EmotionState.ENCOURAGE]: "",
  [EmotionState.THINK]: "",
  [EmotionState.CAUTION]: "",
  [EmotionState.CELEBRATE]: "",
  [EmotionState.HAPPY]: "",
  [EmotionState.SAD]: "",
  [EmotionState.ANGRY]: "",
  [EmotionState.SURPRISED]: "",
  [EmotionState.SHOCK]: "",
  [EmotionState.CONFUSE]: ""
};