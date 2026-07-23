import { EASE_IN_OUT, EASE_OUT } from "./shared.js";
import {
  expressionTracks,
  legTransform,
  softAccentFrames,
  subtleLegIdle,
  subtleRootIdle,
  subtleRotationIdle,
} from "./empathetic-shared.js";

export const disgustRecognizeEmotion = {
  id: "disgust-recognize",
  family: "disgust",
  intensity: "gentle",
  title: "Restrained recognition",
  summary: "Discomfort noticed · small boundary · balanced return · composure",
  accessibleLabel: "Zoe recognizing discomfort with restrained composure",
  entrance: {
    duration: 2200,
    tracks: [
      {
        parts: ["root"],
        frames: [
          { offset: 0, transform: "translate(0, 0)", easing: EASE_IN_OUT },
          { offset: 0.28, transform: "translate(-2px, 0)", easing: EASE_OUT },
          { offset: 0.62, transform: "translate(-1px, 1px)", easing: EASE_IN_OUT },
          { offset: 1, transform: "translate(0, 0)" },
        ],
      },
      {
        parts: ["character"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.28, transform: "rotate(-1.6deg)", easing: EASE_OUT },
          { offset: 0.64, transform: "rotate(-0.5deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(0deg)" },
        ],
      },
      {
        parts: ["leg-left"],
        frames: [
          { offset: 0, transform: legTransform(-3, 0, -1), easing: EASE_IN_OUT },
          { offset: 0.34, transform: legTransform(-5, 0, -1.4), easing: EASE_OUT },
          { offset: 1, transform: legTransform(-5, 0, -1.3) },
        ],
      },
      {
        parts: ["leg-right"],
        frames: [
          { offset: 0, transform: legTransform(3, 0, 1), easing: EASE_IN_OUT },
          { offset: 0.34, transform: legTransform(6, 0, 1.6), easing: EASE_OUT },
          { offset: 1, transform: legTransform(6, 0, 1.4) },
        ],
      },
      {
        parts: ["arm-left"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.38, transform: "rotate(57deg)", easing: EASE_OUT },
          { offset: 0.7, transform: "rotate(47deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(45deg)" },
        ],
      },
      {
        parts: ["arm-right"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.42, transform: "rotate(-9deg)", easing: EASE_OUT },
          { offset: 1, transform: "rotate(-6deg)" },
        ],
      },
      ...expressionTracks({
        eyes: "eyes-narrowed",
        mouth: "mouth-discomfort",
        holdUntil: 0.05,
        changeBy: 0.16,
      }),
      {
        parts: ["release-left"],
        frames: softAccentFrames({
          start: 0.22,
          appear: 0.32,
          hold: 0.46,
          vanish: 0.64,
          x: -5,
          y: -2,
          rotation: -4,
          opacity: 0.58,
        }),
      },
    ],
  },
  idle: {
    duration: 5000,
    tracks: [
      { parts: ["root"], frames: subtleRootIdle(0, 1) },
      { parts: ["character"], frames: subtleRotationIdle(0, -0.25) },
      {
        parts: ["leg-left"],
        frames: subtleLegIdle({
          x: -5,
          rotation: -1.3,
          driftX: 0.3,
          driftRotation: 0.2,
        }),
      },
      {
        parts: ["leg-right"],
        frames: subtleLegIdle({
          x: 6,
          rotation: 1.4,
          driftX: -0.3,
          driftRotation: -0.2,
        }),
      },
      { parts: ["arm-left"], frames: subtleRotationIdle(45, -0.5) },
      { parts: ["arm-right"], frames: subtleRotationIdle(-6, 0.35) },
    ],
  },
  staticPose: {
    "leg-left": { transform: legTransform(-5, 0, -1.3) },
    "leg-right": { transform: legTransform(6, 0, 1.4) },
    "arm-left": { transform: "rotate(45deg)" },
    "arm-right": { transform: "rotate(-6deg)" },
    "eyes-open": { opacity: "0" },
    "eyes-narrowed": { opacity: "1" },
    "mouth-rest": { opacity: "0" },
    "mouth-discomfort": { opacity: "1" },
  },
};
