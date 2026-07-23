import { EASE_IN_OUT, EASE_OUT } from "./shared.js";
import {
  expressionTracks,
  legTransform,
  subtleLegIdle,
  subtleRootIdle,
  subtleRotationIdle,
} from "./empathetic-shared.js";

const OPEN_EYE_BLINK = [
  { offset: 0, opacity: 1 },
  { offset: 0.7, opacity: 1 },
  { offset: 0.72, opacity: 0, easing: EASE_OUT },
  { offset: 0.76, opacity: 0 },
  { offset: 0.78, opacity: 1, easing: EASE_OUT },
  { offset: 1, opacity: 1 },
];

const CLOSED_EYE_BLINK = OPEN_EYE_BLINK.map((frame) => ({
  ...frame,
  opacity: frame.opacity === 1 ? 0 : 1,
}));

export const neutralPresentEmotion = {
  id: "neutral-present",
  family: "neutral",
  intensity: "gentle",
  title: "Relaxed attentive presence",
  summary: "Centered release · attentive lift · relaxed arms · balanced presence",
  accessibleLabel: "Zoe maintaining relaxed attentive presence",
  entrance: {
    duration: 1800,
    tracks: [
      {
        parts: ["root"],
        frames: [
          { offset: 0, transform: "translateY(0)", easing: EASE_IN_OUT },
          { offset: 0.34, transform: "translateY(-2px)", easing: EASE_OUT },
          { offset: 0.72, transform: "translateY(1px)", easing: EASE_IN_OUT },
          { offset: 1, transform: "translateY(0px)" },
        ],
      },
      {
        parts: ["character"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.38, transform: "rotate(0.8deg)", easing: EASE_OUT },
          { offset: 0.74, transform: "rotate(-0.3deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(0deg)" },
        ],
      },
      {
        parts: ["leg-left"],
        frames: [
          { offset: 0, transform: legTransform(-3, 0, -1), easing: EASE_IN_OUT },
          { offset: 0.5, transform: legTransform(-4, 0, -1.2), easing: EASE_OUT },
          { offset: 1, transform: legTransform(-4, 0, -1.2) },
        ],
      },
      {
        parts: ["leg-right"],
        frames: [
          { offset: 0, transform: legTransform(3, 0, 1), easing: EASE_IN_OUT },
          { offset: 0.5, transform: legTransform(4, 0, 1.2), easing: EASE_OUT },
          { offset: 1, transform: legTransform(4, 0, 1.2) },
        ],
      },
      {
        parts: ["arm-left"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.46, transform: "rotate(9deg)", easing: EASE_OUT },
          { offset: 1, transform: "rotate(6deg)" },
        ],
      },
      {
        parts: ["arm-right"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.46, transform: "rotate(-9deg)", easing: EASE_OUT },
          { offset: 1, transform: "rotate(-6deg)" },
        ],
      },
      ...expressionTracks({ mouth: "mouth-neutral", holdUntil: 0.08, changeBy: 0.22 }),
    ],
  },
  idle: {
    duration: 6000,
    tracks: [
      { parts: ["root"], frames: subtleRootIdle(0, 0.8) },
      { parts: ["character"], frames: subtleRotationIdle(0, 0.25) },
      {
        parts: ["leg-left"],
        frames: subtleLegIdle({ x: -4, rotation: -1.2, driftX: 0.2, driftRotation: 0.12 }),
      },
      {
        parts: ["leg-right"],
        frames: subtleLegIdle({ x: 4, rotation: 1.2, driftX: -0.2, driftRotation: -0.12 }),
      },
      { parts: ["arm-left"], frames: subtleRotationIdle(6, -0.25) },
      { parts: ["arm-right"], frames: subtleRotationIdle(-6, 0.25) },
      { parts: ["eyes-open"], frames: OPEN_EYE_BLINK },
      { parts: ["eyes-blink"], frames: CLOSED_EYE_BLINK },
    ],
  },
  staticPose: {
    "leg-left": { transform: legTransform(-4, 0, -1.2) },
    "leg-right": { transform: legTransform(4, 0, 1.2) },
    "arm-left": { transform: "rotate(6deg)" },
    "arm-right": { transform: "rotate(-6deg)" },
    "mouth-rest": { opacity: "0" },
    "mouth-neutral": { opacity: "1" },
  },
};
