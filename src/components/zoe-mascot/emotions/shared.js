export const EASE_SPRING = "cubic-bezier(0.2, 0.85, 0.25, 1.15)";
export const EASE_OUT = "cubic-bezier(0.2, 0.75, 0.25, 1)";
export const EASE_IN_OUT = "cubic-bezier(0.45, 0, 0.2, 1)";

export function armFrames(direction, lift, overshoot, rebound, settleOffset) {
  return [
    { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
    { offset: 0.18, transform: "rotate(0deg)", easing: EASE_SPRING },
    { offset: 0.34, transform: `rotate(${direction * lift}deg)`, easing: EASE_OUT },
    { offset: 0.52, transform: `rotate(${direction * overshoot}deg)`, easing: EASE_SPRING },
    { offset: 0.63, transform: `rotate(${direction * rebound}deg)`, easing: EASE_OUT },
    { offset: settleOffset, transform: "rotate(0deg)" },
    { offset: 1, transform: "rotate(0deg)" },
  ];
}

export function celebrationArmFrames(direction) {
  return [
    { offset: 0, transform: "rotate(0deg)", easing: EASE_IN_OUT },
    { offset: 0.14, transform: `rotate(${direction * 8}deg)`, easing: EASE_SPRING },
    { offset: 0.3, transform: `rotate(${direction * 82}deg)`, easing: EASE_OUT },
    { offset: 0.4, transform: `rotate(${direction * 72}deg)`, easing: EASE_IN_OUT },
    { offset: 0.5, transform: `rotate(${direction * 80}deg)`, easing: EASE_SPRING },
    { offset: 0.6, transform: `rotate(${direction * 68}deg)`, easing: EASE_OUT },
    { offset: 0.72, transform: `rotate(${direction * 45}deg)`, easing: EASE_IN_OUT },
    { offset: 0.82, transform: `rotate(${direction * 12}deg)`, easing: EASE_OUT },
    { offset: 0.9, transform: "rotate(0deg)" },
    { offset: 1, transform: "rotate(0deg)" },
  ];
}

export function visibilityFrames(initial, active, holdStart, fadeInEnd, fadeOutStart, end) {
  return [
    { offset: 0, opacity: initial },
    { offset: holdStart, opacity: initial },
    { offset: fadeInEnd, opacity: active },
    { offset: fadeOutStart, opacity: active },
    { offset: end, opacity: initial },
    { offset: 1, opacity: initial },
  ];
}

export function sparkleFrames(start, pop, hold, vanish, rotation) {
  return [
    { offset: 0, opacity: 0, transform: "scale(1) rotate(0deg)" },
    {
      offset: start,
      opacity: 0,
      transform: `scale(0) rotate(${-rotation}deg)`,
      easing: EASE_SPRING,
    },
    {
      offset: pop,
      opacity: 1,
      transform: `scale(1.18) rotate(${rotation}deg)`,
      easing: EASE_OUT,
    },
    {
      offset: hold,
      opacity: 1,
      transform: "scale(1) rotate(0deg)",
      easing: EASE_IN_OUT,
    },
    {
      offset: vanish,
      opacity: 0,
      transform: `scale(0.45) rotate(${rotation * 1.5}deg)`,
    },
    { offset: vanish + 0.03, opacity: 0, transform: "scale(1) rotate(0deg)" },
    { offset: 1, opacity: 0, transform: "scale(1) rotate(0deg)" },
  ];
}
