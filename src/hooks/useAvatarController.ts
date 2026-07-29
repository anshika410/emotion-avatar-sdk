// emotion-sdk-v0.1.2\src\hooks\useAvatarController.ts
import { useState, useCallback, useEffect, useRef } from "react";
import { EmotionState } from "../types/emotion";
import { processAndClassify } from "../services/emotion/emotionStreamProcessor.js";
import {
  warmUpEmotionModel,
  disposeEmotionModel,
} from "../services/emotion/onnxRuntime";

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

export type EmotionDebugInfo = Awaited<ReturnType<typeof processAndClassify>> & {
  transcript: string;
  state: string;
};

export interface UseAvatarControllerProps {
  isSpeaking?: boolean;
  isListening?: boolean;
  /** Fired after every analyzeEmotion() call with the full signal set. */
  onEmotionDebug?: (info: EmotionDebugInfo) => void;
}

export interface AvatarControllerReturn {
  isInitialized: boolean;
  emotionId: string;
  setIsInitialized: (isInitialized: boolean) => void;
  setEmotion: (emotion: EmotionState | string) => void;
  analyzeEmotion: (text: string, bypassChunkSizeGate?: boolean) => Promise<string>;
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

  // Warm up the ONNX emotion model asynchronously in background without blocking UI thread
  useEffect(() => {
    let isCancelled = false;

    const timer = setTimeout(() => {
      warmUpEmotionModel({ useWorkerProxy: true, numThreads: 1 })
        .then(() => {
          if (!isCancelled) setIsInitialized(true);
        })
        .catch((err: unknown) => {
          console.warn("[EmotionController] Background ONNX model warm-up notice:", err);
          if (!isCancelled) setIsInitialized(true);
        });
    }, 10);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
      disposeEmotionModel();
    };
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

  // Analyze emotion from text with stable function identity
  const analyzeEmotion = useCallback(
    async (text: string, bypassChunkSizeGate: boolean = false): Promise<string> => {
      if (!text.trim()) return "thinking";

      try {
        const signals = await processAndClassify(text, bypassChunkSizeGate);

        let state: string;
        if (signals.modelEmotion) {
          state = signals.modelEmotion;
        } else if (signals.sentimentValence > 0.3) {
          state = "approval";
        } else if (signals.sentimentValence < -0.3) {
          state = "annoyance";
        } else {
          state = "neutral";
        }

        onEmotionDebugRef.current?.({
          ...signals,
          transcript: text,
          state,
        });

        return state;
      } catch (error) {
        console.warn("[useAvatarController] Emotion analysis fallback:", error);
        return "thinking";
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