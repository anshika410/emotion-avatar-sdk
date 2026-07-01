import { useEffect, useRef, useState } from "react";
import { EmotionState } from "../types/emotion";

interface AvatarRendererProps {
  emotionState: EmotionState;
  intensity: number;
  size: number;
  emotionImages: Record<EmotionState, string>; // already blob URLs from hook
}

export function AvatarRenderer({
  emotionState,
  intensity,
  size,
  emotionImages,
}: AvatarRendererProps) {
  const [isVideoSwitching, setIsVideoSwitching] = useState(false);
  const videoRef = useRef<HTMLImageElement>(null);

  // Swap image when emotion changes — no fetching needed, srcs are already blob URLs
  useEffect(() => {
    const imgEl = videoRef.current;
    if (!imgEl) return;

    const newSrc = emotionImages[emotionState];
    if (!newSrc || imgEl.dataset.srcKey === newSrc) return;

    setIsVideoSwitching(true);
    imgEl.dataset.srcKey = newSrc;
    imgEl.src = newSrc; // safe — already a blob URL

    // Just wait for the img element to finish painting
    const handleLoad = () => setIsVideoSwitching(false);
    imgEl.addEventListener("load", handleLoad, { once: true });
    return () => imgEl.removeEventListener("load", handleLoad);
  }, [emotionState, emotionImages]);

  const imageStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    objectFit: "cover",
    borderRadius: "50%",
    opacity: 0.6 + 0.4 * intensity,
    transform: `scale(${1 + 0.05 * intensity})`,
    filter: `brightness(${0.9 + 0.2 * intensity})`,
    transition: "opacity 0.15s ease, transform 0.15s ease, filter 0.15s ease",
  };

  return (
    <img
      ref={videoRef}
      alt="Avatar"
      style={imageStyle}
      className={`avatar-image ${isVideoSwitching ? "loading" : ""}`}
    />
  );
}
