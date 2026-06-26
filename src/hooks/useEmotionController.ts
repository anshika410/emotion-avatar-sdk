/**
 * Simplified emotion controller hook.
 *
 * Analyzes text from LLM output to determine emotion state.
 * No audio prosody or speech metrics - only text-based emotion analysis.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { type EmotionOutput } from "../types/emotion";
import { extractTextSignalsWithML } from "../services/emotion/textSignals";
import { warmUpEmotionClassifier, disposeEmotionClassifier } from "../services/emotion/emotionClassifier";
import {
  mapSignalsToEmotionOutput,
  getSpeakingListeningState,
  IDLE_EMOTION_OUTPUT,
} from "../utils/emotionMapping";

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
  const [emotionOutput, setEmotionOutput] = useState<EmotionOutput>(IDLE_EMOTION_OUTPUT);

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
    if (!text.trim()) return IDLE_EMOTION_OUTPUT;

    try {
      const signals = await extractTextSignalsWithML(text);
      return mapSignalsToEmotionOutput(signals);
    } catch (error) {
      console.warn("[EmotionController] Emotion analysis failed:", error);
      return IDLE_EMOTION_OUTPUT;
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
    const override = getSpeakingListeningState(isSpeaking, isListening);
    if (override) {
      setEmotionOutput(override);
    }
  }, [isSpeaking, isListening]);

  return {
    emotionState: emotionOutput.state,
    intensity: emotionOutput.intensity,
    analyzeText,
  };
}
