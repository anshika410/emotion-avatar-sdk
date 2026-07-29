import React from "react";
import "./zoe-mascot/core/zoe-mascot.js";
import speakingAvatar from "../assets/speaking-edited.webp";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace React {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
      interface IntrinsicElements {
        "zoe-mascot": React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement>,
          HTMLElement
        > & {
          emotion?: string;
          autoplay?: boolean;
          loop?: boolean;
          speed?: number;
        };
      }
    }
  }
}

interface AvatarRendererProps {
  emotionId: string;
  /** CSS class applied to the avatar container */
  className?: string;
  /** Inline styles merged with default presentation */
  style?: React.CSSProperties;
  speed?: number;
}

export function AvatarRenderer({
  emotionId,
  className,
  style: userStyle,
  speed = 1,
}: AvatarRendererProps) {
  const defaultContainerStyle: React.CSSProperties = {
    width: "260px",
    height: "260px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  };

  const mergedStyle = { ...defaultContainerStyle, ...userStyle };
  const useSpeakingAvatar = emotionId === "speaking-edited.webp";

  const speakingAvatarStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    objectPosition: "center center",
    transform: "scale(1.22) translateY(2px)",
    transformOrigin: "center center",
    display: "block",
  };
  return (
    <div style={mergedStyle} className={className}>
      {useSpeakingAvatar ? (
        <img
          src={speakingAvatar}
          alt="Speaking avatar"
          style={speakingAvatarStyle}
        />
      ) : (
        <zoe-mascot
          emotion={emotionId}
          autoplay
          loop
          speed={speed}
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
}