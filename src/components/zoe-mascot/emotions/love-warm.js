import { EASE_IN_OUT, EASE_OUT } from "./shared.js";
import {
  accentPulseFrames,
  expressionTracks,
  legTransform,
  subtleLegIdle,
  subtleRootIdle,
  subtleRotationIdle,
} from "./empathetic-shared.js";

export const loveWarmEmotion = {
  id: "love-warm",
  family: "love",
  intensity: "gentle",
  title: "Warm appreciation",
  summary: "Happy eyes · hand to heart · appreciative sway · soft warmth",
  accessibleLabel: "Zoe expressing warm friendly appreciation",
  entrance: {
    duration: 2400,
    tracks: [
      {
        parts: ["root"],
        frames: [
          { offset: 0, transform: "translateY(0)", easing: EASE_IN_OUT },
          { offset: 0.32, transform: "translateY(-3px)", easing: EASE_OUT },
          { offset: 0.66, transform: "translateY(1px)", easing: EASE_IN_OUT },
          { offset: 1, transform: "translateY(0)" },
        ],
      },
      {
        parts: ["character"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.38, transform: "rotate(-2.5deg)", easing: EASE_OUT },
          { offset: 0.72, transform: "rotate(-1.5deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(-2deg)" },
        ],
      },
      {
        parts: ["leg-left"],
        frames: [
          { offset: 0, transform: legTransform(-3, 0, -1), easing: EASE_IN_OUT },
          { offset: 0.36, transform: legTransform(-4, 0, -1.5), easing: EASE_OUT },
          { offset: 0.72, transform: legTransform(-3, 0, -1), easing: EASE_IN_OUT },
          { offset: 1, transform: legTransform(-3, 0, -1) },
        ],
      },
      {
        parts: ["leg-right"],
        frames: [
          { offset: 0, transform: legTransform(3, 0, 1), easing: EASE_IN_OUT },
          { offset: 0.42, transform: legTransform(5, 0, 2.2), easing: EASE_OUT },
          { offset: 0.7, transform: legTransform(4, 0, 0.8), easing: EASE_IN_OUT },
          { offset: 1, transform: legTransform(5, 0, 1.4) },
        ],
      },
      {
        parts: ["arm-left"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.48, transform: "rotate(-77deg)", easing: EASE_OUT },
          { offset: 0.76, transform: "rotate(-69deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(-72deg)" },
        ],
      },
      {
        parts: ["arm-right"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.54, transform: "rotate(8deg)", easing: EASE_OUT },
          { offset: 1, transform: "rotate(6deg)" },
        ],
      },
      ...expressionTracks({
        eyes: "eyes-happy",
        mouth: "mouth-wide",
        holdUntil: 0.08,
        changeBy: 0.2,
      }),
      {
        parts: ["heart-right"],
        frames: accentPulseFrames({
          start: 0.36,
          appear: 0.47,
          hold: 0.65,
          vanish: 0.82,
          rotation: 6,
        }),
      },
    ],
  },
  idle: {
    duration: 4800,
    tracks: [
      { parts: ["root"], frames: subtleRootIdle(0, -1) },
      { parts: ["character"], frames: subtleRotationIdle(-2, 0.7) },
      {
        parts: ["leg-left"],
        frames: subtleLegIdle({
          x: -3,
          rotation: -1,
          driftX: -0.4,
          driftRotation: -0.3,
        }),
      },
      {
        parts: ["leg-right"],
        frames: subtleLegIdle({
          x: 5,
          rotation: 1.4,
          driftX: -0.5,
          driftRotation: -0.6,
        }),
      },
      {
        parts: ["arm-left"],
        frames: subtleRotationIdle(-72, 0.8),
      },
      {
        parts: ["arm-right"],
        frames: subtleRotationIdle(6, -0.5),
      },
    ],
  },
  staticPose: {
    character: { transform: "rotate(-2deg)" },
    "leg-left": { transform: legTransform(-3, 0, -1) },
    "leg-right": { transform: legTransform(5, 0, 1.4) },
    "arm-left": { transform: "rotate(-72deg)" },
    "arm-right": { transform: "rotate(6deg)" },
    "eyes-open": { opacity: "0" },
    "eyes-happy": { opacity: "1" },
    "mouth-rest": { opacity: "0" },
    "mouth-wide": { opacity: "1" },
    "heart-right": { opacity: "1", transform: "scale(0.9)" },
  },
};
