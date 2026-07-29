import loveStrongImg from "../assets/Love-Strong.webp";
import gentleLoveImg from "../assets/gentle-love.webp";
import happyStrongImg from "../assets/happy_strong.webp";
import happyGentleImg from "../assets/happy_gentle.webp";
import thinkingImg from "../assets/thinking.webp";
import surpriseImg from "../assets/surprise.webp";
import angerImg from "../assets/anger.webp";
import disgustImg from "../assets/disgust.webp";
import fearImg from "../assets/fear.webp";
import sadStrongImg from "../assets/sad-Strong.webp";
import sadGentleImg from "../assets/sad-gentle.webp";
import celebrationImg from "../assets/celebration.webp";
import shokedImg from "../assets/shoked.webp";

import speakingHappyImg from "../assets/speaking_happy.webp";
import speakingNeutralImg from "../assets/speaking_neutral.webp";
import sadSpeakingGentleImg from "../assets/sad-speaking_gentle.webp";

/** Source of Truth mapping: Base mascot asset names */
export type BaseMascotKey =
  | "Love-Strong"
  | "gentle-love"
  | "happy_strong"
  | "happy_gentle"
  | "thinking"
  | "surprise"
  | "anger"
  | "disgust"
  | "fear"
  | "sad-Strong";

/** Source of Truth mapping from 28 model emotions to base mascots */
export const MODEL_EMOTION_TO_BASE_MASCOT: Record<string, BaseMascotKey> = {
  // Love-Strong
  love: "Love-Strong",
  desire: "Love-Strong",

  // gentle-love
  caring: "gentle-love",
  admiration: "gentle-love",
  gratitude: "gentle-love",

  // happy_strong
  joy: "happy_strong",
  amusement: "happy_strong",
  excitement: "happy_strong",
  pride: "happy_strong",

  // happy_gentle
  approval: "happy_gentle",
  optimism: "happy_gentle",
  relief: "happy_gentle",

  // thinking
  neutral: "thinking",
  curiosity: "thinking",
  realization: "thinking",
  confusion: "thinking",

  // surprise
  surprise: "surprise",

  // anger
  anger: "anger",
  annoyance: "anger",

  // disgust
  disgust: "disgust",
  disapproval: "disgust",

  // fear
  fear: "fear",
  nervousness: "fear",

  // sad-Strong
  sadness: "sad-Strong",
  grief: "sad-Strong",
  disappointment: "sad-Strong",
  remorse: "sad-Strong",
  embarrassment: "sad-Strong",
};

/** WebP image URLs for base mascots */
export const BASE_MASCOT_ASSETS: Record<BaseMascotKey | string, string> = {
  "Love-Strong": loveStrongImg,
  "gentle-love": gentleLoveImg,
  happy_strong: happyStrongImg,
  happy_gentle: happyGentleImg,
  thinking: thinkingImg,
  surprise: surpriseImg,
  anger: angerImg,
  disgust: disgustImg,
  fear: fearImg,
  "sad-Strong": sadStrongImg,
  // Additional assets for specific legacy/extended lookups
  "sad-gentle": sadGentleImg,
  celebration: celebrationImg,
  shoked: shokedImg,
};

/** Dedicated speaking assets */
export const SPEAKING_ASSETS = {
  speaking_happy: speakingHappyImg,
  speaking_neutral: speakingNeutralImg,
  "sad-speaking_gentle": sadSpeakingGentleImg,
  // Fallback for strong sadness when dedicated strong speaking asset is not present
  "sad-speaking_strong": sadSpeakingGentleImg,
};

/** Maps each of the 28 model emotions to its designated speaking asset */
export const MODEL_EMOTION_TO_SPEAKING_ASSET: Record<string, string> = {
  // Happy emotions -> speaking_happy.webp
  joy: SPEAKING_ASSETS.speaking_happy,
  amusement: SPEAKING_ASSETS.speaking_happy,
  excitement: SPEAKING_ASSETS.speaking_happy,
  pride: SPEAKING_ASSETS.speaking_happy,
  approval: SPEAKING_ASSETS.speaking_happy,
  optimism: SPEAKING_ASSETS.speaking_happy,
  relief: SPEAKING_ASSETS.speaking_happy,

  // Neutral / Thinking emotions -> speaking_neutral.webp
  neutral: SPEAKING_ASSETS.speaking_neutral,
  curiosity: SPEAKING_ASSETS.speaking_neutral,
  realization: SPEAKING_ASSETS.speaking_neutral,
  confusion: SPEAKING_ASSETS.speaking_neutral,

  // Gentle sadness -> sad-speaking_gentle.webp
  disappointment: SPEAKING_ASSETS["sad-speaking_gentle"],
  remorse: SPEAKING_ASSETS["sad-speaking_gentle"],
  embarrassment: SPEAKING_ASSETS["sad-speaking_gentle"],

  // Strong sadness -> sad-speaking_strong.webp (with fallback)
  sadness: SPEAKING_ASSETS["sad-speaking_strong"],
  grief: SPEAKING_ASSETS["sad-speaking_strong"],

  // Love emotions -> natural fallback: speaking_happy.webp
  love: SPEAKING_ASSETS.speaking_happy,
  desire: SPEAKING_ASSETS.speaking_happy,
  caring: SPEAKING_ASSETS.speaking_happy,
  admiration: SPEAKING_ASSETS.speaking_happy,
  gratitude: SPEAKING_ASSETS.speaking_happy,

  // Anger emotions -> natural fallback: speaking_neutral.webp
  anger: SPEAKING_ASSETS.speaking_neutral,
  annoyance: SPEAKING_ASSETS.speaking_neutral,

  // Disgust emotions -> natural fallback: speaking_neutral.webp
  disgust: SPEAKING_ASSETS.speaking_neutral,
  disapproval: SPEAKING_ASSETS.speaking_neutral,

  // Fear emotions -> natural fallback: speaking_neutral.webp
  fear: SPEAKING_ASSETS.speaking_neutral,
  nervousness: SPEAKING_ASSETS.speaking_neutral,

  // Surprise -> natural fallback: speaking_happy.webp
  surprise: SPEAKING_ASSETS.speaking_happy,
};

/** Alias / legacy reaction ID mappings to model emotion keys */
const LEGACY_ID_TO_MODEL_EMOTION: Record<string, string> = {
  // Enum values & legacy string names
  LISTEN: "neutral",
  listening: "neutral",
  SPEAK_NEUTRAL: "neutral",
  "neutral-focused": "neutral",
  "neutral-present": "neutral",
  THINK: "neutral",
  CONFUSE: "confusion",
  "confusion-curious": "confusion",
  "confusion-clarify": "confusion",

  ENCOURAGE: "desire",
  "desire-encourage": "desire",
  "desire-hopeful": "desire",

  CAUTION: "annoyance",
  "anger-acknowledge": "annoyance",
  "anger-grounding": "anger",
  ANGRY: "anger",

  CELEBRATE: "joy",
  "happy-celebrate": "joy",
  HAPPY: "joy",
  "happy-warm": "joy",

  SAD: "sadness",
  "sadness-concern": "sadness",
  "sadness-comfort": "sadness",
  "shame-acceptance": "embarrassment",
  "shame-support": "embarrassment",
  "guilt-understand": "remorse",
  "guilt-repair": "remorse",

  SURPRISED: "surprise",
  "surprise-notice": "surprise",
  "surprise-astonished": "surprise",

  SHOCK: "fear",
  "fear-reassure": "fear",
  "fear-steady": "fear",
  "disgust-recognize": "disgust",
  "disgust-compose": "disgust",

  "love-warm": "caring",
  "love-heartfelt": "love",
  "sarcasm-notice": "confusion",
  "sarcasm-knowing": "confusion",
};

/** Resolves any emotion input to a base mascot key */
export function resolveBaseMascotKey(emotionInput: string): BaseMascotKey {
  if (!emotionInput) return "thinking";

  const normalized = emotionInput.trim();

  // 1. Direct match with a 28 model emotion
  if (normalized in MODEL_EMOTION_TO_BASE_MASCOT) {
    return MODEL_EMOTION_TO_BASE_MASCOT[normalized];
  }

  // 2. Direct match with a base mascot key
  if (normalized in BASE_MASCOT_ASSETS) {
    return normalized as BaseMascotKey;
  }

  // 3. Match via legacy alias
  const legacyMatch = LEGACY_ID_TO_MODEL_EMOTION[normalized];
  if (legacyMatch && legacyMatch in MODEL_EMOTION_TO_BASE_MASCOT) {
    return MODEL_EMOTION_TO_BASE_MASCOT[legacyMatch];
  }

  // Default fallback
  return "thinking";
}

/** Resolves an emotion input and speaking state to the target WebP image URL */
export function getMascotAssetUrl(
  emotionInput: string,
  isSpeaking: boolean = false,
): string {
  const normalized = emotionInput ? emotionInput.trim() : "neutral";

  if (isSpeaking) {
    // Check direct model emotion speaking asset
    if (normalized in MODEL_EMOTION_TO_SPEAKING_ASSET) {
      return MODEL_EMOTION_TO_SPEAKING_ASSET[normalized];
    }

    // Check legacy ID resolved to model emotion
    const legacyEmotion = LEGACY_ID_TO_MODEL_EMOTION[normalized];
    if (legacyEmotion && legacyEmotion in MODEL_EMOTION_TO_SPEAKING_ASSET) {
      return MODEL_EMOTION_TO_SPEAKING_ASSET[legacyEmotion];
    }

    // Check base mascot key to default speaking asset
    const baseKey = resolveBaseMascotKey(normalized);
    switch (baseKey) {
      case "happy_strong":
      case "happy_gentle":
      case "Love-Strong":
      case "gentle-love":
      case "surprise":
        return SPEAKING_ASSETS.speaking_happy;

      case "sad-Strong":
        return SPEAKING_ASSETS["sad-speaking_gentle"];

      case "thinking":
      case "anger":
      case "disgust":
      case "fear":
      default:
        return SPEAKING_ASSETS.speaking_neutral;
    }
  }

  // Idle state: resolve base mascot WebP asset
  const baseKey = resolveBaseMascotKey(normalized);
  return BASE_MASCOT_ASSETS[baseKey] || BASE_MASCOT_ASSETS.thinking;
}
