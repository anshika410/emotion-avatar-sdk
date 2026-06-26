/**
 * Shared emotion-mapping utilities.
 *
 * Centralizes the logic for converting ML emotion labels and sentiment
 * valence into avatar EmotionState + intensity pairs, and for deriving
 * state from speaking/listening flags.
 */

import { EmotionState, type EmotionLabel, type EmotionOutput } from "../types/emotion";
import type { TextSignals } from "../types/emotion";

// ──────────────────── Model emotion → avatar state ────────────────────

/** Map a model-predicted emotion label to an avatar EmotionState + intensity. */
export function mapModelEmotionToState(label: EmotionLabel): EmotionOutput {
  switch (label) {
    case "happiness":
    case "love":
    case "desire":
      return { state: EmotionState.ENCOURAGE, intensity: 0.8 };
    case "anger":
    case "fear":
    case "sadness":
    case "disgust":
    case "shame":
    case "guilt":
      return { state: EmotionState.CAUTION, intensity: 0.7 };
    case "surprise":
    case "confusion":
      return { state: EmotionState.THINK, intensity: 0.6 };
    case "sarcasm":
      return { state: EmotionState.CAUTION, intensity: 0.4 };
    default:
      return { state: EmotionState.LISTEN, intensity: 0.5 };
  }
}

// ──────────────────── Valence fallback ────────────────────

/** Derive avatar state from sentiment valence when no model emotion is available. */
export function mapValenceToState(valence: number): EmotionOutput {
  if (valence > 0.3) return { state: EmotionState.ENCOURAGE, intensity: 0.7 };
  if (valence < -0.3) return { state: EmotionState.CAUTION, intensity: 0.6 };
  return { state: EmotionState.LISTEN, intensity: 0.5 };
}

// ──────────────────── Combined signal mapping ────────────────────

const DEFAULT_OUTPUT: EmotionOutput = { state: EmotionState.LISTEN, intensity: 0.3 };

/**
 * Map TextSignals (model emotion + valence) to an avatar EmotionOutput.
 * Prefers the ML model emotion when available, falls back to valence.
 */
export function mapSignalsToEmotionOutput(signals: TextSignals): EmotionOutput {
  if (signals.modelEmotion) {
    return mapModelEmotionToState(signals.modelEmotion);
  }
  return mapValenceToState(signals.sentimentValence);
}

/** Default EmotionOutput representing an idle/listen state. */
export const IDLE_EMOTION_OUTPUT: EmotionOutput = DEFAULT_OUTPUT;

// ──────────────────── Speaking / Listening override ────────────────────

/**
 * Derive emotion from speaking/listening flags.
 * Returns null when neither flag is set (no override).
 */
export function getSpeakingListeningState(
  isSpeaking: boolean,
  isListening: boolean,
): EmotionOutput | null {
  if (isSpeaking) return { state: EmotionState.SPEAK_NEUTRAL, intensity: 0.7 };
  if (isListening) return { state: EmotionState.LISTEN, intensity: 0.5 };
  return null;
}
