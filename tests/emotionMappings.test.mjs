import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";

import {
  BASE_MASCOT_ASSETS,
  MODEL_EMOTION_TO_BASE_MASCOT,
  MODEL_EMOTION_TO_SPEAKING_ASSET,
  getMascotAssetUrl,
  resolveBaseMascotKey,
} from "../dist/index.js";

const MODEL_LABELS = [
  "admiration",
  "amusement",
  "anger",
  "annoyance",
  "approval",
  "caring",
  "confusion",
  "curiosity",
  "desire",
  "disappointment",
  "disapproval",
  "disgust",
  "embarrassment",
  "excitement",
  "fear",
  "gratitude",
  "grief",
  "joy",
  "love",
  "nervousness",
  "optimism",
  "pride",
  "realization",
  "relief",
  "remorse",
  "sadness",
  "surprise",
  "neutral",
];

test("all model labels map to existing idle and speaking assets", () => {
  assert.equal(MODEL_LABELS.length, 28);

  for (const label of MODEL_LABELS) {
    const baseKey = MODEL_EMOTION_TO_BASE_MASCOT[label];
    assert.ok(baseKey, `missing idle map: ${label}`);
    assert.ok(BASE_MASCOT_ASSETS[baseKey], `missing base asset: ${baseKey}`);
    assert.equal(resolveBaseMascotKey(label), baseKey);
    assert.ok(
      MODEL_EMOTION_TO_SPEAKING_ASSET[label],
      `missing speaking map: ${label}`,
    );

    for (const speaking of [false, true]) {
      const assetUrl = getMascotAssetUrl(label, speaking);
      assert.ok(
        existsSync(`public${assetUrl}`),
        `missing asset for ${label}, speaking=${speaking}: ${assetUrl}`,
      );
    }
  }
});

test("base mascot keys survive case-insensitive normalization", () => {
  for (const key of Object.keys(BASE_MASCOT_ASSETS)) {
    assert.equal(resolveBaseMascotKey(key), key);
    assert.equal(resolveBaseMascotKey(key.toUpperCase()), key);
  }
});

test("neutral uses thinking consistently", () => {
  assert.equal(resolveBaseMascotKey("neutral"), "thinking");
  assert.equal(getMascotAssetUrl("neutral", false), "/assets/thinking.webp");
  assert.equal(
    getMascotAssetUrl("neutral", true),
    "/assets/speaking_neutral.webp",
  );
});

test("legacy emotion aliases resolve case-insensitively", () => {
  assert.equal(resolveBaseMascotKey("LISTEN"), "thinking");
  assert.equal(resolveBaseMascotKey("listen"), "thinking");
  assert.equal(resolveBaseMascotKey("ENCOURAGE"), "Love-Strong");
  assert.equal(resolveBaseMascotKey("encourage"), "Love-Strong");
  assert.equal(resolveBaseMascotKey("CONFUSION-CURIOUS"), "thinking");
});

test("manual strong and extended mascot keys keep intended speaking family", () => {
  assert.equal(
    getMascotAssetUrl("Love-Strong", true),
    "/assets/speaking_happy.webp",
  );
  assert.equal(
    getMascotAssetUrl("sad-Strong", true),
    "/assets/sad-speaking_gentle.webp",
  );
  assert.equal(
    getMascotAssetUrl("sad-gentle", true),
    "/assets/sad-speaking_gentle.webp",
  );
  assert.equal(
    getMascotAssetUrl("celebration", true),
    "/assets/speaking_happy.webp",
  );
});
