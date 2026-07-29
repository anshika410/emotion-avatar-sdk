/** Base path for mascot assets - defaults to public/assets folder in consumer apps */
export const ASSET_BASE_PATH = "/assets";

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

/** Source of Truth mapping from 28 model emotions and synonyms to base mascots */
export const MODEL_EMOTION_TO_BASE_MASCOT: Record<string, BaseMascotKey> = {
  // Love-Strong
  love: "Love-Strong",
  desire: "Love-Strong",
  love_strong: "Love-Strong",
  heartfelt: "Love-Strong",

  // gentle-love
  caring: "gentle-love",
  admiration: "gentle-love",
  gratitude: "gentle-love",
  love_gentle: "gentle-love",
  affection: "gentle-love",

  // happy_strong
  joy: "happy_strong",
  amusement: "happy_strong",
  excitement: "happy_strong",
  pride: "happy_strong",
  happiness: "happy_strong",
  happy: "happy_strong",
  celebration: "happy_strong",
  excited: "happy_strong",
  thrilled: "happy_strong",

  // happy_gentle
  approval: "happy_gentle",
  optimism: "happy_gentle",
  relief: "happy_gentle",
  pleased: "happy_gentle",
  content: "happy_gentle",

  // thinking
  neutral: "thinking",
  curiosity: "thinking",
  realization: "thinking",
  confusion: "thinking",
  confused: "thinking",
  thinking: "thinking",
  curious: "thinking",

  // surprise
  surprise: "surprise",
  surprised: "surprise",
  astonished: "surprise",
  amazed: "surprise",

  // anger
  anger: "anger",
  annoyance: "anger",
  angry: "anger",
  annoyed: "anger",
  frustration: "anger",
  frustrated: "anger",
  furious: "anger",

  // disgust
  disgust: "disgust",
  disapproval: "disgust",
  disgusted: "disgust",

  // fear
  fear: "fear",
  nervousness: "fear",
  anxiety: "fear",
  terrified: "fear",
  scared: "fear",
  fearful: "fear",
  nervous: "fear",
  panicked: "fear",

  // sad-Strong
  sadness: "sad-Strong",
  grief: "sad-Strong",
  disappointment: "sad-Strong",
  remorse: "sad-Strong",
  embarrassment: "sad-Strong",
  sad: "sad-Strong",
  disappointed: "sad-Strong",
  remorseful: "sad-Strong",
  embarrassed: "sad-Strong",
  grieving: "sad-Strong",
};

/** WebP image URLs for base mascots */
export const BASE_MASCOT_ASSETS: Record<BaseMascotKey | string, string> = {
  "Love-Strong": `${ASSET_BASE_PATH}/Love-Strong.webp`,
  "gentle-love": `${ASSET_BASE_PATH}/gentle-love.webp`,
  happy_strong: `${ASSET_BASE_PATH}/happy_strong.webp`,
  happy_gentle: `${ASSET_BASE_PATH}/happy_gentle.webp`,
  thinking: `${ASSET_BASE_PATH}/thinking.webp`,
  surprise: `${ASSET_BASE_PATH}/surprise.webp`,
  anger: `${ASSET_BASE_PATH}/anger.webp`,
  disgust: `${ASSET_BASE_PATH}/disgust.webp`,
  fear: `${ASSET_BASE_PATH}/fear.webp`,
  "sad-Strong": `${ASSET_BASE_PATH}/sad-Strong.webp`,
  // Additional assets for specific legacy/extended lookups
  "sad-gentle": `${ASSET_BASE_PATH}/sad-gentle.webp`,
  celebration: `${ASSET_BASE_PATH}/celebration.webp`,
  shoked: `${ASSET_BASE_PATH}/shoked.webp`,
};

/** Dedicated speaking assets */
export const SPEAKING_ASSETS = {
  speaking_happy: `${ASSET_BASE_PATH}/speaking_happy.webp`,
  speaking_neutral: `${ASSET_BASE_PATH}/speaking_neutral.webp`,
  "sad-speaking_gentle": `${ASSET_BASE_PATH}/sad-speaking_gentle.webp`,
  // Fallback for strong sadness when dedicated strong speaking asset is not present
  "sad-speaking_strong": `${ASSET_BASE_PATH}/sad-speaking_gentle.webp`,
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
  happiness: SPEAKING_ASSETS.speaking_happy,
  happy: SPEAKING_ASSETS.speaking_happy,

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
  anxiety: SPEAKING_ASSETS.speaking_neutral,
  terrified: SPEAKING_ASSETS.speaking_neutral,

  // Surprise -> natural fallback: speaking_happy.webp
  surprise: SPEAKING_ASSETS.speaking_happy,
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

/** Resolves any emotion input to a base mascot key */
export function resolveBaseMascotKey(emotionInput: string): BaseMascotKey {
  if (!emotionInput) return "thinking";

  const normalized = emotionInput.trim().toLowerCase();

  // 1. Direct match with a 28 model emotion or synonym
  if (normalized in MODEL_EMOTION_TO_BASE_MASCOT) {
    return MODEL_EMOTION_TO_BASE_MASCOT[normalized];
  }

  // 2. Direct match with a base mascot key
  if (normalized in BASE_MASCOT_ASSETS) {
    return normalized as BaseMascotKey;
  }

  // 3. Match via legacy alias
  const legacyMatch = LEGACY_ID_TO_MODEL_EMOTION[emotionInput.trim()];
  if (legacyMatch && legacyMatch.toLowerCase() in MODEL_EMOTION_TO_BASE_MASCOT) {
    return MODEL_EMOTION_TO_BASE_MASCOT[legacyMatch.toLowerCase()];
  }

  // Default fallback
  return "thinking";
}

/** Resolves an emotion input and speaking state to the target WebP image URL */
export function getMascotAssetUrl(
  emotionInput: string,
  isSpeaking: boolean = false,
): string {
  const normalized = emotionInput ? emotionInput.trim().toLowerCase() : "neutral";

  if (isSpeaking) {
    // Check direct model emotion speaking asset
    if (normalized in MODEL_EMOTION_TO_SPEAKING_ASSET) {
      return MODEL_EMOTION_TO_SPEAKING_ASSET[normalized];
    }

    // Check legacy ID resolved to model emotion
    const legacyEmotion = LEGACY_ID_TO_MODEL_EMOTION[emotionInput.trim()];
    if (legacyEmotion && legacyEmotion.toLowerCase() in MODEL_EMOTION_TO_SPEAKING_ASSET) {
      return MODEL_EMOTION_TO_SPEAKING_ASSET[legacyEmotion.toLowerCase()];
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
