import { useState, useCallback, useEffect, useRef } from "react";
import { EmotionState, type EmotionDebugInfo } from "../types/emotion";
import { extractTextSignalsWithML } from "../services/emotion/textSignals";
import { DEFAULT_AVATAR_IMAGES, LOCAL_FALLBACK_IMAGES } from "../constants/defaultImages";
import { warmUpEmotionClassifier, disposeEmotionClassifier } from "../services/emotion/emotionClassifier";

export interface UseAvatarControllerProps {
  isSpeaking?: boolean;
  isListening?: boolean;
  loadAssetsLocally?: boolean; // If true, load images from local assets instead of remote URLs
}

export interface AvatarControllerReturn {
  isInitialized: boolean;
  resolvedBlobImages: Record<EmotionState, string> | null;
  setIsInitialized: (isInitialized: boolean) => void;
  emotionState: EmotionState;
  setEmotion: (emotion: EmotionState) => void;
  analyzeEmotion: (text: string) => Promise<EmotionState>;
  analyzeEmotionDetails: (text: string) => Promise<EmotionDebugInfo | null>;
}

export function useAvatarController({
  isSpeaking = false,
  isListening = false,
  loadAssetsLocally = true, // Default to true for local assets
}: UseAvatarControllerProps): AvatarControllerReturn {
  const [emotionState, setEmotionState] = useState<EmotionState>(EmotionState.LISTEN);
  const [isInitialized, setIsInitialized] = useState(false);
  const [resolvedBlobImages, setResolvedBlobImages] = useState<Record<
    EmotionState,
    string
  > | null>(null);
  const lastImagesRef = useRef<string | null>(null);

  const mapEmotionLabelToState = useCallback((emotionLabel: EmotionDebugInfo["modelEmotion"]) => {
    switch (emotionLabel) {
      case "happiness":
        return EmotionState.HAPPY;
      case "love":
      case "desire":
        return EmotionState.ENCOURAGE;
      case "anger":
        return EmotionState.CAUTION;
      case "disgust":
        return EmotionState.ANGRY;
      case "fear":
        return EmotionState.SHOCK;
      case "shame":
        return EmotionState.SAD;
      case "guilt":
        return EmotionState.CAUTION;
      case "sarcasm":
        return EmotionState.CONFUSE;
      case "sadness":
        return EmotionState.SAD;
      case "surprise":
        return EmotionState.SURPRISED;
      case "confusion":
        return EmotionState.CONFUSE;
      default:
        return EmotionState.LISTEN;
    }
  }, []);

  // Warm up ML emotion classifier on mount
  useEffect(() => {
    warmUpEmotionClassifier().catch((err: unknown) =>
      console.warn("[EmotionController] ML classifier warm-up failed (will use rule-based fallback):", err)
    );
    return () => {
      disposeEmotionClassifier();
    };
  }, []);

  // Asset loading – uses DEFAULT_AVATAR_IMAGES as the source (remote URLs),
  // but can fall back to LOCAL_FALLBACK_IMAGES if loadAssetsLocally is true or a fetch fails.
  useEffect(() => {
    const serialized = JSON.stringify(DEFAULT_AVATAR_IMAGES) + `_local:${loadAssetsLocally}`;
    if (lastImagesRef.current === serialized) {
      return; // already loaded this exact set
    }

    let cancelled = false;
    const objectUrls: string[] = [];

    async function loadImage(
      src: string,
      emotionKey: EmotionState,
    ): Promise<[EmotionState, string] | null> {
      if (loadAssetsLocally) {
        const localSrc = LOCAL_FALLBACK_IMAGES[emotionKey];
        return localSrc ? [emotionKey, localSrc] : null;
      }
      try {
        const res = await fetch(src);
        if (!res.ok) throw new Error(`${res.status}`);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        objectUrls.push(blobUrl);
        return [emotionKey, blobUrl];
      } catch (err) {
        console.warn(`[AvatarController] Failed to preload ${src}`, err);
        const localSrc = LOCAL_FALLBACK_IMAGES[emotionKey];
        return localSrc ? [emotionKey, localSrc] : null;
      }
    }

    setIsInitialized(false);

    Promise.all(
      Object.entries(DEFAULT_AVATAR_IMAGES).map(async ([emotionKey, src]) => {
        return loadImage(src, emotionKey as EmotionState);
      })
    ).then((results) => {
      if (cancelled) return;
      const validResults = results.filter((r): r is [EmotionState, string] => r !== null);
      if (validResults.length > 0) {
        const blobMap = Object.fromEntries(validResults) as Record<EmotionState, string>;
        setResolvedBlobImages(blobMap);
        setIsInitialized(true);
        lastImagesRef.current = serialized;
      } else {
        setIsInitialized(false);
      }
    });

    return () => {
      cancelled = true;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [loadAssetsLocally]); // re‑run only if loadAssetsLocally changes

  // Set emotion manually
  const setEmotion = useCallback((emotion: EmotionState) => {
    setEmotionState(emotion);
  }, []);

  const analyzeEmotionDetails = useCallback(
    async (text: string): Promise<EmotionDebugInfo | null> => {
      if (!text.trim()) return null;

      try {
        const signals = await extractTextSignalsWithML(text);

        let state = EmotionState.LISTEN;

        if (signals.modelEmotion) {
          state = mapEmotionLabelToState(signals.modelEmotion);
        } else if (signals.sentimentValence > 0.3) {
          state = EmotionState.ENCOURAGE;
        } else if (signals.sentimentValence < -0.3) {
          state = EmotionState.CAUTION;
        }

        return {
          transcript: text,
          state,
          tokenCount: signals.tokenCount,
          inferenceLatencyMs: signals.inferenceLatencyMs,
          analysisLatencyMs: signals.analysisLatencyMs,
          contentCompleteness: signals.contentCompleteness,
          sentimentValence: signals.sentimentValence,
          modelEmotion: signals.modelEmotion,
          modelConfidence: signals.modelConfidence,
          emotionScores: signals.emotionScores,
          emotionCount: signals.emotionCount,
          complexityScore: signals.complexityScore,
          complexityBreakdown: signals.complexityBreakdown,
          uncertaintyScore: signals.uncertaintyScore,
          uncertaintyBreakdown: signals.uncertaintyBreakdown,
          topEmotions: signals.topEmotions,
          explanation: signals.explanation,
        };
      } catch (error) {
        console.warn("[useAvatarController] Emotion analysis failed:", error);
        return null;
      }
    }, [mapEmotionLabelToState]);

  // Analyze emotion from text
  const analyzeEmotion = useCallback(
    async (text: string): Promise<EmotionState> => {
      const details = await analyzeEmotionDetails(text);
      return details?.state ?? EmotionState.LISTEN;
    }, [analyzeEmotionDetails]);

  // Update emotion based on speaking/listening state
  useEffect(() => {
    if (isSpeaking && !isListening) {
      setEmotionState(EmotionState.SPEAK_NEUTRAL);
    } else if (!isSpeaking && isListening) {
      setEmotionState(EmotionState.LISTEN);
    } else {
      setEmotionState(EmotionState.LISTEN);
    }
  }, [isSpeaking, isListening]);

  return {
    isInitialized,
    resolvedBlobImages,
    setIsInitialized,
    emotionState,
    setEmotion,
    analyzeEmotion,
    analyzeEmotionDetails,
  };
}