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
  { offset: 0.78, opacity: 1 },
  { offset: 0.8, opacity: 0, easing: EASE_OUT },
  { offset: 0.84, opacity: 0 },
  { offset: 0.86, opacity: 1, easing: EASE_OUT },
  { offset: 1, opacity: 1 },
];

const CLOSED_EYE_BLINK = OPEN_EYE_BLINK.map((frame) => ({
  ...frame,
  opacity: frame.opacity === 1 ? 0 : 1,
}));

export const neutralFocusedEmotion = {
  id: "neutral-focused",
  family: "neutral",
  intensity: "strong",
  title: "Concentrated attention",
  summary: "Attentive orientation · forward focus · ready hand · confirming nod",
  accessibleLabel: "Zoe listening with concentrated ready-to-help attention",
  entrance: {
    duration: 2200,
    tracks: [
      {
        parts: ["root"],
        frames: [
          { offset: 0, transform: "translateY(0)", easing: EASE_IN_OUT },
          { offset: 0.32, transform: "translateY(-2px)", easing: EASE_OUT },
          { offset: 0.68, transform: "translateY(2px)", easing: EASE_IN_OUT },
          { offset: 0.84, transform: "translateY(0)", easing: EASE_OUT },
          { offset: 1, transform: "translateY(1px)" },
        ],
      },
      {
        parts: ["character"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.36, transform: "rotate(1.8deg)", easing: EASE_OUT },
          { offset: 0.7, transform: "rotate(1deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(1.4deg)" },
        ],
      },
      {
        parts: ["leg-left"],
        frames: [
          { offset: 0, transform: legTransform(-3, 0, -1), easing: EASE_IN_OUT },
          { offset: 0.48, transform: legTransform(-6, 0, -1.6), easing: EASE_OUT },
          { offset: 1, transform: legTransform(-6, 0, -1.5) },
        ],
      },
      {
        parts: ["leg-right"],
        frames: [
          { offset: 0, transform: legTransform(3, 0, 1), easing: EASE_IN_OUT },
          { offset: 0.48, transform: legTransform(6, 0, 1.6), easing: EASE_OUT },
          { offset: 1, transform: legTransform(6, 0, 1.5) },
        ],
      },
      {
        parts: ["arm-left"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.48, transform: "rotate(39deg)", easing: EASE_OUT },
          { offset: 0.76, transform: "rotate(32deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(34deg)" },
        ],
      },
      {
        parts: ["arm-right"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.52, transform: "rotate(8deg)", easing: EASE_OUT },
          { offset: 1, transform: "rotate(5deg)" },
        ],
      },
      ...expressionTracks({ mouth: "mouth-neutral", holdUntil: 0.06, changeBy: 0.18 }),
      {
        parts: ["brows-attentive"],
        frames: [
          { offset: 0, opacity: 0 },
          { offset: 0.1, opacity: 0 },
          { offset: 0.24, opacity: 1, easing: EASE_OUT },
          { offset: 1, opacity: 1 },
        ],
      },
    ],
  },
  idle: {
    duration: 5600,
    tracks: [
      { parts: ["root"], frames: subtleRootIdle(1, 0.7) },
      { parts: ["character"], frames: subtleRotationIdle(1.4, -0.25) },
      {
        parts: ["leg-left"],
        frames: subtleLegIdle({ x: -6, rotation: -1.5, driftX: 0.2, driftRotation: 0.12 }),
      },
      {
        parts: ["leg-right"],
        frames: subtleLegIdle({ x: 6, rotation: 1.5, driftX: -0.2, driftRotation: -0.12 }),
      },
      { parts: ["arm-left"], frames: subtleRotationIdle(34, -0.4) },
      { parts: ["arm-right"], frames: subtleRotationIdle(5, -0.2) },
      { parts: ["eyes-open"], frames: OPEN_EYE_BLINK },
      { parts: ["eyes-blink"], frames: CLOSED_EYE_BLINK },
    ],
  },
  staticPose: {
    root: { transform: "translateY(1px)" },
    character: { transform: "rotate(1.4deg)" },
    "leg-left": { transform: legTransform(-6, 0, -1.5) },
    "leg-right": { transform: legTransform(6, 0, 1.5) },
    "arm-left": { transform: "rotate(34deg)" },
    "arm-right": { transform: "rotate(5deg)" },
    "brows-attentive": { opacity: "1" },
    "mouth-rest": { opacity: "0" },
    "mouth-neutral": { opacity: "1" },
  },
};
