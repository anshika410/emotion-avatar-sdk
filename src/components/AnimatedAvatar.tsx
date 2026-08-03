// emotion-sdk-v0.1.2\src\components\AnimatedAvatar.tsx
import { useEffect, useRef } from "react";
import { AvatarRenderer } from "./AvatarRenderer";
import {
  useAvatarController,
  type EmotionDebugInfo,
} from "../hooks/useAvatarController";
import { resetEmotionProcessing } from "../services/emotion/emotionStreamProcessor";
import { BASE_MASCOT_ASSETS } from "../constants/emotionAssets";

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
  const { emotionId, setEmotion, analyzeEmotion, isInitialized } =
    useAvatarController({
      isSpeaking,
      isListening,
      onEmotionDebug,
    });

  const interimResetTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const finalResetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aiResetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    onInitialized?.(isInitialized);
  }, [isInitialized, onInitialized]);

  // AI Message: Analyzed when complete AI sentence arrives, returns to neutral after 3.5s pause
  useEffect(() => {
    if (!aiMessage || !isInitialized || !isSpeaking) return;

    analyzeEmotion(aiMessage, true).then((detected: string) => {
      if (detected) setEmotion(detected);

      if (aiResetTimeout.current) clearTimeout(aiResetTimeout.current);
      aiResetTimeout.current = setTimeout(() => {
        setEmotion("neutral");
      }, 1000);
    });

    return () => {
      if (aiResetTimeout.current) clearTimeout(aiResetTimeout.current);
    };
  }, [aiMessage, isInitialized, isSpeaking, analyzeEmotion, setEmotion]);

  useEffect(() => {
    if (!userMessageInterim || !isInitialized) return;

    const wordCount = userMessageInterim.trim().split(/\s+/).length;
    const charCount = userMessageInterim.length;

    // console.log(`\nINTERIM TRANSCRIPT`)
    if (wordCount > 2 || charCount > 16) {
      analyzeEmotion(userMessageInterim).then((detected: string) => {
        // console.log(`[AnimatedAvater] Emotion Received at END: ${detected}`)
        setEmotion(detected);
      }
      );
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
  }, [userMessageInterim, isInitialized, analyzeEmotion, setEmotion]);

  // User Final Message: Triggered when sentence/turn completes, returns to neutral emotion after a long pause (3.5 seconds)
  useEffect(() => {
    if (!userMessageFinal || !isInitialized) return;
    // console.log(`\nFINAL TRANSCRIPT`)
    const processFinalEmotion = async () => {
      const detected = await analyzeEmotion(userMessageFinal, true, true);
      // Display the detected emotion
      setEmotion(detected);
      // console.log(`[AnimatedAvater] Emotion Received at END: ${detected}`)

      // Clear any previous final reset timeout
      if (finalResetTimeout.current) {
        clearTimeout(finalResetTimeout.current);
      }

      // After long pause (3.5 seconds), return back to neutral emotion ("neutral")
      finalResetTimeout.current = setTimeout(() => {
        resetEmotionProcessing();
        // setEmotion("neutral");
      }, 2000);
    };

    processFinalEmotion();

    return () => {
      if (finalResetTimeout.current) {
        clearTimeout(finalResetTimeout.current);
      }
    };
  }, [userMessageFinal, isInitialized, analyzeEmotion, setEmotion]);

  // Loading state - show default WebP image while dependencies load
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
            borderRadius: "200px",
            background: "#FFFFFF",
            display: "flex",
            alignItems: "self-end",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Default WebP loading image */}
          <img
            src={BASE_MASCOT_ASSETS.neutral}
            alt="Loading avatar"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              padding: "8px",
              opacity: 0.9,
            }}
          />
          {/* Animated green dots loading indicator */}
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "6px",
              alignItems: "center",
            }}
          >
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#22C55E",
                  animation: "avatar-dot-bounce 1.4s ease-in-out infinite",
                  animationDelay: `${index * 0.2}s`,
                }}
              />
            ))}
          </div>
          <style>
            {`
              @keyframes avatar-dot-bounce {
                0%, 80%, 100% {
                  transform: translateY(0) scale(1);
                  opacity: 0.6;
                }
                40% {
                  transform: translateY(-12px) scale(1.2);
                  opacity: 1;
                }
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
        isSpeaking={isSpeaking}
        className={avatarClassName}
        style={style}
      />
    </div>
  );
}
