import { EASE_IN_OUT, EASE_OUT } from "./shared.js";
import {
  expressionTracks,
  legTransform,
  softAccentFrames,
  subtleLegIdle,
  subtleRootIdle,
  subtleRotationIdle,
} from "./empathetic-shared.js";

export const confusionCuriousEmotion = {
  id: "confusion-curious",
  family: "confusion",
  intensity: "gentle",
  title: "Curious attention",
  summary: "Processing pause · curious tilt · raised hand · clarifying nod",
  accessibleLabel: "Zoe responding to confusion with engaged curious attention",
  entrance: {
    duration: 2200,
    tracks: [
      {
        parts: ["root"],
        frames: [
          { offset: 0, transform: "translate(0, 0)", easing: EASE_IN_OUT },
          { offset: 0.24, transform: "translate(-1px, 0)", easing: EASE_OUT },
          { offset: 0.68, transform: "translate(-2px, 2px)", easing: EASE_IN_OUT },
          { offset: 0.84, transform: "translate(0, 0)", easing: EASE_OUT },
          { offset: 1, transform: "translateY(1px)" },
        ],
      },
      {
        parts: ["character"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.34, transform: "rotate(2.6deg)", easing: EASE_OUT },
          { offset: 0.7, transform: "rotate(1.6deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(2deg)" },
        ],
      },
      {
        parts: ["leg-left"],
        frames: [
          { offset: 0, transform: legTransform(-3, 0, -1), easing: EASE_IN_OUT },
          { offset: 0.48, transform: legTransform(-6, 0, -1.5), easing: EASE_OUT },
          { offset: 1, transform: legTransform(-6, 0, -1.4) },
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
          { offset: 0.44, transform: "rotate(55deg)", easing: EASE_OUT },
          { offset: 0.72, transform: "rotate(46deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(49deg)" },
        ],
      },
      {
        parts: ["arm-right"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.52, transform: "rotate(14deg)", easing: EASE_OUT },
          { offset: 1, transform: "rotate(11deg)" },
        ],
      },
      ...expressionTracks({
        eyes: "eyes-curious",
        mouth: "mouth-questioning",
        holdUntil: 0.12,
        changeBy: 0.26,
      }),
      {
        parts: ["orientation-right"],
        frames: softAccentFrames({
          start: 0.28,
          appear: 0.38,
          hold: 0.52,
          vanish: 0.68,
          x: 2,
          y: -5,
          rotation: 5,
          opacity: 0.58,
        }),
      },
    ],
  },
  idle: {
    duration: 5000,
    tracks: [
      { parts: ["root"], frames: subtleRootIdle(1, 0.8) },
      { parts: ["character"], frames: subtleRotationIdle(2, -0.4) },
      {
        parts: ["leg-left"],
        frames: subtleLegIdle({ x: -6, rotation: -1.4, driftX: 0.25, driftRotation: 0.15 }),
      },
      {
        parts: ["leg-right"],
        frames: subtleLegIdle({ x: 4, rotation: 1.2, driftX: -0.2, driftRotation: -0.15 }),
      },
      { parts: ["arm-left"], frames: subtleRotationIdle(49, -0.55) },
      { parts: ["arm-right"], frames: subtleRotationIdle(11, -0.3) },
    ],
  },
  staticPose: {
    root: { transform: "translateY(1px)" },
    character: { transform: "rotate(2deg)" },
    "leg-left": { transform: legTransform(-6, 0, -1.4) },
    "leg-right": { transform: legTransform(4, 0, 1.2) },
    "arm-left": { transform: "rotate(49deg)" },
    "arm-right": { transform: "rotate(11deg)" },
    "eyes-open": { opacity: "0" },
    "eyes-curious": { opacity: "1" },
    "mouth-rest": { opacity: "0" },
    "mouth-questioning": { opacity: "1" },
  },
};
