import { EASE_IN_OUT, EASE_OUT } from "./shared.js";
import {
  accentPulseFrames,
  expressionTracks,
  legTransform,
  subtleLegIdle,
  subtleRootIdle,
  subtleRotationIdle,
} from "./empathetic-shared.js";

export const loveHeartfeltEmotion = {
  id: "love-heartfelt",
  family: "love",
  intensity: "strong",
  title: "Heartfelt affection",
  summary: "Hand to heart · open hug · gentle lift · restrained heart flourish",
  accessibleLabel: "Zoe expressing heartfelt friendly affection",
  entrance: {
    duration: 2800,
    tracks: [
      {
        parts: ["root"],
        frames: [
          { offset: 0, transform: "translateY(0)", easing: EASE_IN_OUT },
          { offset: 0.24, transform: "translateY(1px)", easing: EASE_IN_OUT },
          { offset: 0.52, transform: "translateY(-7px)", easing: EASE_OUT },
          { offset: 0.76, transform: "translateY(-1px)", easing: EASE_IN_OUT },
          { offset: 1, transform: "translateY(-2px)" },
        ],
      },
      {
        parts: ["character"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.28, transform: "rotate(-2deg)", easing: EASE_OUT },
          { offset: 0.55, transform: "rotate(2deg)", easing: EASE_OUT },
          { offset: 0.78, transform: "rotate(-0.8deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(0deg)" },
        ],
      },
      {
        parts: ["leg-left"],
        frames: [
          { offset: 0, transform: legTransform(-3, 0, -1), easing: EASE_IN_OUT },
          { offset: 0.3, transform: legTransform(-3, 0, -0.8), easing: EASE_OUT },
          { offset: 0.58, transform: legTransform(-6, 0, -1.8), easing: EASE_OUT },
          { offset: 0.8, transform: legTransform(-5.5, 0, -1.3), easing: EASE_IN_OUT },
          { offset: 1, transform: legTransform(-6, 0, -1.5) },
        ],
      },
      {
        parts: ["leg-right"],
        frames: [
          { offset: 0, transform: legTransform(3, 0, 1), easing: EASE_IN_OUT },
          { offset: 0.3, transform: legTransform(3, 0, 0.8), easing: EASE_OUT },
          { offset: 0.58, transform: legTransform(6, 0, 1.8), easing: EASE_OUT },
          { offset: 0.8, transform: legTransform(5.5, 0, 1.3), easing: EASE_IN_OUT },
          { offset: 1, transform: legTransform(6, 0, 1.5) },
        ],
      },
      {
        parts: ["arm-left"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.3, transform: "rotate(-70deg)", easing: EASE_OUT },
          { offset: 0.58, transform: "rotate(48deg)", easing: EASE_OUT },
          { offset: 0.8, transform: "rotate(36deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(40deg)" },
        ],
      },
      {
        parts: ["arm-right"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.3, transform: "rotate(28deg)", easing: EASE_OUT },
          { offset: 0.58, transform: "rotate(-43deg)", easing: EASE_OUT },
          { offset: 0.8, transform: "rotate(-32deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(-36deg)" },
        ],
      },
      ...expressionTracks({
        eyes: "eyes-happy",
        mouth: "mouth-wide",
        holdUntil: 0.06,
        changeBy: 0.18,
      }),
      {
        parts: ["heart-left"],
        frames: accentPulseFrames({
          start: 0.48,
          appear: 0.58,
          hold: 0.72,
          vanish: 0.87,
          rotation: -7,
        }),
      },
      {
        parts: ["heart-right"],
        frames: accentPulseFrames({
          start: 0.52,
          appear: 0.62,
          hold: 0.76,
          vanish: 0.91,
          rotation: 7,
        }),
      },
    ],
  },
  idle: {
    duration: 5000,
    tracks: [
      { parts: ["root"], frames: subtleRootIdle(-2, -1) },
      { parts: ["character"], frames: subtleRotationIdle(0, 0.65) },
      {
        parts: ["leg-left"],
        frames: subtleLegIdle({
          x: -6,
          rotation: -1.5,
          driftX: 0.5,
          driftRotation: 0.4,
        }),
      },
      {
        parts: ["leg-right"],
        frames: subtleLegIdle({
          x: 6,
          rotation: 1.5,
          driftX: -0.5,
          driftRotation: -0.4,
        }),
      },
      {
        parts: ["arm-left"],
        frames: subtleRotationIdle(40, -0.9),
      },
      {
        parts: ["arm-right"],
        frames: subtleRotationIdle(-36, 0.9),
      },
    ],
  },
  staticPose: {
    root: { transform: "translateY(-2px)" },
    "leg-left": { transform: legTransform(-6, 0, -1.5) },
    "leg-right": { transform: legTransform(6, 0, 1.5) },
    "arm-left": { transform: "rotate(40deg)" },
    "arm-right": { transform: "rotate(-36deg)" },
    "eyes-open": { opacity: "0" },
    "eyes-happy": { opacity: "1" },
    "mouth-rest": { opacity: "0" },
    "mouth-wide": { opacity: "1" },
    "heart-left": { opacity: "1", transform: "scale(0.82) rotate(-5deg)" },
    "heart-right": { opacity: "1", transform: "scale(0.82) rotate(5deg)" },
  },
};
