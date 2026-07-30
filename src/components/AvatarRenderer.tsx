import React from "react";
import { getMascotAssetUrl } from "../constants/emotionAssets";

export interface AvatarRendererProps {
  emotionId: string;
  isSpeaking?: boolean;
  /** CSS class applied to the avatar container */
  className?: string;
  /** Inline styles merged with default presentation */
  style?: React.CSSProperties;
  speed?: number;
}

export function AvatarRenderer({
  emotionId,
  isSpeaking = false,
  className,
  style: userStyle,
}: AvatarRendererProps) {
  const defaultContainerStyle: React.CSSProperties = {
    width: "260px",
    height: "260px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
  };

  const mergedStyle = { ...defaultContainerStyle, ...userStyle };
  const assetUrl = getMascotAssetUrl(emotionId, isSpeaking);

  return (
    <div style={mergedStyle} className={className}>
      <img
        src={assetUrl}
        alt={emotionId}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          backgroundColor: "#ffffff",
        }}
      />
    </div>
  );
}
