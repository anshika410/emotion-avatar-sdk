import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { EmotionState } from "../types/emotion";

vi.mock("../services/emotion/textSignals", () => ({
  extractTextSignalsWithML: vi.fn(),
}));

vi.mock("../services/emotion/emotionClassifier", () => ({
  warmUpEmotionClassifier: vi.fn(() => Promise.resolve()),
  disposeEmotionClassifier: vi.fn(() => Promise.resolve()),
}));

import { extractTextSignalsWithML } from "../services/emotion/textSignals";
import { useEmotionController } from "../hooks/useEmotionController";

const mockExtractTextSignalsWithML = vi.mocked(extractTextSignalsWithML);

describe("useEmotionController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock performance.now for debounce testing
    vi.spyOn(performance, "now").mockReturnValue(0);
  });

  describe("initial state", () => {
    it("starts with LISTEN emotion and 0.3 intensity", () => {
      const { result } = renderHook(() =>
        useEmotionController({})
      );
      expect(result.current.emotionState).toBe(EmotionState.LISTEN);
      expect(result.current.intensity).toBe(0.3);
    });

    it("returns analyzeText function", () => {
      const { result } = renderHook(() =>
        useEmotionController({})
      );
      expect(typeof result.current.analyzeText).toBe("function");
    });
  });

  describe("speaking/listening effects", () => {
    it("sets SPEAK_NEUTRAL when isSpeaking is true", () => {
      const { result } = renderHook(() =>
        useEmotionController({ isSpeaking: true })
      );
      expect(result.current.emotionState).toBe(EmotionState.SPEAK_NEUTRAL);
      expect(result.current.intensity).toBe(0.7);
    });

    it("sets LISTEN when isListening is true", () => {
      const { result } = renderHook(() =>
        useEmotionController({ isListening: true })
      );
      expect(result.current.emotionState).toBe(EmotionState.LISTEN);
      expect(result.current.intensity).toBe(0.5);
    });

    it("isSpeaking takes priority over isListening", () => {
      const { result } = renderHook(() =>
        useEmotionController({ isSpeaking: true, isListening: true })
      );
      expect(result.current.emotionState).toBe(EmotionState.SPEAK_NEUTRAL);
    });
  });

  describe("analyzeText", () => {
    it("returns LISTEN with 0.3 intensity for empty text", async () => {
      const { result } = renderHook(() => useEmotionController({}));
      let output: { state: EmotionState; intensity: number };
      await act(async () => {
        output = await result.current.analyzeText("");
      });
      expect(output!.state).toBe(EmotionState.LISTEN);
      expect(output!.intensity).toBe(0.3);
    });

    it("returns LISTEN with 0.3 intensity for whitespace-only text", async () => {
      const { result } = renderHook(() => useEmotionController({}));
      let output: { state: EmotionState; intensity: number };
      await act(async () => {
        output = await result.current.analyzeText("   ");
      });
      expect(output!.state).toBe(EmotionState.LISTEN);
      expect(output!.intensity).toBe(0.3);
    });

    it("maps happiness to ENCOURAGE with 0.8 intensity", async () => {
      mockExtractTextSignalsWithML.mockResolvedValue({
        contentCompleteness: 0,
        sentimentValence: 0.5,
        modelEmotion: "happiness",
        modelConfidence: 0.9,
        emotionScores: { happiness: 0.9 },
      });

      const { result } = renderHook(() => useEmotionController({}));
      let output: { state: EmotionState; intensity: number };
      await act(async () => {
        output = await result.current.analyzeText("I'm so happy!");
      });
      expect(output!.state).toBe(EmotionState.ENCOURAGE);
      expect(output!.intensity).toBe(0.8);
    });

    it("maps love to ENCOURAGE with 0.8 intensity", async () => {
      mockExtractTextSignalsWithML.mockResolvedValue({
        contentCompleteness: 0,
        sentimentValence: 0.5,
        modelEmotion: "love",
        modelConfidence: 0.85,
        emotionScores: { love: 0.85 },
      });

      const { result } = renderHook(() => useEmotionController({}));
      let output: { state: EmotionState; intensity: number };
      await act(async () => {
        output = await result.current.analyzeText("I love you");
      });
      expect(output!.state).toBe(EmotionState.ENCOURAGE);
      expect(output!.intensity).toBe(0.8);
    });

    it("maps anger to CAUTION with 0.7 intensity", async () => {
      mockExtractTextSignalsWithML.mockResolvedValue({
        contentCompleteness: 0,
        sentimentValence: -0.5,
        modelEmotion: "anger",
        modelConfidence: 0.88,
        emotionScores: { anger: 0.88 },
      });

      const { result } = renderHook(() => useEmotionController({}));
      let output: { state: EmotionState; intensity: number };
      await act(async () => {
        output = await result.current.analyzeText("I'm furious!");
      });
      expect(output!.state).toBe(EmotionState.CAUTION);
      expect(output!.intensity).toBe(0.7);
    });

    it("maps surprise to THINK with 0.6 intensity", async () => {
      mockExtractTextSignalsWithML.mockResolvedValue({
        contentCompleteness: 0,
        sentimentValence: 0,
        modelEmotion: "surprise",
        modelConfidence: 0.8,
        emotionScores: { surprise: 0.8 },
      });

      const { result } = renderHook(() => useEmotionController({}));
      let output: { state: EmotionState; intensity: number };
      await act(async () => {
        output = await result.current.analyzeText("Wow!");
      });
      expect(output!.state).toBe(EmotionState.THINK);
      expect(output!.intensity).toBe(0.6);
    });

    it("maps sarcasm to CAUTION with 0.4 intensity", async () => {
      mockExtractTextSignalsWithML.mockResolvedValue({
        contentCompleteness: 0,
        sentimentValence: 0,
        modelEmotion: "sarcasm",
        modelConfidence: 0.7,
        emotionScores: { sarcasm: 0.7 },
      });

      const { result } = renderHook(() => useEmotionController({}));
      let output: { state: EmotionState; intensity: number };
      await act(async () => {
        output = await result.current.analyzeText("Oh great");
      });
      expect(output!.state).toBe(EmotionState.CAUTION);
      expect(output!.intensity).toBe(0.4);
    });

    it("falls back to ENCOURAGE for positive sentiment when no ML result", async () => {
      mockExtractTextSignalsWithML.mockResolvedValue({
        contentCompleteness: 0,
        sentimentValence: 0.5,
        modelEmotion: null,
        modelConfidence: 0,
        emotionScores: {},
      });

      const { result } = renderHook(() => useEmotionController({}));
      let output: { state: EmotionState; intensity: number };
      await act(async () => {
        output = await result.current.analyzeText("great awesome");
      });
      expect(output!.state).toBe(EmotionState.ENCOURAGE);
      expect(output!.intensity).toBe(0.7);
    });

    it("falls back to CAUTION for negative sentiment when no ML result", async () => {
      mockExtractTextSignalsWithML.mockResolvedValue({
        contentCompleteness: 0,
        sentimentValence: -0.5,
        modelEmotion: null,
        modelConfidence: 0,
        emotionScores: {},
      });

      const { result } = renderHook(() => useEmotionController({}));
      let output: { state: EmotionState; intensity: number };
      await act(async () => {
        output = await result.current.analyzeText("terrible awful");
      });
      expect(output!.state).toBe(EmotionState.CAUTION);
      expect(output!.intensity).toBe(0.6);
    });

    it("returns LISTEN on error", async () => {
      mockExtractTextSignalsWithML.mockRejectedValue(new Error("Model failed"));

      const { result } = renderHook(() => useEmotionController({}));
      let output: { state: EmotionState; intensity: number };
      await act(async () => {
        output = await result.current.analyzeText("some text");
      });
      expect(output!.state).toBe(EmotionState.LISTEN);
      expect(output!.intensity).toBe(0.3);
    });
  });
});
