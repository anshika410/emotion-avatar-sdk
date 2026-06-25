import { JSX } from 'react';

export declare function AnimatedAvatar({ aiMessage, userMessage, emotionDetection, autoAnimate, isSpeaking, isListening, overrideEmotion, onEmotionChange, emotionImages, size, className, }: AnimatedAvatarProps): JSX.Element;

export declare interface AnimatedAvatarProps {
    aiMessage?: string;
    userMessage?: string;
    emotionDetection?: boolean;
    autoAnimate?: boolean;
    isSpeaking?: boolean;
    isListening?: boolean;
    overrideEmotion?: EmotionState;
    onEmotionChange?: (emotion: EmotionState, intensity: number) => void;
    /** Override individual or all avatar image paths. Merged with DEFAULT_AVATAR_IMAGES. */
    emotionImages?: Partial<Record<EmotionState, string>>;
    size?: number;
    className?: string;
}

export declare interface AvatarControllerReturn {
    emotionState: EmotionState;
    intensity: number;
    setEmotion: (emotion: EmotionState) => void;
    analyzeEmotion: (text: string) => Promise<EmotionState>;
}

export declare function AvatarRenderer({ emotionState, intensity, size, emotionImages, }: AvatarRendererProps): JSX.Element;

declare interface AvatarRendererProps {
    emotionState: EmotionState;
    intensity: number;
    size: number;
    emotionImages: Record<EmotionState, string>;
}

export declare function classifyEmotion(text: string): Promise<EmotionClassification | null>;

export declare function disposeEmotionClassifier(): Promise<void>;

declare interface EmotionClassification {
    topEmotion: EmotionLabel;
    confidence: number;
    scores: Record<EmotionLabel, number>;
    inferenceMs: number;
}

/** The 6 Ekman emotion labels from DistilBERT */
declare type EmotionLabel = "sadness" | "anger" | "love" | "surprise" | "fear" | "happiness" | "neutral" | "disgust" | "shame" | "guilt" | "confusion" | "desire" | "sarcasm";

/** Output of the emotion analysis */
export declare interface EmotionOutput {
    state: EmotionState;
    /** 0–1 intensity value controlling CSS effects (opacity, scale, brightness) */
    intensity: number;
}

/**
 * Emotion types for the mascot avatar animation system.
 * 6 deterministic animation states driven by text-based emotion analysis.
 */
export declare enum EmotionState {
    LISTEN = "LISTEN",
    SPEAK_NEUTRAL = "SPEAK_NEUTRAL",
    ENCOURAGE = "ENCOURAGE",
    THINK = "THINK",
    CAUTION = "CAUTION",
    CELEBRATE = "CELEBRATE"
}

/**
 * Instant rule-based extraction (no ML). Returns in <1 ms.
 * Used as initial value; ML fields are populated later by `extractTextSignalsWithML()`.
 */
export declare function extractTextSignals(transcript: string): TextSignals;

/**
 * Full extraction: rule-based + async ML emotion classification.
 * Call on final transcripts (or debounced interim transcripts).
 *
 * If the ML model isn't loaded yet, returns rule-based signals with empty ML fields.
 */
export declare function extractTextSignalsWithML(transcript: string): Promise<TextSignals>;

export declare function isEmotionClassifierReady(): boolean;

/** Text-level signals from final transcripts */
export declare interface TextSignals {
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

export declare function useAvatarController({ isSpeaking, isListening, onEmotionChange, }: UseAvatarControllerProps): AvatarControllerReturn;

export declare interface UseAvatarControllerProps {
    isSpeaking?: boolean;
    isListening?: boolean;
    onEmotionChange?: (emotion: EmotionState, intensity: number) => void;
}

export declare function useEmotionController({ aiMessage, userMessage, isSpeaking, isListening, }: UseEmotionControllerProps): {
    emotionState: EmotionState;
    intensity: number;
    analyzeText: (text: string) => Promise<EmotionOutput>;
};

declare interface UseEmotionControllerProps {
    /** Text from the AI/LLM for emotion analysis */
    aiMessage?: string;
    /** Text from the user for emotion analysis */
    userMessage?: string;
    /** Speaking state from parent (TTS status) */
    isSpeaking?: boolean;
    /** Listening state from parent (STT status) */
    isListening?: boolean;
}

export declare function warmUpEmotionClassifier(): Promise<void>;

export { }
