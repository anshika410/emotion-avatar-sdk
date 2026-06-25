import { useEffect, useRef, useState, useMemo } from "react";
import { EmotionState } from "../types/emotion";

interface AvatarRendererProps {
  emotionState: EmotionState;
  intensity: number;
  size: number;
  customImages?: Partial<Record<EmotionState, string>>;
}

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
  const imgRef = useRef<HTMLImageElement>(null);
  const preloadedImagesRef = useRef<Set<string>>(new Set());

  // FIX 1: useMemo prevents a new object reference on every render,
  // which was causing Effect 3 to re-run and override the correct image.
  const emotionImageMap = useMemo(
    () => ({ ...DEFAULT_EMOTION_IMAGES, ...customImages }),
    [customImages]
  );

  // Preload all emotion images on mount
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
    Object.values(emotionImageMap).forEach(preloadImage);
  }, [emotionImageMap]);

  // Update avatar image when emotion changes
  useEffect(() => {
    const imgEl = imgRef.current;
    if (!imgEl) return;

    const newSrc = emotionImageMap[emotionState];
    if (!newSrc || imgEl.dataset.srcKey === newSrc) return;

    setIsVideoSwitching(true);
    imgEl.dataset.srcKey = newSrc;
    imgEl.src = newSrc;

    console.log(`[AvatarRenderer] Updating avatar: ${newSrc}, emotion: ${emotionState}`);

    // FIX 2: Restructured if/else so the early return is explicit and the
    // cleanup path is reachable. The dead code after the else-return is gone.
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
  }, [emotionState, emotionImageMap]);

  // FIX 3: Removed the separate "initial mount" useEffect entirely.
  // It ran AFTER the emotion effect and overwrote the correct image every time.
  // The initial src is now set declaratively on the <img> element below,
  // which React handles correctly without any effect needed.

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
      ref={imgRef}
      src={emotionImageMap[EmotionState.LISTEN]} // initial src, overridden by effect
      alt="Avatar"
      style={imageStyle}
      className={`avatar-image ${isVideoSwitching ? "loading" : ""}`}
    />
  );
}