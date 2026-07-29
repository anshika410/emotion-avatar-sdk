// emotion-sdk-v0.1.2\src\hooks\useAvatarController.ts
import { useState, useCallback, useEffect } from "react";
import { EmotionState } from "../types/emotion";
import { processAndClassify } from "../services/emotion/emotionStreamProcessor.js";
import {
  warmUpEmotionModel,
  disposeEmotionModel,
} from "../services/emotion/onnxRuntime";
import { getReactionId } from "../components/zoe-mascot/emotions/index.js";

export const EMOTION_STATE_MAP: Record<EmotionState, string> = {
  [EmotionState.LISTEN]: "listening",
  [EmotionState.SPEAK_NEUTRAL]: "neutral-focused",
  [EmotionState.ENCOURAGE]: "desire-encourage",
  [EmotionState.THINK]: "neutral-present",
  [EmotionState.CAUTION]: "anger-acknowledge",
  [EmotionState.CELEBRATE]: "happy-celebrate",
  [EmotionState.HAPPY]: "happy-warm",
  [EmotionState.SAD]: "sadness-concern",
  [EmotionState.ANGRY]: "disgust-recognize",
  [EmotionState.SURPRISED]: "surprise-notice",
  [EmotionState.SHOCK]: "fear-reassure",
  [EmotionState.CONFUSE]: "confusion-curious",
};

/** Intensity bucket used to pick a reaction variant from getReactionId. */
export type EmotionIntensity = "low" | "medium" | "high";

/**
 * Local replacement for the old `determineIntensity` (previously imported
 * from `emotionClassifier.ts`, which this hook no longer depends on —
 * warm-up/dispose now come from `onnxRuntime.ts` instead).
 *
 * Derives intensity from the model's confidence, discounted by how
 * uncertain the overall classification is (`signals.uncertaintyScore`, which
 * already folds in confidence gap, entropy, and lexical conflict — see
 * emotionStreamProcessor.ts). A high raw confidence paired with high
 * uncertainty (e.g. conflicting cues in the same chunk) is intentionally
 * treated as a weaker reaction, not a strong one.
 *
 * CAVEAT: the previous `determineIntensity(text, confidence)` also took the
 * raw text and may have used cues this version doesn't (length, punctuation,
 * ALL CAPS, etc.). If that nuance mattered for your reactions, port it over
 * from emotionClassifier.ts before retiring that file — this is a
 * best-effort replacement based only on the signals processAndClassify
 * already produces.
 */
function determineIntensity(confidence: number, uncertaintyScore: number): EmotionIntensity {
  const adjustedConfidence = confidence * (1 - uncertaintyScore);
  if (adjustedConfidence >= 0.6) return "high";
  if (adjustedConfidence >= 0.3) return "medium";
  return "low";
}

/**
 * Everything `processAndClassify` returns (modelEmotion, modelConfidence,
 * emotionScores, complexity/uncertainty breakdowns, topEmotions,
 * explanation, contrastShiftDetected, ...) plus the raw transcript that
 * produced it and the final avatar reaction chosen from it.
 *
 * Typed via `Awaited<ReturnType<typeof processAndClassify>>` rather than a
 * hand-written field list, so every field that pipeline returns is
 * automatically forwarded to `onEmotionDebug` — nothing to keep in sync by
 * hand if the pipeline's return shape changes later.
 */
export type EmotionDebugInfo = Awaited<ReturnType<typeof processAndClassify>> & {
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
  analyzeEmotion: (text: string, bypassChunkSizeGate?: boolean) => Promise<string>;
}

export function useAvatarController({
  isSpeaking = false,
  isListening = false,
  onEmotionDebug,
}: UseAvatarControllerProps = {}): AvatarControllerReturn {
  const [emotionId, setEmotionId] = useState<string>("listening");
  const [isInitialized, setIsInitialized] = useState(false);

  // Warm up the ONNX emotion model on mount
  useEffect(() => {
    warmUpEmotionModel({ useWorkerProxy: false, numThreads: 1, })
      .then(() => setIsInitialized(true))
      .catch((err: unknown) => {
        console.warn(
          "[EmotionController] ONNX model warm-up warning:",
          err,
        );
        setIsInitialized(true);
      });
    return () => {
      disposeEmotionModel();
    };
  }, []);

  // Set emotion manually (supports EmotionState enum or specific emotion string ID)
  const setEmotion = useCallback((emotion: EmotionState | string) => {
    if (typeof emotion === "string" && emotion in EMOTION_STATE_MAP) {
      setEmotionId(EMOTION_STATE_MAP[emotion as EmotionState]);
    } else if (typeof emotion === "string") {
      setEmotionId(emotion);
    } else {
      setEmotionId(EMOTION_STATE_MAP[emotion] ?? "listening");
    }
  }, []);

  // Analyze emotion from text
  const analyzeEmotion = useCallback(
    async (text: string, bypassChunkSizeGate: boolean = false): Promise<string> => {
      if (!text.trim()) return "listening";

      try {
        const signals = await processAndClassify(text, bypassChunkSizeGate) ;

        let state: string;
        if (signals.modelEmotion) {
          const intensity = determineIntensity(
            signals.modelConfidence,
            signals.uncertaintyScore,
          );
          state = getReactionId(signals.modelEmotion, intensity);
        } else if (signals.sentimentValence > 0.3) {
          // Fallback to sentiment valence when ML inference wasn't available
          state = "desire-encourage";
        } else if (signals.sentimentValence < -0.3) {
          state = "anger-acknowledge";
        } else {
          state = "listening";
        }

        // Forward the full signal set — everything processAndClassify
        // returned, plus the transcript and the reaction state derived
        // from it — so consumers can inspect model output, smoothing,
        // complexity/uncertainty, and the lexical explanation directly.
        onEmotionDebug?.({
          ...signals,
          transcript: text,
          state,
        });

        return state;
      } catch (error) {
        console.warn("[useAvatarController] Emotion analysis failed:", error);
        return "listening";
      }
    },
    [onEmotionDebug],
  );

  // Update emotion based on speaking/listening state
  useEffect(() => {
    if (isSpeaking && !isListening) {
      setEmotionId("neutral-focused");
    } else if (!isSpeaking && isListening) {
      setEmotionId("listening");
    } else {
      setEmotionId("listening");
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