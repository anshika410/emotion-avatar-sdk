import { useState, useCallback, useEffect} from "react";
import { EmotionState } from "../types/emotion";
import { extractTextSignalsWithML } from "../services/emotion/textSignals";

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

  console.log("[useAvatarController] USER INPUT:", text);

  if (!text.trim()) return EmotionState.LISTEN;

  try {
    const signals = await extractTextSignalsWithML(text);

    console.log("[useAvatarController] ML Emotion:", signals.modelEmotion, " Confidence:", signals.modelConfidence.toFixed(2));

    if (signals.modelEmotion) {
      switch (signals.modelEmotion) {
        case "happiness":
          return EmotionState.HAPPY;
        case "love":
          return EmotionState.ENCOURAGE;
        case "desire":
          return EmotionState.ENCOURAGE;
        case "anger":
          return EmotionState.ANGRY;
        case "fear":
          return EmotionState.CAUTION;
        case "sadness":
          return EmotionState.SAD;
        case "disgust":
          return EmotionState.ANGRY;
        case "surprise":
          return EmotionState.SURPRISED;
        case "shame":
        case "guilt":
          return EmotionState.CAUTION;
        case "confusion":
          return EmotionState.THINK;
        case "sarcasm":
          return EmotionState.CAUTION;
        default:
          return EmotionState.LISTEN;
      }
    }

    // Fallback to sentiment valence
    if (signals.sentimentValence > 0.3) return EmotionState.ENCOURAGE;
    if (signals.sentimentValence < -0.3) return EmotionState.CAUTION;

    return EmotionState.LISTEN;
  } catch (error) {
    console.warn("[useAvatarController] Emotion analysis failed:", error);
    return EmotionState.LISTEN;
  }
}, []);

  // Update emotion based on speaking/listening state
  useEffect(() => {
    if (isSpeaking && !isListening) {
      setEmotionState(EmotionState.SPEAK_NEUTRAL);
      setIntensity(0.7);
    } else if (isListening) {
      setEmotionState(EmotionState.LISTEN);
      setIntensity(0.5);
    }
  }, [isSpeaking, isListening]);

  return {
    emotionState,
    intensity,
    setEmotion,
    analyzeEmotion,
  };
}
