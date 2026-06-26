import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { EmotionState } from "../types/emotion";

vi.mock("../services/emotion/textSignals", () => ({
  extractTextSignalsWithML: vi.fn(),
}));

import { extractTextSignalsWithML } from "../services/emotion/textSignals";
import { useAvatarController } from "../hooks/useAvatarController";

const mockExtractTextSignalsWithML = vi.mocked(extractTextSignalsWithML);

describe("useAvatarController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("starts with LISTEN emotion and 0.3 intensity", () => {
      const { result } = renderHook(() =>
        useAvatarController({ isSpeaking: false, isListening: false })
      );
      expect(result.current.emotionState).toBe(EmotionState.LISTEN);
      expect(result.current.intensity).toBe(0.3);
    });
  });

  describe("setEmotion", () => {
    it("updates emotion state", () => {
      const { result } = renderHook(() => useAvatarController({}));
      act(() => {
        result.current.setEmotion(EmotionState.CELEBRATE);
      });
      expect(result.current.emotionState).toBe(EmotionState.CELEBRATE);
    });

    it("sets intensity to 0.8", () => {
      const { result } = renderHook(() => useAvatarController({}));
      act(() => {
        result.current.setEmotion(EmotionState.THINK);
      });
      expect(result.current.intensity).toBe(0.8);
    });

    it("calls onEmotionChange callback", () => {
      const onEmotionChange = vi.fn();
      const { result } = renderHook(() =>
        useAvatarController({ onEmotionChange })
      );
      act(() => {
        result.current.setEmotion(EmotionState.ENCOURAGE);
      });
      expect(onEmotionChange).toHaveBeenCalledWith(EmotionState.ENCOURAGE, 0.8);
    });
  });

  describe("speaking/listening effects", () => {
    it("sets SPEAK_NEUTRAL when isSpeaking is true", () => {
      const { result } = renderHook(() =>
        useAvatarController({ isSpeaking: true, isListening: false })
      );
      expect(result.current.emotionState).toBe(EmotionState.SPEAK_NEUTRAL);
      expect(result.current.intensity).toBe(0.7);
    });

    it("sets LISTEN when isListening is true", () => {
      const { result } = renderHook(() =>
        useAvatarController({ isSpeaking: false, isListening: true })
      );
      expect(result.current.emotionState).toBe(EmotionState.LISTEN);
      expect(result.current.intensity).toBe(0.5);
    });

    it("isSpeaking takes priority over isListening", () => {
      const { result } = renderHook(() =>
        useAvatarController({ isSpeaking: true, isListening: true })
      );
      expect(result.current.emotionState).toBe(EmotionState.SPEAK_NEUTRAL);
    });
  });

  describe("analyzeEmotion", () => {
    it("returns LISTEN for empty text", async () => {
      const { result } = renderHook(() => useAvatarController({}));
      let emotion: EmotionState;
      await act(async () => {
        emotion = await result.current.analyzeEmotion("");
      });
      expect(emotion!).toBe(EmotionState.LISTEN);
    });

    it("returns LISTEN for whitespace-only text", async () => {
      const { result } = renderHook(() => useAvatarController({}));
      let emotion: EmotionState;
      await act(async () => {
        emotion = await result.current.analyzeEmotion("   ");
      });
      expect(emotion!).toBe(EmotionState.LISTEN);
    });

    it("maps happiness to ENCOURAGE", async () => {
      mockExtractTextSignalsWithML.mockResolvedValue({
        contentCompleteness: 0,
        sentimentValence: 0.5,
        modelEmotion: "happiness",
        modelConfidence: 0.9,
        emotionScores: { happiness: 0.9 },
      });

      const { result } = renderHook(() => useAvatarController({}));
      let emotion: EmotionState;
      await act(async () => {
        emotion = await result.current.analyzeEmotion("I'm so happy!");
      });
      expect(emotion!).toBe(EmotionState.ENCOURAGE);
    });

    it("maps love to ENCOURAGE", async () => {
      mockExtractTextSignalsWithML.mockResolvedValue({
        contentCompleteness: 0,
        sentimentValence: 0.5,
        modelEmotion: "love",
        modelConfidence: 0.85,
        emotionScores: { love: 0.85 },
      });

      const { result } = renderHook(() => useAvatarController({}));
      let emotion: EmotionState;
      await act(async () => {
        emotion = await result.current.analyzeEmotion("I love you");
      });
      expect(emotion!).toBe(EmotionState.ENCOURAGE);
    });

    it("maps desire to ENCOURAGE", async () => {
      mockExtractTextSignalsWithML.mockResolvedValue({
        contentCompleteness: 0,
        sentimentValence: 0,
        modelEmotion: "desire",
        modelConfidence: 0.8,
        emotionScores: { desire: 0.8 },
      });

      const { result } = renderHook(() => useAvatarController({}));
      let emotion: EmotionState;
      await act(async () => {
        emotion = await result.current.analyzeEmotion("I want this so much");
      });
      expect(emotion!).toBe(EmotionState.ENCOURAGE);
    });

    it("maps anger to CAUTION", async () => {
      mockExtractTextSignalsWithML.mockResolvedValue({
        contentCompleteness: 0,
        sentimentValence: -0.5,
        modelEmotion: "anger",
        modelConfidence: 0.88,
        emotionScores: { anger: 0.88 },
      });

      const { result } = renderHook(() => useAvatarController({}));
      let emotion: EmotionState;
      await act(async () => {
        emotion = await result.current.analyzeEmotion("I'm furious!");
      });
      expect(emotion!).toBe(EmotionState.CAUTION);
    });

    it("maps fear to CAUTION", async () => {
      mockExtractTextSignalsWithML.mockResolvedValue({
        contentCompleteness: 0,
        sentimentValence: -0.3,
        modelEmotion: "fear",
        modelConfidence: 0.75,
        emotionScores: { fear: 0.75 },
      });

      const { result } = renderHook(() => useAvatarController({}));
      let emotion: EmotionState;
      await act(async () => {
        emotion = await result.current.analyzeEmotion("I'm scared");
      });
      expect(emotion!).toBe(EmotionState.CAUTION);
    });

    it("maps sadness to CAUTION", async () => {
      mockExtractTextSignalsWithML.mockResolvedValue({
        contentCompleteness: 0,
        sentimentValence: -0.6,
        modelEmotion: "sadness",
        modelConfidence: 0.9,
        emotionScores: { sadness: 0.9 },
      });

      const { result } = renderHook(() => useAvatarController({}));
      let emotion: EmotionState;
      await act(async () => {
        emotion = await result.current.analyzeEmotion("I'm so sad");
      });
      expect(emotion!).toBe(EmotionState.CAUTION);
    });

    it("maps disgust to CAUTION", async () => {
      mockExtractTextSignalsWithML.mockResolvedValue({
        contentCompleteness: 0,
        sentimentValence: -0.4,
        modelEmotion: "disgust",
        modelConfidence: 0.7,
        emotionScores: { disgust: 0.7 },
      });

      const { result } = renderHook(() => useAvatarController({}));
      let emotion: EmotionState;
      await act(async () => {
        emotion = await result.current.analyzeEmotion("That's disgusting");
      });
      expect(emotion!).toBe(EmotionState.CAUTION);
    });

    it("maps shame to CAUTION", async () => {
      mockExtractTextSignalsWithML.mockResolvedValue({
        contentCompleteness: 0,
        sentimentValence: -0.3,
        modelEmotion: "shame",
        modelConfidence: 0.65,
        emotionScores: { shame: 0.65 },
      });

      const { result } = renderHook(() => useAvatarController({}));
      let emotion: EmotionState;
      await act(async () => {
        emotion = await result.current.analyzeEmotion("I feel ashamed");
      });
      expect(emotion!).toBe(EmotionState.CAUTION);
    });

    it("maps guilt to CAUTION", async () => {
      mockExtractTextSignalsWithML.mockResolvedValue({
        contentCompleteness: 0,
        sentimentValence: -0.4,
        modelEmotion: "guilt",
        modelConfidence: 0.72,
        emotionScores: { guilt: 0.72 },
      });

      const { result } = renderHook(() => useAvatarController({}));
      let emotion: EmotionState;
      await act(async () => {
        emotion = await result.current.analyzeEmotion("I feel so guilty");
      });
      expect(emotion!).toBe(EmotionState.CAUTION);
    });

    it("maps sarcasm to CAUTION", async () => {
      mockExtractTextSignalsWithML.mockResolvedValue({
        contentCompleteness: 0,
        sentimentValence: 0,
        modelEmotion: "sarcasm",
        modelConfidence: 0.7,
        emotionScores: { sarcasm: 0.7 },
      });

      const { result } = renderHook(() => useAvatarController({}));
      let emotion: EmotionState;
      await act(async () => {
        emotion = await result.current.analyzeEmotion("Oh great, just great");
      });
      expect(emotion!).toBe(EmotionState.CAUTION);
    });

    it("maps surprise to THINK", async () => {
      mockExtractTextSignalsWithML.mockResolvedValue({
        contentCompleteness: 0,
        sentimentValence: 0,
        modelEmotion: "surprise",
        modelConfidence: 0.8,
        emotionScores: { surprise: 0.8 },
      });

      const { result } = renderHook(() => useAvatarController({}));
      let emotion: EmotionState;
      await act(async () => {
        emotion = await result.current.analyzeEmotion("Wow, really?!");
      });
      expect(emotion!).toBe(EmotionState.THINK);
    });

    it("maps confusion to THINK", async () => {
      mockExtractTextSignalsWithML.mockResolvedValue({
        contentCompleteness: 0,
        sentimentValence: 0,
        modelEmotion: "confusion",
        modelConfidence: 0.75,
        emotionScores: { confusion: 0.75 },
      });

      const { result } = renderHook(() => useAvatarController({}));
      let emotion: EmotionState;
      await act(async () => {
        emotion = await result.current.analyzeEmotion("I don't understand");
      });
      expect(emotion!).toBe(EmotionState.THINK);
    });

    it("falls back to ENCOURAGE for positive sentiment when no ML emotion", async () => {
      mockExtractTextSignalsWithML.mockResolvedValue({
        contentCompleteness: 0,
        sentimentValence: 0.5,
        modelEmotion: null,
        modelConfidence: 0,
        emotionScores: {},
      });

      const { result } = renderHook(() => useAvatarController({}));
      let emotion: EmotionState;
      await act(async () => {
        emotion = await result.current.analyzeEmotion("great excellent awesome");
      });
      expect(emotion!).toBe(EmotionState.ENCOURAGE);
    });

    it("falls back to CAUTION for negative sentiment when no ML emotion", async () => {
      mockExtractTextSignalsWithML.mockResolvedValue({
        contentCompleteness: 0,
        sentimentValence: -0.5,
        modelEmotion: null,
        modelConfidence: 0,
        emotionScores: {},
      });

      const { result } = renderHook(() => useAvatarController({}));
      let emotion: EmotionState;
      await act(async () => {
        emotion = await result.current.analyzeEmotion("terrible awful horrible");
      });
      expect(emotion!).toBe(EmotionState.CAUTION);
    });

    it("falls back to LISTEN for neutral sentiment when no ML emotion", async () => {
      mockExtractTextSignalsWithML.mockResolvedValue({
        contentCompleteness: 0,
        sentimentValence: 0,
        modelEmotion: null,
        modelConfidence: 0,
        emotionScores: {},
      });

      const { result } = renderHook(() => useAvatarController({}));
      let emotion: EmotionState;
      await act(async () => {
        emotion = await result.current.analyzeEmotion("the cat sat on the mat");
      });
      expect(emotion!).toBe(EmotionState.LISTEN);
    });

    it("returns LISTEN on error", async () => {
      mockExtractTextSignalsWithML.mockRejectedValue(new Error("Model failed"));

      const { result } = renderHook(() => useAvatarController({}));
      let emotion: EmotionState;
      await act(async () => {
        emotion = await result.current.analyzeEmotion("some text");
      });
      expect(emotion!).toBe(EmotionState.LISTEN);
    });
  });
});
