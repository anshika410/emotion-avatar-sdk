import type { TextSignals } from "../../types/emotion";
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
): Promise<TextSignals & { topEmotions?: Array<{ emotion: string; score: number }> }> {
  const base = extractTextSignals(transcript);

  const result = await classifyEmotion(transcript);
  if (!result) {
    // If ML fails, return only rule‑based signals (no ML fields)
    return base;
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

  return {
    ...base,
    modelEmotion: emittedEmotion as EmotionLabel,
    modelConfidence: emittedConfidence,
    emotionScores: smoothedScores,      // smoothed probabilities
    topEmotions: topTwo,               // additional info for debugging or advanced use
  };
}