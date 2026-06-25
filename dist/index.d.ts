import { JSX } from 'react/jsx-runtime';

export declare function AnimatedAvatar({ aiMessage, userMessage, emotionDetection, autoAnimate, isSpeaking, isListening, overrideEmotion, onEmotionChange, customImages, size, className, }: AnimatedAvatarProps): JSX.Element;

export declare interface AnimatedAvatarProps {
    /** Text from the AI/LLM for emotion analysis */
    aiMessage?: string;
    /** Text from the user for emotion analysis */
    userMessage?: string;
    /** Whether to enable automatic emotion detection */
    emotionDetection?: boolean;
    /** Whether to enable automatic animations */
    autoAnimate?: boolean;
    /** Speaking state from parent (TTS status) */
    isSpeaking?: boolean;
    /** Listening state from parent (STT status) */
    isListening?: boolean;
    /** Custom emotion state override (for manual control) */
    overrideEmotion?: EmotionState;
    /** Callback when avatar emotion changes */
    onEmotionChange?: (emotion: EmotionState, intensity: number) => void;
    /** Custom avatar images (optional) */
    customImages?: Partial<Record<EmotionState, string>>;
    /** Size of the avatar in pixels */
    size?: number;
    /** CSS class name for styling */
    className?: string;
}

export declare interface AvatarControllerReturn {
    emotionState: EmotionState;
    intensity: number;
    setEmotion: (emotion: EmotionState) => void;
    analyzeEmotion: (text: string) => Promise<EmotionState>;
}

export declare function AvatarRenderer({ emotionState, intensity, size, customImages, }: AvatarRendererProps): JSX.Element;

declare interface AvatarRendererProps {
    emotionState: EmotionState;
    intensity: number;
    size: number;
    customImages?: Partial<Record<EmotionState, string>>;
}

/**
 * Classify the emotion of a text string.
 *
 * Returns all 6 emotion probabilities + the top emotion.
 * Inference time: ~30–80ms on desktop, ~60–120ms on mobile (INT8 WASM).
 *
 * @param text - User speech transcript (partial or final)
 * @returns EmotionClassification or null if model isn't loaded yet
 */
export declare function classifyEmotion(text: string): Promise<EmotionClassification | null>;

/**
 * Dispose of the model pipeline and free memory.
 */
export declare function disposeEmotionClassifier(): Promise<void>;

/** Full classification result */
declare interface EmotionClassification {
    /** Highest-probability emotion */
    topEmotion: EmotionLabel_2;
    /** Confidence of the top emotion (0–1) */
    confidence: number;
    /** All 6 emotion probabilities */
    scores: Record<EmotionLabel_2, number>;
    /** Inference time in milliseconds */
    inferenceMs: number;
}

/** The 6 Ekman emotion labels from DistilBERT */
declare type EmotionLabel = "sadness" | "joy" | "love" | "anger" | "fear" | "surprise";

/**
 * Browser-based emotion classification using DistilBERT (ONNX INT8 quantized).
 *
 * Model: Xenova/distilbert-base-uncased-emotion
 *   - 6 Ekman emotions: sadness, joy, love, anger, fear, surprise
 *   - ~66M params (DistilBERT) ≈ 17 MB quantized INT8
 *   - ~40% fewer params and ~60% faster than BERT-base
 *   - Browser inference via ONNX Runtime WASM (single-threaded)
 *
 * Uses @huggingface/transformers (Transformers.js v3) which handles:
 *   - Automatic model download + IndexedDB caching
 *   - WordPiece tokenization
 *   - ONNX Runtime Web execution with quantization selection
 *
 * The classifier exposes:
 *   - `classifyEmotion(text)` → top emotion + all probabilities
 *   - `warmUp()` → preload model (call during init for no cold-start)
 *   - Debounced batch-friendly: safe to call at high frequency
 */
/** The 6 Ekman emotion labels from the model */
declare type EmotionLabel_2 = "sadness" | "joy" | "love" | "anger" | "fear" | "surprise";

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

/** Whether the model is loaded and ready for inference */
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

/**
 * Pre-load the model so classification calls have no cold-start.
 * Safe to call multiple times (idempotent).
 */
export declare function warmUpEmotionClassifier(): Promise<void>;

export { }
