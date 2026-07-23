import {
  EASE_IN_OUT,
  EASE_OUT,
  EASE_SPRING,
  armFrames,
  visibilityFrames,
} from "./shared.js";

const WARM_UPPER_FRAMES = [
  { offset: 0, transform: "translateY(0) rotate(0deg) scale(1, 1)", easing: EASE_IN_OUT },
  {
    offset: 0.18,
    transform: "translateY(1px) rotate(-0.5deg) scale(1.015, 0.985)",
    easing: EASE_SPRING,
  },
  {
    offset: 0.34,
    transform: "translateY(-1px) rotate(1.5deg) scale(0.99, 1.025)",
    easing: EASE_OUT,
  },
  {
    offset: 0.43,
    transform: "translateY(-0.5px) rotate(-1.25deg) scale(0.995, 1.01)",
    easing: EASE_IN_OUT,
  },
  {
    offset: 0.52,
    transform: "translateY(1px) rotate(0.5deg) scale(1.02, 0.975)",
    easing: EASE_SPRING,
  },
  {
    offset: 0.63,
    transform: "translateY(-0.5px) rotate(0.75deg) scale(0.997, 1.008)",
    easing: EASE_OUT,
  },
  { offset: 0.78, transform: "translateY(0) rotate(0deg) scale(1, 1)" },
  { offset: 1, transform: "translateY(0) rotate(0deg) scale(1, 1)" },
];

export const happyWarmEmotion = {
  id: "happy-warm",
  family: "happiness",
  intensity: "gentle",
  title: "Warm delight",
  summary: "Soft anticipation · quick blink · small hop · cozy settle",
  legacy: true,
  duration: 4000,
  accessibleLabel: "Zoe mascot expressing warm happiness",
  tracks: [
    {
      parts: ["root"],
      frames: [
        { offset: 0, transform: "translateY(0)", easing: EASE_IN_OUT },
        { offset: 0.18, transform: "translateY(2px)", easing: EASE_SPRING },
        { offset: 0.34, transform: "translateY(-7px)", easing: EASE_OUT },
        { offset: 0.43, transform: "translateY(-6px)", easing: EASE_IN_OUT },
        { offset: 0.52, transform: "translateY(1.5px)", easing: EASE_SPRING },
        { offset: 0.63, transform: "translateY(-2px)", easing: EASE_OUT },
        { offset: 0.78, transform: "translateY(0)" },
        { offset: 1, transform: "translateY(0)" },
      ],
    },
    { parts: ["body-surface", "glasses", "upper-overlay"], frames: WARM_UPPER_FRAMES },
    {
      parts: ["legs"],
      frames: [
        { offset: 0, transform: "scale(1, 1)", easing: EASE_IN_OUT },
        { offset: 0.18, transform: "scale(1.03, 0.94)", easing: EASE_SPRING },
        { offset: 0.34, transform: "scale(0.99, 1.025)", easing: EASE_OUT },
        { offset: 0.52, transform: "scale(1.035, 0.94)", easing: EASE_SPRING },
        { offset: 0.63, transform: "scale(0.995, 1.01)", easing: EASE_OUT },
        { offset: 0.78, transform: "scale(1, 1)" },
        { offset: 1, transform: "scale(1, 1)" },
      ],
    },
    { parts: ["arm-left"], frames: armFrames(1, 12, 14, 4, 0.78) },
    { parts: ["arm-right"], frames: armFrames(-1, 12, 14, 4, 0.78) },
    {
      parts: ["mouth-rest"],
      frames: visibilityFrames(1, 0, 0.22, 0.28, 0.68, 0.76),
    },
    {
      parts: ["mouth-wide"],
      frames: [
        { offset: 0, opacity: 0, transform: "scale(1, 1)" },
        { offset: 0.22, opacity: 0, transform: "scale(0.96, 0.96)", easing: EASE_OUT },
        { offset: 0.28, opacity: 1, transform: "scale(1, 1)", easing: EASE_SPRING },
        { offset: 0.34, opacity: 1, transform: "scale(1.015, 1.02)", easing: EASE_OUT },
        {
          offset: 0.63,
          opacity: 1,
          transform: "scale(1.015, 1.02)",
          easing: EASE_IN_OUT,
        },
        { offset: 0.68, opacity: 1, transform: "scale(1, 1)", easing: EASE_IN_OUT },
        { offset: 0.76, opacity: 0, transform: "scale(0.98, 0.98)" },
        { offset: 1, opacity: 0, transform: "scale(1, 1)" },
      ],
    },
    {
      parts: ["eyes-open"],
      frames: visibilityFrames(1, 0, 0.205, 0.225, 0.26, 0.28),
    },
    {
      parts: ["eyes-happy"],
      frames: visibilityFrames(0, 1, 0.205, 0.225, 0.26, 0.28),
    },
  ],
  staticPose: {
    root: { transform: "translateY(-2px)" },
    "body-surface": { transform: "rotate(-1deg) scale(0.998, 1.005)" },
    glasses: { transform: "rotate(-1deg) scale(0.998, 1.005)" },
    "upper-overlay": { transform: "rotate(-1deg) scale(0.998, 1.005)" },
    "arm-left": { transform: "rotate(8deg)" },
    "arm-right": { transform: "rotate(-8deg)" },
    "mouth-rest": { opacity: "0" },
    "mouth-wide": { opacity: "1", transform: "scale(1.015, 1.02)" },
  },
};
