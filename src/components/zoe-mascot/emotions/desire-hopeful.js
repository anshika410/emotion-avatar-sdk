import { EASE_IN_OUT, EASE_OUT } from "./shared.js";
import {
  expressionTracks,
  legTransform,
  softAccentFrames,
  subtleLegIdle,
  subtleRootIdle,
  subtleRotationIdle,
} from "./empathetic-shared.js";

export const desireHopefulEmotion = {
  id: "desire-hopeful",
  family: "desire",
  intensity: "gentle",
  title: "Interested anticipation",
  summary: "Attentive brightening · forward lift · open hand · optimistic nod",
  accessibleLabel: "Zoe recognizing a hopeful desire with interested anticipation",
  entrance: {
    duration: 2300,
    tracks: [
      {
        parts: ["root"],
        frames: [
          { offset: 0, transform: "translateY(0)", easing: EASE_IN_OUT },
          { offset: 0.3, transform: "translateY(-3px)", easing: EASE_OUT },
          { offset: 0.68, transform: "translateY(-1px)", easing: EASE_IN_OUT },
          { offset: 0.84, transform: "translateY(-3px)", easing: EASE_OUT },
          { offset: 1, transform: "translateY(-2px)" },
        ],
      },
      {
        parts: ["character"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.34, transform: "rotate(1.4deg)", easing: EASE_OUT },
          { offset: 0.72, transform: "rotate(0.4deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(0.8deg)" },
        ],
      },
      {
        parts: ["leg-left"],
        frames: [
          { offset: 0, transform: legTransform(-3, 0, -1), easing: EASE_IN_OUT },
          { offset: 0.48, transform: legTransform(-5, -1, -1.4), easing: EASE_OUT },
          { offset: 1, transform: legTransform(-5, -1, -1.3) },
        ],
      },
      {
        parts: ["leg-right"],
        frames: [
          { offset: 0, transform: legTransform(3, 0, 1), easing: EASE_IN_OUT },
          { offset: 0.48, transform: legTransform(4, 0, 1.2), easing: EASE_OUT },
          { offset: 1, transform: legTransform(4, 0, 1.2) },
        ],
      },
      {
        parts: ["arm-left"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.46, transform: "rotate(56deg)", easing: EASE_OUT },
          { offset: 0.72, transform: "rotate(48deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(50deg)" },
        ],
      },
      {
        parts: ["arm-right"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.5, transform: "rotate(22deg)", easing: EASE_OUT },
          { offset: 1, transform: "rotate(18deg)" },
        ],
      },
      ...expressionTracks({ mouth: "mouth-hopeful", holdUntil: 0.08, changeBy: 0.2 }),
      {
        parts: ["forward-glint-left"],
        frames: softAccentFrames({
          start: 0.38,
          appear: 0.48,
          hold: 0.6,
          vanish: 0.76,
          x: 7,
          y: -4,
          rotation: 4,
          opacity: 0.62,
        }),
      },
    ],
  },
  idle: {
    duration: 5000,
    tracks: [
      { parts: ["root"], frames: subtleRootIdle(-2, 1) },
      { parts: ["character"], frames: subtleRotationIdle(0.8, -0.35) },
      {
        parts: ["leg-left"],
        frames: subtleLegIdle({
          x: -5,
          y: -1,
          rotation: -1.3,
          driftX: 0.3,
          driftY: 0.3,
          driftRotation: 0.15,
        }),
      },
      {
        parts: ["leg-right"],
        frames: subtleLegIdle({ x: 4, rotation: 1.2, driftX: -0.25, driftRotation: -0.15 }),
      },
      { parts: ["arm-left"], frames: subtleRotationIdle(50, -0.55) },
      { parts: ["arm-right"], frames: subtleRotationIdle(18, -0.35) },
    ],
  },
  staticPose: {
    root: { transform: "translateY(-2px)" },
    character: { transform: "rotate(0.8deg)" },
    "leg-left": { transform: legTransform(-5, -1, -1.3) },
    "leg-right": { transform: legTransform(4, 0, 1.2) },
    "arm-left": { transform: "rotate(50deg)" },
    "arm-right": { transform: "rotate(18deg)" },
    "mouth-rest": { opacity: "0" },
    "mouth-hopeful": { opacity: "1" },
  },
};
