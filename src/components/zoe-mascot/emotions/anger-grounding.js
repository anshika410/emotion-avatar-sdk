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

export const angerGroundingEmotion = {
  id: "anger-grounding",
  family: "anger",
  intensity: "strong",
  title: "Steady grounding",
  summary: "Intensity registered · stance widened · hands lowered · calm release",
  accessibleLabel: "Zoe grounding a moment of strong anger with calm steadiness",
  entrance: {
    duration: 3000,
    tracks: [
      {
        parts: ["root"],
        frames: [
          { offset: 0, transform: "translateY(0)", easing: EASE_IN_OUT },
          { offset: 0.15, transform: "translateY(-3px)", easing: EASE_OUT },
          { offset: 0.42, transform: "translateY(-1px)", easing: EASE_IN_OUT },
          { offset: 0.72, transform: "translateY(4px)", easing: EASE_OUT },
          { offset: 1, transform: "translateY(3px)" },
        ],
      },
      {
        parts: ["character"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.2, transform: "rotate(-1.2deg)", easing: EASE_OUT },
          { offset: 0.48, transform: "rotate(0.8deg)", easing: EASE_IN_OUT },
          { offset: 0.76, transform: "rotate(-0.4deg)", easing: EASE_OUT },
          { offset: 1, transform: "rotate(0deg)" },
        ],
      },
      {
        parts: ["leg-left"],
        frames: [
          { offset: 0, transform: legTransform(-3, 0, -1), easing: EASE_IN_OUT },
          { offset: 0.24, transform: legTransform(-5, 0, -1.5), easing: EASE_OUT },
          { offset: 0.5, transform: legTransform(-8, 0, -2), easing: EASE_IN_OUT },
          { offset: 0.76, transform: legTransform(-7.5, 0, -1.6), easing: EASE_OUT },
          { offset: 1, transform: legTransform(-8, 0, -1.8) },
        ],
      },
      {
        parts: ["leg-right"],
        frames: [
          { offset: 0, transform: legTransform(3, 0, 1), easing: EASE_IN_OUT },
          { offset: 0.24, transform: legTransform(5, 0, 1.5), easing: EASE_OUT },
          { offset: 0.5, transform: legTransform(8, 0, 2), easing: EASE_IN_OUT },
          { offset: 0.76, transform: legTransform(7.5, 0, 1.6), easing: EASE_OUT },
          { offset: 1, transform: legTransform(8, 0, 1.8) },
        ],
      },
      {
        parts: ["arm-left"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.25, transform: "rotate(60deg)", easing: EASE_OUT },
          { offset: 0.56, transform: "rotate(36deg)", easing: EASE_IN_OUT },
          { offset: 0.78, transform: "rotate(11deg)", easing: EASE_OUT },
          { offset: 1, transform: "rotate(13deg)" },
        ],
      },
      {
        parts: ["arm-right"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.25, transform: "rotate(-45deg)", easing: EASE_OUT },
          { offset: 0.56, transform: "rotate(-30deg)", easing: EASE_IN_OUT },
          { offset: 0.78, transform: "rotate(-11deg)", easing: EASE_OUT },
          { offset: 1, transform: "rotate(-13deg)" },
        ],
      },
      ...expressionTracks({
        mouth: "mouth-steady",
        holdUntil: 0.04,
        changeBy: 0.15,
      }),
      {
        parts: ["brows-attentive"],
        frames: holdVisibilityFrames(0, 1, 0.04, 0.15),
      },
      {
        parts: ["tension-left"],
        frames: tensionReleaseFrames({
          start: 0.04,
          appear: 0.12,
          hold: 0.3,
          vanish: 0.6,
          direction: -1,
        }),
      },
      {
        parts: ["tension-right"],
        frames: tensionReleaseFrames({
          start: 0.08,
          appear: 0.16,
          hold: 0.34,
          vanish: 0.66,
          direction: 1,
        }),
      },
    ],
  },
  idle: {
    duration: 5400,
    tracks: [
      { parts: ["root"], frames: subtleRootIdle(3, 1) },
      { parts: ["character"], frames: subtleRotationIdle(0, 0.3) },
      {
        parts: ["leg-left"],
        frames: subtleLegIdle({
          x: -8,
          rotation: -1.8,
          driftX: 0.5,
          driftRotation: 0.4,
        }),
      },
      {
        parts: ["leg-right"],
        frames: subtleLegIdle({
          x: 8,
          rotation: 1.8,
          driftX: -0.5,
          driftRotation: -0.4,
        }),
      },
      {
        parts: ["arm-left"],
        frames: subtleRotationIdle(13, -0.7),
      },
      {
        parts: ["arm-right"],
        frames: subtleRotationIdle(-13, 0.7),
      },
    ],
  },
  staticPose: {
    root: { transform: "translateY(3px)" },
    "leg-left": { transform: legTransform(-8, 0, -1.8) },
    "leg-right": { transform: legTransform(8, 0, 1.8) },
    "arm-left": { transform: "rotate(13deg)" },
    "arm-right": { transform: "rotate(-13deg)" },
    "mouth-rest": { opacity: "0" },
    "mouth-steady": { opacity: "1" },
    "brows-attentive": { opacity: "1" },
  },
};
