const getAssetUrl = (filename: string): string => {
  return `/assets/${filename}`;
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

/** WebP image URLs for base mascots resolved via standard ESM URL constructor */
export const BASE_MASCOT_ASSETS: Record<BaseMascotKey, string> = {
  "love-strong": getAssetUrl("love-strong.webp"),
  "gentle-love": getAssetUrl("gentle-love.webp"),
  "happy-strong": getAssetUrl("happy-strong.webp"),
  "happy-gentle": getAssetUrl("happy-gentle.webp"),
  thinking: getAssetUrl("thinking.webp"),
  surprise: getAssetUrl("surprise.webp"),
  anger: getAssetUrl("anger.webp"),
  disgust: getAssetUrl("disgust.webp"),
  fear: getAssetUrl("fear.webp"),
  "sad-strong": getAssetUrl("sad-strong.webp"),
  // Additional assets for specific legacy/extended lookups
  "sad-gentle": getAssetUrl("sad-gentle.webp"),
  celebration: getAssetUrl("celebration.webp"),
  shoked: getAssetUrl("shoked.webp"),
  "speaking-happy": getAssetUrl("speaking-happy.webp"),
  "speaking-neutral": getAssetUrl("speaking-neutral.webp"),
  "speaking-sad": getAssetUrl("speaking-sad.webp"),
  neutral: getAssetUrl("neutral.webp"),
};

/** Dedicated speaking assets resolved via standard ESM URL constructor */
export const SPEAKING_ASSETS = {
  "speaking-happy": getAssetUrl("speaking-happy.webp"),
  "speaking-neutral": getAssetUrl("speaking-neutral.webp"),
  "speaking-sad": getAssetUrl("speaking-sad.webp"),
  // Fallback for strong sadness when dedicated strong speaking asset is not present
  "sad-speaking-strong": getAssetUrl("speaking-sad.webp"),
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

  // Strong sadness -> sad-speaking_strong.webp (with fallback)
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

export const MODEL_EMOTIONS_MAP_WITH_BASE_MASCOT_EMOTIONS: Record<
  string,
  BaseMascotKey
> = {
  // High-energy positive
  curiosity: "thinking",
  excitement: "happy-strong",
  joy: "happy-strong",
  pride: "happy-strong",
  amusement: "happy-strong",

  // Gentle positive
  admiration: "happy-gentle",
  approval: "happy-gentle",
  optimism: "happy-gentle",
  relief: "happy-gentle",
  gratitude: "happy-gentle",

  // Love / affection
  love: "love-strong",
  caring: "gentle-love",
  desire: "gentle-love",

  // Neutral / cognitive
  neutral: "neutral",
  confusion: "thinking",
  realization: "surprise",

  // Surprise
  surprise: "surprise",

  // Anger family
  anger: "anger",
  annoyance: "anger",
  disapproval: "disgust",

  // Disgust
  disgust: "disgust",

  // Fear
  fear: "fear",
  nervousness: "fear",
  embarrassment: "fear",

  // Sadness family
  sadness: "sad-gentle",
  disappointment: "sad-gentle",
  grief: "sad-strong",
  remorse: "sad-strong",
};

/** Alias / legacy reaction ID mappings to model emotion keys */
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

/** Resolves any emotion input to a base mascot key */
export function resolveBaseMascotKey(emotionInput: string): BaseMascotKey {
  if (!emotionInput) return "neutral";

  const normalized = emotionInput.trim().toLowerCase();
  if (!normalized) return "neutral";

  const mascotKey = MODEL_EMOTIONS_MAP_WITH_BASE_MASCOT_EMOTIONS[normalized];
  if (mascotKey) return mascotKey;

  // Default fallback for unrecognized emotions
  return "neutral";
}

/** Resolves an emotion input and speaking state to the target WebP image URL */
export function getMascotAssetUrl(
  emotionInput: string,
  isSpeaking: boolean = false,
): string {
  const normalized = emotionInput
    ? emotionInput.trim().toLowerCase()
    : "neutral";

  if (isSpeaking) {
    // Check direct model emotion speaking asset
    if (normalized in MODEL_EMOTION_TO_SPEAKING_ASSET) {
      return MODEL_EMOTION_TO_SPEAKING_ASSET[normalized];
    }

    // Check legacy ID resolved to model emotion
    const legacyEmotion = NORMALIZED_LEGACY_ID_TO_MODEL_EMOTION[normalized];
    if (
      legacyEmotion &&
      legacyEmotion.toLowerCase() in MODEL_EMOTION_TO_SPEAKING_ASSET
    ) {
      return MODEL_EMOTION_TO_SPEAKING_ASSET[legacyEmotion.toLowerCase()];
    }

    // Check base mascot key to default speaking asset
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

  // Idle state: resolve base mascot WebP asset
  const baseKey = resolveBaseMascotKey(normalized);
  return BASE_MASCOT_ASSETS[baseKey] || BASE_MASCOT_ASSETS["neutral"];
}
