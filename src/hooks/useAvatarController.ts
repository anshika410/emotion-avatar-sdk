import { useState, useCallback, useEffect } from "react";
import { EmotionState } from "../types/emotion";
import { extractTextSignalsWithML } from "../services/emotion/textSignals";
import { mapSignalsToEmotionOutput, getSpeakingListeningState } from "../utils/emotionMapping";

export interface UseAvatarControllerProps {
  isSpeaking?: boolean;
  isListening?: boolean;
  onEmotionChange?: (emotion: EmotionState, intensity: number) => void;
}

export interface AvatarControllerReturn {
  emotionState: EmotionState;
  intensity: number;
  setEmotion: (emotion: EmotionState) => void;
  analyzeEmotion: (text: string) => Promise<EmotionState>;
}

export function useAvatarController({
  isSpeaking = false,
  isListening = false,
  onEmotionChange,
}: UseAvatarControllerProps): AvatarControllerReturn {
  const [emotionState, setEmotionState] = useState<EmotionState>(EmotionState.LISTEN);
  const [intensity, setIntensity] = useState(0.3);

  // Set emotion manually
  const setEmotion = useCallback((emotion: EmotionState) => {
    setEmotionState(emotion);
    setIntensity(0.8);
    onEmotionChange?.(emotion, 0.8);
  }, [onEmotionChange]);

  // Analyze emotion from text
  const analyzeEmotion = useCallback(async (text: string): Promise<EmotionState> => {
    if (!text.trim()) return EmotionState.LISTEN;

    try {
      const signals = await extractTextSignalsWithML(text);
      const output = mapSignalsToEmotionOutput(signals);
      return output.state;
    } catch (error) {
      console.warn("[useAvatarController] Emotion analysis failed:", error);
      return EmotionState.LISTEN;
    }
  }, []);

  // Update emotion based on speaking/listening state
  useEffect(() => {
    const override = getSpeakingListeningState(isSpeaking, isListening);
    if (override) {
      setEmotionState(override.state);
      setIntensity(override.intensity);
    }
  }, [isSpeaking, isListening]);

  return {
    emotionState,
    intensity,
    setEmotion,
    analyzeEmotion,
  };
}
