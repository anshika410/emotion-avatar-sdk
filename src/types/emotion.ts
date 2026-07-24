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
  SHOCK = "SHOCK",
  CONFUSE = "CONFUSE",
}

/** Output of the emotion analysis */
export interface EmotionOutput {
  state: EmotionState;
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
  /** Number of tokens in the transcript. */
  tokenCount: number;
  /** Model inference latency in milliseconds. */
  inferenceLatencyMs: number;
  /** End-to-end analysis latency in milliseconds. */
  analysisLatencyMs: number;
  /** -1 to +1 sentiment valence */
  sentimentValence: number;
  /** Top emotion from DistilBERT model (null until model runs) */
  modelEmotion: EmotionLabel | null;
  /** Confidence of top emotion (0–1, 0 until model runs) */
  modelConfidence: number;
  /** All 6 emotion probabilities (empty until model runs) */
  emotionScores: Partial<Record<EmotionLabel, number>>;
  /** Count of emotion labels above the active threshold. */
  emotionCount: number;
  /** 0–1 complexity score where 1 means many competing emotion cues. */
  complexityScore: number;
  /** Breakdown of complexity contributors. */
  complexityBreakdown: {
    topGapComplexity: number;
    entropyComplexity: number;
    lexicalConflictComplexity: number;
    emotionCountComplexity: number;
    total: number;
    notes: string[];
  };
  /** 0–1 uncertainty score where 1 means most uncertain. */
  uncertaintyScore: number;
  /** Breakdown of uncertainty contributors. */
  uncertaintyBreakdown: {
    confidenceUncertainty: number;
    gapUncertainty: number;
    entropyUncertainty: number;
    lexicalUncertainty: number;
    total: number;
    notes: string[];
  };
}

export interface EmotionExplanationChunk {
  text: string;
  score: number;
  valence: number;
  hasNegation: boolean;
  hasIntensifier: boolean;
  hasContrast: boolean;
  keywordHits: number;
  triggerWords: string[];
  matchedKeywords: {
    positive: string[];
    negative: string[];
    emotion: string[];
    negation: string[];
    intensifier: string[];
    contrast: string[];
  };
  scoreBreakdown: {
    valence: number;
    keywordHits: number;
    negationBonus: number;
    intensifierBonus: number;
    contrastBonus: number;
    lengthBonus: number;
    total: number;
  };
}

export interface EmotionExplanation {
  previousTranscript: string;
  currentTranscript: string;
  addedText: string;
  source: "addedText" | "fullTranscript";
  reason: string;
  topChunk: EmotionExplanationChunk | null;
  chunks: EmotionExplanationChunk[];
}

/** Debug payload for showing the raw analysis behind a detected emotion. */
export interface EmotionDebugInfo extends TextSignals {
  /** Original transcript that was analyzed. */
  transcript: string;
  /** Emotion state used by the avatar renderer. */
  state: EmotionState;
  /** Top 2 emotions from the smoothed model output. */
  topEmotions?: Array<{ emotion: string; score: number }>;
  /** Why this emotion was likely predicted for this turn. */
  explanation?: EmotionExplanation;
}
