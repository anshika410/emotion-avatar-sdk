import { EASE_IN_OUT, EASE_OUT } from "./shared.js";
import {
  expressionTracks,
  legTransform,
  softAccentFrames,
  subtleLegIdle,
  subtleRootIdle,
  subtleRotationIdle,
} from "./empathetic-shared.js";

export const shameSupportEmotion = {
  id: "shame-support",
  family: "shame",
  intensity: "strong",
  title: "Deeper emotional support",
  summary: "Attentive lift · supported dip · welcoming arms · held acceptance",
  accessibleLabel: "Zoe offering deeper nonjudgmental support in response to shame",
  entrance: {
    duration: 3000,
    tracks: [
      {
        parts: ["root"],
        frames: [
          { offset: 0, transform: "translateY(0)", easing: EASE_IN_OUT },
          { offset: 0.18, transform: "translateY(-2px)", easing: EASE_OUT },
          { offset: 0.58, transform: "translateY(6px)", easing: EASE_IN_OUT },
          { offset: 0.78, transform: "translateY(4px)", easing: EASE_OUT },
          { offset: 1, transform: "translateY(5px)" },
        ],
      },
      {
        parts: ["character"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.22, transform: "rotate(0.6deg)", easing: EASE_OUT },
          { offset: 0.6, transform: "rotate(-3deg)", easing: EASE_IN_OUT },
          { offset: 0.82, transform: "rotate(-2deg)", easing: EASE_OUT },
          { offset: 1, transform: "rotate(-2.4deg)" },
        ],
      },
      {
        parts: ["leg-left"],
        frames: [
          { offset: 0, transform: legTransform(-3, 0, -1), easing: EASE_IN_OUT },
          { offset: 0.46, transform: legTransform(-6, 0, -1.6), easing: EASE_OUT },
          { offset: 1, transform: legTransform(-6, 0, -1.5) },
        ],
      },
      {
        parts: ["leg-right"],
        frames: [
          { offset: 0, transform: legTransform(3, 0, 1), easing: EASE_IN_OUT },
          { offset: 0.46, transform: legTransform(6, 0, 1.6), easing: EASE_OUT },
          { offset: 1, transform: legTransform(6, 0, 1.5) },
        ],
      },
      {
        parts: ["arm-left"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.2, transform: "rotate(6deg)", easing: EASE_OUT },
          { offset: 0.58, transform: "rotate(-44deg)", easing: EASE_OUT },
          { offset: 0.82, transform: "rotate(-37deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(-39deg)" },
        ],
      },
      {
        parts: ["arm-right"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.22, transform: "rotate(-5deg)", easing: EASE_OUT },
          { offset: 0.6, transform: "rotate(40deg)", easing: EASE_OUT },
          { offset: 0.82, transform: "rotate(33deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(35deg)" },
        ],
      },
      ...expressionTracks({
        eyes: "eyes-concerned",
        mouth: "mouth-steady",
        holdUntil: 0.08,
        changeBy: 0.2,
      }),
      {
        parts: ["acceptance-glint"],
        frames: softAccentFrames({
          start: 0.42,
          appear: 0.51,
          hold: 0.66,
          vanish: 0.8,
          x: 2,
          y: -6,
          opacity: 0.68,
        }),
      },
    ],
  },
  idle: {
    duration: 6000,
    tracks: [
      { parts: ["root"], frames: subtleRootIdle(5, 0.8) },
      { parts: ["character"], frames: subtleRotationIdle(-2.4, 0.35) },
      {
        parts: ["leg-left"],
        frames: subtleLegIdle({ x: -6, rotation: -1.5, driftX: 0.25, driftRotation: 0.15 }),
      },
      {
        parts: ["leg-right"],
        frames: subtleLegIdle({ x: 6, rotation: 1.5, driftX: -0.25, driftRotation: -0.15 }),
      },
      { parts: ["arm-left"], frames: subtleRotationIdle(-39, 0.45) },
      { parts: ["arm-right"], frames: subtleRotationIdle(35, -0.45) },
    ],
  },
  staticPose: {
    root: { transform: "translateY(5px)" },
    character: { transform: "rotate(-2.4deg)" },
    "leg-left": { transform: legTransform(-6, 0, -1.5) },
    "leg-right": { transform: legTransform(6, 0, 1.5) },
    "arm-left": { transform: "rotate(-39deg)" },
    "arm-right": { transform: "rotate(35deg)" },
    "eyes-open": { opacity: "0" },
    "eyes-concerned": { opacity: "1" },
    "mouth-rest": { opacity: "0" },
    "mouth-steady": { opacity: "1" },
  },
};
