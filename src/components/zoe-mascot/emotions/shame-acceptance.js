import { EASE_IN_OUT, EASE_OUT } from "./shared.js";
import {
  expressionTracks,
  legTransform,
  softAccentFrames,
  subtleLegIdle,
  subtleRootIdle,
  subtleRotationIdle,
} from "./empathetic-shared.js";

export const shameAcceptanceEmotion = {
  id: "shame-acceptance",
  family: "shame",
  intensity: "gentle",
  title: "Nonjudgmental acceptance",
  summary: "Quiet attention · caring tilt · inward-open hands · accepting nod",
  accessibleLabel: "Zoe responding to shame with calm nonjudgmental acceptance",
  entrance: {
    duration: 2400,
    tracks: [
      {
        parts: ["root"],
        frames: [
          { offset: 0, transform: "translateY(0)", easing: EASE_IN_OUT },
          { offset: 0.3, transform: "translateY(-1px)", easing: EASE_OUT },
          { offset: 0.68, transform: "translateY(3px)", easing: EASE_IN_OUT },
          { offset: 0.84, transform: "translateY(1px)", easing: EASE_OUT },
          { offset: 1, transform: "translateY(2px)" },
        ],
      },
      {
        parts: ["character"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.4, transform: "rotate(-2.2deg)", easing: EASE_OUT },
          { offset: 0.76, transform: "rotate(-1.4deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(-1.8deg)" },
        ],
      },
      {
        parts: ["leg-left"],
        frames: [
          { offset: 0, transform: legTransform(-3, 0, -1), easing: EASE_IN_OUT },
          { offset: 0.56, transform: legTransform(-4, 0, -1.2), easing: EASE_OUT },
          { offset: 1, transform: legTransform(-4, 0, -1.2) },
        ],
      },
      {
        parts: ["leg-right"],
        frames: [
          { offset: 0, transform: legTransform(3, 0, 1), easing: EASE_IN_OUT },
          { offset: 0.56, transform: legTransform(4, 0, 1.2), easing: EASE_OUT },
          { offset: 1, transform: legTransform(4, 0, 1.2) },
        ],
      },
      {
        parts: ["arm-left"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.52, transform: "rotate(-22deg)", easing: EASE_OUT },
          { offset: 0.78, transform: "rotate(-17deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(-18deg)" },
        ],
      },
      {
        parts: ["arm-right"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.56, transform: "rotate(22deg)", easing: EASE_OUT },
          { offset: 0.8, transform: "rotate(17deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(18deg)" },
        ],
      },
      ...expressionTracks({ mouth: "mouth-neutral", holdUntil: 0.08, changeBy: 0.2 }),
      {
        parts: ["acceptance-glint"],
        frames: softAccentFrames({
          start: 0.42,
          appear: 0.52,
          hold: 0.64,
          vanish: 0.78,
          x: 1,
          y: -5,
          opacity: 0.62,
        }),
      },
    ],
  },
  idle: {
    duration: 5400,
    tracks: [
      { parts: ["root"], frames: subtleRootIdle(2, 0.8) },
      { parts: ["character"], frames: subtleRotationIdle(-1.8, 0.35) },
      {
        parts: ["leg-left"],
        frames: subtleLegIdle({ x: -4, rotation: -1.2, driftX: 0.2, driftRotation: 0.15 }),
      },
      {
        parts: ["leg-right"],
        frames: subtleLegIdle({ x: 4, rotation: 1.2, driftX: -0.2, driftRotation: -0.15 }),
      },
      { parts: ["arm-left"], frames: subtleRotationIdle(-18, 0.4) },
      { parts: ["arm-right"], frames: subtleRotationIdle(18, -0.4) },
    ],
  },
  staticPose: {
    root: { transform: "translateY(2px)" },
    character: { transform: "rotate(-1.8deg)" },
    "leg-left": { transform: legTransform(-4, 0, -1.2) },
    "leg-right": { transform: legTransform(4, 0, 1.2) },
    "arm-left": { transform: "rotate(-18deg)" },
    "arm-right": { transform: "rotate(18deg)" },
    "mouth-rest": { opacity: "0" },
    "mouth-neutral": { opacity: "1" },
  },
};
