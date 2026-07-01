import { EmotionState } from "../types/emotion";
const REPO_ID = "navgurukul-ai/realtime-avatar-animation";
const ASSETS_BASE = `https://huggingface.co/${REPO_ID}/resolve/main/assets`;

export const DEFAULT_AVATAR_IMAGES: Record<EmotionState, string> = {
  [EmotionState.LISTEN]: `${ASSETS_BASE}/listening.webp`,
  [EmotionState.SPEAK_NEUTRAL]: `${ASSETS_BASE}/speaking-edited.webp`,
  [EmotionState.ENCOURAGE]: `${ASSETS_BASE}/ballbounce.webp`,
  [EmotionState.THINK]: `${ASSETS_BASE}/regular-thinking.webp`,
  [EmotionState.CAUTION]: `${ASSETS_BASE}/glassadjustment.webp`,
  [EmotionState.CELEBRATE]: `${ASSETS_BASE}/bubblepop.webp`,
};
