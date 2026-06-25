import { useState, useEffect } from "react";
import { EmotionState } from "../types/emotion";
import { AvatarRenderer } from "./AvatarRenderer";
import { useAvatarController } from "../hooks/useAvatarController";
import { DEFAULT_AVATAR_IMAGES } from "../constants/defaultImages";

export interface AnimatedAvatarProps {
  aiMessage?: string;
  userMessage?: string;
  emotionDetection?: boolean;
  autoAnimate?: boolean;
  isSpeaking?: boolean;
  isListening?: boolean;
  overrideEmotion?: EmotionState;
  onEmotionChange?: (emotion: EmotionState, intensity: number) => void;
  /** Override individual or all avatar image paths. Merged with DEFAULT_AVATAR_IMAGES. */
  emotionImages?: Partial<Record<EmotionState, string>>;
  size?: number;
  className?: string;
}

export function AnimatedAvatar({
  aiMessage = "",
  userMessage = "",
  emotionDetection = true,
  autoAnimate = true,
  isSpeaking = false,
  isListening = false,
  overrideEmotion,
  onEmotionChange,
  emotionImages,
  size = 260,
  className = "",
}: AnimatedAvatarProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  // Merge consumer overrides on top of defaults
  const resolvedImages: Record<EmotionState, string> = {
    ...DEFAULT_AVATAR_IMAGES,
    ...emotionImages,
  };

  const { emotionState, intensity, setEmotion, analyzeEmotion } =
    useAvatarController({ isSpeaking, isListening, onEmotionChange });

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (emotionDetection && aiMessage && isInitialized && autoAnimate) {
      analyzeEmotion(aiMessage).then((detected) => setEmotion(detected));
    }
  }, [aiMessage, emotionDetection, isInitialized, autoAnimate, analyzeEmotion, setEmotion]);

  useEffect(() => {
    if (emotionDetection && userMessage && isInitialized && autoAnimate) {
      analyzeEmotion(userMessage).then((detected: EmotionState) => setEmotion(detected));
    }
  }, [userMessage, emotionDetection, isInitialized, autoAnimate, analyzeEmotion, setEmotion]);

  useEffect(() => {
    if (overrideEmotion) setEmotion(overrideEmotion);
  }, [overrideEmotion, setEmotion]);

  const containerStyle: React.CSSProperties = {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: size,
    height: size,
  };

  return (
    <div className={className} style={containerStyle}>
      <AvatarRenderer
        emotionState={emotionState}
        intensity={intensity}
        size={size}
        emotionImages={resolvedImages}
      />
    </div>
  );
}