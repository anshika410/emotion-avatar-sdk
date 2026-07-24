import type {
  TextSignals,
  EmotionExplanation,
  EmotionExplanationChunk,
} from "../../types/emotion";
import { classifyEmotion } from "./emotionClassifier";
import type { EmotionLabel } from "../../types/emotion";

// ──────────────────── STAR completeness ────────────────────
const STAR_SITUATION = /\b(situation|context|background|project|when|at that time|while working)\b/i;
const STAR_TASK = /\b(task|goal|objective|challenge|responsible for|assigned|needed to)\b/i;
const STAR_ACTION = /\b(action|i did|i built|i implemented|i designed|i created|i wrote|i developed|i used|i refactored|i optimized|my approach|steps i took)\b/i;
const STAR_RESULT = /\b(result|outcome|impact|improved|reduced|increased|saved|achieved|delivered|metric|percentage|percent|%|\d+x)\b/i;

function computeCompleteness(text: string): number {
  if (!text.trim()) return 0;
  let score = 0;
  if (STAR_SITUATION.test(text)) score += 0.25;
  if (STAR_TASK.test(text)) score += 0.25;
  if (STAR_ACTION.test(text)) score += 0.25;
  if (STAR_RESULT.test(text)) score += 0.25;
  return score;
}

// ──────────────────── Sentiment valence ────────────────────
const POSITIVE_WORDS = new Set([
  "good", "great", "excellent", "awesome", "amazing", "fantastic", "wonderful",
  "perfect", "love", "loved", "enjoy", "enjoyed", "happy", "excited", "proud",
  "successful", "success", "improved", "improved", "efficient", "effective",
  "solved", "achieved", "accomplished", "innovative", "elegant", "clean",
  "robust", "scalable", "fast", "reliable", "stable",
]);

const NEGATIVE_WORDS = new Set([
  "bad", "terrible", "awful", "horrible", "poor", "failed", "failure",
  "struggle", "struggled", "difficult", "hard", "confusing", "confused",
  "frustrated", "frustrated", "broken", "buggy", "slow", "unstable",
  "messy", "complicated", "unclear", "wrong", "error", "crash", "crashed",
]);

const NEGATION_WORDS = new Set([
  "not", "never", "no", "none", "nobody", "nothing", "neither", "nor",
  "cannot", "cant", "can't", "dont", "don't", "didnt", "didn't", "wont", "won't",
  "isnt", "isn't", "wasnt", "wasn't", "without",
]);

const INTENSIFIER_WORDS = new Set([
  "very", "really", "so", "too", "extremely", "highly", "super", "totally",
  "absolutely", "incredibly", "deeply", "strongly", "quite", "massively",
]);

const CONTRAST_WORDS = new Set([
  "but", "however", "though", "although", "yet", "instead", "rather",
]);

const EMOTION_HINT_WORDS = new Set([
  "happy", "sad", "angry", "afraid", "fear", "scared", "surprised", "confused",
  "frustrated", "excited", "nervous", "worried", "love", "hate", "guilty", "ashamed",
]);

function computeValence(text: string): number {
  if (!text.trim()) return 0;
  const words = text.toLowerCase().split(/\W+/);
  let pos = 0, neg = 0;
  for (const w of words) {
    if (POSITIVE_WORDS.has(w)) pos++;
    if (NEGATIVE_WORDS.has(w)) neg++;
  }
  const total = pos + neg;
  if (total === 0) return 0;
  return (pos - neg) / total;
}

// ──────────────────── Rolling average + threshold logic ────────────────────

/** Number of past predictions for taking average */
const SMOOTHING_WINDOW = 5;

/** Minimum gap between top two RAW emotions from model to allow a switch */
const EMOTION_SWITCH_THRESHOLD = 0.05;

/** History of RAW emotion score from the model */
let predictionHistory: Array<Record<string, number>> = [];

/** History of confidence value of past emitted emotions (not used for evaluation yet) */
// let confidenceHistory: Array<number> = [];

/** Last emotion that was actually emitted (default: neutral) */
let lastEmittedEmotion: string = 'neutral';

/** Confidence of the last emitted emotion (from the SMOOTHED scores) */
let lastEmittedConfidence: number = 0;

/** Last analyzed transcript for explanation diffing. */
let lastTranscript = "";

function tokenize(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

function computeAddedText(previous: string, current: string): string {
  const prev = previous.trim();
  const curr = current.trim();
  if (!curr) return "";
  if (!prev) return curr;
  if (curr.startsWith(prev)) {
    return curr.slice(prev.length).trim();
  }

  const prevWords = tokenize(prev);
  const currWords = tokenize(curr);

  let prefix = 0;
  while (
    prefix < prevWords.length &&
    prefix < currWords.length &&
    prevWords[prefix].toLowerCase() === currWords[prefix].toLowerCase()
  ) {
    prefix += 1;
  }

  let prevSuffix = prevWords.length - 1;
  let currSuffix = currWords.length - 1;
  while (
    prevSuffix >= prefix &&
    currSuffix >= prefix &&
    prevWords[prevSuffix].toLowerCase() === currWords[currSuffix].toLowerCase()
  ) {
    prevSuffix -= 1;
    currSuffix -= 1;
  }

  const addedWords = currWords.slice(prefix, currSuffix + 1);
  return addedWords.join(" ").trim();
}

function splitIntoChunks(text: string): string[] {
  return text
    .split(/(?<=[.!?,;:])\s+|\s+(?=but\b|however\b|although\b|though\b|yet\b)/i)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

function countWordHits(words: string[], dictionary: Set<string>): number {
  let hits = 0;
  for (const word of words) {
    if (dictionary.has(word)) hits += 1;
  }
  return hits;
}

function getMatchedWords(words: string[], dictionary: Set<string>): string[] {
  return Array.from(new Set(words.filter((word) => dictionary.has(word))));
}

function scoreChunk(chunk: string): EmotionExplanationChunk {
  const words = chunk.toLowerCase().split(/\W+/).filter(Boolean);
  const valence = computeValence(chunk);
  const hasNegation = countWordHits(words, NEGATION_WORDS) > 0;
  const hasIntensifier = countWordHits(words, INTENSIFIER_WORDS) > 0;
  const hasContrast = countWordHits(words, CONTRAST_WORDS) > 0;

  const matchedKeywords = {
    positive: getMatchedWords(words, POSITIVE_WORDS),
    negative: getMatchedWords(words, NEGATIVE_WORDS),
    emotion: getMatchedWords(words, EMOTION_HINT_WORDS),
    negation: getMatchedWords(words, NEGATION_WORDS),
    intensifier: getMatchedWords(words, INTENSIFIER_WORDS),
    contrast: getMatchedWords(words, CONTRAST_WORDS),
  };

  const keywordHits =
    matchedKeywords.positive.length +
    matchedKeywords.negative.length +
    matchedKeywords.emotion.length;

  const valenceScore = Math.abs(valence);
  const negationBonus = hasNegation ? 0.8 : 0;
  const intensifierBonus = hasIntensifier ? 0.6 : 0;
  const contrastBonus = hasContrast ? 0.5 : 0;
  const lengthBonus = Math.min(words.length / 12, 0.4);
  const score =
    valenceScore +
    keywordHits * 1.2 +
    negationBonus +
    intensifierBonus +
    contrastBonus +
    lengthBonus;

  return {
    text: chunk,
    score,
    valence,
    hasNegation,
    hasIntensifier,
    hasContrast,
    keywordHits,
    matchedKeywords,
    scoreBreakdown: {
      valence: valenceScore,
      keywordHits,
      negationBonus,
      intensifierBonus,
      contrastBonus,
      lengthBonus,
      total: score,
    },
  };
}

function buildChunkReason(chunk: EmotionExplanationChunk | null): string {
  if (!chunk) {
    return "No high-signal phrase found in this turn.";
  }

  const parts: string[] = [];
  const keywordWords = [
    ...chunk.matchedKeywords.positive,
    ...chunk.matchedKeywords.negative,
    ...chunk.matchedKeywords.emotion,
  ];
  if (keywordWords.length > 0) {
    parts.push(`keywords: ${keywordWords.join(", ")}`);
  }
  if (chunk.matchedKeywords.negation.length > 0) {
    parts.push(`negation: ${chunk.matchedKeywords.negation.join(", ")}`);
  }
  if (chunk.matchedKeywords.intensifier.length > 0) {
    parts.push(`intensifier: ${chunk.matchedKeywords.intensifier.join(", ")}`);
  }
  if (chunk.matchedKeywords.contrast.length > 0) {
    parts.push(`contrast: ${chunk.matchedKeywords.contrast.join(", ")}`);
  }
  if (chunk.valence > 0.2) parts.push(`positive valence ${chunk.valence.toFixed(2)}`);
  if (chunk.valence < -0.2) parts.push(`negative valence ${chunk.valence.toFixed(2)}`);

  if (parts.length === 0) {
    return "Explanation is based on weak lexical cues from the selected phrase.";
  }

  return `Top phrase selected because ${parts.join(", ")}.`;
}

function buildEmotionExplanation(previousTranscript: string, currentTranscript: string): EmotionExplanation {
  const addedText = computeAddedText(previousTranscript, currentTranscript);
  const source = addedText ? "addedText" : "fullTranscript";
  const chunksSource = addedText || currentTranscript;
  const chunks = splitIntoChunks(chunksSource).map(scoreChunk);
  const topChunk = chunks.length > 0
    ? chunks.reduce((best, current) => (current.score > best.score ? current : best))
    : null;
  const chunkReason = buildChunkReason(topChunk);

  const reason = source === "addedText"
    ? chunkReason
    : `No new text detected, so explanation is based on the full current transcript. ${chunkReason}`;

  return {
    previousTranscript,
    currentTranscript,
    addedText,
    source,
    reason,
    topChunk,
    chunks,
  };
}

/**
 * Update rolling window and return element‑wise average of all scores.
 * The window is a FIFO queue of the last n (SMOOTHING_WINDOW) RAW predictions.
 */
function getSmoothedScores(newScores: Record<string, number>): Record<string, number> {
  predictionHistory.push(newScores);
  if (predictionHistory.length > SMOOTHING_WINDOW) {
    predictionHistory.shift();
  }

  const averaged: Record<string, number> = {};
  const count = predictionHistory.length;
  const allKeys = new Set<string>();
  for (const entry of predictionHistory) {
    for (const key of Object.keys(entry)) {
      allKeys.add(key);
    }
  }

  for (const key of allKeys) {
    let sum = 0;
    for (const entry of predictionHistory) {
      sum += (entry[key] ?? 0);
    }
    averaged[key] = sum / count;
  }

  return averaged;
}

/**
 * Gets the moving average of confidence values over the last SMOOTHING_WINDOW predictions
 * Not used for evaluation yet, but could be useful for future enhancements
 */
// function getMovingAverageConfidence(newConfidence: number): number {
//   confidenceHistory.push(newConfidence);
//   if (confidenceHistory.length > SMOOTHING_WINDOW) {
//     confidenceHistory.shift();
//   }
//   const sum = confidenceHistory.reduce((a, b) => a + b, 0);
//   return sum / confidenceHistory.length;
// }

/** Get top N emotions (sorted descending by score). */
function getTopN(scores: Record<string, number>, n: number): Array<{ emotion: string; score: number }> {
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([emotion, score]) => ({ emotion, score }));
}

/**
 * Reset the rolling history and emitted emotion state.
 * Call this when starting a new conversation.
 * Currently called after Final Transcript with a timeout of 1000 ms
 */
export function resetEmotionProcessing(): void {
  predictionHistory = [];
  // confidenceHistory = [];
  lastEmittedEmotion = 'neutral';
  lastEmittedConfidence = 0;
  lastTranscript = "";
}

// ──────────────────── Public API ────────────────────

/** Default empty ML fields */
const EMPTY_ML: Pick<TextSignals, "modelEmotion" | "modelConfidence" | "emotionScores"> = {
  modelEmotion: null,
  modelConfidence: 0,
  emotionScores: {},
};

/** Instant rule‑based extraction (no ML). Returns in <1 ms. */
export function extractTextSignals(transcript: string): TextSignals {
  return {
    contentCompleteness: computeCompleteness(transcript),
    sentimentValence: computeValence(transcript),
    ...EMPTY_ML,
  };
}

/**
 * Full extraction: rule‑based + smoothed ML emotion.
 * Uses rolling average for smooth transitions of emotions and a threshold to avoid flips when top two emotions are very close.
 * Returns a stable emotion based on the smoothed scores, defaulting to 'neutral'.
 */
export async function extractTextSignalsWithML(
  transcript: string
): Promise<TextSignals & {
  topEmotions?: Array<{ emotion: string; score: number }>;
  explanation?: EmotionExplanation;
}> {
  const base = extractTextSignals(transcript);
  const explanation = buildEmotionExplanation(lastTranscript, transcript);
  lastTranscript = transcript;

  const result = await classifyEmotion(transcript);
  if (!result) {
    // If ML fails, return only rule‑based signals (no ML fields)
    return {
      ...base,
      explanation,
    };
  }

  // 1. Smooth the raw scores over the last N predictions
  const smoothedScores = getSmoothedScores(result.scores);

  // 2. Find the top two emotions from the smoothed distribution
  const topTwo = getTopN(smoothedScores, 2);
  const topEmotion = topTwo[0]?.emotion ?? null;
  const topScore = topTwo[0]?.score ?? 0;
  const secondScore = topTwo[1]?.score ?? 0;
  const diff = topScore - secondScore;

  // 3. Decide which emotion to emit
  let emittedEmotion: string;
  let emittedConfidence: number;

  if (topEmotion === null) {
    // Safety fallback (should never happen)
    emittedEmotion = 'neutral';
    emittedConfidence = 0;
  } else if (diff >= EMOTION_SWITCH_THRESHOLD) {
    // Clear winner – switch to the top emotion
    emittedEmotion = topEmotion;
    emittedConfidence = topScore;
    // Remember it
    lastEmittedEmotion = emittedEmotion;
    lastEmittedConfidence = emittedConfidence;
  } else {
    // Difference too small – keep the last emitted emotion
    emittedEmotion = lastEmittedEmotion;
    // Look up its confidence from the current smoothed scores (if present)
    const score = smoothedScores[emittedEmotion];
    emittedConfidence = (score !== undefined) ? score : lastEmittedConfidence;
    // Update stored confidence if we found a valid score
    if (score !== undefined) {
      lastEmittedConfidence = emittedConfidence;
    }
  }

  console.log("[Emotion Debug]", {
    transcript,
    emotion: emittedEmotion,
    confidence: emittedConfidence,
    scores: smoothedScores,
    topEmotions: topTwo,
    explanation,
  });
  
  return {
    ...base,
    modelEmotion: emittedEmotion as EmotionLabel,
    modelConfidence: emittedConfidence,
    emotionScores: smoothedScores,      // smoothed probabilities
    topEmotions: topTwo,               // additional info for debugging or advanced use
    explanation,
  };
}