/**
 * emotion-sdk-v0.1.2\src\services\emotion\onnxRuntime.ts
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
 *
 * ---------------------------------------------------------------------------
 * Live-traffic additions (mirrors the lifecycle API of emotionClassifier.ts):
 *   - warmUp()   : pays the first-call JIT/allocation cost up front
 *   - isReady()  : cheap readiness check for callers/UI
 *   - dispose()  : releases both ONNX sessions and clears caches
 *   - getStats() : rolling latency stats (avg / p50 / p95 / min / max)
 *
 * Perf notes (read before assuming this hits <5ms):
 *   A real transformer encoder forward pass in WASM (even INT4-quantized) is
 *   realistically 10-100ms per short sentence on CPU, not sub-5ms. Sub-5ms is
 *   only realistic with WebGPU, a much smaller model, or by batching many
 *   inputs into one forward pass. This file gets you as fast as a single
 *   wasm session reasonably can, plus the non-blocking / backpressure
 *   behavior you need for a live UI, and instrumentation (getStats()) to
 *   measure your actual numbers. See the chat response for concrete levers.
 * ---------------------------------------------------------------------------
 */

import {
  AutoTokenizer,
  type PreTrainedTokenizer,
} from "@huggingface/transformers";
import * as ort from "onnxruntime-web";

// // Ensure onnxruntime-web fetches valid WASM binaries from CDN instead of failing on local HTML 404
// if (typeof window !== "undefined" && ort && ort.env && ort.env.wasm) {
//   ort.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.1/dist/";
// }

export interface EmotionPrediction {
  label: string;
  probability: number;
}

export interface InferenceStats {
  count: number;
  avgMs: number;
  p50Ms: number;
  p95Ms: number;
  minMs: number;
  maxMs: number;
  lastMs: number;
  /** Requests currently queued behind an in-flight inference call. */
  pending: number;
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
  /**
   * onnxruntime-web execution providers, defaults to ["wasm"]. Add "webgpu"
   * first (e.g. ["webgpu", "wasm"]) if you need to get anywhere close to a
   * <5ms budget — wasm alone is unlikely to get you there for a full
   * encoder forward pass.
   */
  executionProviders?: ort.InferenceSession.ExecutionProviderConfig[];
  /**
   * wasm thread pool size. Only takes effect if the page is cross-origin
   * isolated (COOP/COEP headers) — otherwise the browser silently caps this
   * at 1 and this setting is a no-op. Defaults to min(hardwareConcurrency, 4).
   */
  numThreads?: number;
  /**
   * Runs the wasm backend on a Worker instead of the main thread, so a slow
   * inference call never blocks UI rendering / scrolling / typing. Strongly
   * recommended for a live-transcript UI. Default: true.
   */
  useWorkerProxy?: boolean;
  /**
   * Max number of most-recent (text,k,applyThreshold) -> prediction results
   * to cache. Genuinely useful here: streaming ASR frequently re-emits the
   * same interim partial transcript several times before it finalizes, so
   * an exact-match cache skips redundant inference for free. 0 disables it.
   * Default: 50.
   */
  cacheSize?: number;
  /** Rolling window size used for getStats(). Default: 100. */
  statsWindow?: number;
  /**
   * How many inference calls may run concurrently against the shared
   * sessions. Default: 1 (safe/serial). Only raise this if you've verified
   * your onnxruntime-web version/build behaves correctly under concurrent
   * run() calls on the same session — otherwise leave it at 1 and scale
   * throughput via true batching or a session pool instead.
   */
  maxConcurrentInference?: number;
  /**
   * Max number of requests allowed to sit in the queue behind an in-flight
   * call. When exceeded, the OLDEST queued (not-yet-started) request is
   * dropped and its promise rejects with a "SUPERSEDED" error. This is the
   * right behavior for live captions: if you fall behind, drop stale
   * partial-transcript requests rather than processing an ever-growing
   * backlog of outdated text. Default: 50 (~1s of backlog at 50 req/s).
   */
  maxQueueDepth?: number;
}

const DEFAULT_REPO_ID = "YashM21/Encoder-Decoder-INT4";
const DEFAULT_ENCODER_PATH = "onnx/embedder_v2b_q4.onnx";
const DEFAULT_CLASSIFIER_PATH = "head_goemotions.onnx";
const DEFAULT_THRESHOLDS_PATH = "thresholds.json";
const DEFAULT_MAX_LENGTH = 128;
const DEFAULT_CACHE_SIZE = 50;
const DEFAULT_STATS_WINDOW = 50;
const DEFAULT_MAX_CONCURRENT = 1;
const DEFAULT_MAX_QUEUE_DEPTH = 50;

function now(): number {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

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
    typeof v === "bigint" ? v : BigInt(Math.trunc(v)),
  );
  return new ort.Tensor("int64", BigInt64Array.from(flat), t.dims);
}

/** Small exact-match LRU cache for (text,k,applyThreshold) -> predictions. */
class LRUCache<K, V> {
  private map = new Map<K, V>();
  constructor(private maxSize: number) {}

  get(key: K): V | undefined {
    if (!this.map.has(key)) return undefined;
    const v = this.map.get(key)!;
    this.map.delete(key);
    this.map.set(key, v); // refresh recency
    return v;
  }

  set(key: K, value: V): void {
    if (this.maxSize <= 0) return;
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.maxSize) {
      const oldestKey = this.map.keys().next().value as K;
      this.map.delete(oldestKey);
    }
  }

  clear(): void {
    this.map.clear();
  }
}

interface QueuedTask<T> {
  run: () => Promise<T>;
  resolve: (v: T) => void;
  reject: (e: unknown) => void;
}

/**
 * Bounded FIFO scheduler in front of the ONNX sessions. Serializes calls
 * (by default) so overlapping predict() calls can't race on shared session
 * state, and applies backpressure by dropping the oldest not-yet-started
 * request once the backlog gets too deep — this is what keeps a live system
 * from accumulating an ever-growing, increasingly-stale queue under burst
 * load instead of just falling further and further behind.
 */
class InferenceScheduler {
  private queue: QueuedTask<unknown>[] = [];
  private active = 0;

  constructor(
    private maxConcurrent: number,
    private maxQueueDepth: number,
  ) {}

  get pending(): number {
    return this.queue.length + this.active;
  }

  schedule<T>(task: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      if (this.queue.length >= this.maxQueueDepth) {
        const stale = this.queue.shift();
        stale?.reject(
          new Error(
            "SUPERSEDED: dropped from inference queue (backlog too deep)",
          ),
        );
      }
      this.queue.push({ run: task, resolve, reject } as QueuedTask<unknown>);
      this.drain();
    });
  }

  /** Rejects everything still queued. Used on dispose(). */
  clear(reason: string): void {
    while (this.queue.length) {
      const task = this.queue.shift();
      task?.reject(new Error(reason));
    }
  }

  private drain(): void {
    if (this.active >= this.maxConcurrent) return;
    const next = this.queue.shift();
    if (!next) return;
    this.active++;
    next
      .run()
      .then(next.resolve, next.reject)
      .finally(() => {
        this.active--;
        this.drain();
      });
  }
}

export class ONNXEmotionModel {
  private tokenizer!: PreTrainedTokenizer;
  private encoderSession!: ort.InferenceSession;
  private classifierSession!: ort.InferenceSession;
  private thresholds: Record<string, number> = {};
  private emotionLabels: string[] = [];
  private initialized = false;
  private initPromise: Promise<void> | null = null;
  private warmedUp = false;
  private disposed = false;

  private readonly repoId: string;
  private readonly encoderPath: string;
  private readonly classifierPath: string;
  private readonly thresholdsPath: string;
  private readonly maxLength: number;
  private readonly executionProviders: ort.InferenceSession.ExecutionProviderConfig[];

  private readonly scheduler: InferenceScheduler;
  private readonly cache: LRUCache<string, EmotionPrediction[]>;
  private readonly statsWindow: number;
  private readonly latencies: number[] = [];

  constructor(options: ONNXEmotionModelOptions = {}) {
    this.repoId = options.repoId ?? DEFAULT_REPO_ID;
    this.encoderPath = options.encoderPath ?? DEFAULT_ENCODER_PATH;
    this.classifierPath = options.classifierPath ?? DEFAULT_CLASSIFIER_PATH;
    this.thresholdsPath = options.thresholdsPath ?? DEFAULT_THRESHOLDS_PATH;
    this.maxLength = options.maxLength ?? DEFAULT_MAX_LENGTH;
    this.executionProviders = options.executionProviders ?? ["wasm"];

    this.scheduler = new InferenceScheduler(
      options.maxConcurrentInference ?? DEFAULT_MAX_CONCURRENT,
      options.maxQueueDepth ?? DEFAULT_MAX_QUEUE_DEPTH,
    );
    this.cache = new LRUCache(options.cacheSize ?? DEFAULT_CACHE_SIZE);
    this.statsWindow = options.statsWindow ?? DEFAULT_STATS_WINDOW;

    // --- perf: configure the wasm backend before any session is created ---
    const defaultThreads =
      typeof navigator !== "undefined"
        ? Math.min(navigator.hardwareConcurrency || 4, 4)
        : 4;
    ort.env.wasm.numThreads = options.numThreads ?? defaultThreads;
    ort.env.wasm.simd = true;
    // Keeps inference off the main/UI thread so a live transcript view never
    // stutters while a prediction is running.
    ort.env.wasm.proxy = options.useWorkerProxy ?? true;

    if (options.wasmPaths) {
      ort.env.wasm.wasmPaths = options.wasmPaths;
    }
  }

  static async create(
    options: ONNXEmotionModelOptions = {},
  ): Promise<ONNXEmotionModel> {
    const model = new ONNXEmotionModel(options);
    await model.init();
    await model.warmUp();
    return model;
  }

  /** Loads the tokenizer, both ONNX sessions, and thresholds.json. Safe to call multiple times. */
  async init(): Promise<void> {
    if (this.disposed) {
      throw new Error(
        "ONNXEmotionModel has been disposed; create a new instance.",
      );
    }
    if (this.initialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      const startMs = now();

      this.tokenizer = (await AutoTokenizer.from_pretrained(
        this.repoId,
      )) as PreTrainedTokenizer;

      const [encoderBuf, classifierBuf, thresholdsJson] = await Promise.all([
        this.fetchArrayBuffer(this.resolveUrl(this.encoderPath)),
        this.fetchArrayBuffer(this.resolveUrl(this.classifierPath)),
        this.fetchJson(this.resolveUrl(this.thresholdsPath)),
      ]);

      const sessionOptions: ort.InferenceSession.SessionOptions = {
        executionProviders: this.executionProviders,
        graphOptimizationLevel: "all",
        executionMode: "parallel",
      };

      const [encoderSession, classifierSession] = await Promise.all([
        ort.InferenceSession.create(encoderBuf, sessionOptions),
        ort.InferenceSession.create(classifierBuf, sessionOptions),
      ]);
      this.encoderSession = encoderSession;
      this.classifierSession = classifierSession;

      this.thresholds = thresholdsJson as Record<string, number>;
      // Classifier exposes one output per emotion label, mirroring the Python version.
      this.emotionLabels = Array.from(this.classifierSession.outputNames);

      this.initialized = true;
      console.log(
        `[ONNXEmotionModel] Sessions loaded in ${(now() - startMs).toFixed(0)}ms`,
      );
    })();

    return this.initPromise;
  }

  /**
   * Runs one throwaway inference so wasm kernel compilation, memory-arena
   * allocation, and tokenizer warm-caches are all paid for before live
   * traffic arrives. Skipping this means your first real request eats a
   * one-time cost (often hundreds of ms) that will blow any latency budget
   * and can visibly stall the first caption.
   */
  async warmUp(
    sampleText = "This is a warm up sentence to initialize the model.",
  ): Promise<void> {
    if (this.disposed) {
      throw new Error(
        "ONNXEmotionModel has been disposed; create a new instance.",
      );
    }
    if (!this.initialized) await this.init();
    if (this.warmedUp) return;

    const startMs = now();
    await this.predictTopK(sampleText, 1, false);
    this.warmedUp = true;

    // The warm-up call isn't representative of real traffic — don't let it
    // skew stats or occupy a cache slot a real caller might want.
    this.resetStats();
    this.cache.clear();

    console.log(
      `[ONNXEmotionModel] Warm-up complete in ${(now() - startMs).toFixed(0)}ms`,
    );
  }

  /** True once the model is loaded, warmed up, and not disposed. */
  isReady(): boolean {
    return this.initialized && this.warmedUp && !this.disposed;
  }

  /** Releases both ONNX sessions, rejects any queued work, and clears caches/stats. */
  async dispose(): Promise<void> {
    if (this.disposed) return;
    this.disposed = true;

    this.scheduler.clear("ONNXEmotionModel disposed");

    const releasers: Promise<void>[] = [];
    if (
      this.encoderSession &&
      typeof this.encoderSession.release === "function"
    ) {
      releasers.push(this.encoderSession.release());
    }
    if (
      this.classifierSession &&
      typeof this.classifierSession.release === "function"
    ) {
      releasers.push(this.classifierSession.release());
    }
    await Promise.all(releasers);

    this.cache.clear();
    this.latencies.length = 0;
    this.initialized = false;
    this.warmedUp = false;
    this.initPromise = null;

    console.log("[ONNXEmotionModel] Disposed");
  }

  /** Rolling inference-latency stats (post tokenize+encode+classify, excludes cache hits). */
  getStats(): InferenceStats {
    const n = this.latencies.length;
    if (n === 0) {
      return {
        count: 0,
        avgMs: 0,
        p50Ms: 0,
        p95Ms: 0,
        minMs: 0,
        maxMs: 0,
        lastMs: 0,
        pending: this.scheduler.pending,
      };
    }
    const sorted = [...this.latencies].sort((a, b) => a - b);
    const sum = sorted.reduce((a, b) => a + b, 0);
    const pct = (p: number) =>
      sorted[Math.min(n - 1, Math.floor((p / 100) * n))];
    return {
      count: n,
      avgMs: sum / n,
      p50Ms: pct(50),
      p95Ms: pct(95),
      minMs: sorted[0],
      maxMs: sorted[n - 1],
      lastMs: this.latencies[n - 1],
      pending: this.scheduler.pending,
    };
  }

  resetStats(): void {
    this.latencies.length = 0;
  }

  private recordLatency(ms: number): void {
    this.latencies.push(ms);
    if (this.latencies.length > this.statsWindow) this.latencies.shift();
  }

  private resolveUrl(path: string): string {
    return `https://huggingface.co/${this.repoId}/resolve/main/${path}`;
  }

  private async fetchArrayBuffer(url: string): Promise<ArrayBuffer> {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch ${url}: ${res.status} ${res.statusText}`,
      );
    }
    return res.arrayBuffer();
  }

  private async fetchJson(url: string): Promise<unknown> {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch ${url}: ${res.status} ${res.statusText}`,
      );
    }
    return res.json();
  }

  /** Tokenize and return a normalised sentence embedding (batch=1 x hidden). */
  private async meanPoolEmbedding(
    text: string,
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
        encoded.token_type_ids as unknown as TensorLike,
      );
    }

    const output = await this.encoderSession.run(feeds);
    const outputName = this.encoderSession.outputNames[0];
    const tokenEmbeds = output[outputName]; // shape [batch, seq, hidden]

    const [batch, seq, hidden] = tokenEmbeds.dims as number[];
    const embedData = tokenEmbeds.data as Float32Array;
    const maskFlat = Array.from(
      attentionMask.data as ArrayLike<number | bigint>,
    ).map((v) => Number(v));

    if (batch !== 1) {
      throw new Error(
        `Expected batch size 1, got ${batch}. Batch prediction is not supported.`,
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

  private async runInference(
    text: string,
    k: number,
    applyThreshold: boolean,
  ): Promise<EmotionPrediction[]> {
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
        (p) => p.probability >= (this.thresholds[p.label] ?? 0.5),
      );
    }

    return preds.slice(0, k);
  }

  /**
   * Return the top-k (label, probability) pairs for `text`.
   * If `applyThreshold` is true, only emotions with score >= threshold are kept,
   * and the result may contain fewer than k items.
   *
   * Exact-repeat requests (same text/k/applyThreshold) are served from an LRU
   * cache without touching the model. New requests are queued through a
   * bounded scheduler — if the backlog is too deep the oldest queued request
   * is dropped and rejects with a "SUPERSEDED" error, which callers in a
   * live pipeline should treat as "skip this one, a newer one is coming."
   */
  async predictTopK(
    text: string,
    k = 3,
    applyThreshold = false,
  ): Promise<EmotionPrediction[]> {
    if (this.disposed) {
      throw new Error(
        "ONNXEmotionModel has been disposed; create a new instance.",
      );
    }
    if (!this.initialized) {
      await this.init();
    }

    const cacheKey = `${text}\u0000${k}\u0000${applyThreshold}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const startMs = now();
    const result = await this.scheduler.schedule(() =>
      this.runInference(text, k, applyThreshold),
    );
    this.recordLatency(now() - startMs);

    this.cache.set(cacheKey, result);
    return result;
  }
}

// ----- Convenience top-level functions (use a lazily-created default instance) -----

let defaultPredictor: ONNXEmotionModel | null = null;

/**
 * Simple wrapper mirroring the Python `predict_topk` helper.
 * `model` can be an ONNXEmotionModel instance, options for creating one, or omitted
 * to use/create a shared default instance.
 */
export async function predictTopK(
  text: string,
  k = 3,
  model?: ONNXEmotionModel | ONNXEmotionModelOptions,
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

/** Loads + warms up the shared default model. Call this once at app startup. */
export async function warmUpEmotionModel(
  options?: ONNXEmotionModelOptions,
): Promise<void> {
  if (!defaultPredictor) {
    defaultPredictor = new ONNXEmotionModel(options);
  }
  await defaultPredictor.warmUp();
}

export function isEmotionModelReady(): boolean {
  return defaultPredictor?.isReady() ?? false;
}

export async function disposeEmotionModel(): Promise<void> {
  if (defaultPredictor) {
    const toDispose = defaultPredictor;
    defaultPredictor = null; // release the slot immediately so a new mount can create a fresh instance
    await toDispose.dispose(); // let it finish disposing in the background
  }
}

export function getEmotionModelStats(): InferenceStats | null {
  return defaultPredictor?.getStats() ?? null;
}

// ---------------------------------------------------------------------
// Example usage (mirrors the Python `if __name__ == "__main__":` block).
// Call this from your app, e.g. a button handler or a dev-only script.
// ---------------------------------------------------------------------

// To test run this script use:
// npx tsx /path_to_file_where_it's_called
export async function runExample(): Promise<void> {
  const predictor = await ONNXEmotionModel.create(); // init() + warmUp() already done

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

  console.log("\nStats:", predictor.getStats());
  await predictor.dispose();
}

// testing in it's own file
// runExample()
