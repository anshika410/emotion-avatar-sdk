import {
  DEFAULT_EMOTION_ID,
  emotionDefinitions,
  getEmotionDefinition,
} from "../emotions/index.js";
import { ZOE_RIG_TEMPLATE } from "./zoe-rig.js";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const DEFAULT_SPEED = 1;
const MIN_SPEED = 0.25;
const MAX_SPEED = 4;

export class ZoeMascot extends HTMLElement {
  static get observedAttributes() {
    return ["emotion", "autoplay", "loop", "speed"];
  }

  #animations = [];
  #connected = false;
  #motionQuery = null;
  #onMotionPreferenceChange;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = ZOE_RIG_TEMPLATE;
    this.#onMotionPreferenceChange = () => this.#configureEmotion();
  }

  connectedCallback() {
    if (this.#connected) return;

    this.#connected = true;
    this.#motionQuery = window.matchMedia?.(REDUCED_MOTION_QUERY) ?? null;
    this.#motionQuery?.addEventListener?.("change", this.#onMotionPreferenceChange);
    this.setAttribute("role", "img");
    this.#validateRig();
    this.#configureEmotion();
  }

  disconnectedCallback() {
    this.#cancelAnimations();
    this.#motionQuery?.removeEventListener?.("change", this.#onMotionPreferenceChange);
    this.#connected = false;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.#connected || oldValue === newValue) return;

    if (name === "speed") {
      this.#syncPlaybackRate();
      return;
    }

    if (name === "autoplay") {
      if (this.hasAttribute("autoplay")) this.play();
      else this.pause();
      return;
    }

    this.#configureEmotion();
  }

  get emotion() {
    return getEmotionDefinition(this.getAttribute("emotion") ?? DEFAULT_EMOTION_ID).id;
  }

  set emotion(value) {
    this.setAttribute("emotion", value);
  }

  get speed() {
    const requested = Number.parseFloat(this.getAttribute("speed") ?? "");
    if (!Number.isFinite(requested)) return DEFAULT_SPEED;
    return Math.min(MAX_SPEED, Math.max(MIN_SPEED, requested));
  }

  set speed(value) {
    this.setAttribute("speed", String(value));
  }

  play() {
    if (!this.#connected || this.#prefersReducedMotion() || !this.#hasAnimatedEmotion()) {
      this.#emitPlayState(false);
      return;
    }

    if (this.#animations.length === 0) this.#buildTimeline();
    this.#animations.forEach((animation) => animation.play());
    this.#emitPlayState(true);
  }

  pause() {
    this.#animations.forEach((animation) => animation.pause());
    this.#emitPlayState(false);
  }

  restart() {
    if (!this.#connected || this.#prefersReducedMotion() || !this.#hasAnimatedEmotion()) {
      this.#configureEmotion();
      return;
    }

    if (this.#animations.length === 0) this.#buildTimeline();
    this.#animations.forEach((animation) => {
      animation.pause();
      animation.currentTime = 0;
      animation.playbackRate = this.speed;
    });
    this.#animations.forEach((animation) => animation.play());
    this.#emitPlayState(true);
  }

  #definition() {
    return getEmotionDefinition(this.emotion);
  }

  #hasAnimatedEmotion() {
    const definition = this.#definition();
    return Boolean(
      definition.entrance?.tracks?.length
      || definition.idle?.tracks?.length
      || definition.tracks?.length,
    );
  }

  #configureEmotion() {
    this.#cancelAnimations();
    this.#resetPose();
    this.#updateAccessibleLabel();

    if (!this.#hasAnimatedEmotion()) {
      this.#emitPlayState(false);
      return;
    }

    if (this.#prefersReducedMotion()) {
      this.#applyStaticEmotionPose();
      this.#emitPlayState(false);
      return;
    }

    this.#buildTimeline();
    if (this.hasAttribute("autoplay")) this.play();
    else this.pause();
  }

  #buildTimeline() {
    const definition = this.#definition();
    if (definition.entrance && definition.idle) {
      this.#buildPhasedTimeline(definition);
      return;
    }

    this.#buildLegacyTimeline(definition);
  }

  #buildPhasedTimeline(definition) {
    const entranceTiming = {
      duration: definition.entrance.duration,
      iterations: 1,
      fill: "forwards",
      easing: "linear",
    };
    const idleIterations = this.hasAttribute("loop") ? Infinity : 1;
    const idleTiming = {
      duration: definition.idle.duration,
      delay: definition.entrance.duration,
      iterations: idleIterations,
      fill: idleIterations === Infinity ? "none" : "forwards",
      easing: "linear",
    };

    const entranceAnimations = this.#animateTracks(
      definition.entrance.tracks,
      entranceTiming,
    );
    const idleAnimations = this.#animateTracks(definition.idle.tracks, idleTiming);
    this.#animations = [...entranceAnimations, ...idleAnimations];

    if (idleIterations === 1) {
      const finalAnimation = idleAnimations[0] ?? entranceAnimations[0];
      finalAnimation?.addEventListener(
        "finish",
        () => this.#emitPlayState(false),
        { once: true },
      );
    }
  }

  #buildLegacyTimeline(definition) {
    if (!definition.tracks?.length) return;

    const iterations = this.hasAttribute("loop") ? Infinity : 1;
    const timing = {
      duration: definition.duration,
      iterations,
      fill: "both",
      easing: "linear",
    };

    this.#animations = this.#animateTracks(definition.tracks, timing);

    if (iterations === 1 && this.#animations[0]) {
      this.#animations[0].addEventListener("finish", () => this.#emitPlayState(false), {
        once: true,
      });
    }
  }

  #animateTracks(tracks, timing) {
    return tracks.flatMap(({ parts, frames }) =>
      parts.map((partName) => {
        const animation = this.#part(partName).animate(frames, timing);
        animation.pause();
        animation.currentTime = 0;
        animation.playbackRate = this.speed;
        return animation;
      }),
    );
  }

  #cancelAnimations() {
    this.#animations.forEach((animation) => animation.cancel());
    this.#animations = [];
  }

  #syncPlaybackRate() {
    this.#animations.forEach((animation) => {
      animation.playbackRate = this.speed;
    });
  }

  #resetPose() {
    this.shadowRoot.querySelectorAll("[data-part]").forEach((element) => {
      element.style.removeProperty("transform");
      element.style.removeProperty("opacity");
    });
  }

  #applyStaticEmotionPose() {
    Object.entries(this.#definition().staticPose).forEach(([partName, styles]) => {
      this.#setPartStyle(partName, styles);
    });
  }

  #setPartStyle(partName, styles) {
    Object.assign(this.#part(partName).style, styles);
  }

  #prefersReducedMotion() {
    return Boolean(this.#motionQuery?.matches);
  }

  #part(partName) {
    const matches = this.shadowRoot.querySelectorAll(`[data-part="${partName}"]`);
    if (matches.length !== 1) {
      throw new Error(`Zoe rig expected one \"${partName}\" part, found ${matches.length}.`);
    }
    return matches[0];
  }

  #validateRig() {
    const requiredParts = new Set(["root"]);

    emotionDefinitions.forEach(({ tracks, entrance, idle, staticPose }) => {
      [tracks, entrance?.tracks, idle?.tracks]
        .filter(Boolean)
        .forEach((phaseTracks) => {
          phaseTracks.forEach(({ parts }) => {
            parts.forEach((partName) => requiredParts.add(partName));
          });
        });
      Object.keys(staticPose).forEach((partName) => requiredParts.add(partName));
    });

    requiredParts.forEach((partName) => this.#part(partName));
  }

  #updateAccessibleLabel() {
    this.setAttribute("aria-label", this.#definition().accessibleLabel);
  }

  #emitPlayState(playing) {
    this.dispatchEvent(
      new CustomEvent("zoe-playstatechange", {
        bubbles: true,
        composed: true,
        detail: { playing, emotion: this.emotion },
      }),
    );
  }
}

if (!customElements.get("zoe-mascot")) {
  customElements.define("zoe-mascot", ZoeMascot);
}
