import {
  pipeline,
  env,
  type TextClassificationOutput,
} from "@huggingface/transformers";
import type { EmotionLabel } from "../../types/emotion";
import { getReactionId } from "../../components/zoe-mascot/emotions/index.js";

// Allow local bundled model only — block accidental CDN fetch
env.allowRemoteModels = true;
env.allowLocalModels = false;
env.useBrowserCache = true;

// Resolves to dist/models/onnx/ regardless of where the consumer
// installs the package — this is the key fix
const MODEL_PATH = "navgurukul-ai/realtime-avatar-animation";

export interface EmotionClassification {
  topEmotion: EmotionLabel;
  specificEmotionId: string;
  intensity: "gentle" | "strong";
  confidence: number;
  scores: Record<EmotionLabel, number>;
  inferenceMs: number;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ClassificationPipeline = Awaited<
  ReturnType<typeof pipeline<"text-classification">>
>;

let pipelineInstance: ClassificationPipeline | null = null;
let loadPromise: Promise<ClassificationPipeline> | null = null;
let isLoaded = false;

async function getClassifier(): Promise<ClassificationPipeline> {
  if (pipelineInstance) return pipelineInstance;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    console.log("[EmotionClassifier] Loading bundled model from:", MODEL_PATH);
    const startMs = performance.now();
    try {
      const classifier = await pipeline("text-classification", MODEL_PATH, {
        device: "wasm",
        dtype: "fp32",
      });
      console.log(
        `[EmotionClassifier] Model loaded in ${(performance.now() - startMs).toFixed(0)}ms`,
      );
      pipelineInstance = classifier;
      isLoaded = true;
      return classifier;
    } catch (error) {
      console.error("[EmotionClassifier] Failed to load model:", error);
      loadPromise = null;
      throw error;
    }
  })();

  return loadPromise;
}

export async function warmUpEmotionClassifier(): Promise<void> {
  const classifier = await getClassifier();
  await classifier("hello world");
  console.log("[EmotionClassifier] Emotion model warm-up complete");
}

export function isEmotionClassifierReady(): boolean {
  return isLoaded;
}

/**
 * Determines intensity ("gentle" vs "strong") based on text features & model score confidence.
 */
export function determineIntensity(text: string, confidenceScore: number): "gentle" | "strong" {
  const isHighConfidence = confidenceScore >= 0.65;
  const hasExclamation = text.includes("!");
  const hasAllCapsWord = /\b[A-Z]{2,}\b/.test(text);

  if (isHighConfidence || hasExclamation || hasAllCapsWord) {
    return "strong";
  }
  return "gentle";
}

export async function classifyEmotion(
  text: string,
): Promise<EmotionClassification | null> {
  if (!text?.trim()) return null;

  try {
    const classifier = await getClassifier();
    const startMs = performance.now();

    const result = (await classifier(text, {
      top_k: 13, // match your model's actual label count
    })) as TextClassificationOutput;

    const inferenceMs = performance.now() - startMs;
    const resultArray = Array.isArray(result[0]) ? result[0] : result;

    const scores: Partial<Record<EmotionLabel, number>> = {};
    for (const item of resultArray as Array<{
      label: EmotionLabel;
      score: number;
    }>) {
      scores[item.label] = item.score;
    }

    let topEmotion: EmotionLabel = "neutral";
    let maxScore = 0;
    for (const [label, score] of Object.entries(scores)) {
      if ((score ?? 0) > maxScore) {
        maxScore = score ?? 0;
        topEmotion = label as EmotionLabel;
      }
    }

    const intensity = determineIntensity(text, maxScore);
    const specificEmotionId = getReactionId(topEmotion, intensity);

    return {
      topEmotion,
      specificEmotionId,
      intensity,
      confidence: maxScore,
      scores: scores as Record<EmotionLabel, number>,
      inferenceMs,
    };
  } catch (error) {
    console.error("[EmotionClassifier] Inference error:", error);
    return null;
  }
}

export async function disposeEmotionClassifier(): Promise<void> {
  if (pipelineInstance) {
    await pipelineInstance.dispose();
    pipelineInstance = null;
    loadPromise = null;
    isLoaded = false;
    console.log("[EmotionClassifier] Model disposed");
  }
}
