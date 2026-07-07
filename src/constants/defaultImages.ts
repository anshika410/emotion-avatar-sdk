import { EmotionState } from "../types/emotion";
// Import local fallback images
import listenImg from "../assets/listening.webp";
import speakImg from "../assets/speaking-edited.webp";
import encourageImg from "../assets/Zoe_nodding.webp";
import thinkImg from "../assets/regular-thinking.webp";
import cautionImg from "../assets/glassadjustment.webp";
import celebrateImg from "../assets/bubblepop.webp";
import happyImg from "../assets/Zoe_happy.webp";
import sadImg from "../assets/Zoe_sad.webp";
import angryImg from "../assets/Zoe_disgust.webp";
import surprisedImg from "../assets/Zoe_surprise.webp";
import shockImg from "../assets/Zoe_scared.webp"
import confuseImg from "../assets/Zoe_confuse.webp"


const REPO_ID = "navgurukul-ai/realtime-avatar-animation";
const ASSETS_BASE = `https://huggingface.co/${REPO_ID}/resolve/main/assets`;


export const DEFAULT_AVATAR_IMAGES: Record<EmotionState, string> = {
  [EmotionState.LISTEN]: `${ASSETS_BASE}/listening.webp`,
  [EmotionState.SPEAK_NEUTRAL]: `${ASSETS_BASE}/speaking-edited.webp`,
  [EmotionState.ENCOURAGE]: `${ASSETS_BASE}/ballbounce.webp`,
  [EmotionState.THINK]: `${ASSETS_BASE}/regular-thinking.webp`,
  [EmotionState.CAUTION]: `${ASSETS_BASE}/glassadjustment.webp`,
  [EmotionState.CELEBRATE]: `${ASSETS_BASE}/bubblepop.webp`,
  [EmotionState.HAPPY]: `${ASSETS_BASE}/Zoe_happy.webp`,
  [EmotionState.SAD]: `${ASSETS_BASE}/Zoe_sad.webp`,
  [EmotionState.ANGRY]: `${ASSETS_BASE}/Zoe_disgust.webp`,
  [EmotionState.SURPRISED]: `${ASSETS_BASE}/Zoe_surprise.webp`,
  [EmotionState.SHOCK]: `${ASSETS_BASE}/Zoe_scared.webp`,
  [EmotionState.CONFUSE]: `${ASSETS_BASE}/Zoe_confuse.webp`,
};


// Local fallback URLs (these will be inlined or served by your bundler)
export const LOCAL_FALLBACK_IMAGES: Record<EmotionState, string> = {
  [EmotionState.LISTEN]: listenImg,
  [EmotionState.SPEAK_NEUTRAL]: speakImg,
  [EmotionState.ENCOURAGE]: encourageImg,
  [EmotionState.THINK]: thinkImg,
  [EmotionState.CAUTION]: cautionImg,
  [EmotionState.CELEBRATE]: celebrateImg,
  [EmotionState.HAPPY]: happyImg,
  [EmotionState.SAD]: sadImg,
  [EmotionState.ANGRY]: angryImg,
  [EmotionState.SURPRISED]: surprisedImg,
  [EmotionState.SHOCK]: shockImg,
  [EmotionState.CONFUSE]: confuseImg,
};