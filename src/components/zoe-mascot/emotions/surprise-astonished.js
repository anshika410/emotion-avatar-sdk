import { EASE_IN_OUT, EASE_OUT } from "./shared.js";
import {
  accentPulseFrames,
  expressionTracks,
  legTransform,
  subtleLegIdle,
  subtleRootIdle,
  subtleRotationIdle,
} from "./empathetic-shared.js";

export const surpriseAstonishedEmotion = {
  id: "surprise-astonished",
  family: "surprise",
  intensity: "strong",
  title: "Full astonishment",
  summary: "Supported lift · open hands · held astonishment · measured landing",
  accessibleLabel: "Zoe registering strong surprise with neutral astonishment",
  entrance: {
    duration: 2600,
    tracks: [
      {
        parts: ["root"],
        frames: [
          { offset: 0, transform: "translateY(0)", easing: EASE_IN_OUT },
          { offset: 0.12, transform: "translateY(1px)", easing: EASE_IN_OUT },
          { offset: 0.34, transform: "translateY(-5px)", easing: EASE_OUT },
          { offset: 0.62, transform: "translateY(-4px)", easing: EASE_IN_OUT },
          { offset: 0.82, transform: "translateY(0)", easing: EASE_OUT },
          { offset: 1, transform: "translateY(-1px)" },
        ],
      },
      {
        parts: ["character"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.36, transform: "rotate(-1.2deg)", easing: EASE_OUT },
          { offset: 0.68, transform: "rotate(0.7deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(0deg)" },
        ],
      },
      {
        parts: ["leg-left"],
        frames: [
          { offset: 0, transform: legTransform(-3, 0, -1), easing: EASE_IN_OUT },
          { offset: 0.16, transform: legTransform(-4, 0, -1.2), easing: EASE_OUT },
          { offset: 0.38, transform: legTransform(-7, -1, -2), easing: EASE_OUT },
          { offset: 0.82, transform: legTransform(-7, 0, -1.7), easing: EASE_IN_OUT },
          { offset: 1, transform: legTransform(-6, 0, -1.5) },
        ],
      },
      {
        parts: ["leg-right"],
        frames: [
          { offset: 0, transform: legTransform(3, 0, 1), easing: EASE_IN_OUT },
          { offset: 0.16, transform: legTransform(4, 0, 1.2), easing: EASE_OUT },
          { offset: 0.38, transform: legTransform(7, -1, 2), easing: EASE_OUT },
          { offset: 0.82, transform: legTransform(7, 0, 1.7), easing: EASE_IN_OUT },
          { offset: 1, transform: legTransform(6, 0, 1.5) },
        ],
      },
      {
        parts: ["arm-left"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.38, transform: "rotate(68deg)", easing: EASE_OUT },
          { offset: 0.68, transform: "rotate(58deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(54deg)" },
        ],
      },
      {
        parts: ["arm-right"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.38, transform: "rotate(-63deg)", easing: EASE_OUT },
          { offset: 0.68, transform: "rotate(-54deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(-50deg)" },
        ],
      },
      ...expressionTracks({
        eyes: "eyes-wide",
        mouth: "mouth-small-open",
        holdUntil: 0.03,
        changeBy: 0.12,
      }),
      {
        parts: ["orientation-left"],
        frames: accentPulseFrames({
          start: 0.22,
          appear: 0.31,
          hold: 0.52,
          vanish: 0.7,
          rotation: -7,
        }),
      },
      {
        parts: ["orientation-right"],
        frames: accentPulseFrames({
          start: 0.25,
          appear: 0.34,
          hold: 0.55,
          vanish: 0.73,
          rotation: 7,
        }),
      },
    ],
  },
  idle: {
    duration: 5000,
    tracks: [
      { parts: ["root"], frames: subtleRootIdle(-1, 1) },
      { parts: ["character"], frames: subtleRotationIdle(0, 0.35) },
      {
        parts: ["leg-left"],
        frames: subtleLegIdle({
          x: -6,
          rotation: -1.5,
          driftX: 0.5,
          driftRotation: 0.35,
        }),
      },
      {
        parts: ["leg-right"],
        frames: subtleLegIdle({
          x: 6,
          rotation: 1.5,
          driftX: -0.5,
          driftRotation: -0.35,
        }),
      },
      { parts: ["arm-left"], frames: subtleRotationIdle(54, -0.8) },
      { parts: ["arm-right"], frames: subtleRotationIdle(-50, 0.8) },
    ],
  },
  staticPose: {
    root: { transform: "translateY(-1px)" },
    "leg-left": { transform: legTransform(-6, 0, -1.5) },
    "leg-right": { transform: legTransform(6, 0, 1.5) },
    "arm-left": { transform: "rotate(54deg)" },
    "arm-right": { transform: "rotate(-50deg)" },
    "eyes-open": { opacity: "0" },
    "eyes-wide": { opacity: "1" },
    "mouth-rest": { opacity: "0" },
    "mouth-small-open": { opacity: "1" },
    "orientation-left": { opacity: "0.78" },
    "orientation-right": { opacity: "0.78" },
  },
};
