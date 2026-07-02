import { useState, useCallback, useEffect, useMemo } from "react";
import { EmotionState } from "../types/emotion";
import { extractTextSignalsWithML } from "../services/emotion/textSignals";
import { DEFAULT_AVATAR_IMAGES, LOCAL_FALLBACK_IMAGES } from "../constants/defaultImages";
export interface UseAvatarControllerProps {
  isSpeaking?: boolean;
  isListening?: boolean;
  onEmotionChange?: (emotion: EmotionState, intensity: number) => void;
  emotionImages?: Partial<Record<EmotionState, string>>;
  loadAssetsLocally?: boolean; // If true, load images from local assets instead of remote URLs
}

export interface AvatarControllerReturn {
  isInitialized: boolean;
  resolvedBlobImages: Record<EmotionState, string> | null;
  setIsInitialized: (isInitialized: boolean) => void;
  emotionState: EmotionState;
  intensity: number;
  setEmotion: (emotion: EmotionState) => void;
  analyzeEmotion: (text: string) => Promise<EmotionState>;
}

export function useAvatarController({
  isSpeaking = false,
  isListening = false,
  onEmotionChange,
  emotionImages,
  loadAssetsLocally = true, // Default to true for local assets
}: UseAvatarControllerProps): AvatarControllerReturn {
  const [emotionState, setEmotionState] = useState<EmotionState>(EmotionState.LISTEN);
  const [intensity, setIntensity] = useState(0.3);
  const [isInitialized, setIsInitialized] = useState(false);
  const [resolvedBlobImages, setResolvedBlobImages] = useState<Record<
    EmotionState,
    string
  > | null>(null);

  const resolvedImages = useMemo(
    () => ({
      ...DEFAULT_AVATAR_IMAGES,
      ...emotionImages,
    }),
    [emotionImages],
  );

  // Asset loading lives here now
  useEffect(() => {
    let cancelled = false;
    const objectUrls: string[] = [];

    async function loadImage(
      src: string,
      emotionKey: EmotionState,
    ): Promise<[string, string] | null> {
      
      // If loadAssetsLocally is true, skip fetch and use local fallback
      if (loadAssetsLocally) {
        const localSrc = LOCAL_FALLBACK_IMAGES[emotionKey];
        if (localSrc) {
          console.log(`[AvatarController] Using local fallback for ${emotionKey}`);
          return [emotionKey, localSrc];
        }
        return null;
      }

      try {
        const res = await fetch(src);
        if (!res.ok) throw new Error(`${res.status}`);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        objectUrls.push(blobUrl);
        console.log(`[AvatarController] Preloaded from url ${emotionKey}`);
        return [emotionKey, blobUrl]; // [original → blob]
      } catch (err) {
        console.warn(`[AvatarController] Failed to preload ${src}`, err);
        // Use the local fallback image if available
        const localSrc = LOCAL_FALLBACK_IMAGES[emotionKey];
        if (localSrc) {
          console.log(`[AvatarController] Using local fallback for ${emotionKey}`);
          // No need to blob it – just use the local path directly
          return [emotionKey, localSrc];
        }
        return null;
      }
    }

    setIsInitialized(false);

    Promise.all(
      Object.entries(resolvedImages).map(async ([emotionKey, src]) => {
        const result = await loadImage(src, emotionKey as EmotionState);
        return result;
      })
    ).then((results) => {
      if (cancelled) return;
      const allLoaded = results.every(Boolean);
      if (allLoaded) {
        // results are now ([EmotionState, string] | null)[]
        const blobMap = Object.fromEntries(
          results.filter((r): r is [EmotionState, string] => r !== null)
        ) as Record<EmotionState, string>;
        setResolvedBlobImages(blobMap);
        setIsInitialized(true);
      } else {
        setIsInitialized(false);
      }
    });

    return () => {
      cancelled = true;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
      setResolvedBlobImages(null);
    };
  }, [resolvedImages]);

  
  // Set emotion manually
  const setEmotion = useCallback(
    (emotion: EmotionState) => {
      setEmotionState(emotion);
      setIntensity(0.8);
      onEmotionChange?.(emotion, 0.8);
    },
    [onEmotionChange],
  );

  // Analyze emotion from text
  const analyzeEmotion = useCallback(
    async (text: string): Promise<EmotionState> => {

      console.log("[useAvatarController] Analyzing text:", text);

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
              return EmotionState.CAUTION;
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
    isInitialized,
    resolvedBlobImages,
    setIsInitialized,
    emotionState,
    intensity,
    setEmotion,
    analyzeEmotion,
  };
}
