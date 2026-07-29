import { getMascotAssetUrl } from "../constants/emotionAssets.js";

const BaseElement = typeof HTMLElement !== "undefined" ? HTMLElement : class {};

export class ZoeMascot extends BaseElement {
  static get observedAttributes() {
    return ["emotion", "speaking", "is-speaking", "autoplay", "loop", "speed"];
  }

  #connected = false;

  constructor() {
    super();
    if (typeof this.attachShadow === "function") {
      this.attachShadow({ mode: "open" });
    }
  }

  connectedCallback() {
    if (this.#connected) return;
    this.#connected = true;
    if (typeof this.setAttribute === "function") {
      this.setAttribute("role", "img");
    }
    this.#render();
  }

  disconnectedCallback() {
    this.#connected = false;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.#connected || oldValue === newValue) return;
    this.#render();
  }

  get emotion() {
    return (typeof this.getAttribute === "function" && this.getAttribute("emotion")) || "thinking";
  }

  set emotion(value) {
    if (typeof this.setAttribute === "function") {
      this.setAttribute("emotion", value);
    }
  }

  get isSpeaking() {
    if (typeof this.getAttribute !== "function") return false;
    const isSp = this.getAttribute("is-speaking") || this.getAttribute("speaking");
    return isSp === "true" || isSp === "" || this.hasAttribute("speaking");
  }

  set isSpeaking(value) {
    if (typeof this.setAttribute === "function" && typeof this.removeAttribute === "function") {
      if (value) this.setAttribute("is-speaking", "true");
      else this.removeAttribute("is-speaking");
    }
  }

  #render() {
    if (!this.shadowRoot) return;
    const activeEmotion = this.emotion;
    const isSpeakingState = this.isSpeaking;
    const imgUrl = getMascotAssetUrl(activeEmotion, isSpeakingState);

    if (typeof this.setAttribute === "function") {
      this.setAttribute(
        "aria-label",
        `Mascot avatar showing ${activeEmotion}${isSpeakingState ? " (speaking)" : ""}`
      );
    }

    let imgEl = this.shadowRoot.querySelector("img");
    if (!imgEl) {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: inline-block;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
          }
          .container {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            position: relative;
            background-color: #ffffff;
            border-radius: 16px;
          }
          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            background-color: #ffffff;
            transition: transform 0.2s ease, opacity 0.2s ease;
            user-select: none;
            -webkit-user-drag: none;
          }
        </style>
        <div class="container">
          <img src="${imgUrl}" alt="${activeEmotion}" />
        </div>
      `;
    } else {
      if (imgEl.src !== imgUrl) {
        imgEl.src = imgUrl;
      }
      imgEl.alt = activeEmotion;
    }

    if (typeof this.dispatchEvent === "function") {
      this.dispatchEvent(
        new CustomEvent("zoe-playstatechange", {
          bubbles: true,
          composed: true,
          detail: {
            playing: true,
            emotion: activeEmotion,
            isSpeaking: isSpeakingState,
            assetUrl: imgUrl,
          },
        })
      );
    }
  }
}

if (typeof customElements !== "undefined" && !customElements.get("zoe-mascot")) {
  customElements.define("zoe-mascot", ZoeMascot);
}
