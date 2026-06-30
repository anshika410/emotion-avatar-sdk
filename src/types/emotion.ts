/**
 * Emotion types for the mascot avatar animation system.
 * 6 deterministic animation states driven by text-based emotion analysis.
 */

export enum EmotionState {
  LISTEN = "LISTEN",
  SPEAK_NEUTRAL = "SPEAK_NEUTRAL",
  ENCOURAGE = "ENCOURAGE",
  THINK = "THINK",
  CAUTION = "CAUTION",
  CELEBRATE = "CELEBRATE",
  HAPPY = "HAPPY",
  SAD = "SAD",
  ANGRY = "ANGRY",
  SURPRISED = "SURPRISED",
}

/** Output of the emotion analysis */
export interface EmotionOutput {
  state: EmotionState;
  /** 0–1 intensity value controlling CSS effects (opacity, scale, brightness) */
  intensity: number;
}

/** The 6 Ekman emotion labels from DistilBERT */
export type EmotionLabel =
  | "sadness"
  | "anger"
  | "love"
  | "surprise"
  | "fear"
  | "happiness"
  | "neutral"
  | "disgust"
  | "shame"
  | "guilt"
  | "confusion"
  | "desire"
  | "sarcasm";

/** Text-level signals from final transcripts */
export interface TextSignals {
  /** 0–1 content completeness (STAR framework markers) */
  contentCompleteness: number;
  /** -1 to +1 sentiment valence */
  sentimentValence: number;
  /** Top emotion from DistilBERT model (null until model runs) */
  modelEmotion: EmotionLabel | null;
  /** Confidence of top emotion (0–1, 0 until model runs) */
  modelConfidence: number;
  /** All 6 emotion probabilities (empty until model runs) */
  emotionScores: Partial<Record<EmotionLabel, number>>;
}
