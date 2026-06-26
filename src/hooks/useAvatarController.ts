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
  if (!text.trim()) return EmotionState.LISTEN;

  try {
    const signals = await extractTextSignalsWithML(text);

    if (signals.modelEmotion) {
      switch (signals.modelEmotion) {
        case "happiness":
        case "love":
        case "desire":
          return EmotionState.ENCOURAGE;
        case "anger":
        case "fear":
        case "sadness":
        case "disgust":
        case "shame":
        case "guilt":
          return EmotionState.CAUTION;
        case "surprise":
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
  } catch {
    return EmotionState.LISTEN;
  }
}, []);

  // Update emotion based on speaking/listening state
  useEffect(() => {
    if (isSpeaking) {
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
