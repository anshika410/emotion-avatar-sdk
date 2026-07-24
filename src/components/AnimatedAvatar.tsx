import { useEffect, useRef } from "react";
import { EmotionState, type EmotionDebugInfo } from "../types/emotion";
import { AvatarRenderer } from "./AvatarRenderer";
import { useAvatarController } from "../hooks/useAvatarController";
import { resetEmotionProcessing } from "../services/emotion/textSignals";

export interface AnimatedAvatarProps {
  aiMessage?: string;
  userMessageInterim?: string;
  userMessageFinal?: string;
  isSpeaking?: boolean;
  isListening?: boolean;
  onInitialized?: (isInitialized: boolean) => void;
  onEmotionDebug?: (info: EmotionDebugInfo) => void;
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
  onEmotionDebug,
  containerClassName,
  avatarClassName,
  style,
}: AnimatedAvatarProps) {
  const {
    emotionState,
    setEmotion,
    analyzeEmotionDetails,
    isInitialized,
    resolvedBlobImages,
  } = useAvatarController({
    isSpeaking,
    isListening,
  });

  const interimResetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finalResetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    onInitialized?.(isInitialized);
  }, [isInitialized, onInitialized]);

  useEffect(() => {
    if (aiMessage && isInitialized && isSpeaking) {
      setEmotion(EmotionState.SPEAK_NEUTRAL);
    }
  }, [aiMessage, isInitialized, setEmotion, isSpeaking]);

  useEffect(() => {
    if (!userMessageInterim || !isInitialized) return;

    const wordCount = userMessageInterim.trim().split(/\s+/).length;
    const charCount = userMessageInterim.length;

    if (wordCount > 3 || charCount > 20) {
      analyzeEmotionDetails(userMessageInterim).then((details) => {
        if (!details) return;
        setEmotion(details.state);
        onEmotionDebug?.(details);
      });
    }

    // Restart inactivity timer
    if (interimResetTimeout.current) {
      clearTimeout(interimResetTimeout.current);
    }

    interimResetTimeout.current = setTimeout(() => {
      resetEmotionProcessing();
    }, 5000);

    return () => {
      if (interimResetTimeout.current) {
        clearTimeout(interimResetTimeout.current);
      }
    };

  }, [userMessageInterim, isInitialized, analyzeEmotionDetails, setEmotion, onEmotionDebug]);


  useEffect(() => {
    if (!userMessageFinal || !isInitialized) return;

    const processFinalEmotion = async () => {
      const detected = await analyzeEmotionDetails(userMessageFinal);

      if (!detected) return;

      // Display the detected emotion
      setEmotion(detected.state);
      onEmotionDebug?.(detected);

      // Clear any previous final reset timeout
      if (finalResetTimeout.current) {
        clearTimeout(finalResetTimeout.current);
      }

      // Delay the reset by 1 second so the user can see the final emotion
      finalResetTimeout.current = setTimeout(() => {
        resetEmotionProcessing();
      }, 1000);
    };

    processFinalEmotion();

    return () => {
      if (finalResetTimeout.current) {
        clearTimeout(finalResetTimeout.current);
      }
    };
  }, [userMessageFinal, isInitialized, analyzeEmotionDetails, setEmotion, onEmotionDebug]);

  // Loading state
  if (!isInitialized || !resolvedBlobImages) {
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
        emotionState={emotionState}
        emotionImages={resolvedBlobImages}
        className={avatarClassName}
        style={style}
      />
    </div>
  );
}