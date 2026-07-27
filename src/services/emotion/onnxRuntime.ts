/**
 * src/onnxRuntime.ts
 *
 * Loads the quantized ONNX pipeline (tokenizer + encoder + emotion-classifier head)
 * hosted on the Hugging Face Hub and provides emotion prediction in the browser
 * via onnxruntime-web + @huggingface/transformers.
 *
 * HF repo layout assumed (YashM21/Encoder-Decoder-INT4):
 *   config.json
 *   head_goemotions.onnx        <- classifier head (root)
 *   head_v2b.onnx
 *   special_tokens_map.json
 *   thresholds.json
 *   tokenizer.json
 *   tokenizer_config.json
 *   vocab.txt
 *   onnx/
 *     embedder_v2b_q4.onnx      <- quantized sentence encoder (used here)
 *     encoder_int8.onnx
 */

import { AutoTokenizer, type PreTrainedTokenizer } from "@huggingface/transformers";
import * as ort from "onnxruntime-web";

export interface EmotionPrediction {
  label: string;
  probability: number;
}

export interface ONNXEmotionModelOptions {
  /** Hugging Face repo id, e.g. "YashM21/Encoder-Decoder-INT4" */
  repoId?: string;
  /** Path (relative to repo root) to the sentence-encoder ONNX file */
  encoderPath?: string;
  /** Path (relative to repo root) to the classifier-head ONNX file */
  classifierPath?: string;
  /** Path (relative to repo root) to thresholds.json */
  thresholdsPath?: string;
  /** Max sequence length passed to the tokenizer */
  maxLength?: number;
  /** Override onnxruntime-web wasm asset path (needed for bundlers) */
  wasmPaths?: string;
  /** onnxruntime-web execution providers, defaults to ["wasm"] */
  executionProviders?: ort.InferenceSession.ExecutionProviderConfig[];
}

const DEFAULT_REPO_ID = "YashM21/Encoder-Decoder-INT4";
const DEFAULT_ENCODER_PATH = "onnx/embedder_v2b_q4.onnx";
const DEFAULT_CLASSIFIER_PATH = "head_goemotions.onnx";
const DEFAULT_THRESHOLDS_PATH = "thresholds.json";
const DEFAULT_MAX_LENGTH = 128;

/**
 * Any tensor-like object with numeric/bigint typed data and shape (dims).
 * @huggingface/transformers' Tensor type satisfies this shape.
 */
interface TensorLike {
  data: Int32Array | BigInt64Array | Float32Array | number[] | bigint[];
  dims: number[];
}

function toBigInt64Tensor(t: TensorLike): ort.Tensor {
  const flat = Array.from(t.data as ArrayLike<number | bigint>).map((v) =>
    typeof v === "bigint" ? v : BigInt(Math.trunc(v))
  );
  return new ort.Tensor("int64", BigInt64Array.from(flat), t.dims);
}

export class ONNXEmotionModel {
  private tokenizer!: PreTrainedTokenizer;
  private encoderSession!: ort.InferenceSession;
  private classifierSession!: ort.InferenceSession;
  private thresholds: Record<string, number> = {};
  private emotionLabels: string[] = [];
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  private readonly repoId: string;
  private readonly encoderPath: string;
  private readonly classifierPath: string;
  private readonly thresholdsPath: string;
  private readonly maxLength: number;
  private readonly executionProviders: ort.InferenceSession.ExecutionProviderConfig[];

  constructor(options: ONNXEmotionModelOptions = {}) {
    this.repoId = options.repoId ?? DEFAULT_REPO_ID;
    this.encoderPath = options.encoderPath ?? DEFAULT_ENCODER_PATH;
    this.classifierPath = options.classifierPath ?? DEFAULT_CLASSIFIER_PATH;
    this.thresholdsPath = options.thresholdsPath ?? DEFAULT_THRESHOLDS_PATH;
    this.maxLength = options.maxLength ?? DEFAULT_MAX_LENGTH;
    this.executionProviders = options.executionProviders ?? ["wasm"];

    if (options.wasmPaths) {
      ort.env.wasm.wasmPaths = options.wasmPaths;
    }
  }

  static async create(options: ONNXEmotionModelOptions = {}): Promise<ONNXEmotionModel> {
    const model = new ONNXEmotionModel(options);
    await model.init();
    return model;
  }

  /** Loads the tokenizer, both ONNX sessions, and thresholds.json. Safe to call multiple times. */
  async init(): Promise<void> {
    if (this.initialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      this.tokenizer = (await AutoTokenizer.from_pretrained(
        this.repoId
      )) as PreTrainedTokenizer;

      const [encoderBuf, classifierBuf, thresholdsJson] = await Promise.all([
        this.fetchArrayBuffer(this.resolveUrl(this.encoderPath)),
        this.fetchArrayBuffer(this.resolveUrl(this.classifierPath)),
        this.fetchJson(this.resolveUrl(this.thresholdsPath)),
      ]);

      this.encoderSession = await ort.InferenceSession.create(encoderBuf, {
        executionProviders: this.executionProviders,
      });
      this.classifierSession = await ort.InferenceSession.create(classifierBuf, {
        executionProviders: this.executionProviders,
      });

      this.thresholds = thresholdsJson as Record<string, number>;
      // Classifier exposes one output per emotion label, mirroring the Python version.
      this.emotionLabels = Array.from(this.classifierSession.outputNames);

      this.initialized = true;
    })();

    return this.initPromise;
  }

  private resolveUrl(path: string): string {
    return `https://huggingface.co/${this.repoId}/resolve/main/${path}`;
  }

  private async fetchArrayBuffer(url: string): Promise<ArrayBuffer> {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
    }
    return res.arrayBuffer();
  }

  private async fetchJson(url: string): Promise<unknown> {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
    }
    return res.json();
  }

  /** Tokenize and return a normalised sentence embedding (batch=1 x hidden). */
  private async meanPoolEmbedding(
    text: string
  ): Promise<{ data: Float32Array; hidden: number }> {
    const encoded = await this.tokenizer(text, {
      padding: true,
      truncation: true,
      max_length: this.maxLength,
      return_tensor: true,
    });

    const inputIds = encoded.input_ids as unknown as TensorLike;
    const attentionMask = encoded.attention_mask as unknown as TensorLike;

    const feeds: Record<string, ort.Tensor> = {
      input_ids: toBigInt64Tensor(inputIds),
      attention_mask: toBigInt64Tensor(attentionMask),
    };

    if ("token_type_ids" in encoded && encoded.token_type_ids) {
      feeds.token_type_ids = toBigInt64Tensor(
        encoded.token_type_ids as unknown as TensorLike
      );
    }

    const output = await this.encoderSession.run(feeds);
    const outputName = this.encoderSession.outputNames[0];
    const tokenEmbeds = output[outputName]; // shape [batch, seq, hidden]

    const [batch, seq, hidden] = tokenEmbeds.dims as number[];
    const embedData = tokenEmbeds.data as Float32Array;
    const maskFlat = Array.from(
      attentionMask.data as ArrayLike<number | bigint>
    ).map((v) => Number(v));

    if (batch !== 1) {
      throw new Error(
        `Expected batch size 1, got ${batch}. Batch prediction is not supported.`
      );
    }

    const pooled = new Float32Array(hidden);
    let maskSum = 0;
    for (let s = 0; s < seq; s++) {
      const m = maskFlat[s];
      maskSum += m;
      if (m === 0) continue;
      for (let h = 0; h < hidden; h++) {
        pooled[h] += embedData[s * hidden + h] * m;
      }
    }
    const denom = Math.max(maskSum, 1e-9);

    let normSq = 0;
    for (let h = 0; h < hidden; h++) {
      pooled[h] /= denom;
      normSq += pooled[h] * pooled[h];
    }
    const norm = Math.sqrt(normSq) || 1e-9;
    for (let h = 0; h < hidden; h++) {
      pooled[h] /= norm;
    }

    return { data: pooled, hidden };
  }

  /**
   * Return the top-k (label, probability) pairs for `text`.
   * If `applyThreshold` is true, only emotions with score >= threshold are kept,
   * and the result may contain fewer than k items.
   */
  async predictTopK(
    text: string,
    k = 3,
    applyThreshold = false
  ): Promise<EmotionPrediction[]> {
    if (!this.initialized) {
      await this.init();
    }

    const { data: embedding, hidden } = await this.meanPoolEmbedding(text);

    const feeds: Record<string, ort.Tensor> = {
      logits: new ort.Tensor("float32", embedding, [1, hidden]),
    };

    const output = await this.classifierSession.run(feeds);

    let preds: EmotionPrediction[] = this.emotionLabels.map((label) => {
      const out = output[label]; // shape (1, 2) - class 1 is the positive probability
      const data = out.data as Float32Array;
      return { label, probability: data[1] };
    });

    preds.sort((a, b) => b.probability - a.probability);

    if (applyThreshold) {
      preds = preds.filter(
        (p) => p.probability >= (this.thresholds[p.label] ?? 0.5)
      );
    }

    return preds.slice(0, k);
  }
}

// ----- Convenience top-level function (uses a lazily-created default instance) -----

let defaultPredictor: ONNXEmotionModel | null = null;

/**
 * Simple wrapper mirroring the Python `predict_topk` helper.
 * `model` can be an ONNXEmotionModel instance, options for creating one, or omitted
 * to use/create a shared default instance.
 */
export async function predictTopK(
  text: string,
  k = 3,
  model?: ONNXEmotionModel | ONNXEmotionModelOptions
): Promise<EmotionPrediction[]> {
  let predictor: ONNXEmotionModel;

  if (model instanceof ONNXEmotionModel) {
    predictor = model;
  } else if (model) {
    predictor = new ONNXEmotionModel(model);
  } else {
    if (!defaultPredictor) {
      defaultPredictor = new ONNXEmotionModel();
    }
    predictor = defaultPredictor;
  }

  return predictor.predictTopK(text, k);
}


// ---------------------------------------------------------------------
// Example usage (mirrors the Python `if __name__ == "__main__":` block).
// Call this from your app, e.g. a button handler or a dev-only script.
// ---------------------------------------------------------------------

// To test run this script use:
// npx tsx /path_to_file_where_it's_called
export async function runExample(): Promise<void> {
  const predictor = await ONNXEmotionModel.create();

  const testSentences = [
    "I was really confident when I started explaining my solution, but after you pointed out the edge case, I realized my approach was wrong and now I'm feeling disappointed.",
    "At first I was nervous because I didn't understand the problem, but after breaking it into smaller parts, I became excited because the solution finally made sense.",
  ];

  for (const s of testSentences) {
    console.log(`\nText: ${s}`);
    const preds = await predictor.predictTopK(s, 20);
    for (const { label, probability } of preds) {
      console.log(`  ${label.padEnd(15)}: ${probability.toFixed(4)}`);
    }
  }
}

// testing in it's own file
// runExample()