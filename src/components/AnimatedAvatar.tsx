import { useEffect, useRef } from "react";
import { EmotionState } from "../types/emotion";
import { AvatarRenderer } from "./AvatarRenderer";
import { useAvatarController } from "../hooks/useAvatarController";

export interface AnimatedAvatarProps {
  aiMessage?: string;
  userMessageInterim?: string;
  userMessageFinal?: string;
  isSpeaking?: boolean;
  isListening?: boolean;
  onInitialized?: (isInitialized: boolean) => void;
  /** CSS class for the outer wrapper (layout container) */
  containerClassName?: string;
  /** CSS class for the avatar image (optional) */
  avatarClassName?: string;
  /** Inline styles for the avatar image (merged with default) */
  style?: React.CSSProperties;
}

export function AnimatedAvatar({
  aiMessage = "",
  userMessageInterim = "",
  userMessageFinal = "",
  isSpeaking = false,
  isListening = false,
  onInitialized,
  containerClassName,
  avatarClassName,
  style,
}: AnimatedAvatarProps) {
  const {
    emotionId,
    setEmotion,
    analyzeEmotion,
    isInitialized,
  } = useAvatarController({
    isSpeaking,
    isListening,
  });

  const lastInterimText = useRef("");

  useEffect(() => {
    onInitialized?.(isInitialized);
  }, [isInitialized, onInitialized]);

  useEffect(() => {
    if (aiMessage && isInitialized && isSpeaking) {
      setEmotion(EmotionState.SPEAK_NEUTRAL);
    }
  }, [aiMessage, isInitialized, analyzeEmotion, setEmotion]);

  useEffect(() => {
    if (!userMessageInterim || !isInitialized) return;

    const trimmedInterim = userMessageInterim.trim();
    const wordCount = trimmedInterim.split(/\s+/).length;
    const charCount = trimmedInterim.length;
    const hasMeaningfulLength = wordCount > 3 || charCount > 20;

    if (hasMeaningfulLength && trimmedInterim !== lastInterimText.current) {
      lastInterimText.current = trimmedInterim;
      analyzeEmotion(trimmedInterim).then((detected: string) => {
        setEmotion(detected);
      });
    }
  }, [userMessageInterim, isInitialized, analyzeEmotion, setEmotion]);


  useEffect(() => {
    if (!userMessageFinal || !isInitialized) return;

    const processFinalEmotion = async () => {
      const detected = await analyzeEmotion(userMessageFinal);
      setEmotion(detected);
    };

    processFinalEmotion();
  }, [userMessageFinal, isInitialized, analyzeEmotion, setEmotion]);

  // Loading state
  if (!isInitialized) {
    const loadingSize = 260; // fallback size
    return (
      <div
        className={containerClassName}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: loadingSize,
            height: loadingSize,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #e0e0e0 40%, #f8f8f8 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 1px 8px rgba(82,82,82,0.06)",
          }}
        >
          <div
            style={{
              width: loadingSize * 0.32,
              height: loadingSize * 0.32,
              border: `${Math.max(2, loadingSize * 0.036)}px solid #9993`,
              borderTop: `${Math.max(2, loadingSize * 0.036)}px solid #4f9eed`,
              borderRadius: "50%",
              animation: "avatar-spin 1s linear infinite",
              boxSizing: "border-box",
            }}
          />
          <style>
            {`
              @keyframes avatar-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      </div>
    );
  }

  // Main rendering
  return (
    <div className={containerClassName}>
      <AvatarRenderer
        emotionId={emotionId}
        className={avatarClassName}
        style={style}
      />
    </div>
  );
}