import { EASE_IN_OUT, EASE_OUT } from "./shared.js";
import {
  expressionTracks,
  legTransform,
  softAccentFrames,
  subtleLegIdle,
  subtleRootIdle,
  subtleRotationIdle,
} from "./empathetic-shared.js";

const OPEN_EYE_BEAT = [
  { offset: 0, opacity: 1 },
  { offset: 0.64, opacity: 1 },
  { offset: 0.68, opacity: 0, easing: EASE_OUT },
  { offset: 0.76, opacity: 0 },
  { offset: 0.8, opacity: 1, easing: EASE_OUT },
  { offset: 1, opacity: 1 },
];

const KNOWING_EYE_BEAT = OPEN_EYE_BEAT.map((frame) => ({
  ...frame,
  opacity: frame.opacity === 1 ? 0 : 1,
}));

export const sarcasmKnowingEmotion = {
  id: "sarcasm-knowing",
  family: "sarcasm",
  intensity: "strong",
  title: "Kind playful acknowledgment",
  summary: "Recognition pause · restrained orientation · open hands · calm center",
  accessibleLabel: "Zoe acknowledging clear sarcasm with friendly recognition",
  entrance: {
    duration: 2500,
    tracks: [
      {
        parts: ["root"],
        frames: [
          { offset: 0, transform: "translate(0, 0)", easing: EASE_IN_OUT },
          { offset: 0.28, transform: "translate(-2px, 1px)", easing: EASE_OUT },
          { offset: 0.52, transform: "translate(2px, 0)", easing: EASE_IN_OUT },
          { offset: 0.76, transform: "translate(0, 1px)", easing: EASE_OUT },
          { offset: 1, transform: "translateY(0px)" },
        ],
      },
      {
        parts: ["character"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.3, transform: "rotate(-3deg)", easing: EASE_OUT },
          { offset: 0.54, transform: "rotate(1.8deg)", easing: EASE_IN_OUT },
          { offset: 0.78, transform: "rotate(-0.4deg)", easing: EASE_OUT },
          { offset: 1, transform: "rotate(0deg)" },
        ],
      },
      {
        parts: ["leg-left"],
        frames: [
          { offset: 0, transform: legTransform(-3, 0, -1), easing: EASE_IN_OUT },
          { offset: 0.38, transform: legTransform(-6, 0, -1.5), easing: EASE_OUT },
          { offset: 1, transform: legTransform(-5, 0, -1.3) },
        ],
      },
      {
        parts: ["leg-right"],
        frames: [
          { offset: 0, transform: legTransform(3, 0, 1), easing: EASE_IN_OUT },
          { offset: 0.38, transform: legTransform(6, 0, 1.5), easing: EASE_OUT },
          { offset: 1, transform: legTransform(5, 0, 1.3) },
        ],
      },
      {
        parts: ["arm-left"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.42, transform: "rotate(55deg)", easing: EASE_OUT },
          { offset: 0.68, transform: "rotate(31deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(26deg)" },
        ],
      },
      {
        parts: ["arm-right"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.42, transform: "rotate(-51deg)", easing: EASE_OUT },
          { offset: 0.68, transform: "rotate(-28deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(-23deg)" },
        ],
      },
      {
        parts: ["eyes-open"],
        frames: [
          { offset: 0, opacity: 1 },
          { offset: 0.1, opacity: 1 },
          { offset: 0.18, opacity: 0, easing: EASE_OUT },
          { offset: 0.55, opacity: 0 },
          { offset: 0.7, opacity: 1, easing: EASE_OUT },
          { offset: 1, opacity: 1 },
        ],
      },
      {
        parts: ["eyes-knowing"],
        frames: [
          { offset: 0, opacity: 0 },
          { offset: 0.1, opacity: 0 },
          { offset: 0.18, opacity: 1, easing: EASE_OUT },
          { offset: 0.55, opacity: 1 },
          { offset: 0.7, opacity: 0, easing: EASE_OUT },
          { offset: 1, opacity: 0 },
        ],
      },
      ...expressionTracks({ mouth: "mouth-neutral", holdUntil: 0.06, changeBy: 0.18 }),
      {
        parts: ["knowing-beat-left"],
        frames: softAccentFrames({
          start: 0.16,
          appear: 0.23,
          hold: 0.34,
          vanish: 0.48,
          x: -3,
          y: -3,
          rotation: -4,
          opacity: 0.6,
        }),
      },
      {
        parts: ["knowing-beat-right"],
        frames: softAccentFrames({
          start: 0.2,
          appear: 0.27,
          hold: 0.38,
          vanish: 0.52,
          x: 3,
          y: -3,
          rotation: 4,
          opacity: 0.6,
        }),
      },
    ],
  },
  idle: {
    duration: 5600,
    tracks: [
      { parts: ["root"], frames: subtleRootIdle(0, 0.7) },
      { parts: ["character"], frames: subtleRotationIdle(0, 0.2) },
      {
        parts: ["leg-left"],
        frames: subtleLegIdle({ x: -5, rotation: -1.3, driftX: 0.2, driftRotation: 0.12 }),
      },
      {
        parts: ["leg-right"],
        frames: subtleLegIdle({ x: 5, rotation: 1.3, driftX: -0.2, driftRotation: -0.12 }),
      },
      { parts: ["arm-left"], frames: subtleRotationIdle(26, -0.35) },
      { parts: ["arm-right"], frames: subtleRotationIdle(-23, 0.35) },
      { parts: ["eyes-open"], frames: OPEN_EYE_BEAT },
      { parts: ["eyes-knowing"], frames: KNOWING_EYE_BEAT },
    ],
  },
  staticPose: {
    "leg-left": { transform: legTransform(-5, 0, -1.3) },
    "leg-right": { transform: legTransform(5, 0, 1.3) },
    "arm-left": { transform: "rotate(26deg)" },
    "arm-right": { transform: "rotate(-23deg)" },
    "eyes-open": { opacity: "0" },
    "eyes-knowing": { opacity: "1" },
    "mouth-rest": { opacity: "0" },
    "mouth-neutral": { opacity: "1" },
  },
};
