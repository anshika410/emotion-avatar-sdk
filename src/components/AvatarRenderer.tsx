import { useEffect, useRef, useState } from "react";
import { EmotionState } from "../types/emotion";

interface AvatarRendererProps {
  emotionState: EmotionState;
  intensity: number;
  size: number;
  customImages?: Partial<Record<EmotionState, string>>;
}

// Default emotion image mapping
const DEFAULT_EMOTION_IMAGES: Record<EmotionState, string> = {
  [EmotionState.LISTEN]: "/assets/listening.webp",
  [EmotionState.SPEAK_NEUTRAL]: "/assets/speaking-edited.webp",
  [EmotionState.ENCOURAGE]: "/assets/ballbounce.webp",
  [EmotionState.THINK]: "/assets/regular-thinking.webp",
  [EmotionState.CAUTION]: "/assets/glassadjustment.webp",
  [EmotionState.CELEBRATE]: "/assets/bubblepop.webp",
};

export function AvatarRenderer({
  emotionState,
  intensity,
  size,
  customImages,
}: AvatarRendererProps) {
  const [isVideoSwitching, setIsVideoSwitching] = useState(false);
  const videoRef = useRef<HTMLImageElement>(null);
  const preloadedImagesRef = useRef<Set<string>>(new Set());

  // Merge custom images with defaults
  const emotionImageMap = { ...DEFAULT_EMOTION_IMAGES, ...customImages };

  // Preload all emotion images on mount
  useEffect(() => {
    const preloadImage = (src: string): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          preloadedImagesRef.current.add(src);
          resolve();
        };
        img.onerror = () => resolve();
        img.src = src;
      });
    };

    const allImages = Object.values(emotionImageMap);
    allImages.forEach((src) => preloadImage(src));
  }, [emotionImageMap]);

  // Update avatar image when emotion changes
  useEffect(() => {
    const imgEl = videoRef.current;
    if (!imgEl) return;

    const newSrc = emotionImageMap[emotionState];
    if (!newSrc || imgEl.dataset.srcKey === newSrc) return;

    setIsVideoSwitching(true);
    imgEl.dataset.srcKey = newSrc;
    imgEl.src = newSrc;

    const handleLoad = () => {
      setIsVideoSwitching(false);
      preloadedImagesRef.current.add(newSrc);
    };

    if (preloadedImagesRef.current.has(newSrc)) {
      setIsVideoSwitching(false);
    } else {
      imgEl.addEventListener("load", handleLoad, { once: true });
      return () => {
        imgEl.removeEventListener("load", handleLoad);
      };
    }
  }, [emotionState, emotionImageMap]);

  // Set initial image on mount
  useEffect(() => {
    const imgEl = videoRef.current;
    if (!imgEl) return;
    const initialSrc = emotionImageMap[EmotionState.LISTEN];
    imgEl.dataset.srcKey = initialSrc;
    imgEl.src = initialSrc;
  }, [emotionImageMap]);

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
