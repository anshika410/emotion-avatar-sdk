// emotion-sdk-v0.1.2\src\components\AnimatedAvatar.tsx
import { useEffect, useRef } from "react";
import { AvatarRenderer } from "./AvatarRenderer";
import {
  useAvatarController,
  type EmotionDebugInfo,
} from "../hooks/useAvatarController";
import { resetEmotionProcessing } from "../services/emotion/emotionStreamProcessor";

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

  // Message deduplication refs to prevent infinite re-analysis loops
  const lastAnalyzedAiMessage = useRef<string>("");
  const lastAnalyzedInterim = useRef<string>("");
  const lastAnalyzedFinal = useRef<string>("");

  useEffect(() => {
    onInitialized?.(isInitialized);
  }, [isInitialized, onInitialized]);

  // AI Message: Analyzed when complete AI sentence arrives, returns to neutral after 3.5s pause
  useEffect(() => {
    if (!aiMessage || !isInitialized || !isSpeaking) return;
    if (lastAnalyzedAiMessage.current === aiMessage) return;

    lastAnalyzedAiMessage.current = aiMessage;
    analyzeEmotion(aiMessage, true).then((detected: string) => {
      if (detected) setEmotion(detected);

      if (aiResetTimeout.current) clearTimeout(aiResetTimeout.current);
      aiResetTimeout.current = setTimeout(() => {
        setEmotion("happy_gentle");
      }, 1000);
    });

    return () => {
      if (aiResetTimeout.current) clearTimeout(aiResetTimeout.current);
    };
  }, [aiMessage, isInitialized, isSpeaking, analyzeEmotion, setEmotion]);

  // User Interim Speech/Transcript: Only trigger emotion change on complete sentence boundaries (full stop, ?, !, ;)
  // Returns to neutral emotion after a long pause (3.5 seconds)
  useEffect(() => {
    if (!userMessageInterim || !isInitialized) return;
    if (lastAnalyzedInterim.current === userMessageInterim) return;

    const trimmed = userMessageInterim.trim();
    const hasSentenceBoundary = /[.!?;\n]$/.test(trimmed);

    if (hasSentenceBoundary) {
      lastAnalyzedInterim.current = userMessageInterim;
      analyzeEmotion(userMessageInterim, true).then((detected: string) => {
        if (detected) setEmotion(detected);

        if (interimResetTimeout.current)
          clearTimeout(interimResetTimeout.current);
        interimResetTimeout.current = setTimeout(() => {
          resetEmotionProcessing();
          setEmotion("happy_gentle");
        }, 3500);
      });
    }

    return () => {
      if (interimResetTimeout.current) {
        clearTimeout(interimResetTimeout.current);
      }
    };
  }, [userMessageInterim, isInitialized, analyzeEmotion, setEmotion]);

  // User Final Message: Triggered when sentence/turn completes, returns to neutral emotion after a long pause (3.5 seconds)
  useEffect(() => {
    if (!userMessageFinal || !isInitialized) return;
    if (lastAnalyzedFinal.current === userMessageFinal) return;

    lastAnalyzedFinal.current = userMessageFinal;

    const processFinalEmotion = async () => {
      const detected = await analyzeEmotion(userMessageFinal, true);
      console.log(
        "this emotion got detected by model",
        userMessageFinal,
        ":",
        detected,
      );
      // Display the detected emotion
      setEmotion(detected);

      // Clear any previous final reset timeout
      if (finalResetTimeout.current) {
        clearTimeout(finalResetTimeout.current);
      }

      // After long pause (3.5 seconds), return back to neutral emotion ("happy_gentle")
      finalResetTimeout.current = setTimeout(() => {
        resetEmotionProcessing();
        setEmotion("happy_gentle");
      }, 3500);
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
            borderRadius: "20px",
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
            border: "2px solid #e2e8f0",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Default WebP loading image */}
          <img
            src="/assets/happy_gentle.webp"
            alt="Loading avatar"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              padding: "8px",
              opacity: 0.9,
            }}
          />
          {/* Subtle loading indicator overlay */}
          <div
            style={{
              position: "absolute",
              bottom: "8px",
              left: "50%",
              transform: "translateX(-50%)",
              width: loadingSize * 0.4,
              height: "3px",
              background: "#e2e8f0",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "40%",
                height: "100%",
                background: "#4f9eed",
                borderRadius: "2px",
                animation: "avatar-loading-slide 1.5s ease-in-out infinite",
              }}
            />
          </div>
          <style>
            {`
              @keyframes avatar-loading-slide {
                0% { transform: translateX(-100%); }
                50% { transform: translateX(200%); }
                100% { transform: translateX(400%); }
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