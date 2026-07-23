import React from "react";
import "./zoe-mascot/core/zoe-mascot.js";

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

  return (
    <div style={mergedStyle} className={className}>
      <zoe-mascot
        emotion={emotionId}
        autoplay
        loop
        speed={speed}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}