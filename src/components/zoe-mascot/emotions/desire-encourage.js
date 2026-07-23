import { EASE_IN_OUT, EASE_OUT } from "./shared.js";
import {
  expressionTracks,
  legTransform,
  softAccentFrames,
  subtleLegIdle,
  subtleRootIdle,
  subtleRotationIdle,
} from "./empathetic-shared.js";

export const desireEncourageEmotion = {
  id: "desire-encourage",
  family: "desire",
  intensity: "strong",
  title: "Hopeful encouragement",
  summary: "Contained anticipation · supported step · open encouragement · hopeful hold",
  accessibleLabel: "Zoe offering hopeful encouragement toward a desired outcome",
  entrance: {
    duration: 2900,
    tracks: [
      {
        parts: ["root"],
        frames: [
          { offset: 0, transform: "translateY(0)", easing: EASE_IN_OUT },
          { offset: 0.22, transform: "translateY(2px)", easing: EASE_OUT },
          { offset: 0.58, transform: "translateY(-5px)", easing: EASE_OUT },
          { offset: 0.78, transform: "translateY(-4px)", easing: EASE_IN_OUT },
          { offset: 1, transform: "translateY(-3px)" },
        ],
      },
      {
        parts: ["character"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.24, transform: "rotate(-0.8deg)", easing: EASE_OUT },
          { offset: 0.6, transform: "rotate(1.8deg)", easing: EASE_OUT },
          { offset: 0.8, transform: "rotate(0.6deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(1deg)" },
        ],
      },
      {
        parts: ["leg-left"],
        frames: [
          { offset: 0, transform: legTransform(-3, 0, -1), easing: EASE_IN_OUT },
          { offset: 0.3, transform: legTransform(-5, 0, -1.4), easing: EASE_OUT },
          { offset: 0.6, transform: legTransform(-8, -3, -2), easing: EASE_OUT },
          { offset: 1, transform: legTransform(-8, -2, -1.8) },
        ],
      },
      {
        parts: ["leg-right"],
        frames: [
          { offset: 0, transform: legTransform(3, 0, 1), easing: EASE_IN_OUT },
          { offset: 0.3, transform: legTransform(5, 0, 1.4), easing: EASE_OUT },
          { offset: 0.6, transform: legTransform(6, 0, 1.6), easing: EASE_OUT },
          { offset: 1, transform: legTransform(6, 0, 1.5) },
        ],
      },
      {
        parts: ["arm-left"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.28, transform: "rotate(-24deg)", easing: EASE_OUT },
          { offset: 0.6, transform: "rotate(66deg)", easing: EASE_OUT },
          { offset: 0.82, transform: "rotate(56deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(59deg)" },
        ],
      },
      {
        parts: ["arm-right"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.28, transform: "rotate(25deg)", easing: EASE_OUT },
          { offset: 0.6, transform: "rotate(-58deg)", easing: EASE_OUT },
          { offset: 0.82, transform: "rotate(-48deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(-51deg)" },
        ],
      },
      ...expressionTracks({ mouth: "mouth-hopeful", holdUntil: 0.06, changeBy: 0.18 }),
      {
        parts: ["forward-glint-left"],
        frames: softAccentFrames({
          start: 0.46,
          appear: 0.55,
          hold: 0.68,
          vanish: 0.84,
          x: 8,
          y: -5,
          rotation: 5,
          opacity: 0.68,
        }),
      },
      {
        parts: ["forward-glint-right"],
        frames: softAccentFrames({
          start: 0.5,
          appear: 0.59,
          hold: 0.72,
          vanish: 0.88,
          x: 8,
          y: -5,
          rotation: 5,
          opacity: 0.68,
        }),
      },
    ],
  },
  idle: {
    duration: 5600,
    tracks: [
      { parts: ["root"], frames: subtleRootIdle(-3, 1) },
      { parts: ["character"], frames: subtleRotationIdle(1, -0.35) },
      {
        parts: ["leg-left"],
        frames: subtleLegIdle({
          x: -8,
          y: -2,
          rotation: -1.8,
          driftX: 0.3,
          driftY: 0.3,
          driftRotation: 0.2,
        }),
      },
      {
        parts: ["leg-right"],
        frames: subtleLegIdle({ x: 6, rotation: 1.5, driftX: -0.25, driftRotation: -0.2 }),
      },
      { parts: ["arm-left"], frames: subtleRotationIdle(59, -0.65) },
      { parts: ["arm-right"], frames: subtleRotationIdle(-51, 0.65) },
    ],
  },
  staticPose: {
    root: { transform: "translateY(-3px)" },
    character: { transform: "rotate(1deg)" },
    "leg-left": { transform: legTransform(-8, -2, -1.8) },
    "leg-right": { transform: legTransform(6, 0, 1.5) },
    "arm-left": { transform: "rotate(59deg)" },
    "arm-right": { transform: "rotate(-51deg)" },
    "mouth-rest": { opacity: "0" },
    "mouth-hopeful": { opacity: "1" },
  },
};
