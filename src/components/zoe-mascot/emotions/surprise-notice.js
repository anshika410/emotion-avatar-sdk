import { EASE_IN_OUT, EASE_OUT } from "./shared.js";
import {
  accentPulseFrames,
  expressionTracks,
  legTransform,
  subtleLegIdle,
  subtleRootIdle,
  subtleRotationIdle,
} from "./empathetic-shared.js";

export const surpriseNoticeEmotion = {
  id: "surprise-notice",
  family: "surprise",
  intensity: "gentle",
  title: "Attentive wonder",
  summary: "Quick orientation · neutral wonder · one open hand · alert settle",
  accessibleLabel: "Zoe noticing something surprising with attentive neutral wonder",
  entrance: {
    duration: 2000,
    tracks: [
      {
        parts: ["root"],
        frames: [
          { offset: 0, transform: "translateY(0)", easing: EASE_IN_OUT },
          { offset: 0.24, transform: "translateY(-3px)", easing: EASE_OUT },
          { offset: 0.58, transform: "translateY(-2px)", easing: EASE_IN_OUT },
          { offset: 1, transform: "translateY(-1px)" },
        ],
      },
      {
        parts: ["character"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.26, transform: "rotate(1.4deg)", easing: EASE_OUT },
          { offset: 0.62, transform: "rotate(-0.5deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(0.4deg)" },
        ],
      },
      {
        parts: ["leg-left"],
        frames: [
          { offset: 0, transform: legTransform(-3, 0, -1), easing: EASE_IN_OUT },
          { offset: 0.32, transform: legTransform(-5, 0, -1.6), easing: EASE_OUT },
          { offset: 1, transform: legTransform(-5, 0, -1.3) },
        ],
      },
      {
        parts: ["leg-right"],
        frames: [
          { offset: 0, transform: legTransform(3, 0, 1), easing: EASE_IN_OUT },
          { offset: 0.32, transform: legTransform(5, 0, 1.6), easing: EASE_OUT },
          { offset: 1, transform: legTransform(5, 0, 1.3) },
        ],
      },
      {
        parts: ["arm-left"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.38, transform: "rotate(52deg)", easing: EASE_OUT },
          { offset: 0.68, transform: "rotate(45deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(47deg)" },
        ],
      },
      {
        parts: ["arm-right"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.42, transform: "rotate(-7deg)", easing: EASE_OUT },
          { offset: 1, transform: "rotate(-5deg)" },
        ],
      },
      ...expressionTracks({
        eyes: "eyes-wide",
        mouth: "mouth-small-open",
        holdUntil: 0.04,
        changeBy: 0.14,
      }),
      {
        parts: ["orientation-right"],
        frames: accentPulseFrames({
          start: 0.2,
          appear: 0.3,
          hold: 0.48,
          vanish: 0.68,
          rotation: 5,
        }),
      },
    ],
  },
  idle: {
    duration: 4600,
    tracks: [
      { parts: ["root"], frames: subtleRootIdle(-1, 1) },
      { parts: ["character"], frames: subtleRotationIdle(0.4, -0.35) },
      {
        parts: ["leg-left"],
        frames: subtleLegIdle({
          x: -5,
          rotation: -1.3,
          driftX: 0.4,
          driftRotation: 0.3,
        }),
      },
      {
        parts: ["leg-right"],
        frames: subtleLegIdle({
          x: 5,
          rotation: 1.3,
          driftX: -0.4,
          driftRotation: -0.3,
        }),
      },
      { parts: ["arm-left"], frames: subtleRotationIdle(47, -0.7) },
      { parts: ["arm-right"], frames: subtleRotationIdle(-5, 0.4) },
    ],
  },
  staticPose: {
    root: { transform: "translateY(-1px)" },
    character: { transform: "rotate(0.4deg)" },
    "leg-left": { transform: legTransform(-5, 0, -1.3) },
    "leg-right": { transform: legTransform(5, 0, 1.3) },
    "arm-left": { transform: "rotate(47deg)" },
    "arm-right": { transform: "rotate(-5deg)" },
    "eyes-open": { opacity: "0" },
    "eyes-wide": { opacity: "1" },
    "mouth-rest": { opacity: "0" },
    "mouth-small-open": { opacity: "1" },
    "orientation-right": { opacity: "0.8" },
  },
};
