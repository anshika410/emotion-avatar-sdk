import { EASE_IN_OUT, EASE_OUT, sparkleFrames } from "./shared.js";
import {
  expressionTracks,
  legTransform,
  subtleLegIdle,
  subtleRootIdle,
  subtleRotationIdle,
} from "./empathetic-shared.js";

export const happyCelebrateEmotion = {
  id: "happy-celebrate",
  family: "happiness",
  intensity: "strong",
  title: "Big celebration",
  summary: "Step preparation · restrained hop · raised arms · bright settle",
  accessibleLabel: "Zoe celebrating happily with a lively step and hop",
  entrance: {
    duration: 3000,
    tracks: [
      {
        parts: ["root"],
        frames: [
          { offset: 0, transform: "translateY(0)", easing: EASE_IN_OUT },
          { offset: 0.12, transform: "translateY(2px)", easing: EASE_IN_OUT },
          { offset: 0.26, transform: "translateY(-1px)", easing: EASE_OUT },
          { offset: 0.42, transform: "translateY(-8px)", easing: EASE_OUT },
          { offset: 0.58, transform: "translateY(1px)", easing: EASE_IN_OUT },
          { offset: 0.68, transform: "translateY(-2px)", easing: EASE_OUT },
          { offset: 0.82, transform: "translateY(0)", easing: EASE_IN_OUT },
          { offset: 1, transform: "translateY(0)" },
        ],
      },
      {
        parts: ["character"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.2, transform: "rotate(-1.5deg)", easing: EASE_OUT },
          { offset: 0.42, transform: "rotate(2deg)", easing: EASE_OUT },
          { offset: 0.6, transform: "rotate(-1deg)", easing: EASE_IN_OUT },
          { offset: 0.78, transform: "rotate(0.5deg)", easing: EASE_OUT },
          { offset: 1, transform: "rotate(0deg)" },
        ],
      },
      {
        parts: ["leg-left"],
        frames: [
          { offset: 0, transform: legTransform(-3, 0, -1), easing: EASE_IN_OUT },
          { offset: 0.18, transform: legTransform(-5, 0, -1.6), easing: EASE_OUT },
          { offset: 0.32, transform: legTransform(-4, 0, -1), easing: EASE_IN_OUT },
          { offset: 0.42, transform: legTransform(-4, -1, -1.4), easing: EASE_OUT },
          { offset: 0.58, transform: legTransform(-6, 0, -1.8), easing: EASE_IN_OUT },
          { offset: 0.72, transform: legTransform(-5.5, 0, -1.3), easing: EASE_OUT },
          { offset: 1, transform: legTransform(-6, 0, -1.5) },
        ],
      },
      {
        parts: ["leg-right"],
        frames: [
          { offset: 0, transform: legTransform(3, 0, 1), easing: EASE_IN_OUT },
          { offset: 0.18, transform: legTransform(4, 0, 1.4), easing: EASE_OUT },
          { offset: 0.3, transform: legTransform(4, -4, 2.2), easing: EASE_OUT },
          { offset: 0.42, transform: legTransform(6, -3, 2.4), easing: EASE_OUT },
          { offset: 0.58, transform: legTransform(6, 0, 1.8), easing: EASE_IN_OUT },
          { offset: 0.72, transform: legTransform(5.5, 0, 1.3), easing: EASE_OUT },
          { offset: 1, transform: legTransform(6, 0, 1.5) },
        ],
      },
      {
        parts: ["arm-left"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.14, transform: "rotate(10deg)", easing: EASE_OUT },
          { offset: 0.42, transform: "rotate(76deg)", easing: EASE_OUT },
          { offset: 0.58, transform: "rotate(66deg)", easing: EASE_IN_OUT },
          { offset: 0.72, transform: "rotate(61deg)", easing: EASE_OUT },
          { offset: 1, transform: "rotate(58deg)" },
        ],
      },
      {
        parts: ["arm-right"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.14, transform: "rotate(-10deg)", easing: EASE_OUT },
          { offset: 0.42, transform: "rotate(-76deg)", easing: EASE_OUT },
          { offset: 0.58, transform: "rotate(-66deg)", easing: EASE_IN_OUT },
          { offset: 0.72, transform: "rotate(-61deg)", easing: EASE_OUT },
          { offset: 1, transform: "rotate(-58deg)" },
        ],
      },
      ...expressionTracks({
        eyes: "eyes-happy",
        mouth: "mouth-open",
        holdUntil: 0.06,
        changeBy: 0.18,
      }),
      {
        parts: ["sparkle-left"],
        frames: sparkleFrames(0.32, 0.38, 0.53, 0.64, -12),
      },
      {
        parts: ["sparkle-upper-right"],
        frames: sparkleFrames(0.35, 0.41, 0.56, 0.67, 15),
      },
      {
        parts: ["sparkle-right"],
        frames: sparkleFrames(0.39, 0.45, 0.59, 0.7, -10),
      },
    ],
  },
  idle: {
    duration: 5200,
    tracks: [
      { parts: ["root"], frames: subtleRootIdle(0, -1) },
      { parts: ["character"], frames: subtleRotationIdle(0, 0.45) },
      {
        parts: ["leg-left"],
        frames: subtleLegIdle({
          x: -6,
          rotation: -1.5,
          driftX: 0.5,
          driftRotation: 0.4,
        }),
      },
      {
        parts: ["leg-right"],
        frames: subtleLegIdle({
          x: 6,
          rotation: 1.5,
          driftX: -0.5,
          driftRotation: -0.4,
        }),
      },
      {
        parts: ["arm-left"],
        frames: subtleRotationIdle(58, -0.8),
      },
      {
        parts: ["arm-right"],
        frames: subtleRotationIdle(-58, 0.8),
      },
    ],
  },
  staticPose: {
    root: { transform: "translateY(-1px)" },
    "leg-left": { transform: legTransform(-6, 0, -1.5) },
    "leg-right": { transform: legTransform(6, 0, 1.5) },
    "arm-left": { transform: "rotate(58deg)" },
    "arm-right": { transform: "rotate(-58deg)" },
    "eyes-open": { opacity: "0" },
    "eyes-happy": { opacity: "1" },
    "mouth-rest": { opacity: "0" },
    "mouth-open": { opacity: "1" },
    "sparkle-upper-right": { opacity: "1", transform: "scale(0.9)" },
  },
};
