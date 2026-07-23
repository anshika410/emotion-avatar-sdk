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
  { offset: 0.42, opacity: 1 },
  { offset: 0.46, opacity: 0, easing: EASE_OUT },
  { offset: 0.53, opacity: 0 },
  { offset: 0.57, opacity: 1, easing: EASE_OUT },
  { offset: 1, opacity: 1 },
];

const KNOWING_EYE_BEAT = OPEN_EYE_BEAT.map((frame) => ({
  ...frame,
  opacity: frame.opacity === 1 ? 0 : 1,
}));

export const sarcasmNoticeEmotion = {
  id: "sarcasm-notice",
  family: "sarcasm",
  intensity: "gentle",
  title: "Subtle recognition",
  summary: "Knowing eye beat · tiny tilt · open acknowledgment · attentive return",
  accessibleLabel: "Zoe kindly recognizing a subtle sarcastic tone",
  entrance: {
    duration: 2000,
    tracks: [
      {
        parts: ["root"],
        frames: [
          { offset: 0, transform: "translateY(0)", easing: EASE_IN_OUT },
          { offset: 0.36, transform: "translateY(1px)", easing: EASE_OUT },
          { offset: 0.72, transform: "translateY(-1px)", easing: EASE_IN_OUT },
          { offset: 1, transform: "translateY(0px)" },
        ],
      },
      {
        parts: ["character"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.38, transform: "rotate(-2.2deg)", easing: EASE_OUT },
          { offset: 0.7, transform: "rotate(-0.5deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(0deg)" },
        ],
      },
      {
        parts: ["leg-left"],
        frames: [
          { offset: 0, transform: legTransform(-3, 0, -1), easing: EASE_IN_OUT },
          { offset: 0.42, transform: legTransform(-4, 0, -1.2), easing: EASE_OUT },
          { offset: 1, transform: legTransform(-4, 0, -1.2) },
        ],
      },
      {
        parts: ["leg-right"],
        frames: [
          { offset: 0, transform: legTransform(3, 0, 1), easing: EASE_IN_OUT },
          { offset: 0.42, transform: legTransform(4, 0, 1.2), easing: EASE_OUT },
          { offset: 1, transform: legTransform(4, 0, 1.2) },
        ],
      },
      {
        parts: ["arm-left"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.44, transform: "rotate(45deg)", easing: EASE_OUT },
          { offset: 0.72, transform: "rotate(35deg)", easing: EASE_IN_OUT },
          { offset: 1, transform: "rotate(38deg)" },
        ],
      },
      {
        parts: ["arm-right"],
        frames: [
          { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
          { offset: 0.5, transform: "rotate(7deg)", easing: EASE_OUT },
          { offset: 1, transform: "rotate(4deg)" },
        ],
      },
      {
        parts: ["eyes-open"],
        frames: [
          { offset: 0, opacity: 1 },
          { offset: 0.12, opacity: 1 },
          { offset: 0.2, opacity: 0, easing: EASE_OUT },
          { offset: 0.48, opacity: 0 },
          { offset: 0.62, opacity: 1, easing: EASE_OUT },
          { offset: 1, opacity: 1 },
        ],
      },
      {
        parts: ["eyes-knowing"],
        frames: [
          { offset: 0, opacity: 0 },
          { offset: 0.12, opacity: 0 },
          { offset: 0.2, opacity: 1, easing: EASE_OUT },
          { offset: 0.48, opacity: 1 },
          { offset: 0.62, opacity: 0, easing: EASE_OUT },
          { offset: 1, opacity: 0 },
        ],
      },
      ...expressionTracks({ mouth: "mouth-neutral", holdUntil: 0.08, changeBy: 0.2 }),
      {
        parts: ["knowing-beat-left"],
        frames: softAccentFrames({
          start: 0.18,
          appear: 0.25,
          hold: 0.34,
          vanish: 0.46,
          x: -2,
          y: -3,
          rotation: -3,
          opacity: 0.56,
        }),
      },
    ],
  },
  idle: {
    duration: 5200,
    tracks: [
      { parts: ["root"], frames: subtleRootIdle(0, 0.7) },
      { parts: ["character"], frames: subtleRotationIdle(0, 0.2) },
      {
        parts: ["leg-left"],
        frames: subtleLegIdle({ x: -4, rotation: -1.2, driftX: 0.15, driftRotation: 0.1 }),
      },
      {
        parts: ["leg-right"],
        frames: subtleLegIdle({ x: 4, rotation: 1.2, driftX: -0.15, driftRotation: -0.1 }),
      },
      { parts: ["arm-left"], frames: subtleRotationIdle(38, -0.35) },
      { parts: ["arm-right"], frames: subtleRotationIdle(4, -0.2) },
      { parts: ["eyes-open"], frames: OPEN_EYE_BEAT },
      { parts: ["eyes-knowing"], frames: KNOWING_EYE_BEAT },
    ],
  },
  staticPose: {
    "leg-left": { transform: legTransform(-4, 0, -1.2) },
    "leg-right": { transform: legTransform(4, 0, 1.2) },
    "arm-left": { transform: "rotate(38deg)" },
    "arm-right": { transform: "rotate(4deg)" },
    "eyes-open": { opacity: "0" },
    "eyes-knowing": { opacity: "1" },
    "mouth-rest": { opacity: "0" },
    "mouth-neutral": { opacity: "1" },
  },
};
