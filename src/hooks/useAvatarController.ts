import { useState, useCallback, useEffect, useRef } from "react";
import { EmotionState } from "../types/emotion";
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

  // Analyze emotion from text
  const analyzeEmotion = useCallback(
    async (text: string): Promise<EmotionState> => {
      if (!text.trim()) return EmotionState.LISTEN;

      try {
        const signals = await extractTextSignalsWithML(text);

        if (signals.modelEmotion) {
          switch (signals.modelEmotion) {
            case "happiness":
              return EmotionState.HAPPY;
            case "love":
              return EmotionState.ENCOURAGE;
            case "desire":
              return EmotionState.ENCOURAGE;
            case "anger":
              return EmotionState.CAUTION;
            case "disgust":
              return EmotionState.ANGRY;
            case "fear":
              return EmotionState.SHOCK;
            case "shame":
              return EmotionState.SAD
            case "guilt":
              return EmotionState.CAUTION
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
  };
}