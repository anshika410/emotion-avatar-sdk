import { EASE_IN_OUT, EASE_OUT } from "./shared.js";
import {
  expressionTracks,
  legTransform,
  softAccentFrames,
  subtleLegIdle,
  subtleRootIdle,
  subtleRotationIdle,
} from "./empathetic-shared.js";

export const confusionClarifyEmotion = {
  id: "confusion-clarify",
  family: "confusion",
  intensity: "strong",
  title: "Active clarification",
  summary: "Focused processing · ideas separated · centered opening · ready to help",
  accessibleLabel: "Zoe actively organizing confusing information and preparing to clarify",
  entrance: {
    duration: 2800,
    tracks: [
      {
        parts: ["root"],
        frames: [
          { offset: 0, transform: "translate(0, 0)", easing: EASE_IN_OUT },
          { offset: 0.24, transform: "translate(-2px, 1px)", easing: EASE_OUT },
          { offset: 0.5, transform: "translate(2px, 0)", easing: EASE_IN_OUT },
          { offset: 0.72, transform: "translate(0, 2px)", easing: EASE_OUT },
          { offset: 1, transform: "translateY(1px)" },
        ],
      },
      {
        parts: ["character"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.26, transform: "rotate(3deg)", easing: EASE_OUT },
          { offset: 0.5, transform: "rotate(-2deg)", easing: EASE_IN_OUT },
          { offset: 0.74, transform: "rotate(0.8deg)", easing: EASE_OUT },
          { offset: 1, transform: "rotate(0deg)" },
        ],
      },
      {
        parts: ["leg-left"],
        frames: [
          { offset: 0, transform: legTransform(-3, 0, -1), easing: EASE_IN_OUT },
          { offset: 0.38, transform: legTransform(-6, 0, -1.6), easing: EASE_OUT },
          { offset: 0.7, transform: legTransform(-7, 0, -1.8), easing: EASE_IN_OUT },
          { offset: 1, transform: legTransform(-7, 0, -1.7) },
        ],
      },
      {
        parts: ["leg-right"],
        frames: [
          { offset: 0, transform: legTransform(3, 0, 1), easing: EASE_IN_OUT },
          { offset: 0.38, transform: legTransform(6, 0, 1.6), easing: EASE_OUT },
          { offset: 0.7, transform: legTransform(7, 0, 1.8), easing: EASE_IN_OUT },
          { offset: 1, transform: legTransform(7, 0, 1.7) },
        ],
      },
      {
        parts: ["arm-left"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.42, transform: "rotate(64deg)", easing: EASE_OUT },
          { offset: 0.62, transform: "rotate(55deg)", easing: EASE_IN_OUT },
          { offset: 0.82, transform: "rotate(40deg)", easing: EASE_OUT },
          { offset: 1, transform: "rotate(43deg)" },
        ],
      },
      {
        parts: ["arm-right"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.42, transform: "rotate(-59deg)", easing: EASE_OUT },
          { offset: 0.62, transform: "rotate(-50deg)", easing: EASE_IN_OUT },
          { offset: 0.82, transform: "rotate(-30deg)", easing: EASE_OUT },
          { offset: 1, transform: "rotate(-33deg)" },
        ],
      },
      ...expressionTracks({
        eyes: "eyes-curious",
        mouth: "mouth-questioning",
        holdUntil: 0.08,
        changeBy: 0.2,
      }),
      {
        parts: ["brows-attentive"],
        frames: [
          { offset: 0, opacity: 0 },
          { offset: 0.48, opacity: 0 },
          { offset: 0.66, opacity: 1, easing: EASE_OUT },
          { offset: 1, opacity: 1 },
        ],
      },
      {
        parts: ["orientation-left"],
        frames: softAccentFrames({
          start: 0.24,
          appear: 0.34,
          hold: 0.48,
          vanish: 0.66,
          x: -5,
          y: -3,
          rotation: -6,
          opacity: 0.62,
        }),
      },
      {
        parts: ["orientation-right"],
        frames: softAccentFrames({
          start: 0.28,
          appear: 0.38,
          hold: 0.52,
          vanish: 0.7,
          x: 5,
          y: -3,
          rotation: 6,
          opacity: 0.62,
        }),
      },
    ],
  },
  idle: {
    duration: 5400,
    tracks: [
      { parts: ["root"], frames: subtleRootIdle(1, 0.8) },
      { parts: ["character"], frames: subtleRotationIdle(0, 0.3) },
      {
        parts: ["leg-left"],
        frames: subtleLegIdle({ x: -7, rotation: -1.7, driftX: 0.25, driftRotation: 0.15 }),
      },
      {
        parts: ["leg-right"],
        frames: subtleLegIdle({ x: 7, rotation: 1.7, driftX: -0.25, driftRotation: -0.15 }),
      },
      { parts: ["arm-left"], frames: subtleRotationIdle(43, -0.5) },
      { parts: ["arm-right"], frames: subtleRotationIdle(-33, 0.5) },
    ],
  },
  staticPose: {
    root: { transform: "translateY(1px)" },
    "leg-left": { transform: legTransform(-7, 0, -1.7) },
    "leg-right": { transform: legTransform(7, 0, 1.7) },
    "arm-left": { transform: "rotate(43deg)" },
    "arm-right": { transform: "rotate(-33deg)" },
    "eyes-open": { opacity: "0" },
    "eyes-curious": { opacity: "1" },
    "brows-attentive": { opacity: "1" },
    "mouth-rest": { opacity: "0" },
    "mouth-questioning": { opacity: "1" },
  },
};
