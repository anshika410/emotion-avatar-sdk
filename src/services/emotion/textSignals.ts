/**
 * Text signal extraction — hybrid rule-based + ML pipeline.
 *
 * Rule-based (instant):
 * - Content completeness (STAR framework markers)
 * - Sentiment valence (positive/negative word balance)
 *
 * ML-based (async, DistilBERT INT8 ONNX via Transformers.js):
 * - 6-class emotion classification (joy, sadness, anger, fear, surprise, love)
 * - Runs in ~30–80ms on desktop after warm-up
 *
 * `extractTextSignals()` returns rule-based output immediately.
 * `extractTextSignalsWithML()` adds ML emotion output asynchronously.
 */

import type { TextSignals } from "../../types/emotion";
import { classifyEmotion } from "./emotionClassifier";

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
  let pos = 0;
  let neg = 0;
  for (const w of words) {
    if (POSITIVE_WORDS.has(w)) pos++;
    if (NEGATIVE_WORDS.has(w)) neg++;
  }
  const total = pos + neg;
  if (total === 0) return 0;
  return (pos - neg) / total;
}

// ──────────────────── Public API ────────────────────

/** Default empty ML fields */
const EMPTY_ML: Pick<TextSignals, "modelEmotion" | "modelConfidence" | "emotionScores"> = {
  modelEmotion: null,
  modelConfidence: 0,
  emotionScores: {},
};

/**
 * Instant rule-based extraction (no ML). Returns in <1 ms.
 * Used as initial value; ML fields are populated later by `extractTextSignalsWithML()`.
 */
export function extractTextSignals(transcript: string): TextSignals {
  return {
    contentCompleteness: computeCompleteness(transcript),
    sentimentValence: computeValence(transcript),
    ...EMPTY_ML,
  };
}

/**
 * Full extraction: rule-based + async ML emotion classification.
 * Call on final transcripts (or debounced interim transcripts).
 *
 * If the ML model isn't loaded yet, returns rule-based signals with empty ML fields.
 */
export async function extractTextSignalsWithML(transcript: string): Promise<TextSignals> {
  const base = extractTextSignals(transcript);

  try {
    const result = await classifyEmotion(transcript);
    if (!result) return base;

    return {
      ...base,
      modelEmotion: result.topEmotion,
      modelConfidence: result.confidence,
      emotionScores: result.scores,
    };
  } catch (error) {
    console.warn("[TextSignals] ML classification failed, returning rule-based signals:", error);
    return base;
  }
}
