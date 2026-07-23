import { useState, useCallback, useEffect } from "react";
import { EmotionState } from "../types/emotion";
import { extractTextSignalsWithML } from "../services/emotion/textSignals";
import {
  warmUpEmotionClassifier,
  disposeEmotionClassifier,
  determineIntensity,
} from "../services/emotion/emotionClassifier";
import { getReactionId } from "../components/zoe-mascot/emotions/index.js";

export const EMOTION_STATE_MAP: Record<EmotionState, string> = {
  [EmotionState.LISTEN]: "listening",
  [EmotionState.SPEAK_NEUTRAL]: "neutral-focused",
  [EmotionState.ENCOURAGE]: "desire-encourage",
  [EmotionState.THINK]: "neutral-present",
  [EmotionState.CAUTION]: "anger-acknowledge",
  [EmotionState.CELEBRATE]: "happy-celebrate",
  [EmotionState.HAPPY]: "happy-warm",
  [EmotionState.SAD]: "sadness-concern",
  [EmotionState.ANGRY]: "disgust-recognize",
  [EmotionState.SURPRISED]: "surprise-notice",
  [EmotionState.SHOCK]: "fear-reassure",
  [EmotionState.CONFUSE]: "confusion-curious",
};

export interface UseAvatarControllerProps {
  isSpeaking?: boolean;
  isListening?: boolean;
}

export interface AvatarControllerReturn {
  isInitialized: boolean;
  emotionId: string;
  setIsInitialized: (isInitialized: boolean) => void;
  setEmotion: (emotion: EmotionState | string) => void;
  analyzeEmotion: (text: string) => Promise<string>;
}

export function useAvatarController({
  isSpeaking = false,
  isListening = false,
}: UseAvatarControllerProps = {}): AvatarControllerReturn {
  const [emotionId, setEmotionId] = useState<string>("listening");
  const [isInitialized, setIsInitialized] = useState(false);

  // Warm up ML emotion classifier on mount
  useEffect(() => {
    warmUpEmotionClassifier()
      .then(() => setIsInitialized(true))
      .catch((err: unknown) => {
        console.warn(
          "[EmotionController] ML classifier warm-up warning:",
          err,
        );
        setIsInitialized(true);
      });
    return () => {
      disposeEmotionClassifier();
    };
  }, []);

  // Set emotion manually (supports EmotionState enum or specific emotion string ID)
  const setEmotion = useCallback((emotion: EmotionState | string) => {
    if (typeof emotion === "string" && emotion in EMOTION_STATE_MAP) {
      setEmotionId(EMOTION_STATE_MAP[emotion as EmotionState]);
    } else if (typeof emotion === "string") {
      setEmotionId(emotion);
    } else {
      setEmotionId(EMOTION_STATE_MAP[emotion] ?? "listening");
    }
  }, []);

  // Analyze emotion from text
  const analyzeEmotion = useCallback(
    async (text: string): Promise<string> => {
      if (!text.trim()) return "listening";

      try {
        const signals = await extractTextSignalsWithML(text);

        if (signals.modelEmotion) {
          const intensity = determineIntensity(text, signals.modelConfidence);
          return getReactionId(signals.modelEmotion, intensity);
        }

        // Fallback to sentiment valence
        if (signals.sentimentValence > 0.3) return "desire-encourage";
        if (signals.sentimentValence < -0.3) return "anger-acknowledge";

        return "listening";
      } catch (error) {
        console.warn("[useAvatarController] Emotion analysis failed:", error);
        return "listening";
      }
    },
    [],
  );

  // Update emotion based on speaking/listening state
  useEffect(() => {
    if (isSpeaking && !isListening) {
      setEmotionId("neutral-focused");
    } else if (!isSpeaking && isListening) {
      setEmotionId("listening");
    } else {
      setEmotionId("listening");
    }
  }, [isSpeaking, isListening]);

  return {
    isInitialized,
    emotionId,
    setIsInitialized,
    setEmotion,
    analyzeEmotion,
  };
}