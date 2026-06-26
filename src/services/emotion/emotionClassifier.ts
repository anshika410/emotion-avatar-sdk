import {
  pipeline,
  env,
  type TextClassificationOutput,
} from "@huggingface/transformers";
import type { EmotionLabel } from "../../types/emotion";

// Allow local bundled model only — block accidental CDN fetch
env.allowLocalModels = true;
env.allowRemoteModels = false;
env.useBrowserCache = true;

const MODEL_PATH = new URL("../models/onnx/", import.meta.url).href;

// BERT max-position-embeddings = 512 tokens; ~2000 chars is a safe upper bound
const MAX_INPUT_LENGTH = 2000;

export interface EmotionClassification {
  topEmotion: EmotionLabel;
  confidence: number;
  scores: Record<EmotionLabel, number>;
  inferenceMs: number;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ClassificationPipeline = Awaited<ReturnType<typeof pipeline<"text-classification">>>;

let pipelineInstance: ClassificationPipeline | null = null;
let loadPromise: Promise<ClassificationPipeline> | null = null;
let isLoaded = false;

async function getClassifier(): Promise<ClassificationPipeline> {
  if (pipelineInstance) return pipelineInstance;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    try {
      const classifier = await pipeline(
        "text-classification",
        MODEL_PATH,
        {
          device: "wasm",
          dtype: "q8",
        }
      );
      pipelineInstance = classifier;
      isLoaded = true;
      return classifier;
    } catch (error) {
      loadPromise = null;
      throw error;
    }
  })();

  return loadPromise;
}

export async function warmUpEmotionClassifier(): Promise<void> {
  const classifier = await getClassifier();
  await classifier("hello world");
}

export function isEmotionClassifierReady(): boolean {
  return isLoaded;
}

export async function classifyEmotion(
  text: string
): Promise<EmotionClassification | null> {
  if (!text?.trim()) return null;

  const truncated = text.length > MAX_INPUT_LENGTH
    ? text.slice(0, MAX_INPUT_LENGTH)
    : text;

  try {
    const classifier = await getClassifier();
    const startMs = performance.now();

    const result = (await classifier(truncated, {
      top_k: 13, // match your model's actual label count
    })) as TextClassificationOutput;

    const inferenceMs = performance.now() - startMs;
    const resultArray = Array.isArray(result[0]) ? result[0] : result;

    const scores: Partial<Record<EmotionLabel, number>> = {};
    for (const item of resultArray as Array<{ label: EmotionLabel; score: number }>) {
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

    return {
      topEmotion,
      confidence: maxScore,
      scores: scores as Record<EmotionLabel, number>,
      inferenceMs,
    };
  } catch {
    return null;
  }
}

export async function disposeEmotionClassifier(): Promise<void> {
  if (pipelineInstance) {
    await pipelineInstance.dispose();
    pipelineInstance = null;
    loadPromise = null;
    isLoaded = false;
  }
}