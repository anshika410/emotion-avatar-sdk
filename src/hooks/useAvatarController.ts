// emotion-sdk-v0.1.2\src\hooks\useAvatarController.ts
import { useState, useCallback, useEffect, useRef } from "react";
import { EmotionState } from "../types/emotion";
import {
  classifyEmotion,
  warmUpEmotionClassifier,
} from "../services/emotion/emotionClassifier.js";
import { extractTextSignals } from "../services/emotion/emotionStreamProcessor.js";

export const EMOTION_STATE_MAP: Record<EmotionState, string> = {
  [EmotionState.LISTEN]: "thinking",
  [EmotionState.SPEAK_NEUTRAL]: "thinking",
  [EmotionState.ENCOURAGE]: "Love-Strong",
  [EmotionState.THINK]: "thinking",
  [EmotionState.CAUTION]: "anger",
  [EmotionState.CELEBRATE]: "happy_strong",
  [EmotionState.HAPPY]: "happy_strong",
  [EmotionState.SAD]: "sad-Strong",
  [EmotionState.ANGRY]: "anger",
  [EmotionState.SURPRISED]: "surprise",
  [EmotionState.SHOCK]: "fear",
  [EmotionState.CONFUSE]: "thinking",
};

export interface EmotionDebugInfo {
  transcript: string;
  state: string;
  modelEmotion?: string;
  modelConfidence?: number;
  sentimentValence?: number;
}

export interface UseAvatarControllerProps {
  isSpeaking?: boolean;
  isListening?: boolean;
  /** Fired after every analyzeEmotion() call with the signal set. */
  onEmotionDebug?: (info: EmotionDebugInfo) => void;
}

export interface AvatarControllerReturn {
  isInitialized: boolean;
  emotionId: string;
  setIsInitialized: (isInitialized: boolean) => void;
  setEmotion: (emotion: EmotionState | string) => void;
  analyzeEmotion: (text: string, bypassChunkSizeGate?: boolean) => Promise<string>;
}

/** Rule-based emotion detector for text fallback */
export function detectRuleBasedEmotion(text: string): string {
  const lower = text.toLowerCase();

  if (/\b(fail|failed|disappointed|disappointment|sad|sadness|grief|remorse|embarrassed)\b/.test(lower)) {
    return "disappointment";
  }
  if (/\b(nervous|terrified|fear|anxiety|scared|afraid|worried)\b/.test(lower)) {
    return "fear";
  }
  if (/\b(lag|crash|frustrat|annoy|anger|angry|hate|terrible)\b/.test(lower)) {
    return "annoyance";
  }
  if (/\b(amazing|proud|excited|excitement|joy|finished|celebrate|happy|happiness)\b/.test(lower)) {
    return "excitement";
  }
  if (/\b(thank|admire|appreciate|caring|kind|love|gratitude)\b/.test(lower)) {
    return "gratitude";
  }
  if (/\b(confused|realize|realization|understand|formula|works)\b/.test(lower)) {
    return "realization";
  }

  const signals = extractTextSignals(text);
  if (signals.sentimentValence > 0.3) return "approval";
  if (signals.sentimentValence < -0.3) return "annoyance";
  return "neutral";
}

export function useAvatarController({
  onEmotionDebug,
}: UseAvatarControllerProps = {}): AvatarControllerReturn {
  const [emotionId, setEmotionId] = useState<string>("thinking");
  const [isInitialized, setIsInitialized] = useState(true);

  // Store debug callback in ref to maintain a 100% stable analyzeEmotion reference
  const onEmotionDebugRef = useRef(onEmotionDebug);
  useEffect(() => {
    onEmotionDebugRef.current = onEmotionDebug;
  }, [onEmotionDebug]);

  // Warm up the HuggingFace transformers emotion model asynchronously
  useEffect(() => {
    warmUpEmotionClassifier().catch((err: unknown) => {
      console.warn("[EmotionController] Transformers.js model warm-up notice:", err);
    });
  }, []);

  // Set emotion manually (supports EmotionState enum, 28 model emotions, base mascot keys, or legacy string IDs)
  const setEmotion = useCallback((emotion: EmotionState | string) => {
    if (typeof emotion === "string" && emotion in EMOTION_STATE_MAP) {
      setEmotionId(EMOTION_STATE_MAP[emotion as EmotionState]);
    } else if (typeof emotion === "string") {
      setEmotionId(emotion);
    } else {
      setEmotionId(EMOTION_STATE_MAP[emotion] ?? "thinking");
    }
  }, []);

  // Analyze emotion from text using HuggingFace Transformers.js with rule fallback
  const analyzeEmotion = useCallback(
    async (text: string): Promise<string> => {
      if (!text.trim()) return "thinking";

      try {
        const result = await classifyEmotion(text);
        let state: string;
        let modelEmotion = "neutral";
        let modelConfidence = 0;

        if (result && result.topEmotion) {
          modelEmotion = result.topEmotion;
          modelConfidence = result.confidence;
          state = result.topEmotion;
        } else {
          // Rule-based fallback if ML model is warming up
          state = detectRuleBasedEmotion(text);
          modelEmotion = state;
          modelConfidence = 0.85;
        }

        const signals = extractTextSignals(text);

        onEmotionDebugRef.current?.({
          transcript: text,
          state,
          modelEmotion,
          modelConfidence,
          sentimentValence: signals.sentimentValence,
        });

        return state;
      } catch (error) {
        console.warn("[useAvatarController] Emotion analysis fallback:", error);
        const fallbackState = detectRuleBasedEmotion(text);
        return fallbackState;
      }
    },
    [],
  );

  return {
    isInitialized,
    emotionId,
    setIsInitialized,
    setEmotion,
    analyzeEmotion,
  };
}