import { EASE_IN_OUT, EASE_OUT } from "./shared.js";

export const EASE_GENTLE = "cubic-bezier(0.22, 0.61, 0.36, 1)";

export function holdVisibilityFrames(initial, active, holdUntil, changeBy) {
  return [
    { offset: 0, opacity: initial },
    { offset: holdUntil, opacity: initial },
    { offset: changeBy, opacity: active, easing: EASE_OUT },
    { offset: 1, opacity: active },
  ];
}

export function expressionTracks({ eyes, mouth, holdUntil = 0.12, changeBy = 0.22 }) {
  const tracks = [];

  if (eyes) {
    tracks.push(
      {
        parts: ["eyes-open"],
        frames: holdVisibilityFrames(1, 0, holdUntil, changeBy),
      },
      {
        parts: [eyes],
        frames: holdVisibilityFrames(0, 1, holdUntil, changeBy),
      },
    );
  }

  if (mouth) {
    tracks.push(
      {
        parts: ["mouth-rest"],
        frames: holdVisibilityFrames(1, 0, holdUntil, changeBy),
      },
      {
        parts: [mouth],
        frames: holdVisibilityFrames(0, 1, holdUntil, changeBy),
      },
    );
  }

  return tracks;
}

export function accentPulseFrames({
  start = 0.28,
  appear = 0.38,
  hold = 0.58,
  vanish = 0.76,
  rotation = 0,
}) {
  return [
    { offset: 0, opacity: 0, transform: "translateY(0) scale(0.7) rotate(0deg)" },
    {
      offset: start,
      opacity: 0,
      transform: `translateY(3px) scale(0.7) rotate(${-rotation}deg)`,
      easing: EASE_GENTLE,
    },
    {
      offset: appear,
      opacity: 1,
      transform: `translateY(-1px) scale(1) rotate(${rotation}deg)`,
      easing: EASE_OUT,
    },
    {
      offset: hold,
      opacity: 1,
      transform: "translateY(-2px) scale(1) rotate(0deg)",
      easing: EASE_IN_OUT,
    },
    {
      offset: vanish,
      opacity: 0,
      transform: `translateY(-7px) scale(0.82) rotate(${rotation}deg)`,
      easing: EASE_GENTLE,
    },
    { offset: 1, opacity: 0, transform: "translateY(0) scale(1) rotate(0deg)" },
  ];
}

export function tensionReleaseFrames({
  start = 0.12,
  appear = 0.22,
  hold = 0.42,
  vanish = 0.64,
  direction = 1,
}) {
  return [
    { offset: 0, opacity: 0, transform: "translate(0, 0) rotate(0deg)" },
    {
      offset: start,
      opacity: 0,
      transform: `translate(${direction * -2}px, 3px) rotate(${direction * -3}deg)`,
    },
    {
      offset: appear,
      opacity: 0.78,
      transform: "translate(0, 0) rotate(0deg)",
      easing: EASE_OUT,
    },
    {
      offset: hold,
      opacity: 0.62,
      transform: `translate(${direction}px, -2px) rotate(${direction * 2}deg)`,
      easing: EASE_IN_OUT,
    },
    {
      offset: vanish,
      opacity: 0,
      transform: `translate(${direction * 4}px, -8px) rotate(${direction * 5}deg)`,
      easing: EASE_GENTLE,
    },
    { offset: 1, opacity: 0, transform: "translate(0, 0) rotate(0deg)" },
  ];
}

export function softAccentFrames({
  start = 0.22,
  appear = 0.32,
  hold = 0.56,
  vanish = 0.76,
  x = 0,
  y = -5,
  rotation = 0,
  opacity = 0.72,
}) {
  return [
    { offset: 0, opacity: 0, transform: "translate(0, 0) rotate(0deg)" },
    { offset: start, opacity: 0, transform: "translate(0, 2px) rotate(0deg)" },
    {
      offset: appear,
      opacity,
      transform: "translate(0, 0) rotate(0deg)",
      easing: EASE_OUT,
    },
    {
      offset: hold,
      opacity,
      transform: `translate(${x / 2}px, ${y / 2}px) rotate(${rotation / 2}deg)`,
      easing: EASE_IN_OUT,
    },
    {
      offset: vanish,
      opacity: 0,
      transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
      easing: EASE_GENTLE,
    },
    { offset: 1, opacity: 0, transform: "translate(0, 0) rotate(0deg)" },
  ];
}

export function subtleRootIdle(baseY, drift = 1) {
  return [
    { offset: 0, transform: `translateY(${baseY}px)`, easing: EASE_IN_OUT },
    {
      offset: 0.5,
      transform: `translateY(${baseY + drift}px)`,
      easing: EASE_IN_OUT,
    },
    { offset: 1, transform: `translateY(${baseY}px)`, easing: EASE_IN_OUT },
  ];
}

export function subtleRotationIdle(baseRotation, drift = 0.6) {
  return [
    {
      offset: 0,
      transform: `rotate(${baseRotation}deg)`,
      easing: EASE_IN_OUT,
    },
    {
      offset: 0.5,
      transform: `rotate(${baseRotation + drift}deg)`,
      easing: EASE_IN_OUT,
    },
    {
      offset: 1,
      transform: `rotate(${baseRotation}deg)`,
      easing: EASE_IN_OUT,
    },
  ];
}

export function legTransform(x, y = 0, rotation = 0) {
  return `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
}

export function subtleLegIdle({
  x,
  y = 0,
  rotation = 0,
  driftX = 0,
  driftY = 0,
  driftRotation = 0,
}) {
  return [
    {
      offset: 0,
      transform: legTransform(x, y, rotation),
      easing: EASE_IN_OUT,
    },
    {
      offset: 0.5,
      transform: legTransform(
        x + driftX,
        y + driftY,
        rotation + driftRotation,
      ),
      easing: EASE_IN_OUT,
    },
    {
      offset: 1,
      transform: legTransform(x, y, rotation),
      easing: EASE_IN_OUT,
    },
  ];
}
