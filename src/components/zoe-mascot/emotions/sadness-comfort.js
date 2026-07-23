import { EASE_IN_OUT, EASE_OUT } from "./shared.js";
import {
  accentPulseFrames,
  expressionTracks,
  legTransform,
  subtleLegIdle,
  subtleRootIdle,
  subtleRotationIdle,
} from "./empathetic-shared.js";

export const sadnessComfortEmotion = {
  id: "sadness-comfort",
  family: "sadness",
  intensity: "strong",
  title: "Deep comfort",
  summary: "Attentive lift · caring dip · embrace gesture · quiet presence",
  accessibleLabel: "Zoe responding to strong sadness with deep comfort",
  entrance: {
    duration: 3000,
    tracks: [
      {
        parts: ["root"],
        frames: [
          { offset: 0, transform: "translateY(0)", easing: EASE_IN_OUT },
          { offset: 0.2, transform: "translateY(-2px)", easing: EASE_OUT },
          { offset: 0.58, transform: "translateY(8px)", easing: EASE_IN_OUT },
          { offset: 0.78, transform: "translateY(6px)", easing: EASE_OUT },
          { offset: 1, transform: "translateY(7px)" },
        ],
      },
      {
        parts: ["character"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.42, transform: "rotate(-3.5deg)", easing: EASE_OUT },
          { offset: 0.76, transform: "rotate(-2.4deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(-3deg)" },
        ],
      },
      {
        parts: ["leg-left"],
        frames: [
          { offset: 0, transform: legTransform(-3, 0, -1), easing: EASE_IN_OUT },
          { offset: 0.24, transform: legTransform(-3, 0, -0.6), easing: EASE_OUT },
          { offset: 0.6, transform: legTransform(-5, 0, -1.4), easing: EASE_IN_OUT },
          { offset: 0.8, transform: legTransform(-4.5, 0, -1), easing: EASE_OUT },
          { offset: 1, transform: legTransform(-5, 0, -1.2) },
        ],
      },
      {
        parts: ["leg-right"],
        frames: [
          { offset: 0, transform: legTransform(3, 0, 1), easing: EASE_IN_OUT },
          { offset: 0.24, transform: legTransform(3, 0, 0.6), easing: EASE_OUT },
          { offset: 0.6, transform: legTransform(5, 0, 1.4), easing: EASE_IN_OUT },
          { offset: 0.8, transform: legTransform(4.5, 0, 1), easing: EASE_OUT },
          { offset: 1, transform: legTransform(5, 0, 1.2) },
        ],
      },
      {
        parts: ["arm-left"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.18, transform: "rotate(5deg)", easing: EASE_OUT },
          { offset: 0.58, transform: "rotate(-49deg)", easing: EASE_OUT },
          { offset: 0.8, transform: "rotate(-43deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(-45deg)" },
        ],
      },
      {
        parts: ["arm-right"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.2, transform: "rotate(-4deg)", easing: EASE_OUT },
          { offset: 0.6, transform: "rotate(42deg)", easing: EASE_OUT },
          { offset: 0.8, transform: "rotate(36deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(38deg)" },
        ],
      },
      ...expressionTracks({
        eyes: "eyes-concerned",
        mouth: "mouth-concerned",
        holdUntil: 0.08,
        changeBy: 0.2,
      }),
      {
        parts: ["tear"],
        frames: accentPulseFrames({
          start: 0.26,
          appear: 0.36,
          hold: 0.53,
          vanish: 0.7,
          rotation: 0,
        }),
      },
    ],
  },
  idle: {
    duration: 6000,
    tracks: [
      { parts: ["root"], frames: subtleRootIdle(7, 1) },
      { parts: ["character"], frames: subtleRotationIdle(-3, 0.55) },
      {
        parts: ["leg-left"],
        frames: subtleLegIdle({
          x: -5,
          rotation: -1.2,
          driftX: -0.5,
          driftRotation: -0.3,
        }),
      },
      {
        parts: ["leg-right"],
        frames: subtleLegIdle({
          x: 5,
          rotation: 1.2,
          driftX: 0.5,
          driftRotation: 0.3,
        }),
      },
      {
        parts: ["arm-left"],
        frames: subtleRotationIdle(-45, 0.8),
      },
      {
        parts: ["arm-right"],
        frames: subtleRotationIdle(38, -0.8),
      },
    ],
  },
  staticPose: {
    root: { transform: "translateY(7px)" },
    character: { transform: "rotate(-3deg)" },
    "leg-left": { transform: legTransform(-5, 0, -1.2) },
    "leg-right": { transform: legTransform(5, 0, 1.2) },
    "arm-left": { transform: "rotate(-45deg)" },
    "arm-right": { transform: "rotate(38deg)" },
    "eyes-open": { opacity: "0" },
    "eyes-concerned": { opacity: "1" },
    "mouth-rest": { opacity: "0" },
    "mouth-concerned": { opacity: "1" },
    tear: { opacity: "1", transform: "translateY(-1px) scale(0.9)" },
  },
};
