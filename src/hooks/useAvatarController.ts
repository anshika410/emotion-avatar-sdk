// emotion-sdk-v0.1.2\src\hooks\useAvatarController.ts
import { useState, useCallback, useEffect, useRef } from "react";
import { EmotionState } from "../types/emotion";
import { processAndClassify } from "../services/emotion/emotionStreamProcessor.js";
import {
  warmUpEmotionModel,
  disposeEmotionModel,
} from "../services/emotion/onnxRuntime";
import { extractTextSignals } from "../services/emotion/emotionStreamProcessor";
import { DEFAULT_AVATAR_EMOTIONS } from "../constants/defaultImages";

export const EMOTION_STATE_MAP: Record<EmotionState, string> =
  DEFAULT_AVATAR_EMOTIONS;

export type EmotionDebugInfo = Awaited<
  ReturnType<typeof processAndClassify>
> & {
  transcript: string;
  state: string;
};

export interface UseAvatarControllerProps {
  isSpeaking?: boolean;
  isListening?: boolean;
  /** Fired after every analyzeEmotion() call with the full signal set. */
  onEmotionDebug?: (info: EmotionDebugInfo) => void;
}

export interface AvatarControllerReturn {
  isInitialized: boolean;
  emotionId: string;
  setIsInitialized: (isInitialized: boolean) => void;
  setEmotion: (emotion: EmotionState | string) => void;
  analyzeEmotion: (
    text: string,
    bypassChunkSizeGate?: boolean,
    bypassBuffer?: boolean,
  ) => Promise<string>;
}

/** Comprehensive NLP text emotion classifier for sentence-level scoring fallback */
export function detectRuleBasedEmotion(text: string): string {
  if (!text || !text.trim()) return "neutral";
  const lower = text.toLowerCase();

  // 1. Sadness / Grief / Disappointment / Remorse / Embarrassment
  if (
    /\b(fail|failed|failing|disappoint|disappointed|disappointment|sad|sadness|grief|grieving|remorse|remorseful|embarrass|embarrassed|embarrassment|heartbroken|depressed|sorry|apologize|regret|unfortunate|ruined|hopeless|loss|lost)\b/.test(
      lower,
    )
  ) {
    if (
      /\b(fail|failed|disappoint|disappointed|disappointment|regret)\b/.test(
        lower,
      )
    )
      return "disappointment";
    if (/\b(remorse|remorseful|sorry|apologize|guilt|guilty)\b/.test(lower))
      return "remorse";
    if (/\b(embarrass|embarrassed|embarrassment|shame|ashamed)\b/.test(lower))
      return "embarrassment";
    return "sadness";
  }

  // 2. Fear / Nervousness / Anxiety
  if (
    /\b(nervous|terrified|fear|fearful|anxiety|anxious|panic|panicked|scared|afraid|worried|worry|freaking|frightened|dread|horror)\b/.test(
      lower,
    )
  ) {
    if (/\b(nervous|worried|worry|anxious|anxiety)\b/.test(lower))
      return "nervousness";
    return "fear";
  }

  // 3. Anger / Annoyance / Frustration
  if (
    /\b(lag|crash|crashing|frustrat|frustrated|frustrating|annoy|annoyed|annoying|anger|angry|furious|outraged|hate|hates|terrible|horrible|worst|broken|stuck|useless|idiot|stupid)\b/.test(
      lower,
    )
  ) {
    if (/\b(annoy|annoyed|annoying|lag|stuck|bother)\b/.test(lower))
      return "annoyance";
    return "anger";
  }

  // 4. Joy / Excitement / Amusement / Pride / Happiness
  if (
    /\b(amazing|proud|pride|excited|excitement|joy|joyful|finished|celebrate|celebration|happy|happiness|awesome|wonderful|great|fantastic|excellent|yay|hurray|win|won|victory|thrilled|delighted|haha|lol|funny|amused|amusement)\b/.test(
      lower,
    )
  ) {
    if (/\b(excited|excitement|thrilled|amazing|fantastic)\b/.test(lower))
      return "excitement";
    if (/\b(proud|pride)\b/.test(lower)) return "pride";
    if (/\b(haha|lol|funny|amused|amusement)\b/.test(lower)) return "amusement";
    return "joy";
  }

  // 5. Caring / Admiration / Gratitude / Love
  if (
    /\b(thank|thanks|thankful|admire|admiration|appreciate|appreciation|caring|kind|love|loved|loving|gratitude|blessed|sweet|support)\b/.test(
      lower,
    )
  ) {
    if (
      /\b(thank|thanks|thankful|appreciate|appreciation|gratitude)\b/.test(
        lower,
      )
    )
      return "gratitude";
    if (/\b(admire|admiration)\b/.test(lower)) return "admiration";
    if (/\b(care|caring|kind|support)\b/.test(lower)) return "caring";
    return "love";
  }

  // 6. Approval / Optimism / Relief
  if (
    /\b(good|nice|agree|approved|approval|hope|hopeful|optimistic|optimism|relieved|relief|glad|phew|finally)\b/.test(
      lower,
    )
  ) {
    if (/\b(relieved|relief|phew)\b/.test(lower)) return "relief";
    if (/\b(hope|hopeful|optimistic|optimism)\b/.test(lower)) return "optimism";
    return "approval";
  }

  // 7. Surprise
  if (
    /\b(wow|omg|surprise|surprised|astonished|shock|shocked|unbelievable|unexpected)\b/.test(
      lower,
    )
  ) {
    return "surprise";
  }

  // 8. Disgust / Disapproval
  if (
    /\b(gross|disgust|disgusted|revolting|eww|yuck|disapprove|disapproval|nasty)\b/.test(
      lower,
    )
  ) {
    return "disgust";
  }

  // 9. Realization / Curiosity / Confusion
  if (
    /\b(confused|confusion|confusing|realize|realized|realization|curious|curiosity|wonder|wondering|why|how|what|huh|understand|formula|works)\b/.test(
      lower,
    )
  ) {
    if (
      /\b(realize|realized|realization|aha|oh|understand|works)\b/.test(lower)
    )
      return "realization";
    if (/\b(curious|curiosity|wonder|wondering)\b/.test(lower))
      return "curiosity";
    if (/\b(confused|confusion|confusing|huh)\b/.test(lower))
      return "confusion";
  }

  const signals = extractTextSignals(text);
  if (signals.sentimentValence > 0.2) return "approval";
  if (signals.sentimentValence < -0.2) return "annoyance";

  return "neutral";
}

export function useAvatarController({
  isSpeaking = false,
  isListening = false,
  onEmotionDebug,
}: UseAvatarControllerProps = {}): AvatarControllerReturn {
  const [emotionId, setEmotionId] = useState<string>("neutral");
  const [isInitialized, setIsInitialized] = useState(false);

  // Store debug callback in ref to maintain a 100% stable analyzeEmotion reference
  const onEmotionDebugRef = useRef(onEmotionDebug);
  useEffect(() => {
    onEmotionDebugRef.current = onEmotionDebug;
  }, [onEmotionDebug]);

  // Warm up the HuggingFace transformers emotion model asynchronously
  useEffect(() => {
    let isCancelled = false;

    const timer = setTimeout(() => {
      warmUpEmotionModel({ useWorkerProxy: false, numThreads: 1 })
        .then(() => {
          if (!isCancelled) setIsInitialized(true);
        })
        .catch((err: unknown) => {
          console.warn(
            "[EmotionController] Background ONNX model warm-up notice:",
            err,
          );
          if (!isCancelled) setIsInitialized(true);
        });
    }, 10);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
      disposeEmotionModel();
    };
  }, []);

  // Set emotion manually (supports EmotionState enum, 28 model emotions, base mascot keys, or legacy string IDs)
  const setEmotion = useCallback((emotion: EmotionState | string) => {
    if (typeof emotion === "string" && emotion in EMOTION_STATE_MAP) {
      setEmotionId(EMOTION_STATE_MAP[emotion as EmotionState]);
    } else if (typeof emotion === "string") {
      setEmotionId(emotion);
    } else {
      setEmotionId(EMOTION_STATE_MAP[emotion] ?? "neutral");
    }
  }, []);

  // Analyze emotion from text using HuggingFace Transformers.js with rule fallback
  const analyzeEmotion = useCallback(
    async (
      text: string,
      bypassChunkSizeGate: boolean = false,
      bypassBuffer: boolean = false,
    ): Promise<string> => {
      if (!text.trim()) return "neutral";

      try {
        const signals = await processAndClassify(text, bypassChunkSizeGate, bypassBuffer);
        // console.log(`[useAvatarController] Emotion received: ${signals.modelEmotion}`)
        let state: string;
        if (signals?.modelEmotion) {
          state = signals.modelEmotion;
        } else {
          state = detectRuleBasedEmotion(text);
        }

        onEmotionDebugRef.current?.({
          ...signals,
          transcript: text,
          state,
        });

        return state;
      } catch (error) {
        console.warn("[useAvatarController] Emotion analysis fallback:", error);
        const fallbackState = detectRuleBasedEmotion(text);
        onEmotionDebugRef.current?.({
          ...extractTextSignals(text),
          transcript: text,
          state: fallbackState,
        });
        return fallbackState;
      }
    },
    [],
  );

  useEffect(() => {
    if (isSpeaking) {
      setEmotionId("neutral-focused");
    } else if (isListening) {
      setEmotionId("listening");
    } else {
      setEmotionId("neutral");
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
