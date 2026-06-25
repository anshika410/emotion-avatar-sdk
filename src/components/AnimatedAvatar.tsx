import { useState, useEffect } from "react";
import { EmotionState } from "../types/emotion";
import { AvatarRenderer } from "./AvatarRenderer";
import { useAvatarController } from "../hooks/useAvatarController";

export interface AnimatedAvatarProps {
  /** Text from the AI/LLM for emotion analysis */
  aiMessage?: string;
  
  /** Text from the user for emotion analysis */
  userMessage?: string;
  
  /** Whether to enable automatic emotion detection */
  emotionDetection?: boolean;
  
  /** Whether to enable automatic animations */
  autoAnimate?: boolean;
  
  /** Speaking state from parent (TTS status) */
  isSpeaking?: boolean;
  
  /** Listening state from parent (STT status) */
  isListening?: boolean;
  
  /** Custom emotion state override (for manual control) */
  overrideEmotion?: EmotionState;
  
  /** Callback when avatar emotion changes */
  onEmotionChange?: (emotion: EmotionState, intensity: number) => void;
  
  /** Custom avatar images (optional) */
  customImages?: Partial<Record<EmotionState, string>>;
  
  /** Size of the avatar in pixels */
  size?: number;
  
  /** CSS class name for styling */
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
  customImages,
  size = 260,
  className = "",
}: AnimatedAvatarProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  const {
    emotionState,
    intensity,
    setEmotion,
    analyzeEmotion,
  } = useAvatarController({
    isSpeaking,
    isListening,
    onEmotionChange,
  });

  // Initialize on mount
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // Analyze AI message for emotion when it changes
  useEffect(() => {
    if (emotionDetection && aiMessage && isInitialized && autoAnimate) {
      // analyzeEmotion(aiMessage).then((detectedEmotion) => {
      //   setEmotion(detectedEmotion);
      // });
    }
  }, [aiMessage, emotionDetection, isInitialized, autoAnimate, analyzeEmotion, setEmotion]);

  // Analyze user message for emotion when it changes
  useEffect(() => {
    if (emotionDetection && userMessage && isInitialized && autoAnimate) {
      analyzeEmotion(userMessage).then((detectedEmotion: EmotionState) => {
        console.log(`[AnimatedAvatar] USER MESSAGE: ${userMessage}`);
        console.log(`[AnimatedAvatar] DETECTED RESPONSE: ${detectedEmotion}`);  
        setEmotion(detectedEmotion);
      });
    }
  }, [userMessage, emotionDetection, isInitialized, autoAnimate, analyzeEmotion, setEmotion]);

  // Handle manual emotion override
  useEffect(() => {
    if (overrideEmotion) {
      setEmotion(overrideEmotion);
    }
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
        customImages={customImages}
      />
    </div>
  );
}
