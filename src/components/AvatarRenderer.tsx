import { useEffect, useRef, useState } from "react";
import { EmotionState } from "../types/emotion";

interface AvatarRendererProps {
  emotionState: EmotionState;
  intensity: number;
  size: number;
  emotionImages: Record<EmotionState, string>; // always fully resolved by parent
}

export function AvatarRenderer({
  emotionState,
  intensity,
  size,
  emotionImages,
}: AvatarRendererProps) {
  const [isVideoSwitching, setIsVideoSwitching] = useState(false);
  const videoRef = useRef<HTMLImageElement>(null);
  const preloadedImagesRef = useRef<Set<string>>(new Set());

  // Preload all emotion images on mount
  useEffect(() => {
    const preloadImage = (src: string): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => { preloadedImagesRef.current.add(src); resolve(); };
        img.onerror = () => resolve();
        img.src = src;
      });
    };
    Object.values(emotionImages).forEach((src) => preloadImage(src));
  }, [emotionImages]);

  // Update avatar image when emotion changes
  useEffect(() => {
    const imgEl = videoRef.current;
    if (!imgEl) return;

    const newSrc = emotionImages[emotionState];
    if (!newSrc || imgEl.dataset.srcKey === newSrc) return;

    setIsVideoSwitching(true);
    imgEl.dataset.srcKey = newSrc;
    imgEl.src = newSrc;

    if (preloadedImagesRef.current.has(newSrc)) {
      setIsVideoSwitching(false);
    } else {
      const handleLoad = () => {
        setIsVideoSwitching(false);
        preloadedImagesRef.current.add(newSrc);
      };
      imgEl.addEventListener("load", handleLoad, { once: true });
      return () => imgEl.removeEventListener("load", handleLoad);
    }
  }, [emotionState, emotionImages]);

  // Set initial image on mount
  useEffect(() => {
    const imgEl = videoRef.current;
    if (!imgEl) return;
    const initialSrc = emotionImages[EmotionState.LISTEN];
    imgEl.dataset.srcKey = initialSrc;
    imgEl.src = initialSrc;
  }, [emotionImages]);

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