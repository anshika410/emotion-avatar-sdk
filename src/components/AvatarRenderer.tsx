import { useEffect, useRef, useState } from "react";
import { EmotionState } from "../types/emotion";

interface AvatarRendererProps {
  emotionState: EmotionState;
  size: number;
  emotionImages: Record<EmotionState, string>; // already blob URLs from hook
}

export function AvatarRenderer({
  emotionState,
  size,
  emotionImages,
}: AvatarRendererProps) {
  const [isVideoSwitching, setIsVideoSwitching] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const preloadedImagesRef = useRef<Set<string>>(new Set());

  // Refs for throttling
  const lastUpdateTimeRef = useRef<number>(0);
  const currentDisplayedEmotionRef = useRef<EmotionState>(EmotionState.LISTEN);

  // Preload all emotion images on mount or when the map changes
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

  // Update avatar image when emotion changes, with throttling
  useEffect(() => {
    const imgEl = imgRef.current;
    if (!imgEl) return;

    const newSrc = emotionImages[emotionState];
    if (!newSrc || imgEl.dataset.srcKey === newSrc) return;

    const now = Date.now();

    // Throttle updates to avoid rapid flickering
    // const timeSinceLastUpdate = now - lastUpdateTimeRef.current;
    // if (timeSinceLastUpdate < 400) {
    //   // Skip update – image stays as is
    //   return;
    // }

    // Apply the new image
    setIsVideoSwitching(true);
    imgEl.dataset.srcKey = newSrc;
    imgEl.src = newSrc;

    // Update throttling timestamps and displayed emotion
    lastUpdateTimeRef.current = now;
    currentDisplayedEmotionRef.current = emotionState;

    // debugging avatar files
    console.log(`[AvatarRenderer] Switching to emotion: ${emotionState}, src: ${newSrc.slice(0, 70)}`);

    // If already preloaded, we can end the switching state immediately
    if (preloadedImagesRef.current.has(newSrc)) {
      setIsVideoSwitching(false);
      return;
    }

    // Otherwise, wait for the image to load
    const handleLoad = () => {
      setIsVideoSwitching(false);
      preloadedImagesRef.current.add(newSrc);
    };
    imgEl.addEventListener("load", handleLoad, { once: true });
    return () => imgEl.removeEventListener("load", handleLoad);
  }, [emotionState, emotionImages]);

  const imageStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    objectFit: "cover",
    borderRadius: "50%",
    transition: "opacity 0.15s ease, transform 0.15s ease, filter 0.15s ease",
  };

  return (
    <img
      ref={imgRef}
      src={emotionImages[EmotionState.LISTEN]} // initial image
      alt="Avatar"
      style={imageStyle}
      className={`avatar-image ${isVideoSwitching ? "loading" : ""}`}
    />
  );
}