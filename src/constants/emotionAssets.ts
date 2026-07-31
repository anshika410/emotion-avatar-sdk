// emotion-sdk-v0.1.2/src/constants/emotionAssets.ts
import { EMOTION_ASSET_DATA } from "./emotionAssetData";

/** Resolves a generated data-URI by its exact on-disk filename (case-sensitive) */
const asset = (fileKey: string): string => {
  const uri = EMOTION_ASSET_DATA[fileKey];
  if (!uri) {
    console.warn(`[emotion-sdk] Missing generated asset for "${fileKey}" — check public/assets and re-run build:assets`);
    return EMOTION_ASSET_DATA["neutral"] ?? "";
  }
  return uri;
};

/** Source of Truth mapping: Base mascot asset names */
export type BaseMascotKey =
  | "love-strong"
  | "gentle-love"
  | "happy-strong"
  | "happy-gentle"
  | "thinking"
  | "surprise"
  | "anger"
  | "disgust"
  | "fear"
  | "sad-strong"
  | "celebration"
  | "sad-gentle"
  | "shoked"
  | "speaking-happy"
  | "speaking-neutral"
  | "neutral"
  | "speaking-sad";

/**
 * WebP data URIs for base mascots.
 * Right-hand side keys must exactly match the on-disk filename (no extension),
 * casing included — see public/assets for the source of truth.
 */
export const BASE_MASCOT_ASSETS: Record<BaseMascotKey, string> = {
  "love-strong": asset("Love-Strong"),        // actual file: Love-Strong.webp
  "gentle-love": asset("gentle-love"),
  "happy-strong": asset("happy_strong"),      // actual file: happy_strong.webp (underscore)
  "happy-gentle": asset("happy_gentle"),      // actual file: happy_gentle.webp (underscore)
  thinking: asset("thinking"),
  surprise: asset("surprise"),
  anger: asset("anger"),
  disgust: asset("disgust"),
  fear: asset("fear"),
  "sad-strong": asset("sad-Strong"),          // actual file: sad-Strong.webp
  "sad-gentle": asset("sad-gentle"),
  "celebration": asset("celebration"),
  shoked: asset("shoked"),
  "speaking-happy": asset("speaking_happy"),      // actual file: speaking_happy.webp
  "speaking-neutral": asset("speaking_neutral"),  // actual file: speaking_neutral.webp
  // No dedicated "speaking-sad" asset exists on disk — only the gentle speaking variant.
  "speaking-sad": asset("sad-speaking_gentle"),   // actual file: sad-speaking_gentle.webp
  neutral: asset("neutral"),
};

/** Dedicated speaking assets. Only 3 speaking states actually exist as separate art. */
export const SPEAKING_ASSETS = {
  "speaking-happy": BASE_MASCOT_ASSETS["speaking-happy"],
  "speaking-neutral": BASE_MASCOT_ASSETS["speaking-neutral"],
  "speaking-sad": BASE_MASCOT_ASSETS["speaking-sad"],
  // No dedicated "strong sadness while speaking" art — falls back to the gentle speaking asset.
  "sad-speaking-strong": BASE_MASCOT_ASSETS["speaking-sad"],
};

/** Maps each of the 28 model emotions to its designated speaking asset */
export const MODEL_EMOTION_TO_SPEAKING_ASSET: Record<string, string> = {
  // Happy emotions -> speaking_happy.webp
  joy: SPEAKING_ASSETS["speaking-happy"],
  amusement: SPEAKING_ASSETS["speaking-happy"],
  excitement: SPEAKING_ASSETS["speaking-happy"],
  pride: SPEAKING_ASSETS["speaking-happy"],
  approval: SPEAKING_ASSETS["speaking-happy"],
  optimism: SPEAKING_ASSETS["speaking-happy"],
  relief: SPEAKING_ASSETS["speaking-happy"],
  happiness: SPEAKING_ASSETS["speaking-happy"],
  happy: SPEAKING_ASSETS["speaking-happy"],

  // Neutral / Thinking emotions -> speaking_neutral.webp
  neutral: SPEAKING_ASSETS["speaking-neutral"],
  curiosity: SPEAKING_ASSETS["speaking-neutral"],
  realization: SPEAKING_ASSETS["speaking-neutral"],
  confusion: SPEAKING_ASSETS["speaking-neutral"],

  // Gentle sadness -> sad-speaking_gentle.webp
  disappointment: SPEAKING_ASSETS["speaking-sad"],
  remorse: SPEAKING_ASSETS["speaking-sad"],
  embarrassment: SPEAKING_ASSETS["speaking-sad"],

  // Strong sadness -> falls back to the gentle speaking asset (no strong variant exists)
  sadness: SPEAKING_ASSETS["sad-speaking-strong"],
  grief: SPEAKING_ASSETS["sad-speaking-strong"],

  // Love emotions -> natural fallback: speaking_happy.webp
  love: SPEAKING_ASSETS["speaking-happy"],
  desire: SPEAKING_ASSETS["speaking-happy"],
  caring: SPEAKING_ASSETS["speaking-happy"],
  admiration: SPEAKING_ASSETS["speaking-happy"],
  gratitude: SPEAKING_ASSETS["speaking-happy"],

  // Anger emotions -> natural fallback: speaking_neutral.webp
  anger: SPEAKING_ASSETS["speaking-neutral"],
  annoyance: SPEAKING_ASSETS["speaking-neutral"],

  // Disgust emotions -> natural fallback: speaking_neutral.webp
  disgust: SPEAKING_ASSETS["speaking-neutral"],
  disapproval: SPEAKING_ASSETS["speaking-neutral"],

  // Fear emotions -> natural fallback: speaking_neutral.webp
  fear: SPEAKING_ASSETS["speaking-neutral"],
  nervousness: SPEAKING_ASSETS["speaking-neutral"],
  anxiety: SPEAKING_ASSETS["speaking-neutral"],
  terrified: SPEAKING_ASSETS["speaking-neutral"],

  // Surprise -> natural fallback: speaking_happy.webp
  surprise: SPEAKING_ASSETS["speaking-happy"],
};

export const MODEL_EMOTIONS_MAP_WITH_BASE_MASCOT_EMOTIONS: 
Record<string, BaseMascotKey> = {
  curiosity: "thinking",
  excitement: "happy-strong",
  joy: "happy-strong",
  pride: "celebration",
  amusement: "happy-strong",

  admiration: "happy-gentle",
  approval: "happy-gentle",
  optimism: "happy-gentle",
  relief: "happy-gentle",
  gratitude: "happy-gentle",

  love: "love-strong",
  caring: "gentle-love",
  desire: "gentle-love",

  neutral: "neutral",
  confusion: "thinking",
  realization: "surprise",

  surprise: "surprise",

  anger: "anger",
  annoyance: "anger",
  disapproval: "disgust",

  disgust: "disgust",

  fear: "fear",
  nervousness: "fear",
  embarrassment: "fear",

  sadness: "sad-gentle",
  disappointment: "sad-gentle",
  grief: "sad-strong",
  remorse: "sad-strong",
};

const LEGACY_ID_TO_MODEL_EMOTION: Record<string, string> = {
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

const NORMALIZED_LEGACY_ID_TO_MODEL_EMOTION = Object.fromEntries(
  Object.entries(LEGACY_ID_TO_MODEL_EMOTION).map(([key, value]) => [
    key.toLowerCase(),
    value,
  ]),
) as Record<string, string>;

export function resolveBaseMascotKey(emotionInput: string): BaseMascotKey {
  if (!emotionInput) return "neutral";
  const normalized = emotionInput.trim().toLowerCase();
  if (!normalized) return "neutral";
  return MODEL_EMOTIONS_MAP_WITH_BASE_MASCOT_EMOTIONS[normalized] ?? "neutral";
}

export function getMascotAssetUrl(
  emotionInput: string,
  isSpeaking: boolean = false,
): string {
  const normalized = emotionInput ? emotionInput.trim().toLowerCase() : "neutral";

  if (isSpeaking) {
    if (normalized in MODEL_EMOTION_TO_SPEAKING_ASSET) {
      return MODEL_EMOTION_TO_SPEAKING_ASSET[normalized];
    }

    const legacyEmotion = NORMALIZED_LEGACY_ID_TO_MODEL_EMOTION[normalized];
    if (legacyEmotion && legacyEmotion.toLowerCase() in MODEL_EMOTION_TO_SPEAKING_ASSET) {
      return MODEL_EMOTION_TO_SPEAKING_ASSET[legacyEmotion.toLowerCase()];
    }

    const baseKey = resolveBaseMascotKey(normalized);
    switch (baseKey) {
      case "happy-strong":
      case "happy-gentle":
      case "love-strong":
      case "gentle-love":
      case "surprise":
      case "celebration":
        return SPEAKING_ASSETS["speaking-happy"];
      case "sad-strong":
        return SPEAKING_ASSETS["sad-speaking-strong"];
      case "sad-gentle":
        return SPEAKING_ASSETS["speaking-sad"];
      case "thinking":
      case "anger":
      case "disgust":
      case "fear":
      case "shoked":
      default:
        return SPEAKING_ASSETS["speaking-neutral"];
    }
  }

  const baseKey = resolveBaseMascotKey(normalized);
  return BASE_MASCOT_ASSETS[baseKey] || BASE_MASCOT_ASSETS["neutral"];
}