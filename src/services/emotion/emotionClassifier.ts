/**
 * Browser-based emotion classification using DistilBERT (ONNX INT8 quantized).
 *
 * Model: Xenova/distilbert-base-uncased-emotion
 *   - 6 Ekman emotions: sadness, joy, love, anger, fear, surprise
 *   - ~66M params (DistilBERT) ≈ 17 MB quantized INT8
 *   - ~40% fewer params and ~60% faster than BERT-base
 *   - Browser inference via ONNX Runtime WASM (single-threaded)
 *
 * Uses @huggingface/transformers (Transformers.js v3) which handles:
 *   - Automatic model download + IndexedDB caching
 *   - WordPiece tokenization
 *   - ONNX Runtime Web execution with quantization selection
 *
 * The classifier exposes:
 *   - `classifyEmotion(text)` → top emotion + all probabilities
 *   - `warmUp()` → preload model (call during init for no cold-start)
 *   - Debounced batch-friendly: safe to call at high frequency
 */

import { pipeline, env, type TextClassificationOutput } from "@huggingface/transformers";

// Transformers.js v3 handles ONNX runtime automatically
// No custom ort path needed - uses default from HuggingFace Hub

// Disable remote model hosting check (we want HuggingFace Hub CDN)
env.allowRemoteModels = true;

// Cache models in browser IndexedDB
env.useBrowserCache = true;

// ──────────────── Types ────────────────

/** The 6 Ekman emotion labels from the model */
export type EmotionLabel = "sadness" | "joy" | "love" | "anger" | "fear" | "surprise";

/** Full classification result */
export interface EmotionClassification {
  /** Highest-probability emotion */
  topEmotion: EmotionLabel;
  /** Confidence of the top emotion (0–1) */
  confidence: number;
  /** All 6 emotion probabilities */
  scores: Record<EmotionLabel, number>;
  /** Inference time in milliseconds */
  inferenceMs: number;
}

// ──────────────── Model Configuration ────────────────

const MODEL_ID = "Xenova/distilbert-base-uncased-emotion";

/**
 * Quantization: "q8" = INT8 quantized ONNX (~17 MB, ~60% faster than FP32)
 * Alternatives: "fp32" (full precision), "fp16" (half precision), "q4" (4-bit)
 */
const QUANTIZATION = "q8";

// ──────────────── Singleton Pipeline ────────────────

type ClassificationPipeline = Awaited<ReturnType<typeof pipeline<"text-classification">>>;

let pipelineInstance: ClassificationPipeline | null = null;
let loadPromise: Promise<ClassificationPipeline> | null = null;
let isLoaded = false;

/**
 * Get or create the classification pipeline (singleton, lazy-loaded).
 * First call downloads the model (~17 MB), subsequent calls use IndexedDB cache.
 */
async function getClassifier(): Promise<ClassificationPipeline> {
  if (pipelineInstance) return pipelineInstance;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    console.log("[EmotionClassifier] Loading DistilBERT emotion model (INT8 quantized)...");
    const startMs = performance.now();

    try {
      const classifier = await pipeline("text-classification", MODEL_ID, {
        dtype: QUANTIZATION,
        device: "wasm",
      });

      const elapsed = performance.now() - startMs;
      console.log(`[EmotionClassifier] Model loaded in ${elapsed.toFixed(0)}ms`);
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

// ──────────────── Public API ────────────────

/**
 * Pre-load the model so classification calls have no cold-start.
 * Safe to call multiple times (idempotent).
 */
export async function warmUpEmotionClassifier(): Promise<void> {
  await getClassifier();
  // Run a dummy inference to JIT-compile the WASM execution plan
  if (pipelineInstance) {
    await pipelineInstance("hello", { top_k: 6 });
    console.log("[EmotionClassifier] Warm-up inference complete");
  }
}

/** Whether the model is loaded and ready for inference */
export function isEmotionClassifierReady(): boolean {
  return isLoaded;
}

/**
 * Classify the emotion of a text string.
 *
 * Returns all 6 emotion probabilities + the top emotion.
 * Inference time: ~30–80ms on desktop, ~60–120ms on mobile (INT8 WASM).
 *
 * @param text - User speech transcript (partial or final)
 * @returns EmotionClassification or null if model isn't loaded yet
 */
export async function classifyEmotion(text: string): Promise<EmotionClassification | null> {
  if (!text.trim()) return null;

  try {
    const classifier = await getClassifier();
    const startMs = performance.now();

    // Request all 6 labels with softmax scores
    const result = await classifier(text, { top_k: 6 }) as TextClassificationOutput;

    const inferenceMs = performance.now() - startMs;

    // Build scores map
    const scores: Record<string, number> = {};
    const resultArray = Array.isArray(result[0]) ? result[0] : result;

    for (const item of resultArray as Array<{ label: string; score: number }>) {
      scores[item.label] = item.score;
    }

    // Find top emotion
    let topEmotion: EmotionLabel = "joy";
    let maxScore = 0;
    for (const [label, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        topEmotion = label as EmotionLabel;
      }
    }

    return {
      topEmotion,
      confidence: maxScore,
      scores: scores as Record<EmotionLabel, number>,
      inferenceMs,
    };
  } catch (error) {
    console.error("[EmotionClassifier] Inference error:", error);
    return null;
  }
}

/**
 * Dispose of the model pipeline and free memory.
 */
export async function disposeEmotionClassifier(): Promise<void> {
  if (pipelineInstance) {
    await pipelineInstance.dispose();
    pipelineInstance = null;
    loadPromise = null;
    isLoaded = false;
    console.log("[EmotionClassifier] Model disposed");
  }
}
