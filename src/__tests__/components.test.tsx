import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmotionState } from "../types/emotion";
import { AvatarRenderer } from "../components/AvatarRenderer";
import { AnimatedAvatar } from "../components/AnimatedAvatar";

// Mock services for AnimatedAvatar
vi.mock("../services/emotion/textSignals", () => ({
  extractTextSignalsWithML: vi.fn().mockResolvedValue({
    contentCompleteness: 0,
    sentimentValence: 0,
    modelEmotion: null,
    modelConfidence: 0,
    emotionScores: {},
  }),
}));

vi.mock("../services/emotion/emotionClassifier", () => ({
  warmUpEmotionClassifier: vi.fn(() => Promise.resolve()),
  disposeEmotionClassifier: vi.fn(() => Promise.resolve()),
  classifyEmotion: vi.fn(() => Promise.resolve(null)),
  isEmotionClassifierReady: vi.fn(() => false),
}));

const TEST_IMAGES: Record<EmotionState, string> = {
  [EmotionState.LISTEN]: "/test/listen.webp",
  [EmotionState.SPEAK_NEUTRAL]: "/test/speak.webp",
  [EmotionState.ENCOURAGE]: "/test/encourage.webp",
  [EmotionState.THINK]: "/test/think.webp",
  [EmotionState.CAUTION]: "/test/caution.webp",
  [EmotionState.CELEBRATE]: "/test/celebrate.webp",
};

describe("AvatarRenderer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders an img element with alt text", () => {
    render(
      <AvatarRenderer
        emotionState={EmotionState.LISTEN}
        intensity={0.5}
        size={260}
        emotionImages={TEST_IMAGES}
      />
    );
    const img = screen.getByAltText("Avatar");
    expect(img).toBeInTheDocument();
  });

  it("applies correct size styles", () => {
    render(
      <AvatarRenderer
        emotionState={EmotionState.LISTEN}
        intensity={0.5}
        size={300}
        emotionImages={TEST_IMAGES}
      />
    );
    const img = screen.getByAltText("Avatar");
    expect(img).toHaveStyle({ width: "300px", height: "300px" });
  });

  it("applies intensity-based opacity", () => {
    render(
      <AvatarRenderer
        emotionState={EmotionState.LISTEN}
        intensity={1.0}
        size={260}
        emotionImages={TEST_IMAGES}
      />
    );
    const img = screen.getByAltText("Avatar");
    // opacity = 0.6 + 0.4 * 1.0 = 1.0
    expect(img).toHaveStyle({ opacity: 1 });
  });

  it("applies intensity-based transform", () => {
    render(
      <AvatarRenderer
        emotionState={EmotionState.LISTEN}
        intensity={0.5}
        size={260}
        emotionImages={TEST_IMAGES}
      />
    );
    const img = screen.getByAltText("Avatar");
    // transform = scale(1 + 0.05 * 0.5) = scale(1.025)
    expect(img).toHaveStyle({ transform: "scale(1.025)" });
  });

  it("includes avatar-image class", () => {
    render(
      <AvatarRenderer
        emotionState={EmotionState.LISTEN}
        intensity={0.5}
        size={260}
        emotionImages={TEST_IMAGES}
      />
    );
    const img = screen.getByAltText("Avatar");
    expect(img).toHaveClass("avatar-image");
  });

  it("sets border-radius to 50%", () => {
    render(
      <AvatarRenderer
        emotionState={EmotionState.LISTEN}
        intensity={0.5}
        size={260}
        emotionImages={TEST_IMAGES}
      />
    );
    const img = screen.getByAltText("Avatar");
    expect(img).toHaveStyle({ borderRadius: "50%" });
  });
});

describe("AnimatedAvatar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing", () => {
    const { container } = render(<AnimatedAvatar />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders an img element", () => {
    render(<AnimatedAvatar />);
    const img = screen.getByAltText("Avatar");
    expect(img).toBeInTheDocument();
  });

  it("applies custom size", () => {
    const { container } = render(<AnimatedAvatar size={400} />);
    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv).toHaveStyle({ width: "400px", height: "400px" });
  });

  it("applies custom className", () => {
    const { container } = render(<AnimatedAvatar className="my-custom-class" />);
    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv).toHaveClass("my-custom-class");
  });

  it("uses default size of 260", () => {
    const { container } = render(<AnimatedAvatar />);
    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv).toHaveStyle({ width: "260px", height: "260px" });
  });

  it("container has correct flex layout styles", () => {
    const { container } = render(<AnimatedAvatar />);
    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv).toHaveStyle({
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    });
  });

  it("merges custom emotionImages with defaults", () => {
    const customImages = {
      [EmotionState.CELEBRATE]: "/custom/celebrate.webp",
    };
    render(<AnimatedAvatar emotionImages={customImages} />);
    // Should render without errors (images merged internally)
    const img = screen.getByAltText("Avatar");
    expect(img).toBeInTheDocument();
  });
});
