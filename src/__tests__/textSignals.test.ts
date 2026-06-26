import { describe, it, expect, vi } from "vitest";
import { extractTextSignals, extractTextSignalsWithML } from "../services/emotion/textSignals";

vi.mock("../services/emotion/emotionClassifier", () => ({
  classifyEmotion: vi.fn(),
}));

import { classifyEmotion } from "../services/emotion/emotionClassifier";
const mockClassifyEmotion = vi.mocked(classifyEmotion);

describe("extractTextSignals", () => {
  describe("contentCompleteness (STAR framework)", () => {
    it("returns 0 for empty string", () => {
      const result = extractTextSignals("");
      expect(result.contentCompleteness).toBe(0);
    });

    it("returns 0 for whitespace-only string", () => {
      const result = extractTextSignals("   ");
      expect(result.contentCompleteness).toBe(0);
    });

    it("detects SITUATION markers", () => {
      const result = extractTextSignals("The situation was complex");
      expect(result.contentCompleteness).toBe(0.25);
    });

    it("detects TASK markers", () => {
      const result = extractTextSignals("My task was to fix it");
      expect(result.contentCompleteness).toBe(0.25);
    });

    it("detects ACTION markers", () => {
      const result = extractTextSignals("I implemented a caching layer");
      expect(result.contentCompleteness).toBe(0.25);
    });

    it("detects RESULT markers", () => {
      const result = extractTextSignals("The result was a 50% improvement");
      expect(result.contentCompleteness).toBe(0.25);
    });

    it("detects all STAR components for score of 1.0", () => {
      const text =
        "The situation was a slow API. The task was to optimize it. I implemented caching. The result was a 3x improvement.";
      const result = extractTextSignals(text);
      expect(result.contentCompleteness).toBe(1.0);
    });

    it("detects partial STAR (2 components)", () => {
      const text = "The situation was dire. I built a solution.";
      const result = extractTextSignals(text);
      expect(result.contentCompleteness).toBe(0.5);
    });

    it("is case-insensitive", () => {
      const result = extractTextSignals("The SITUATION was complex");
      expect(result.contentCompleteness).toBe(0.25);
    });
  });

  describe("sentimentValence", () => {
    it("returns 0 for empty string", () => {
      const result = extractTextSignals("");
      expect(result.sentimentValence).toBe(0);
    });

    it("returns 0 for neutral text", () => {
      const result = extractTextSignals("the cat sat on the mat");
      expect(result.sentimentValence).toBe(0);
    });

    it("returns positive valence for positive words", () => {
      const result = extractTextSignals("great excellent awesome amazing");
      expect(result.sentimentValence).toBe(1);
    });

    it("returns negative valence for negative words", () => {
      const result = extractTextSignals("terrible awful horrible poor");
      expect(result.sentimentValence).toBe(-1);
    });

    it("returns balanced valence for mixed sentiment", () => {
      const result = extractTextSignals("great but terrible");
      expect(result.sentimentValence).toBe(0);
    });

    it("handles positive bias correctly", () => {
      // 3 positive, 1 negative => (3-1)/4 = 0.5
      const result = extractTextSignals("great excellent awesome but bad");
      expect(result.sentimentValence).toBe(0.5);
    });

    it("handles negative bias correctly", () => {
      // 1 positive, 3 negative => (1-3)/4 = -0.5
      const result = extractTextSignals("good but terrible awful horrible");
      expect(result.sentimentValence).toBe(-0.5);
    });
  });

  describe("ML fields default to empty", () => {
    it("modelEmotion is null", () => {
      const result = extractTextSignals("hello world");
      expect(result.modelEmotion).toBeNull();
    });

    it("modelConfidence is 0", () => {
      const result = extractTextSignals("hello world");
      expect(result.modelConfidence).toBe(0);
    });

    it("emotionScores is empty object", () => {
      const result = extractTextSignals("hello world");
      expect(result.emotionScores).toEqual({});
    });
  });
});

describe("extractTextSignalsWithML", () => {
  it("returns base signals with ML fields when classifier returns a result", async () => {
    mockClassifyEmotion.mockResolvedValue({
      topEmotion: "happiness",
      confidence: 0.92,
      scores: { happiness: 0.92, sadness: 0.03, anger: 0.01, fear: 0.01, surprise: 0.02, love: 0.01 } as any,
      inferenceMs: 42,
    });

    const result = await extractTextSignalsWithML("I am so happy today!");
    expect(result.modelEmotion).toBe("happiness");
    expect(result.modelConfidence).toBe(0.92);
    expect(result.emotionScores).toHaveProperty("happiness", 0.92);
    // Rule-based fields should still work
    expect(result.contentCompleteness).toBe(0);
  });

  it("returns base signals when classifier returns null", async () => {
    mockClassifyEmotion.mockResolvedValue(null);

    const result = await extractTextSignalsWithML("hello");
    expect(result.modelEmotion).toBeNull();
    expect(result.modelConfidence).toBe(0);
    expect(result.emotionScores).toEqual({});
  });

  it("preserves rule-based analysis alongside ML results", async () => {
    mockClassifyEmotion.mockResolvedValue({
      topEmotion: "sadness",
      confidence: 0.85,
      scores: { sadness: 0.85, happiness: 0.05 } as any,
      inferenceMs: 30,
    });

    const text = "The situation was terrible and awful";
    const result = await extractTextSignalsWithML(text);
    // Rule-based: SITUATION marker detected
    expect(result.contentCompleteness).toBe(0.25);
    // Rule-based: negative sentiment
    expect(result.sentimentValence).toBe(-1);
    // ML fields
    expect(result.modelEmotion).toBe("sadness");
    expect(result.modelConfidence).toBe(0.85);
  });
});
