import { useEffect, useRef, useState } from "react";
import { EmotionState } from "../types/emotion";

interface AvatarRendererProps {
  emotionState: EmotionState;
  emotionImages: Record<EmotionState, string>;
  /** CSS class applied to the avatar image */
  className?: string;
  /** Inline styles merged with default presentation */
  style?: React.CSSProperties;
}

export function AvatarRenderer({
  emotionState,
  emotionImages,
  className,
  style: userStyle,
}: AvatarRendererProps) {
  const [isVideoSwitching, setIsVideoSwitching] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const preloadedImagesRef = useRef<Set<string>>(new Set());
  const lastUpdateTimeRef = useRef<number>(0);

  // Preload all emotion images
  useEffect(() => {
    const preloadImage = (src: string): Promise<void> =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          preloadedImagesRef.current.add(src);
          resolve();
        };
        img.onerror = () => resolve();
        img.src = src;
      });
    Object.values(emotionImages).forEach(preloadImage);
  }, [emotionImages]);

  // Update emotion image with throttle
  useEffect(() => {
    const imgEl = imgRef.current;
    if (!imgEl) return;

    const newSrc = emotionImages[emotionState];
    if (!newSrc || imgEl.dataset.srcKey === newSrc) return;

    const now = Date.now();
    // Throttle (optional) – uncomment if needed
    // if (now - lastUpdateTimeRef.current < 400) return;

    setIsVideoSwitching(true);
    imgEl.dataset.srcKey = newSrc;
    imgEl.src = newSrc;
    lastUpdateTimeRef.current = now;

    if (preloadedImagesRef.current.has(newSrc)) {
      setIsVideoSwitching(false);
      return;
    }

    const handleLoad = () => {
      setIsVideoSwitching(false);
      preloadedImagesRef.current.add(newSrc);
    };
    imgEl.addEventListener("load", handleLoad, { once: true });
    return () => imgEl.removeEventListener("load", handleLoad);
  }, [emotionState, emotionImages]);

  // Default image styling – provides a solid base (260x260, circle, transitions)
  const defaultImageStyle: React.CSSProperties = {
    width: "260px",
    height: "260px",
    objectFit: "cover",
    borderRadius: "50%",
    transition: "opacity 0.15s ease, transform 0.15s ease, filter 0.15s ease",
  };

  // Merge: user style overrides defaults
  const mergedStyle = { ...defaultImageStyle, ...userStyle };

  return (
    <img
      ref={imgRef}
      src={emotionImages[EmotionState.LISTEN]} // initial fallback
      alt="Avatar"
      style={mergedStyle}
      className={`avatar-image ${isVideoSwitching? "loading" : className ?? ""}`.trim()}
    />
  );
}