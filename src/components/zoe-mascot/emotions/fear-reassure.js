import { EASE_IN_OUT, EASE_OUT } from "./shared.js";
import {
  expressionTracks,
  legTransform,
  softAccentFrames,
  subtleLegIdle,
  subtleRootIdle,
  subtleRotationIdle,
} from "./empathetic-shared.js";

export const fearReassureEmotion = {
  id: "fear-reassure",
  family: "fear",
  intensity: "gentle",
  title: "Gentle reassurance",
  summary: "Alert concern · reassuring palm · anchored stance · slow nod",
  accessibleLabel: "Zoe responding to fear with calm gentle reassurance",
  entrance: {
    duration: 2500,
    tracks: [
      {
        parts: ["root"],
        frames: [
          { offset: 0, transform: "translateY(0)", easing: EASE_IN_OUT },
          { offset: 0.16, transform: "translateY(-2px)", easing: EASE_OUT },
          { offset: 0.48, transform: "translateY(1px)", easing: EASE_IN_OUT },
          { offset: 1, transform: "translateY(0)" },
        ],
      },
      {
        parts: ["character"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.2, transform: "rotate(-0.8deg)", easing: EASE_OUT },
          { offset: 0.58, transform: "rotate(1.4deg)", easing: EASE_IN_OUT },
          { offset: 0.76, transform: "rotate(0.3deg)", easing: EASE_OUT },
          { offset: 1, transform: "rotate(0.6deg)" },
        ],
      },
      {
        parts: ["leg-left"],
        frames: [
          { offset: 0, transform: legTransform(-3, 0, -1), easing: EASE_IN_OUT },
          { offset: 0.34, transform: legTransform(-6, 0, -1.6), easing: EASE_OUT },
          { offset: 1, transform: legTransform(-6, 0, -1.5) },
        ],
      },
      {
        parts: ["leg-right"],
        frames: [
          { offset: 0, transform: legTransform(3, 0, 1), easing: EASE_IN_OUT },
          { offset: 0.34, transform: legTransform(4, 0, 1.2), easing: EASE_OUT },
          { offset: 1, transform: legTransform(4, 0, 1.2) },
        ],
      },
      {
        parts: ["arm-left"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.38, transform: "rotate(68deg)", easing: EASE_OUT },
          { offset: 0.7, transform: "rotate(59deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(61deg)" },
        ],
      },
      {
        parts: ["arm-right"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.42, transform: "rotate(17deg)", easing: EASE_OUT },
          { offset: 1, transform: "rotate(14deg)" },
        ],
      },
      ...expressionTracks({
        eyes: "eyes-concerned",
        mouth: "mouth-steady",
        holdUntil: 0.05,
        changeBy: 0.16,
      }),
      {
        parts: ["calm-arc"],
        frames: softAccentFrames({
          start: 0.3,
          appear: 0.42,
          hold: 0.6,
          vanish: 0.78,
          y: -4,
          opacity: 0.48,
        }),
      },
    ],
  },
  idle: {
    duration: 5600,
    tracks: [
      { parts: ["root"], frames: subtleRootIdle(0, 1) },
      { parts: ["character"], frames: subtleRotationIdle(0.6, -0.35) },
      {
        parts: ["leg-left"],
        frames: subtleLegIdle({
          x: -6,
          rotation: -1.5,
          driftX: 0.3,
          driftRotation: 0.25,
        }),
      },
      {
        parts: ["leg-right"],
        frames: subtleLegIdle({
          x: 4,
          rotation: 1.2,
          driftX: -0.3,
          driftRotation: -0.25,
        }),
      },
      { parts: ["arm-left"], frames: subtleRotationIdle(61, -0.7) },
      { parts: ["arm-right"], frames: subtleRotationIdle(14, -0.4) },
    ],
  },
  staticPose: {
    character: { transform: "rotate(0.6deg)" },
    "leg-left": { transform: legTransform(-6, 0, -1.5) },
    "leg-right": { transform: legTransform(4, 0, 1.2) },
    "arm-left": { transform: "rotate(61deg)" },
    "arm-right": { transform: "rotate(14deg)" },
    "eyes-open": { opacity: "0" },
    "eyes-concerned": { opacity: "1" },
    "mouth-rest": { opacity: "0" },
    "mouth-steady": { opacity: "1" },
  },
};
