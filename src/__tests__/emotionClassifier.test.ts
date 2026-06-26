import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock the @huggingface/transformers module
const mockClassifier = vi.fn() as ReturnType<typeof vi.fn> & { dispose: ReturnType<typeof vi.fn> };
const mockDispose = vi.fn();
mockClassifier.dispose = mockDispose;

vi.mock("@huggingface/transformers", () => ({
  pipeline: vi.fn(() => Promise.resolve(Object.assign(mockClassifier, { dispose: mockDispose }))),
  env: {
    allowLocalModels: true,
    allowRemoteModels: false,
    useBrowserCache: true,
  },
}));

// We need to reset modules between tests to reset the singleton state
describe("emotionClassifier", () => {
  let classifyEmotion: typeof import("../services/emotion/emotionClassifier").classifyEmotion;
  let warmUpEmotionClassifier: typeof import("../services/emotion/emotionClassifier").warmUpEmotionClassifier;
  let isEmotionClassifierReady: typeof import("../services/emotion/emotionClassifier").isEmotionClassifierReady;
  let disposeEmotionClassifier: typeof import("../services/emotion/emotionClassifier").disposeEmotionClassifier;

  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();

    // Re-mock after reset
    vi.doMock("@huggingface/transformers", () => ({
      pipeline: vi.fn(() => Promise.resolve(Object.assign(mockClassifier, { dispose: mockDispose }))),
      env: {
        allowLocalModels: true,
        allowRemoteModels: false,
        useBrowserCache: true,
      },
    }));

    const module = await import("../services/emotion/emotionClassifier");
    classifyEmotion = module.classifyEmotion;
    warmUpEmotionClassifier = module.warmUpEmotionClassifier;
    isEmotionClassifierReady = module.isEmotionClassifierReady;
    disposeEmotionClassifier = module.disposeEmotionClassifier;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("classifyEmotion", () => {
    it("returns null for empty string", async () => {
      const result = await classifyEmotion("");
      expect(result).toBeNull();
    });

    it("returns null for whitespace-only string", async () => {
      const result = await classifyEmotion("   ");
      expect(result).toBeNull();
    });

    it("returns null for null/undefined input", async () => {
      const result = await classifyEmotion(null as unknown as string);
      expect(result).toBeNull();
    });

    it("returns classification result with correct structure", async () => {
      mockClassifier.mockResolvedValue([
        { label: "happiness", score: 0.85 },
        { label: "neutral", score: 0.10 },
        { label: "sadness", score: 0.05 },
      ]);

      const result = await classifyEmotion("I love this!");
      expect(result).not.toBeNull();
      expect(result!.topEmotion).toBe("happiness");
      expect(result!.confidence).toBe(0.85);
      expect(result!.scores).toEqual({
        happiness: 0.85,
        neutral: 0.10,
        sadness: 0.05,
      });
      expect(result!.inferenceMs).toBeGreaterThanOrEqual(0);
    });

    it("handles nested array result format", async () => {
      mockClassifier.mockResolvedValue([
        [
          { label: "anger", score: 0.9 },
          { label: "neutral", score: 0.1 },
        ],
      ]);

      const result = await classifyEmotion("I'm furious!");
      expect(result).not.toBeNull();
      expect(result!.topEmotion).toBe("anger");
      expect(result!.confidence).toBe(0.9);
    });

    it("returns null on classifier error", async () => {
      mockClassifier.mockRejectedValue(new Error("Model inference failed"));

      const result = await classifyEmotion("some text");
      expect(result).toBeNull();
    });

    it("identifies correct top emotion from multiple scores", async () => {
      mockClassifier.mockResolvedValue([
        { label: "sadness", score: 0.2 },
        { label: "fear", score: 0.7 },
        { label: "anger", score: 0.1 },
      ]);

      const result = await classifyEmotion("I'm scared");
      expect(result!.topEmotion).toBe("fear");
      expect(result!.confidence).toBe(0.7);
    });
  });

  describe("warmUpEmotionClassifier", () => {
    it("calls the classifier with test input", async () => {
      mockClassifier.mockResolvedValue([{ label: "neutral", score: 1.0 }]);
      await warmUpEmotionClassifier();
      expect(mockClassifier).toHaveBeenCalledWith("hello world");
    });
  });

  describe("isEmotionClassifierReady", () => {
    it("returns false initially", () => {
      expect(isEmotionClassifierReady()).toBe(false);
    });

    it("returns true after warm-up", async () => {
      mockClassifier.mockResolvedValue([{ label: "neutral", score: 1.0 }]);
      await warmUpEmotionClassifier();
      expect(isEmotionClassifierReady()).toBe(true);
    });
  });

  describe("disposeEmotionClassifier", () => {
    it("does nothing if not loaded", async () => {
      await disposeEmotionClassifier();
      expect(mockDispose).not.toHaveBeenCalled();
    });

    it("disposes the pipeline when loaded", async () => {
      mockClassifier.mockResolvedValue([{ label: "neutral", score: 1.0 }]);
      await warmUpEmotionClassifier();
      await disposeEmotionClassifier();
      expect(mockDispose).toHaveBeenCalled();
    });

    it("resets ready state after dispose", async () => {
      mockClassifier.mockResolvedValue([{ label: "neutral", score: 1.0 }]);
      await warmUpEmotionClassifier();
      expect(isEmotionClassifierReady()).toBe(true);
      await disposeEmotionClassifier();
      expect(isEmotionClassifierReady()).toBe(false);
    });
  });
});
