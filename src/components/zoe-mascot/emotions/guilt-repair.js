import { EASE_IN_OUT, EASE_OUT } from "./shared.js";
import {
  expressionTracks,
  legTransform,
  softAccentFrames,
  subtleLegIdle,
  subtleRootIdle,
  subtleRotationIdle,
} from "./empathetic-shared.js";

export const guiltRepairEmotion = {
  id: "guilt-repair",
  family: "guilt",
  intensity: "strong",
  title: "Constructive reassurance",
  summary: "Heartfelt reflection · grounded pause · forward opening · ready stance",
  accessibleLabel: "Zoe supporting constructive repair with compassionate encouragement",
  entrance: {
    duration: 3000,
    tracks: [
      {
        parts: ["root"],
        frames: [
          { offset: 0, transform: "translate(0, 0)", easing: EASE_IN_OUT },
          { offset: 0.32, transform: "translate(0, 3px)", easing: EASE_OUT },
          { offset: 0.68, transform: "translate(2px, 1px)", easing: EASE_IN_OUT },
          { offset: 0.84, transform: "translate(0, 3px)", easing: EASE_OUT },
          { offset: 1, transform: "translateY(2px)" },
        ],
      },
      {
        parts: ["character"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.3, transform: "rotate(-1.2deg)", easing: EASE_OUT },
          { offset: 0.68, transform: "rotate(1.8deg)", easing: EASE_IN_OUT },
          { offset: 0.86, transform: "rotate(0.5deg)", easing: EASE_OUT },
          { offset: 1, transform: "rotate(0.9deg)" },
        ],
      },
      {
        parts: ["leg-left"],
        frames: [
          { offset: 0, transform: legTransform(-3, 0, -1), easing: EASE_IN_OUT },
          { offset: 0.34, transform: legTransform(-5, 0, -1.4), easing: EASE_OUT },
          { offset: 0.68, transform: legTransform(-7, -2, -1.8), easing: EASE_IN_OUT },
          { offset: 1, transform: legTransform(-7, -2, -1.7) },
        ],
      },
      {
        parts: ["leg-right"],
        frames: [
          { offset: 0, transform: legTransform(3, 0, 1), easing: EASE_IN_OUT },
          { offset: 0.34, transform: legTransform(5, 0, 1.4), easing: EASE_OUT },
          { offset: 0.68, transform: legTransform(5, 0, 1.5), easing: EASE_IN_OUT },
          { offset: 1, transform: legTransform(5, 0, 1.4) },
        ],
      },
      {
        parts: ["arm-left"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.36, transform: "rotate(18deg)", easing: EASE_OUT },
          { offset: 0.68, transform: "rotate(55deg)", easing: EASE_OUT },
          { offset: 0.86, transform: "rotate(46deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(49deg)" },
        ],
      },
      {
        parts: ["arm-right"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.34, transform: "rotate(51deg)", easing: EASE_OUT },
          { offset: 0.5, transform: "rotate(45deg)", easing: EASE_IN_OUT },
          { offset: 0.72, transform: "rotate(-35deg)", easing: EASE_OUT },
          { offset: 0.88, transform: "rotate(-27deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(-30deg)" },
        ],
      },
      ...expressionTracks({ mouth: "mouth-steady", holdUntil: 0.08, changeBy: 0.2 }),
      {
        parts: ["brows-attentive"],
        frames: [
          { offset: 0, opacity: 0 },
          { offset: 0.46, opacity: 0 },
          { offset: 0.62, opacity: 1, easing: EASE_OUT },
          { offset: 1, opacity: 1 },
        ],
      },
      {
        parts: ["repair-glint"],
        frames: softAccentFrames({
          start: 0.58,
          appear: 0.67,
          hold: 0.76,
          vanish: 0.9,
          x: 7,
          y: -1,
          opacity: 0.68,
        }),
      },
    ],
  },
  idle: {
    duration: 5800,
    tracks: [
      { parts: ["root"], frames: subtleRootIdle(2, 0.8) },
      { parts: ["character"], frames: subtleRotationIdle(0.9, -0.3) },
      {
        parts: ["leg-left"],
        frames: subtleLegIdle({
          x: -7,
          y: -2,
          rotation: -1.7,
          driftX: 0.25,
          driftY: 0.2,
          driftRotation: 0.15,
        }),
      },
      {
        parts: ["leg-right"],
        frames: subtleLegIdle({ x: 5, rotation: 1.4, driftX: -0.2, driftRotation: -0.15 }),
      },
      { parts: ["arm-left"], frames: subtleRotationIdle(49, -0.45) },
      { parts: ["arm-right"], frames: subtleRotationIdle(-30, 0.5) },
    ],
  },
  staticPose: {
    root: { transform: "translateY(2px)" },
    character: { transform: "rotate(0.9deg)" },
    "leg-left": { transform: legTransform(-7, -2, -1.7) },
    "leg-right": { transform: legTransform(5, 0, 1.4) },
    "arm-left": { transform: "rotate(49deg)" },
    "arm-right": { transform: "rotate(-30deg)" },
    "brows-attentive": { opacity: "1" },
    "mouth-rest": { opacity: "0" },
    "mouth-steady": { opacity: "1" },
  },
};
