import { EASE_IN_OUT, EASE_OUT } from "./shared.js";
import {
  expressionTracks,
  legTransform,
  softAccentFrames,
  subtleLegIdle,
  subtleRootIdle,
  subtleRotationIdle,
} from "./empathetic-shared.js";

export const guiltUnderstandEmotion = {
  id: "guilt-understand",
  family: "guilt",
  intensity: "gentle",
  title: "Compassionate acknowledgment",
  summary: "Reflective pause · hand to heart · open acknowledgment · measured nod",
  accessibleLabel: "Zoe acknowledging guilt with compassionate reflection",
  entrance: {
    duration: 2500,
    tracks: [
      {
        parts: ["root"],
        frames: [
          { offset: 0, transform: "translateY(0)", easing: EASE_IN_OUT },
          { offset: 0.24, transform: "translateY(1px)", easing: EASE_OUT },
          { offset: 0.66, transform: "translateY(4px)", easing: EASE_IN_OUT },
          { offset: 0.84, transform: "translateY(2px)", easing: EASE_OUT },
          { offset: 1, transform: "translateY(3px)" },
        ],
      },
      {
        parts: ["character"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.32, transform: "rotate(-1deg)", easing: EASE_OUT },
          { offset: 0.7, transform: "rotate(1deg)", easing: EASE_IN_OUT },
          { offset: 0.86, transform: "rotate(0.2deg)", easing: EASE_OUT },
          { offset: 1, transform: "rotate(0.6deg)" },
        ],
      },
      {
        parts: ["leg-left"],
        frames: [
          { offset: 0, transform: legTransform(-3, 0, -1), easing: EASE_IN_OUT },
          { offset: 0.48, transform: legTransform(-5, 0, -1.4), easing: EASE_OUT },
          { offset: 1, transform: legTransform(-5, 0, -1.3) },
        ],
      },
      {
        parts: ["leg-right"],
        frames: [
          { offset: 0, transform: legTransform(3, 0, 1), easing: EASE_IN_OUT },
          { offset: 0.48, transform: legTransform(5, 0, 1.4), easing: EASE_OUT },
          { offset: 1, transform: legTransform(5, 0, 1.3) },
        ],
      },
      {
        parts: ["arm-left"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.5, transform: "rotate(53deg)", easing: EASE_OUT },
          { offset: 0.78, transform: "rotate(46deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(48deg)" },
        ],
      },
      {
        parts: ["arm-right"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.4, transform: "rotate(47deg)", easing: EASE_OUT },
          { offset: 0.72, transform: "rotate(40deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(42deg)" },
        ],
      },
      ...expressionTracks({ mouth: "mouth-neutral", holdUntil: 0.1, changeBy: 0.22 }),
      {
        parts: ["acceptance-glint"],
        frames: softAccentFrames({
          start: 0.34,
          appear: 0.44,
          hold: 0.56,
          vanish: 0.72,
          x: 1,
          y: -5,
          opacity: 0.58,
        }),
      },
    ],
  },
  idle: {
    duration: 5400,
    tracks: [
      { parts: ["root"], frames: subtleRootIdle(3, 0.8) },
      { parts: ["character"], frames: subtleRotationIdle(0.6, -0.3) },
      {
        parts: ["leg-left"],
        frames: subtleLegIdle({ x: -5, rotation: -1.3, driftX: 0.2, driftRotation: 0.15 }),
      },
      {
        parts: ["leg-right"],
        frames: subtleLegIdle({ x: 5, rotation: 1.3, driftX: -0.2, driftRotation: -0.15 }),
      },
      { parts: ["arm-left"], frames: subtleRotationIdle(48, -0.45) },
      { parts: ["arm-right"], frames: subtleRotationIdle(42, -0.35) },
    ],
  },
  staticPose: {
    root: { transform: "translateY(3px)" },
    character: { transform: "rotate(0.6deg)" },
    "leg-left": { transform: legTransform(-5, 0, -1.3) },
    "leg-right": { transform: legTransform(5, 0, 1.3) },
    "arm-left": { transform: "rotate(48deg)" },
    "arm-right": { transform: "rotate(42deg)" },
    "mouth-rest": { opacity: "0" },
    "mouth-neutral": { opacity: "1" },
  },
};
