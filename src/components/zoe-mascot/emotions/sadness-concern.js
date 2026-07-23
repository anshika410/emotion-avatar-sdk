import { EASE_IN_OUT, EASE_OUT } from "./shared.js";
import {
  expressionTracks,
  legTransform,
  subtleLegIdle,
  subtleRootIdle,
  subtleRotationIdle,
} from "./empathetic-shared.js";

export const sadnessConcernEmotion = {
  id: "sadness-concern",
  family: "sadness",
  intensity: "gentle",
  title: "Quiet concern",
  summary: "Soft eyes · sympathetic tilt · inward hands · reassuring settle",
  accessibleLabel: "Zoe responding to sadness with quiet concern",
  entrance: {
    duration: 2400,
    tracks: [
      {
        parts: ["root"],
        frames: [
          { offset: 0, transform: "translateY(0)", easing: EASE_IN_OUT },
          { offset: 0.22, transform: "translateY(-1px)", easing: EASE_OUT },
          { offset: 0.58, transform: "translateY(4px)", easing: EASE_IN_OUT },
          { offset: 0.78, transform: "translateY(3px)", easing: EASE_OUT },
          { offset: 1, transform: "translateY(4px)" },
        ],
      },
      {
        parts: ["character"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.38, transform: "rotate(-2.4deg)", easing: EASE_OUT },
          { offset: 0.72, transform: "rotate(-1.5deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(-2deg)" },
        ],
      },
      {
        parts: ["leg-left"],
        frames: [
          { offset: 0, transform: legTransform(-3, 0, -1), easing: EASE_IN_OUT },
          { offset: 0.42, transform: legTransform(-3, 0, -0.8), easing: EASE_OUT },
          { offset: 0.7, transform: legTransform(-2, 0, -0.3), easing: EASE_IN_OUT },
          { offset: 1, transform: legTransform(-2, 0, -0.5) },
        ],
      },
      {
        parts: ["leg-right"],
        frames: [
          { offset: 0, transform: legTransform(3, 0, 1), easing: EASE_IN_OUT },
          { offset: 0.46, transform: legTransform(3, 0, 0.8), easing: EASE_OUT },
          { offset: 0.72, transform: legTransform(2, 0, 0.3), easing: EASE_IN_OUT },
          { offset: 1, transform: legTransform(2, 0, 0.5) },
        ],
      },
      {
        parts: ["arm-left"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.48, transform: "rotate(-21deg)", easing: EASE_OUT },
          { offset: 0.76, transform: "rotate(-17deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(-18deg)" },
        ],
      },
      {
        parts: ["arm-right"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.52, transform: "rotate(21deg)", easing: EASE_OUT },
          { offset: 0.78, transform: "rotate(17deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(18deg)" },
        ],
      },
      ...expressionTracks({
        eyes: "eyes-concerned",
        mouth: "mouth-concerned",
        holdUntil: 0.1,
        changeBy: 0.22,
      }),
    ],
  },
  idle: {
    duration: 5600,
    tracks: [
      { parts: ["root"], frames: subtleRootIdle(4, 1) },
      { parts: ["character"], frames: subtleRotationIdle(-2, 0.45) },
      {
        parts: ["leg-left"],
        frames: subtleLegIdle({
          x: -2,
          rotation: -0.5,
          driftX: -0.4,
          driftRotation: -0.3,
        }),
      },
      {
        parts: ["leg-right"],
        frames: subtleLegIdle({
          x: 2,
          rotation: 0.5,
          driftX: 0.4,
          driftRotation: 0.3,
        }),
      },
      {
        parts: ["arm-left"],
        frames: subtleRotationIdle(-18, 0.7),
      },
      {
        parts: ["arm-right"],
        frames: subtleRotationIdle(18, -0.7),
      },
    ],
  },
  staticPose: {
    root: { transform: "translateY(4px)" },
    character: { transform: "rotate(-2deg)" },
    "leg-left": { transform: legTransform(-2, 0, -0.5) },
    "leg-right": { transform: legTransform(2, 0, 0.5) },
    "arm-left": { transform: "rotate(-18deg)" },
    "arm-right": { transform: "rotate(18deg)" },
    "eyes-open": { opacity: "0" },
    "eyes-concerned": { opacity: "1" },
    "mouth-rest": { opacity: "0" },
    "mouth-concerned": { opacity: "1" },
  },
};
