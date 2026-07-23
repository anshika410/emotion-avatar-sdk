import { EASE_IN_OUT, EASE_OUT } from "./shared.js";
import {
  expressionTracks,
  legTransform,
  softAccentFrames,
  subtleLegIdle,
  subtleRootIdle,
  subtleRotationIdle,
} from "./empathetic-shared.js";

export const fearSteadyEmotion = {
  id: "fear-steady",
  family: "fear",
  intensity: "strong",
  title: "Protective steadiness",
  summary: "Urgency recognized · stance widened · hands lowered · calm presence",
  accessibleLabel: "Zoe responding to strong fear with protective calm steadiness",
  entrance: {
    duration: 3000,
    tracks: [
      {
        parts: ["root"],
        frames: [
          { offset: 0, transform: "translateY(0)", easing: EASE_IN_OUT },
          { offset: 0.14, transform: "translateY(-3px)", easing: EASE_OUT },
          { offset: 0.42, transform: "translateY(-1px)", easing: EASE_IN_OUT },
          { offset: 0.72, transform: "translateY(3px)", easing: EASE_OUT },
          { offset: 1, transform: "translateY(3px)" },
        ],
      },
      {
        parts: ["character"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.2, transform: "rotate(-1deg)", easing: EASE_OUT },
          { offset: 0.48, transform: "rotate(0.8deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(0deg)" },
        ],
      },
      {
        parts: ["leg-left"],
        frames: [
          { offset: 0, transform: legTransform(-3, 0, -1), easing: EASE_IN_OUT },
          { offset: 0.32, transform: legTransform(-6, 0, -1.5), easing: EASE_OUT },
          { offset: 0.62, transform: legTransform(-8, 0, -2), easing: EASE_IN_OUT },
          { offset: 1, transform: legTransform(-8, 0, -1.8) },
        ],
      },
      {
        parts: ["leg-right"],
        frames: [
          { offset: 0, transform: legTransform(3, 0, 1), easing: EASE_IN_OUT },
          { offset: 0.32, transform: legTransform(6, 0, 1.5), easing: EASE_OUT },
          { offset: 0.62, transform: legTransform(8, 0, 2), easing: EASE_IN_OUT },
          { offset: 1, transform: legTransform(8, 0, 1.8) },
        ],
      },
      {
        parts: ["arm-left"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.3, transform: "rotate(58deg)", easing: EASE_OUT },
          { offset: 0.62, transform: "rotate(30deg)", easing: EASE_IN_OUT },
          { offset: 0.82, transform: "rotate(18deg)", easing: EASE_OUT },
          { offset: 1, transform: "rotate(20deg)" },
        ],
      },
      {
        parts: ["arm-right"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.3, transform: "rotate(-52deg)", easing: EASE_OUT },
          { offset: 0.62, transform: "rotate(-28deg)", easing: EASE_IN_OUT },
          { offset: 0.82, transform: "rotate(-17deg)", easing: EASE_OUT },
          { offset: 1, transform: "rotate(-19deg)" },
        ],
      },
      ...expressionTracks({
        eyes: "eyes-concerned",
        mouth: "mouth-steady",
        holdUntil: 0.04,
        changeBy: 0.14,
      }),
      {
        parts: ["calm-arc"],
        frames: softAccentFrames({
          start: 0.38,
          appear: 0.5,
          hold: 0.68,
          vanish: 0.84,
          y: -5,
          opacity: 0.58,
        }),
      },
    ],
  },
  idle: {
    duration: 6000,
    tracks: [
      { parts: ["root"], frames: subtleRootIdle(3, 1) },
      { parts: ["character"], frames: subtleRotationIdle(0, 0.25) },
      {
        parts: ["leg-left"],
        frames: subtleLegIdle({
          x: -8,
          rotation: -1.8,
          driftX: 0.35,
          driftRotation: 0.25,
        }),
      },
      {
        parts: ["leg-right"],
        frames: subtleLegIdle({
          x: 8,
          rotation: 1.8,
          driftX: -0.35,
          driftRotation: -0.25,
        }),
      },
      { parts: ["arm-left"], frames: subtleRotationIdle(20, -0.6) },
      { parts: ["arm-right"], frames: subtleRotationIdle(-19, 0.6) },
    ],
  },
  staticPose: {
    root: { transform: "translateY(3px)" },
    "leg-left": { transform: legTransform(-8, 0, -1.8) },
    "leg-right": { transform: legTransform(8, 0, 1.8) },
    "arm-left": { transform: "rotate(20deg)" },
    "arm-right": { transform: "rotate(-19deg)" },
    "eyes-open": { opacity: "0" },
    "eyes-concerned": { opacity: "1" },
    "mouth-rest": { opacity: "0" },
    "mouth-steady": { opacity: "1" },
  },
};
