import { EASE_IN_OUT, EASE_OUT } from "./shared.js";
import {
  expressionTracks,
  legTransform,
  softAccentFrames,
  subtleLegIdle,
  subtleRootIdle,
  subtleRotationIdle,
} from "./empathetic-shared.js";

export const disgustComposeEmotion = {
  id: "disgust-compose",
  family: "disgust",
  intensity: "strong",
  title: "Restore composure",
  summary: "Aversion registered · boundaries opened · centered release · calm finish",
  accessibleLabel: "Zoe acknowledging strong disgust and returning to calm composure",
  entrance: {
    duration: 2800,
    tracks: [
      {
        parts: ["root"],
        frames: [
          { offset: 0, transform: "translate(0, 0)", easing: EASE_IN_OUT },
          { offset: 0.2, transform: "translate(-3px, -1px)", easing: EASE_OUT },
          { offset: 0.42, transform: "translate(-2px, 0)", easing: EASE_IN_OUT },
          { offset: 0.72, transform: "translate(1px, 1px)", easing: EASE_OUT },
          { offset: 1, transform: "translate(0, 0)" },
        ],
      },
      {
        parts: ["character"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.22, transform: "rotate(-2.4deg)", easing: EASE_OUT },
          { offset: 0.5, transform: "rotate(-0.8deg)", easing: EASE_IN_OUT },
          { offset: 0.76, transform: "rotate(0.5deg)", easing: EASE_OUT },
          { offset: 1, transform: "rotate(0deg)" },
        ],
      },
      {
        parts: ["leg-left"],
        frames: [
          { offset: 0, transform: legTransform(-3, 0, -1), easing: EASE_IN_OUT },
          { offset: 0.3, transform: legTransform(-6, 0, -1.7), easing: EASE_OUT },
          { offset: 0.68, transform: legTransform(-7, 0, -1.8), easing: EASE_IN_OUT },
          { offset: 1, transform: legTransform(-6, 0, -1.5) },
        ],
      },
      {
        parts: ["leg-right"],
        frames: [
          { offset: 0, transform: legTransform(3, 0, 1), easing: EASE_IN_OUT },
          { offset: 0.3, transform: legTransform(6, 0, 1.7), easing: EASE_OUT },
          { offset: 0.68, transform: legTransform(7, 0, 1.8), easing: EASE_IN_OUT },
          { offset: 1, transform: legTransform(6, 0, 1.5) },
        ],
      },
      {
        parts: ["arm-left"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.3, transform: "rotate(66deg)", easing: EASE_OUT },
          { offset: 0.58, transform: "rotate(52deg)", easing: EASE_IN_OUT },
          { offset: 0.82, transform: "rotate(25deg)", easing: EASE_OUT },
          { offset: 1, transform: "rotate(28deg)" },
        ],
      },
      {
        parts: ["arm-right"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.3, transform: "rotate(-61deg)", easing: EASE_OUT },
          { offset: 0.58, transform: "rotate(-49deg)", easing: EASE_IN_OUT },
          { offset: 0.82, transform: "rotate(-23deg)", easing: EASE_OUT },
          { offset: 1, transform: "rotate(-26deg)" },
        ],
      },
      ...expressionTracks({
        eyes: "eyes-narrowed",
        mouth: "mouth-discomfort",
        holdUntil: 0.04,
        changeBy: 0.14,
      }),
      {
        parts: ["release-left"],
        frames: softAccentFrames({
          start: 0.16,
          appear: 0.25,
          hold: 0.42,
          vanish: 0.62,
          x: -7,
          y: -3,
          rotation: -6,
          opacity: 0.65,
        }),
      },
      {
        parts: ["release-right"],
        frames: softAccentFrames({
          start: 0.2,
          appear: 0.29,
          hold: 0.46,
          vanish: 0.66,
          x: 7,
          y: -3,
          rotation: 6,
          opacity: 0.65,
        }),
      },
    ],
  },
  idle: {
    duration: 5400,
    tracks: [
      { parts: ["root"], frames: subtleRootIdle(0, 1) },
      { parts: ["character"], frames: subtleRotationIdle(0, 0.25) },
      {
        parts: ["leg-left"],
        frames: subtleLegIdle({
          x: -6,
          rotation: -1.5,
          driftX: 0.35,
          driftRotation: 0.25,
        }),
      },
      {
        parts: ["leg-right"],
        frames: subtleLegIdle({
          x: 6,
          rotation: 1.5,
          driftX: -0.35,
          driftRotation: -0.25,
        }),
      },
      { parts: ["arm-left"], frames: subtleRotationIdle(28, -0.55) },
      { parts: ["arm-right"], frames: subtleRotationIdle(-26, 0.55) },
    ],
  },
  staticPose: {
    "leg-left": { transform: legTransform(-6, 0, -1.5) },
    "leg-right": { transform: legTransform(6, 0, 1.5) },
    "arm-left": { transform: "rotate(28deg)" },
    "arm-right": { transform: "rotate(-26deg)" },
    "eyes-open": { opacity: "0" },
    "eyes-narrowed": { opacity: "1" },
    "mouth-rest": { opacity: "0" },
    "mouth-discomfort": { opacity: "1" },
  },
};
