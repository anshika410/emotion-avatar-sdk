import { angerAcknowledgeEmotion } from "./anger-acknowledge.js";
import { angerGroundingEmotion } from "./anger-grounding.js";
import { confusionClarifyEmotion } from "./confusion-clarify.js";
import { confusionCuriousEmotion } from "./confusion-curious.js";
import { disgustComposeEmotion } from "./disgust-compose.js";
import { disgustRecognizeEmotion } from "./disgust-recognize.js";
import { desireEncourageEmotion } from "./desire-encourage.js";
import { desireHopefulEmotion } from "./desire-hopeful.js";
import { fearReassureEmotion } from "./fear-reassure.js";
import { fearSteadyEmotion } from "./fear-steady.js";
import { happyCelebrateEmotion } from "./happy-celebrate.js";
import { happyWarmEmotion } from "./happy-warm.js";
import { guiltRepairEmotion } from "./guilt-repair.js";
import { guiltUnderstandEmotion } from "./guilt-understand.js";
import { listeningEmotion } from "./listening.js";
import { loveHeartfeltEmotion } from "./love-heartfelt.js";
import { loveWarmEmotion } from "./love-warm.js";
import { neutralFocusedEmotion } from "./neutral-focused.js";
import { neutralPresentEmotion } from "./neutral-present.js";
import { sadnessComfortEmotion } from "./sadness-comfort.js";
import { sadnessConcernEmotion } from "./sadness-concern.js";
import { shameAcceptanceEmotion } from "./shame-acceptance.js";
import { shameSupportEmotion } from "./shame-support.js";
import { sarcasmKnowingEmotion } from "./sarcasm-knowing.js";
import { sarcasmNoticeEmotion } from "./sarcasm-notice.js";
import { surpriseAstonishedEmotion } from "./surprise-astonished.js";
import { surpriseNoticeEmotion } from "./surprise-notice.js";

export const DEFAULT_EMOTION_ID = listeningEmotion.id;

const mascotFamilies = {
  love: {
    gentle: loveWarmEmotion.id,
    strong: loveHeartfeltEmotion.id,
  },
  joy: {
    gentle: happyWarmEmotion.id,
    strong: happyCelebrateEmotion.id,
  },
  surprise: {
    gentle: surpriseNoticeEmotion.id,
    strong: surpriseAstonishedEmotion.id,
  },
  anger: {
    gentle: angerAcknowledgeEmotion.id,
    strong: angerGroundingEmotion.id,
  },
  disgust: {
    gentle: disgustRecognizeEmotion.id,
    strong: disgustComposeEmotion.id,
  },
  sadness: {
    gentle: sadnessConcernEmotion.id,
    strong: sadnessComfortEmotion.id,
  },
  fear: {
    gentle: fearReassureEmotion.id,
    strong: fearSteadyEmotion.id,
  },
  neutral: {
    gentle: neutralPresentEmotion.id,
    strong: neutralFocusedEmotion.id,
  },
};

const emotionAliases = {
  happiness: { family: "joy", intensity: "strong" },
  joy: { family: "joy", intensity: "strong" },
  amusement: { family: "joy", intensity: "strong" },
  excitement: { family: "joy", intensity: "strong" },
  approval: { family: "joy", intensity: "gentle" },
  pride: { family: "joy", intensity: "strong" },
  optimism: { family: "joy", intensity: "gentle" },
  curiosity: { family: "joy", intensity: "gentle" },
  relief: { family: "joy", intensity: "gentle" },
  love: { family: "love", intensity: "strong" },
  caring: { family: "love", intensity: "gentle" },
  admiration: { family: "love", intensity: "gentle" },
  desire: { family: "love", intensity: "strong" },
  gratitude: { family: "love", intensity: "gentle" },
  surprise: { family: "surprise", intensity: "strong" },
  realization: { family: "surprise", intensity: "gentle" },
  confusion: { family: "surprise", intensity: "gentle" },
  anger: { family: "anger", intensity: "strong" },
  annoyance: { family: "anger", intensity: "gentle" },
  disgust: { family: "disgust", intensity: "strong" },
  disapproval: { family: "disgust", intensity: "gentle" },
  sadness: { family: "sadness", intensity: "strong" },
  grief: { family: "sadness", intensity: "strong" },
  disappointment: { family: "sadness", intensity: "gentle" },
  remorse: { family: "sadness", intensity: "gentle" },
  embarrassment: { family: "sadness", intensity: "gentle" },
  shame: { family: "sadness", intensity: "gentle" },
  guilt: { family: "sadness", intensity: "gentle" },
  fear: { family: "fear", intensity: "strong" },
  nervousness: { family: "fear", intensity: "gentle" },
  neutral: { family: "neutral", intensity: "gentle" },
  sarcasm: { family: "neutral", intensity: "gentle" },
  listening: { family: "neutral", intensity: "gentle" },
};

export const emotionList = [
  listeningEmotion,
  sadnessConcernEmotion,
  sadnessComfortEmotion,
  angerAcknowledgeEmotion,
  angerGroundingEmotion,
  loveWarmEmotion,
  loveHeartfeltEmotion,
  happyWarmEmotion,
  happyCelebrateEmotion,
  surpriseNoticeEmotion,
  surpriseAstonishedEmotion,
  fearReassureEmotion,
  fearSteadyEmotion,
  disgustRecognizeEmotion,
  disgustComposeEmotion,
  shameAcceptanceEmotion,
  shameSupportEmotion,
  guiltUnderstandEmotion,
  guiltRepairEmotion,
  confusionCuriousEmotion,
  confusionClarifyEmotion,
  desireHopefulEmotion,
  desireEncourageEmotion,
  sarcasmNoticeEmotion,
  sarcasmKnowingEmotion,
  neutralPresentEmotion,
  neutralFocusedEmotion,
];

export const emotionDefinitions = new Map(
  emotionList.map((emotion) => [
    emotion.id,
    emotion,
  ]),
);

export function getEmotionDefinition(requestedId) {
  return emotionDefinitions.get(requestedId) ?? emotionDefinitions.get(DEFAULT_EMOTION_ID);
}

export function getReactionId(emotion, intensity = "gentle") {
  const requestedEmotion = String(emotion ?? "").toLowerCase();
  const normalizedIntensity = intensity === "strong" ? "strong" : "gentle";

  if (emotionDefinitions.has(requestedEmotion)) {
    return requestedEmotion;
  }

  const alias = emotionAliases[requestedEmotion];
  if (alias) {
    return mascotFamilies[alias.family]?.[alias.intensity] ?? DEFAULT_EMOTION_ID;
  }

  return mascotFamilies[requestedEmotion]?.[normalizedIntensity] ?? DEFAULT_EMOTION_ID;
}
