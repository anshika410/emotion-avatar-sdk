import { describe, it, expect } from "vitest";
import { DEFAULT_AVATAR_IMAGES } from "../constants/defaultImages";
import { EmotionState } from "../types/emotion";

describe("DEFAULT_AVATAR_IMAGES", () => {
  it("has an entry for every EmotionState", () => {
    const allStates = Object.values(EmotionState);
    for (const state of allStates) {
      expect(DEFAULT_AVATAR_IMAGES).toHaveProperty(state);
      expect(typeof DEFAULT_AVATAR_IMAGES[state]).toBe("string");
    }
  });

  it("maps LISTEN to listening.webp", () => {
    expect(DEFAULT_AVATAR_IMAGES[EmotionState.LISTEN]).toBe("/assets/listening.webp");
  });

  it("maps SPEAK_NEUTRAL to speaking-edited.webp", () => {
    expect(DEFAULT_AVATAR_IMAGES[EmotionState.SPEAK_NEUTRAL]).toBe("/assets/speaking-edited.webp");
  });

  it("maps ENCOURAGE to ballbounce.webp", () => {
    expect(DEFAULT_AVATAR_IMAGES[EmotionState.ENCOURAGE]).toBe("/assets/ballbounce.webp");
  });

  it("maps THINK to regular-thinking.webp", () => {
    expect(DEFAULT_AVATAR_IMAGES[EmotionState.THINK]).toBe("/assets/regular-thinking.webp");
  });

  it("maps CAUTION to glassadjustment.webp", () => {
    expect(DEFAULT_AVATAR_IMAGES[EmotionState.CAUTION]).toBe("/assets/glassadjustment.webp");
  });

  it("maps CELEBRATE to bubblepop.webp", () => {
    expect(DEFAULT_AVATAR_IMAGES[EmotionState.CELEBRATE]).toBe("/assets/bubblepop.webp");
  });

  it("all paths start with /assets/", () => {
    for (const path of Object.values(DEFAULT_AVATAR_IMAGES)) {
      expect(path).toMatch(/^\/assets\//);
    }
  });

  it("all paths end with .webp", () => {
    for (const path of Object.values(DEFAULT_AVATAR_IMAGES)) {
      expect(path).toMatch(/\.webp$/);
    }
  });

  it("has exactly 6 entries", () => {
    expect(Object.keys(DEFAULT_AVATAR_IMAGES)).toHaveLength(6);
  });
});
