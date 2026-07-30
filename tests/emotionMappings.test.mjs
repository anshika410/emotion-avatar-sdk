import assert from "node:assert/strict";
import test from "node:test";
import { resolveBaseMascotKey } from "../dist/index.js";

test("Emotion Mapping - All 61 detected emotions & synonyms map correctly", () => {
  const expectedMappings = {
    // Love
    admiration: "gentle-love",
    caring: "gentle-love",
    desire: "gentle-love",
    gratitude: "gentle-love",
    love: "Love-Strong",
    love_strong: "Love-Strong",
    heartfelt: "Love-Strong",
    love_gentle: "gentle-love",
    affection: "gentle-love",

    // Happy Strong
    amusement: "happy_strong",
    excitement: "happy_strong",
    joy: "happy_strong",
    pride: "happy_strong",
    happiness: "happy_strong",
    happy: "happy_strong",
    celebration: "celebration",
    excited: "happy_strong",
    thrilled: "happy_strong",

    // Happy Gentle
    approval: "happy_gentle",
    optimism: "happy_gentle",
    relief: "happy_gentle",
    pleased: "happy_gentle",
    content: "happy_gentle",
    neutral: "happy_gentle",

    // Thinking
    confusion: "thinking",
    confused: "thinking",
    curiosity: "thinking",
    curious: "thinking",
    realization: "thinking",
    thinking: "thinking",

    // Surprise
    surprise: "surprise",
    surprised: "surprise",
    astonished: "surprise",
    amazed: "surprise",

    // Anger
    anger: "anger",
    annoyance: "anger",
    angry: "anger",
    annoyed: "anger",
    frustration: "anger",
    frustrated: "anger",
    furious: "anger",

    // Disgust
    disapproval: "disgust",
    disgust: "disgust",
    disgusted: "disgust",

    // Fear
    fear: "fear",
    nervousness: "fear",
    anxiety: "fear",
    terrified: "fear",
    scared: "fear",
    fearful: "fear",
    nervous: "fear",
    panicked: "fear",

    // Sad Strong
    disappointment: "sad-Strong",
    embarrassment: "sad-Strong",
    grief: "sad-Strong",
    remorse: "sad-Strong",
    sadness: "sad-Strong",
    sad: "sad-Strong",
    disappointed: "sad-Strong",
    remorseful: "sad-Strong",
    embarrassed: "sad-Strong",
    grieving: "sad-Strong",
    shame: "sad-Strong",
  };

  for (const [emotion, expectedBase] of Object.entries(expectedMappings)) {
    const actual = resolveBaseMascotKey(emotion);
    assert.equal(actual, expectedBase, `Expected '${emotion}' to map to '${expectedBase}', got '${actual}'`);
  }
});

test("Emotion Mapping - Fallback to happy_gentle for unrecognised emotions", () => {
  const unrecognised = ["unknown_emotion", "xyz_123", "", "   ", "random_string"];
  for (const emotion of unrecognised) {
    const actual = resolveBaseMascotKey(emotion);
    assert.equal(actual, "happy_gentle", `Expected '${emotion}' to fall back to 'happy_gentle', got '${actual}'`);
  }
});
