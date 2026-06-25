/**
 * Simplified emotion controller hook.
 *
 * Analyzes text from LLM output to determine emotion state.
 * No audio prosody or speech metrics - only text-based emotion analysis.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { EmotionState, type EmotionOutput, type TextSignals } from "../types/emotion";
import { extractTextSignalsWithML } from "../services/emotion/textSignals";
import { warmUpEmotionClassifier, disposeEmotionClassifier } from "../services/emotion/emotionClassifier";

/** Minimum interval between ML inference calls (ms) */
const ML_DEBOUNCE_MS = 1000;

interface UseEmotionControllerProps {
  /** Text from the AI/LLM for emotion analysis */
  aiMessage?: string;
  /** Text from the user for emotion analysis */
  userMessage?: string;
  /** Speaking state from parent (TTS status) */
  isSpeaking?: boolean;
  /** Listening state from parent (STT status) */
  isListening?: boolean;
}

export function useEmotionController({
  aiMessage = "",
  userMessage = "",
  isSpeaking = false,
  isListening = false,
}: UseEmotionControllerProps) {
  const [emotionOutput, setEmotionOutput] = useState<EmotionOutput>({
    state: EmotionState.LISTEN,
    intensity: 0.3,
  });

  const lastMLInferenceRef = useRef(0);
  const mlInferenceInFlightRef = useRef(false);

  // Warm up ML emotion classifier on mount
  useEffect(() => {
    warmUpEmotionClassifier().catch((err: unknown) =>
      console.warn("[EmotionController] ML classifier warm-up failed (will use rule-based fallback):", err)
    );
    return () => {
      disposeEmotionClassifier();
    };
  }, []);

  // Analyze emotion from text
  const analyzeText = useCallback(async (text: string): Promise<EmotionOutput> => {
    if (!text.trim()) {
      return { state: EmotionState.LISTEN, intensity: 0.3 };
    }

    try {
      const signals: TextSignals = await extractTextSignalsWithML(text);
      
      // Map ML emotion to avatar emotion state
      let emotionState = EmotionState.LISTEN;
      let intensity = 0.5;

      if (signals.modelEmotion) {
        switch (signals.modelEmotion) {
          case "happiness":
          case "love":
          case "desire":
            emotionState = EmotionState.ENCOURAGE; intensity = 0.8; break;
          case "anger":
          case "fear":
          case "sadness":
          case "disgust":
          case "shame":
          case "guilt":
            emotionState = EmotionState.CAUTION; intensity = 0.7; break;
          case "surprise":
          case "confusion":
            emotionState = EmotionState.THINK; intensity = 0.6; break;
          case "sarcasm":
            emotionState = EmotionState.CAUTION; intensity = 0.4; break;
          default:
            emotionState = EmotionState.LISTEN;
        }
      } else {
        // Fallback to sentiment valence
        if (signals.sentimentValence > 0.3) {
          emotionState = EmotionState.ENCOURAGE;
          intensity = 0.7;
        } else if (signals.sentimentValence < -0.3) {
          emotionState = EmotionState.CAUTION;
          intensity = 0.6;
        }
      }

      return { state: emotionState, intensity };
    } catch (error) {
      console.warn("[EmotionController] Emotion analysis failed:", error);
      return { state: EmotionState.LISTEN, intensity: 0.3 };
    }
  }, []);

  // Analyze AI message when it changes
  useEffect(() => {
    if (!aiMessage) return;

    const now = performance.now();
    if (mlInferenceInFlightRef.current || now - lastMLInferenceRef.current < ML_DEBOUNCE_MS) {
      return;
    }

    mlInferenceInFlightRef.current = true;
    lastMLInferenceRef.current = now;

    analyzeText(aiMessage).then((result) => {
      setEmotionOutput(result);
      mlInferenceInFlightRef.current = false;
    }).catch(() => {
      mlInferenceInFlightRef.current = false;
    });
  }, [aiMessage, analyzeText]);

  // Analyze user message when it changes
  useEffect(() => {
    if (!userMessage) return;

    const now = performance.now();
    if (mlInferenceInFlightRef.current || now - lastMLInferenceRef.current < ML_DEBOUNCE_MS) {
      return;
    }

    mlInferenceInFlightRef.current = true;
    lastMLInferenceRef.current = now;

    analyzeText(userMessage).then((result) => {
      setEmotionOutput(result);
      mlInferenceInFlightRef.current = false;
    }).catch(() => {
      mlInferenceInFlightRef.current = false;
    });
  }, [userMessage, analyzeText]);

  // Update emotion based on speaking/listening state
  useEffect(() => {
    if (isSpeaking) {
      setEmotionOutput({ state: EmotionState.SPEAK_NEUTRAL, intensity: 0.7 });
    } else if (isListening) {
      setEmotionOutput({ state: EmotionState.LISTEN, intensity: 0.5 });
    }
  }, [isSpeaking, isListening]);

  return {
    emotionState: emotionOutput.state,
    intensity: emotionOutput.intensity,
    analyzeText,
  };
}
