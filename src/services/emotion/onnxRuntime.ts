import {
  AutoTokenizer,
  env,
  type PreTrainedTokenizer,
} from "@huggingface/transformers";
import * as ort from "onnxruntime-web";

/**
 * IMPORTANT - read this if caching "isn't helping":
 *
 * cachedFetch() below only covers the files THIS code fetches directly:
 * the two .onnx model files and thresholds.json. It does NOT cover the
 * onnxruntime-web WASM RUNTIME binaries themselves (ort-wasm*.wasm, several
 * MB, loaded internally by the ort library based on ort.env.wasm.wasmPaths).
 * Those are usually the single biggest fetch on the page and are almost
 * certainly why "cached vs. not" feels identical - if they're re-fetched
 * every reload, that dwarfs any savings from caching a 15MB encoder file.
 *
 * Two things to check:
 *   1. Are you testing against a Vite/webpack DEV server? Dev servers
 *      commonly send no-cache headers for everything under /public, so
 *      even the browser's normal HTTP cache won't hold onto the .wasm
 *      runtime files across a reload. Test against a PRODUCTION build
 *      (`vite build && vite preview` or equivalent) before concluding
 *      caching doesn't work - dev-mode results here are misleading.
 *   2. If self-hosting the wasm files (via wasmPaths), make sure your
 *      server/CDN sends long-lived, immutable Cache-Control headers for
 *      them, e.g. `Cache-Control: public, max-age=31536000, immutable`.
 *      Filenames from onnxruntime-web are already version-scoped, so this
 *      is safe.
 */

// Transformers.js already browser-caches tokenizer.json/vocab.txt/config.json
// under the hood - this just makes that explicit rather than relying on the
// library default. The two raw .onnx files + thresholds.json below are
// fetched with plain fetch() (not through the library), so they need their
// own Cache Storage handling - see cachedFetch().
env.useBrowserCache = true;

/**
 * Bump this if the repo layout or file contents change in a way that should
 * invalidate previously-cached bytes (e.g. swapping to a different
 * quantization or repo). Cache Storage has no built-in versioning/ETag
 * revalidation for arbitrary fetch()es the way HTTP caching does, so a
 * version suffix in the cache name is the simplest way to force a clean
 * re-download after a real model change.
 */
const ONNX_CACHE_NAME = "emotion-onnx-cache-v1";

/**
 * Fetches a URL through the browser's Cache Storage API so the ~MB-sized
 * .onnx files and thresholds.json are only downloaded once per browser,
 * not on every page refresh. Falls back to a normal network fetch on a
 * cache miss and populates the cache for next time.
 *
 * Logs a hit/miss + timing for each call - this is deliberate: "caching
 * doesn't seem to help" is nearly always one of (a) it's actually still
 * missing the cache for a reason that isn't obvious from the outside, or
 * (b) the cache IS hitting but something else entirely (WASM compile,
 * not I/O) is what's actually slow. This makes it visible which one you're
 * looking at instead of guessing.
 */
async function cachedFetch(url: string): Promise<Response> {
  if (typeof caches !== "undefined") {
    try {
      const cache = await caches.open(ONNX_CACHE_NAME);
      const cached = await cache.match(url);
      if (cached) {
        return cached;
      }
    } catch {
      // Ignore cache storage match errors
    }
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${url}: ${response.status} ${response.statusText}`,
    );
  }

  if (typeof caches !== "undefined") {
    try {
      const cache = await caches.open(ONNX_CACHE_NAME);
      await cache.put(url, response.clone());
    } catch {
      // Ignore cache storage write errors
    }
  }

  return response;
}

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
  pending: number;
}

export interface ONNXEmotionModelOptions {
  repoId?: string;
  encoderPath?: string;
  classifierPath?: string;
  thresholdsPath?: string;
  maxLength?: number;
  wasmPaths?: string;
  executionProviders?: ort.InferenceSession.ExecutionProviderConfig[];
  /**
   * ONNX Runtime graph optimization level. "all" (the previous hardcoded
   * default) produces the fastest INFERENCE but spends more time optimizing
   * the graph on every single session creation - and that optimization
   * step re-runs on every page reload with no way to cache/persist the
   * optimized result in the browser. If your bottleneck turns out to be
   * session-creation time (see the new per-step console logs in init()),
   * try "basic" here and compare - you're trading a bit of steady-state
   * inference speed for meaningfully faster time-to-ready. Default: "all".
   */
  graphOptimizationLevel?: "disabled" | "basic" | "extended" | "all";
  numThreads?: number;
  useWorkerProxy?: boolean;
  cacheSize?: number;
  statsWindow?: number;
  maxConcurrentInference?: number;
  maxQueueDepth?: number;
}

const DEFAULT_REPO_ID = "navgurukul-ai/realtime-avatar-animation";
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

class LRUCache<K, V> {
  private map = new Map<K, V>();
  constructor(private maxSize: number) {}

  get(key: K): V | undefined {
    if (!this.map.has(key)) return undefined;
    const v = this.map.get(key)!;
    this.map.delete(key);
    this.map.set(key, v);
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
  private readonly graphOptimizationLevel:
    | "disabled"
    | "basic"
    | "extended"
    | "all";

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
    this.graphOptimizationLevel = options.graphOptimizationLevel ?? "all";

    this.scheduler = new InferenceScheduler(
      options.maxConcurrentInference ?? DEFAULT_MAX_CONCURRENT,
      options.maxQueueDepth ?? DEFAULT_MAX_QUEUE_DEPTH,
    );
    this.cache = new LRUCache(options.cacheSize ?? DEFAULT_CACHE_SIZE);
    this.statsWindow = options.statsWindow ?? DEFAULT_STATS_WINDOW;

    const defaultThreads =
      typeof navigator !== "undefined"
        ? Math.min(navigator.hardwareConcurrency || 4, 4)
        : 4;
    ort.env.wasm.numThreads = options.numThreads ?? defaultThreads;
    ort.env.wasm.simd = true;
    ort.env.wasm.proxy = options.useWorkerProxy ?? false;

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

  async doInit(): Promise<void> {
    if (this.disposed) {
      throw new Error(
        "ONNXEmotionModel has been disposed; create a new instance.",
      );
    }
    if (this.initialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      const startMs = now();

      const tokenizerStart = now();
      this.tokenizer = (await AutoTokenizer.from_pretrained(
        this.repoId,
      )) as PreTrainedTokenizer;
      console.log(
        `[ONNXEmotionModel] tokenizer loaded in ${(now() - tokenizerStart).toFixed(0)}ms`,
      );

      const fetchStart = now();
      const [encoderBuf, classifierBuf, thresholdsJson] = await Promise.all([
        this.fetchArrayBuffer(this.resolveUrl(this.encoderPath)),
        this.fetchArrayBuffer(this.resolveUrl(this.classifierPath)),
        this.fetchJson(this.resolveUrl(this.thresholdsPath)),
      ]);
      console.log(
        `[ONNXEmotionModel] all fetches settled in ${(now() - fetchStart).toFixed(0)}ms`,
      );

      const sessionOptions: ort.InferenceSession.SessionOptions = {
        executionProviders: this.executionProviders,
        graphOptimizationLevel: this.graphOptimizationLevel,
        executionMode: "parallel",
      };

      // Timed separately (not just as a Promise.all pair) because these two
      // numbers are the ones that matter most: this is pure WASM
      // instantiation + graph-optimization compute, which Cache Storage
      // cannot speed up at all - it only ever helps the fetch step above.
      const encoderSessionStart = now();
      const encoderSession = await ort.InferenceSession.create(
        encoderBuf,
        sessionOptions,
      );
      console.log(
        `[ONNXEmotionModel] encoder session created in ${(now() - encoderSessionStart).toFixed(0)}ms`,
      );

      const classifierSessionStart = now();
      const classifierSession = await ort.InferenceSession.create(
        classifierBuf,
        sessionOptions,
      );
      console.log(
        `[ONNXEmotionModel] classifier session created in ${(now() - classifierSessionStart).toFixed(0)}ms`,
      );

      this.encoderSession = encoderSession;
      this.classifierSession = classifierSession;

      this.thresholds = thresholdsJson as Record<string, number>;
      this.emotionLabels = Array.from(this.classifierSession.outputNames);

      this.initialized = true;
      console.log(
        `[ONNXEmotionModel] TOTAL init() in ${(now() - startMs).toFixed(0)}ms`,
      );
    })();

    return this.initPromise;
  }

  async init(): Promise<void> {
    if (this.disposed)
      throw new Error(
        "ONNXEmotionModel has been disposed; create a new instance.",
      );
    if (this.initialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = this.doInit().catch(async (err) => {
      if (ort.env.wasm.proxy) {
        console.warn(
          "[ONNXEmotionModel] Worker-proxy WASM init failed, retrying on main thread:",
          err,
        );
        ort.env.wasm.proxy = false;
        this.initPromise = null;
        return this.init();
      }
      throw err;
    });

    return this.initPromise;
  }

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

    this.resetStats();
    this.cache.clear();

    console.log(
      `[ONNXEmotionModel] Warm-up complete in ${(now() - startMs).toFixed(0)}ms`,
    );
  }

  isReady(): boolean {
    return this.initialized && this.warmedUp && !this.disposed;
  }

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
    const res = await cachedFetch(url);
    return res.arrayBuffer();
  }

  private async fetchJson(url: string): Promise<unknown> {
    const res = await cachedFetch(url);
    return res.json();
  }

  /**
   * Deletes this model's cached .onnx/.json files from Cache Storage, so
   * the next init() re-downloads fresh copies. Use this after shipping a
   * new model version under the same repoId/paths, or to free up the
   * browser's cache storage quota. Does NOT affect the tokenizer's own
   * Transformers.js-managed cache - see clearEmotionModelCache() for a
   * convenience wrapper that also covers that if needed.
   */
  async clearCache(): Promise<void> {
    const cache = await caches.open(ONNX_CACHE_NAME);
    const keys = await cache.keys();
    const repoUrlPrefix = `https://huggingface.co/${this.repoId}/`;
    await Promise.all(
      keys
        .filter((req) => req.url.startsWith(repoUrlPrefix))
        .map((req) => cache.delete(req)),
    );
  }

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
    const tokenEmbeds = output[outputName];

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
      const out = output[label];
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

let defaultPredictor: ONNXEmotionModel | null = null;

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
    defaultPredictor = null;
    await toDispose.dispose();
  }
}

export function getEmotionModelStats(): InferenceStats | null {
  return defaultPredictor?.getStats() ?? null;
}

/**
 * Clears cached .onnx/thresholds.json bytes for the shared default model
 * (or for the whole ONNX_CACHE_NAME bucket if no instance has been created
 * yet). Call this once after shipping a new model version so returning
 * users get the new files instead of stale cached ones under the same URLs.
 */
export async function clearEmotionModelCache(): Promise<void> {
  if (defaultPredictor) {
    await defaultPredictor.clearCache();
  } else {
    await caches.delete(ONNX_CACHE_NAME);
  }
}

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
