import { EASE_IN_OUT, EASE_OUT } from "./shared.js";
import {
  expressionTracks,
  holdVisibilityFrames,
  legTransform,
  subtleLegIdle,
  subtleRootIdle,
  subtleRotationIdle,
  tensionReleaseFrames,
} from "./empathetic-shared.js";

export const angerAcknowledgeEmotion = {
  id: "anger-acknowledge",
  family: "anger",
  intensity: "gentle",
  title: "Calm acknowledgment",
  summary: "Intensity recognized · open palm · confirming nod · supported stance",
  accessibleLabel: "Zoe calmly acknowledging the user's frustration",
  entrance: {
    duration: 2400,
    tracks: [
      {
        parts: ["root"],
        frames: [
          { offset: 0, transform: "translateY(0)", easing: EASE_IN_OUT },
          { offset: 0.16, transform: "translateY(-3px)", easing: EASE_OUT },
          { offset: 0.4, transform: "translateY(0)", easing: EASE_IN_OUT },
          { offset: 0.68, transform: "translateY(1px)", easing: EASE_OUT },
          { offset: 1, transform: "translateY(0)" },
        ],
      },
      {
        parts: ["character"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.2, transform: "rotate(0.8deg)", easing: EASE_OUT },
          { offset: 0.52, transform: "rotate(-1.2deg)", easing: EASE_IN_OUT },
          { offset: 0.72, transform: "rotate(0.5deg)", easing: EASE_OUT },
          { offset: 1, transform: "rotate(0deg)" },
        ],
      },
      {
        parts: ["leg-left"],
        frames: [
          { offset: 0, transform: legTransform(-3, 0, -1), easing: EASE_IN_OUT },
          { offset: 0.24, transform: legTransform(-4, 0, -1.4), easing: EASE_OUT },
          { offset: 0.58, transform: legTransform(-3.5, 0, -1), easing: EASE_IN_OUT },
          { offset: 1, transform: legTransform(-4, 0, -1.2) },
        ],
      },
      {
        parts: ["leg-right"],
        frames: [
          { offset: 0, transform: legTransform(3, 0, 1), easing: EASE_IN_OUT },
          { offset: 0.3, transform: legTransform(5, 0, 1.6), easing: EASE_OUT },
          { offset: 0.56, transform: legTransform(7, 0, 2), easing: EASE_IN_OUT },
          { offset: 1, transform: legTransform(7, 0, 1.5) },
        ],
      },
      {
        parts: ["arm-left"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.3, transform: "rotate(88deg)", easing: EASE_OUT },
          { offset: 0.62, transform: "rotate(78deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(82deg)" },
        ],
      },
      {
        parts: ["arm-right"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.42, transform: "rotate(-6deg)", easing: EASE_OUT },
          { offset: 1, transform: "rotate(-4deg)" },
        ],
      },
      ...expressionTracks({
        mouth: "mouth-steady",
        holdUntil: 0.06,
        changeBy: 0.17,
      }),
      {
        parts: ["brows-attentive"],
        frames: holdVisibilityFrames(0, 1, 0.06, 0.17),
      },
      {
        parts: ["tension-left"],
        frames: tensionReleaseFrames({
          start: 0.04,
          appear: 0.12,
          hold: 0.24,
          vanish: 0.42,
          direction: -1,
        }),
      },
    ],
  },
  idle: {
    duration: 5000,
    tracks: [
      { parts: ["root"], frames: subtleRootIdle(0, 1) },
      { parts: ["character"], frames: subtleRotationIdle(0, 0.3) },
      {
        parts: ["leg-left"],
        frames: subtleLegIdle({
          x: -4,
          rotation: -1.2,
          driftX: -0.4,
          driftRotation: -0.3,
        }),
      },
      {
        parts: ["leg-right"],
        frames: subtleLegIdle({
          x: 7,
          rotation: 1.5,
          driftX: -0.5,
          driftRotation: -0.4,
        }),
      },
      {
        parts: ["arm-left"],
        frames: subtleRotationIdle(82, -0.8),
      },
      {
        parts: ["arm-right"],
        frames: subtleRotationIdle(-4, 0.5),
      },
    ],
  },
  staticPose: {
    "leg-left": { transform: legTransform(-4, 0, -1.2) },
    "leg-right": { transform: legTransform(7, 0, 1.5) },
    "arm-left": { transform: "rotate(82deg)" },
    "arm-right": { transform: "rotate(-4deg)" },
    "mouth-rest": { opacity: "0" },
    "mouth-steady": { opacity: "1" },
    "brows-attentive": { opacity: "1" },
  },
};
