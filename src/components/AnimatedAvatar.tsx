import { useEffect } from "react";
import { EmotionState } from "../types/emotion";
import { AvatarRenderer } from "./AvatarRenderer";
import { useAvatarController } from "../hooks/useAvatarController";
import { resetEmotionProcessing } from "../services/emotion/textSignals";

export interface AnimatedAvatarProps {
  aiMessage?: string;
  userMessageInterim?: string;
  userMessageFinal?: string;
  emotionDetection?: boolean;
  autoAnimate?: boolean;
  isSpeaking?: boolean;
  isListening?: boolean;
  overrideEmotion?: EmotionState;
  onEmotionChange?: (emotion: EmotionState) => void;
  /** Override individual or all avatar image paths. Merged with DEFAULT_AVATAR_IMAGES. */
  emotionImages?: Partial<Record<EmotionState, string>>;
  onInitialized?: (isInitialized: boolean) => void;
  size?: number;
  className?: string;
}

export function AnimatedAvatar({
  aiMessage = "",
  userMessageInterim = "",
  userMessageFinal = "",
  emotionDetection = true,
  autoAnimate = true,
  isSpeaking = false,
  isListening = false,
  overrideEmotion,
  onEmotionChange,
  emotionImages,
  onInitialized,
  size = 260,
  className = "",
}: AnimatedAvatarProps) {
  const {
    emotionState,
    setEmotion,
    analyzeEmotion,
    isInitialized,
    resolvedBlobImages,
  } = useAvatarController({
    isSpeaking,
    isListening,
    onEmotionChange,
    emotionImages,
  });

  // Logging all params for debugging purposes
  // useEffect(() => {
  //   console.log("[AnimatedAvatar]\nProps:\nisSpeaking:", isSpeaking, "\nisListening:", isListening, "\noverrideEmotion:", overrideEmotion, "\nemotionDetection:", emotionDetection, "\nautoAnimate:", autoAnimate, );
  // }, [emotionDetection, autoAnimate, isSpeaking, isListening, overrideEmotion]);

  useEffect(() => {
    onInitialized?.(isInitialized);
  }, [isInitialized, onInitialized]);

  // Future enhancement when model accuracy improves: analyze AI message for emotion when speaking, and user messages when listening
  useEffect(() => {
    if (emotionDetection && aiMessage && isInitialized && autoAnimate && isSpeaking) {
      // analyzeEmotion(aiMessage).then((detected) => setEmotion(detected));
      setEmotion(EmotionState.SPEAK_NEUTRAL);
    }
  }, [
    aiMessage,
    emotionDetection,
    isInitialized,
    autoAnimate,
    analyzeEmotion,
    setEmotion,
  ]);

  useEffect(() => {
    if (emotionDetection && userMessageInterim && isInitialized && autoAnimate) {
      console.log("\n");
      // count the number of words and characters in the interim transcript
      const wordCount = userMessageInterim.trim().split(/\s+/).length;
      const charCount = userMessageInterim.length;
      console.log(`[AnimatedAvatar] Interim Transcript Word Count: ${wordCount}, Character Count: ${charCount}`);
      if (wordCount > 3 || charCount > 20) {
        analyzeEmotion(userMessageInterim).then((detected: EmotionState) => setEmotion(detected));
      }
    }
  }, [
    userMessageInterim,
    emotionDetection,
    isInitialized,
    autoAnimate,
    analyzeEmotion,
    setEmotion,
  ]);


  useEffect(() => {
    if (emotionDetection && userMessageFinal && isInitialized && autoAnimate) {
      console.log("\n");

      console.log("[AnimatedAvatar] Final Transcript");
      analyzeEmotion(userMessageFinal).then((detected: EmotionState) => setEmotion(detected));
      // reset 
      setTimeout(() => {
        resetEmotionProcessing();
      }, 1000);
    }
  }, [
    userMessageFinal,
    emotionDetection,
    isInitialized,
    autoAnimate,
    analyzeEmotion,
    setEmotion,
  ]);


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

  if (!isInitialized || !resolvedBlobImages)
    return (
      <div className={className} style={containerStyle}>
        <div
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #e0e0e0 40%, #f8f8f8 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            boxShadow: "0 1px 8px rgba(82,82,82,0.06)",
          }}
        >
          <div
            style={{
              width: size * 0.32,
              height: size * 0.32,
              border: `${Math.max(2, size * 0.036)}px solid #9993`,
              borderTop: `${Math.max(2, size * 0.036)}px solid #4f9eed`,
              borderRadius: "50%",
              animation: "avatar-spin 1s linear infinite",
              boxSizing: "border-box",
            }}
          />
          <style>
            {`
        @keyframes avatar-spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}
          </style>
        </div>
      </div>
    ); // or a loader



  return (
    <div className={className} style={containerStyle}>
      <AvatarRenderer
        emotionState={emotionState}
        size={size}
        emotionImages={resolvedBlobImages}
      />
    </div>
  );
}