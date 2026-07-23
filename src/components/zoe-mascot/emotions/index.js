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

const reactionIds = {
  sadness: {
    gentle: sadnessConcernEmotion.id,
    strong: sadnessComfortEmotion.id,
  },
  anger: {
    gentle: angerAcknowledgeEmotion.id,
    strong: angerGroundingEmotion.id,
  },
  love: {
    gentle: loveWarmEmotion.id,
    strong: loveHeartfeltEmotion.id,
  },
  happiness: {
    gentle: happyWarmEmotion.id,
    strong: happyCelebrateEmotion.id,
  },
  surprise: {
    gentle: surpriseNoticeEmotion.id,
    strong: surpriseAstonishedEmotion.id,
  },
  fear: {
    gentle: fearReassureEmotion.id,
    strong: fearSteadyEmotion.id,
  },
  disgust: {
    gentle: disgustRecognizeEmotion.id,
    strong: disgustComposeEmotion.id,
  },
  shame: {
    gentle: shameAcceptanceEmotion.id,
    strong: shameSupportEmotion.id,
  },
  guilt: {
    gentle: guiltUnderstandEmotion.id,
    strong: guiltRepairEmotion.id,
  },
  confusion: {
    gentle: confusionCuriousEmotion.id,
    strong: confusionClarifyEmotion.id,
  },
  desire: {
    gentle: desireHopefulEmotion.id,
    strong: desireEncourageEmotion.id,
  },
  sarcasm: {
    gentle: sarcasmNoticeEmotion.id,
    strong: sarcasmKnowingEmotion.id,
  },
  neutral: {
    gentle: neutralPresentEmotion.id,
    strong: neutralFocusedEmotion.id,
  },
};

export function getEmotionDefinition(requestedId) {
  return emotionDefinitions.get(requestedId) ?? emotionDefinitions.get(DEFAULT_EMOTION_ID);
}

export function getReactionId(family, intensity = "gentle") {
  const normalizedIntensity = intensity === "strong" ? "strong" : "gentle";
  return reactionIds[family]?.[normalizedIntensity] ?? DEFAULT_EMOTION_ID;
}
