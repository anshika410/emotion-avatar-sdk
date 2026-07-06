import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { EmotionState } from "../types/emotion";
import { extractTextSignalsWithML } from "../services/emotion/textSignals";
import { DEFAULT_AVATAR_IMAGES, LOCAL_FALLBACK_IMAGES } from "../constants/defaultImages";
import { warmUpEmotionClassifier, disposeEmotionClassifier } from "../services/emotion/emotionClassifier";

export interface UseAvatarControllerProps {
  isSpeaking?: boolean;
  isListening?: boolean;
  onEmotionChange?: (emotion: EmotionState) => void;
  emotionImages?: Partial<Record<EmotionState, string>>;
  loadAssetsLocally?: boolean; // If true, load images from local assets instead of remote URLs
}

export interface AvatarControllerReturn {
  isInitialized: boolean;
  resolvedBlobImages: Record<EmotionState, string> | null;
  setIsInitialized: (isInitialized: boolean) => void;
  emotionState: EmotionState;
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
  const [isInitialized, setIsInitialized] = useState(false);
  const [resolvedBlobImages, setResolvedBlobImages] = useState<Record<
    EmotionState,
    string
  > | null>(null);
  const lastImagesRef = useRef<string | null>(null);

  const resolvedImages = useMemo(
    () => ({
      ...DEFAULT_AVATAR_IMAGES,
      ...emotionImages,
    }),
    [emotionImages],
  );

    // Warm up ML emotion classifier on mount
    useEffect(() => {
      warmUpEmotionClassifier().catch((err: unknown) =>
        console.warn("[EmotionController] ML classifier warm-up failed (will use rule-based fallback):", err)
      );
      return () => {
        disposeEmotionClassifier();
      };
    }, []);
  

  // Asset loading lives here now
  useEffect(() => {
    
    // Check if the resolved images have changed since the last load
    // console.log("[AvatarController] REFERENCE\n", lastImagesRef);
    const serialized = JSON.stringify(resolvedImages) + `_local:${loadAssetsLocally}`;
    if (lastImagesRef.current === serialized) {
      // Already loaded exactly this set – nothing to do
      return;
    }

    let cancelled = false;
    const objectUrls: string[] = [];

    async function loadImage(
      src: string,
      emotionKey: EmotionState,
    ): Promise<[EmotionState, string] | null> {
      if (loadAssetsLocally) {
        const localSrc = LOCAL_FALLBACK_IMAGES[emotionKey];
        console.log(`[AvatarController] Loading local asset for ${emotionKey}: ${localSrc.slice(0, 70)}`);
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

    // Instead of resetting to null, we set a loading flag if needed,
    // but we keep the previous map so the avatar never disappears.
    setIsInitialized(false);

    Promise.all(
      Object.entries(resolvedImages).map(async ([emotionKey, src]) => {
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
        // Only set false if we have absolutely nothing (shouldn't happen with fallbacks)
        setIsInitialized(false);
      }
    });

    return () => {
      cancelled = true;
      // Revoke old blob URLs from *this* run
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
      // Do NOT set resolvedBlobImages to null
    };
  }, [resolvedImages, loadAssetsLocally]); // include loadAssetsLocally as dep if it can change


  // Set emotion manually
  const setEmotion = useCallback(
    (emotion: EmotionState) => {
      setEmotionState(emotion);
      onEmotionChange?.(emotion);
    },
    [onEmotionChange],
  );

  // Analyze emotion from text
  const analyzeEmotion = useCallback(
    async (text: string): Promise<EmotionState> => {

      if (!text.trim()) return EmotionState.LISTEN;

      try {
        const signals = await extractTextSignalsWithML(text);

        // These mapping are not fix as the avatar may gets updated
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
    } else if (!isSpeaking && isListening) {
      setEmotionState(EmotionState.LISTEN);
    } else {
      setEmotionState(EmotionState.LISTEN); // Default to LISTEN when neither speaking nor listening
    }
  }, [isSpeaking, isListening]);

  return {
    isInitialized,
    resolvedBlobImages,
    setIsInitialized,
    emotionState,
    setEmotion,
    analyzeEmotion,
  };
}
