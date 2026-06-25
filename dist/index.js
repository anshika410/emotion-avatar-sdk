import Ee, { useState as O, useRef as x, useMemo as pe, useEffect as _, useCallback as L } from "react";
import { env as V, pipeline as Te } from "@huggingface/transformers";
var j = { exports: {} }, N = {};
var H;
function be() {
  if (H) return N;
  H = 1;
  var r = /* @__PURE__ */ Symbol.for("react.transitional.element"), t = /* @__PURE__ */ Symbol.for("react.fragment");
  function s(f, c, i) {
    var m = null;
    if (i !== void 0 && (m = "" + i), c.key !== void 0 && (m = "" + c.key), "key" in c) {
      i = {};
      for (var u in c)
        u !== "key" && (i[u] = c[u]);
    } else i = c;
    return c = i.ref, {
      $$typeof: r,
      type: f,
      key: m,
      ref: c !== void 0 ? c : null,
      props: i
    };
  }
  return N.Fragment = t, N.jsx = s, N.jsxs = s, N;
}
var h = {};
var X;
function Re() {
  return X || (X = 1, process.env.NODE_ENV !== "production" && (function() {
    function r(e) {
      if (e == null) return null;
      if (typeof e == "function")
        return e.$$typeof === fe ? null : e.displayName || e.name || null;
      if (typeof e == "string") return e;
      switch (e) {
        case y:
          return "Fragment";
        case C:
          return "Profiler";
        case P:
          return "StrictMode";
        case ie:
          return "Suspense";
        case le:
          return "SuspenseList";
        case ue:
          return "Activity";
      }
      if (typeof e == "object")
        switch (typeof e.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), e.$$typeof) {
          case A:
            return "Portal";
          case ae:
            return e.displayName || "Context";
          case oe:
            return (e._context.displayName || "Context") + ".Consumer";
          case se:
            var n = e.render;
            return e = e.displayName, e || (e = n.displayName || n.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
          case ce:
            return n = e.displayName || null, n !== null ? n : r(e.type) || "Memo";
          case U:
            n = e._payload, e = e._init;
            try {
              return r(e(n));
            } catch {
            }
        }
      return null;
    }
    function t(e) {
      return "" + e;
    }
    function s(e) {
      try {
        t(e);
        var n = !1;
      } catch {
        n = !0;
      }
      if (n) {
        n = console;
        var p = n.error, T = typeof Symbol == "function" && Symbol.toStringTag && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return p.call(
          n,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          T
        ), t(e);
      }
    }
    function f(e) {
      if (e === y) return "<>";
      if (typeof e == "object" && e !== null && e.$$typeof === U)
        return "<...>";
      try {
        var n = r(e);
        return n ? "<" + n + ">" : "<...>";
      } catch {
        return "<...>";
      }
    }
    function c() {
      var e = $.A;
      return e === null ? null : e.getOwner();
    }
    function i() {
      return Error("react-stack-top-frame");
    }
    function m(e) {
      if (W.call(e, "key")) {
        var n = Object.getOwnPropertyDescriptor(e, "key").get;
        if (n && n.isReactWarning) return !1;
      }
      return e.key !== void 0;
    }
    function u(e, n) {
      function p() {
        z || (z = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          n
        ));
      }
      p.isReactWarning = !0, Object.defineProperty(e, "key", {
        get: p,
        configurable: !0
      });
    }
    function E() {
      var e = r(this.type);
      return K[e] || (K[e] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), e = this.props.ref, e !== void 0 ? e : null;
    }
    function l(e, n, p, T, k, D) {
      var b = p.ref;
      return e = {
        $$typeof: I,
        type: e,
        key: n,
        props: p,
        _owner: T
      }, (b !== void 0 ? b : null) !== null ? Object.defineProperty(e, "ref", {
        enumerable: !1,
        get: E
      }) : Object.defineProperty(e, "ref", { enumerable: !1, value: null }), e._store = {}, Object.defineProperty(e._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: 0
      }), Object.defineProperty(e, "_debugInfo", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: null
      }), Object.defineProperty(e, "_debugStack", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: k
      }), Object.defineProperty(e, "_debugTask", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: D
      }), Object.freeze && (Object.freeze(e.props), Object.freeze(e)), e;
    }
    function o(e, n, p, T, k, D) {
      var b = n.children;
      if (b !== void 0)
        if (T)
          if (de(b)) {
            for (T = 0; T < b.length; T++)
              d(b[T]);
            Object.freeze && Object.freeze(b);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else d(b);
      if (W.call(n, "key")) {
        b = r(e);
        var S = Object.keys(n).filter(function(me) {
          return me !== "key";
        });
        T = 0 < S.length ? "{key: someKey, " + S.join(": ..., ") + ": ...}" : "{key: someKey}", J[b + T] || (S = 0 < S.length ? "{" + S.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          T,
          b,
          S,
          b
        ), J[b + T] = !0);
      }
      if (b = null, p !== void 0 && (s(p), b = "" + p), m(n) && (s(n.key), b = "" + n.key), "key" in n) {
        p = {};
        for (var F in n)
          F !== "key" && (p[F] = n[F]);
      } else p = n;
      return b && u(
        p,
        typeof e == "function" ? e.displayName || e.name || "Unknown" : e
      ), l(
        e,
        b,
        p,
        c(),
        k,
        D
      );
    }
    function d(e) {
      R(e) ? e._store && (e._store.validated = 1) : typeof e == "object" && e !== null && e.$$typeof === U && (e._payload.status === "fulfilled" ? R(e._payload.value) && e._payload.value._store && (e._payload.value._store.validated = 1) : e._store && (e._store.validated = 1));
    }
    function R(e) {
      return typeof e == "object" && e !== null && e.$$typeof === I;
    }
    var v = Ee, I = /* @__PURE__ */ Symbol.for("react.transitional.element"), A = /* @__PURE__ */ Symbol.for("react.portal"), y = /* @__PURE__ */ Symbol.for("react.fragment"), P = /* @__PURE__ */ Symbol.for("react.strict_mode"), C = /* @__PURE__ */ Symbol.for("react.profiler"), oe = /* @__PURE__ */ Symbol.for("react.consumer"), ae = /* @__PURE__ */ Symbol.for("react.context"), se = /* @__PURE__ */ Symbol.for("react.forward_ref"), ie = /* @__PURE__ */ Symbol.for("react.suspense"), le = /* @__PURE__ */ Symbol.for("react.suspense_list"), ce = /* @__PURE__ */ Symbol.for("react.memo"), U = /* @__PURE__ */ Symbol.for("react.lazy"), ue = /* @__PURE__ */ Symbol.for("react.activity"), fe = /* @__PURE__ */ Symbol.for("react.client.reference"), $ = v.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, W = Object.prototype.hasOwnProperty, de = Array.isArray, M = console.createTask ? console.createTask : function() {
      return null;
    };
    v = {
      react_stack_bottom_frame: function(e) {
        return e();
      }
    };
    var z, K = {}, q = v.react_stack_bottom_frame.bind(
      v,
      i
    )(), B = M(f(i)), J = {};
    h.Fragment = y, h.jsx = function(e, n, p) {
      var T = 1e4 > $.recentlyCreatedOwnerStacks++;
      return o(
        e,
        n,
        p,
        !1,
        T ? Error("react-stack-top-frame") : q,
        T ? M(f(e)) : B
      );
    }, h.jsxs = function(e, n, p) {
      var T = 1e4 > $.recentlyCreatedOwnerStacks++;
      return o(
        e,
        n,
        p,
        !0,
        T ? Error("react-stack-top-frame") : q,
        T ? M(f(e)) : B
      );
    };
  })()), h;
}
var Z;
function ve() {
  return Z || (Z = 1, process.env.NODE_ENV === "production" ? j.exports = be() : j.exports = Re()), j.exports;
}
var Y = ve(), a = /* @__PURE__ */ ((r) => (r.LISTEN = "LISTEN", r.SPEAK_NEUTRAL = "SPEAK_NEUTRAL", r.ENCOURAGE = "ENCOURAGE", r.THINK = "THINK", r.CAUTION = "CAUTION", r.CELEBRATE = "CELEBRATE", r))(a || {});
const _e = {
  [a.LISTEN]: "/assets/listening.webp",
  [a.SPEAK_NEUTRAL]: "/assets/speaking-edited.webp",
  [a.ENCOURAGE]: "/assets/ballbounce.webp",
  [a.THINK]: "/assets/regular-thinking.webp",
  [a.CAUTION]: "/assets/glassadjustment.webp",
  [a.CELEBRATE]: "/assets/bubblepop.webp"
};
function we({
  emotionState: r,
  intensity: t,
  size: s,
  customImages: f
}) {
  const [c, i] = O(!1), m = x(null), u = x(/* @__PURE__ */ new Set()), E = pe(
    () => ({ ..._e, ...f }),
    [f]
  );
  _(() => {
    const o = (d) => new Promise((R) => {
      const v = new Image();
      v.onload = () => {
        u.current.add(d), R();
      }, v.onerror = () => R(), v.src = d;
    });
    Object.values(E).forEach(o);
  }, [E]), _(() => {
    const o = m.current;
    if (!o) return;
    const d = E[r];
    if (!d || o.dataset.srcKey === d) return;
    if (i(!0), o.dataset.srcKey = d, o.src = d, console.log(`[AvatarRenderer] Updating avatar: ${d}, emotion: ${r}`), u.current.has(d)) {
      i(!1);
      return;
    }
    const R = () => {
      i(!1), u.current.add(d);
    };
    return o.addEventListener("load", R, { once: !0 }), () => o.removeEventListener("load", R);
  }, [r, E]);
  const l = {
    width: `${s}px`,
    height: `${s}px`,
    objectFit: "cover",
    borderRadius: "50%",
    opacity: 0.6 + 0.4 * t,
    transform: `scale(${1 + 0.05 * t})`,
    filter: `brightness(${0.9 + 0.2 * t})`,
    transition: "opacity 0.15s ease, transform 0.15s ease, filter 0.15s ease"
  };
  return /* @__PURE__ */ Y.jsx(
    "img",
    {
      ref: m,
      src: E[a.LISTEN],
      alt: "Avatar",
      style: l,
      className: `avatar-image ${c ? "loading" : ""}`
    }
  );
}
V.allowRemoteModels = !1;
V.allowLocalModels = !0;
V.useBrowserCache = !0;
const Q = "/emotion-model", ee = "fp32";
let w = null, g = null, G = !1;
async function te() {
  return w || g || (g = (async () => {
    console.log("[EmotionClassifier] Loading DistilBERT emotion model (INT8 quantized)...");
    const r = performance.now();
    try {
      console.log(`[EmotionClassifier] Using emotion model: ${Q} (${ee})`);
      const t = await Te("text-classification", Q, {
        dtype: ee,
        device: "wasm"
      }), s = performance.now() - r;
      return console.log(`[EmotionClassifier] Model loaded in ${s.toFixed(0)}ms`), w = t, G = !0, t;
    } catch (t) {
      throw console.error("[EmotionClassifier] Failed to load model:", t), g = null, t;
    }
  })(), g);
}
async function Ae() {
  await te(), w && (await w("hello", { top_k: 6 }), console.log("[EmotionClassifier] Warm-up inference complete"));
}
function Me() {
  return G;
}
async function ye(r) {
  if (!r.trim()) return null;
  try {
    const t = await te(), s = performance.now(), f = await t(r, { top_k: 6 }), c = performance.now() - s, i = {}, m = Array.isArray(f[0]) ? f[0] : f;
    for (const l of m)
      i[l.label] = l.score;
    let u = "joy", E = 0;
    for (const [l, o] of Object.entries(i))
      o > E && (E = o, u = l);
    return console.log(`[EmotionClassifier] topEmotion=${u}, confidence=${E.toFixed(3)}, inferenceMs=${c.toFixed(0)}ms`), {
      topEmotion: u,
      confidence: E,
      scores: i,
      inferenceMs: c
    };
  } catch (t) {
    return console.error("[EmotionClassifier] Inference error:", t), null;
  }
}
async function Se() {
  w && (await w.dispose(), w = null, g = null, G = !1, console.log("[EmotionClassifier] Model disposed"));
}
const ge = /\b(situation|context|background|project|when|at that time|while working)\b/i, Ne = /\b(task|goal|objective|challenge|responsible for|assigned|needed to)\b/i, he = /\b(action|i did|i built|i implemented|i designed|i created|i wrote|i developed|i used|i refactored|i optimized|my approach|steps i took)\b/i, Oe = /\b(result|outcome|impact|improved|reduced|increased|saved|achieved|delivered|metric|percentage|percent|%|\d+x)\b/i;
function Ie(r) {
  if (!r.trim()) return 0;
  let t = 0;
  return ge.test(r) && (t += 0.25), Ne.test(r) && (t += 0.25), he.test(r) && (t += 0.25), Oe.test(r) && (t += 0.25), t;
}
const Ce = /* @__PURE__ */ new Set([
  "good",
  "great",
  "excellent",
  "awesome",
  "amazing",
  "fantastic",
  "wonderful",
  "perfect",
  "love",
  "loved",
  "enjoy",
  "enjoyed",
  "happy",
  "excited",
  "proud",
  "successful",
  "success",
  "improved",
  "improved",
  "efficient",
  "effective",
  "solved",
  "achieved",
  "accomplished",
  "innovative",
  "elegant",
  "clean",
  "robust",
  "scalable",
  "fast",
  "reliable",
  "stable"
]), ke = /* @__PURE__ */ new Set([
  "bad",
  "terrible",
  "awful",
  "horrible",
  "poor",
  "failed",
  "failure",
  "struggle",
  "struggled",
  "difficult",
  "hard",
  "confusing",
  "confused",
  "frustrated",
  "frustrated",
  "broken",
  "buggy",
  "slow",
  "unstable",
  "messy",
  "complicated",
  "unclear",
  "wrong",
  "error",
  "crash",
  "crashed"
]);
function je(r) {
  if (!r.trim()) return 0;
  const t = r.toLowerCase().split(/\W+/);
  let s = 0, f = 0;
  for (const i of t)
    Ce.has(i) && s++, ke.has(i) && f++;
  const c = s + f;
  return c === 0 ? 0 : (s - f) / c;
}
const Le = {
  modelEmotion: null,
  modelConfidence: 0,
  emotionScores: {}
};
function xe(r) {
  return {
    contentCompleteness: Ie(r),
    sentimentValence: je(r),
    ...Le
  };
}
async function ne(r) {
  const t = xe(r), s = await ye(r);
  return s ? {
    ...t,
    modelEmotion: s.topEmotion,
    modelConfidence: s.confidence,
    emotionScores: s.scores
  } : t;
}
function Pe({
  isSpeaking: r = !1,
  isListening: t = !1,
  onEmotionChange: s
}) {
  const [f, c] = O(a.LISTEN), [i, m] = O(0.3), u = L((l) => {
    c(l), m(0.8), s?.(l, 0.8);
  }, [s]), E = L(async (l) => {
    if (!l.trim()) return a.LISTEN;
    try {
      const o = await ne(l);
      if (o.modelEmotion)
        switch (o.modelEmotion) {
          case "joy":
            return a.CELEBRATE;
          case "love":
            return a.ENCOURAGE;
          case "anger":
          case "fear":
          case "sadness":
            return a.CAUTION;
          case "surprise":
            return a.THINK;
          default:
            return a.LISTEN;
        }
      return o.sentimentValence > 0.3 ? a.ENCOURAGE : o.sentimentValence < -0.3 ? a.CAUTION : a.LISTEN;
    } catch (o) {
      return console.warn("[useAvatarController] Emotion analysis failed:", o), a.LISTEN;
    }
  }, []);
  return L(() => {
    r ? (c(a.SPEAK_NEUTRAL), m(0.7)) : t && (c(a.LISTEN), m(0.5));
  }, [r, t]), {
    emotionState: f,
    intensity: i,
    setEmotion: u,
    analyzeEmotion: E
  };
}
function De({
  aiMessage: r = "",
  userMessage: t = "",
  emotionDetection: s = !0,
  autoAnimate: f = !0,
  isSpeaking: c = !1,
  isListening: i = !1,
  overrideEmotion: m,
  onEmotionChange: u,
  customImages: E,
  size: l = 260,
  className: o = ""
}) {
  const [d, R] = O(!1), {
    emotionState: v,
    intensity: I,
    setEmotion: A,
    analyzeEmotion: y
  } = Pe({
    isSpeaking: c,
    isListening: i,
    onEmotionChange: u
  });
  _(() => {
    R(!0);
  }, []), _(() => {
  }, [r, s, d, f, y, A]), _(() => {
    s && t && d && f && y(t).then((C) => {
      console.log(`[AnimatedAvatar] USER MESSAGE: ${t}`), console.log(`[AnimatedAvatar] DETECTED RESPONSE: ${C}`), A(C);
    });
  }, [t, s, d, f, y, A]), _(() => {
    m && A(m);
  }, [m, A]);
  const P = {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: l,
    height: l
  };
  return /* @__PURE__ */ Y.jsx("div", { className: o, style: P, children: /* @__PURE__ */ Y.jsx(
    we,
    {
      emotionState: v,
      intensity: I,
      size: l,
      customImages: E
    }
  ) });
}
const re = 1e3;
function Fe({
  aiMessage: r = "",
  userMessage: t = "",
  isSpeaking: s = !1,
  isListening: f = !1
}) {
  const [c, i] = O({
    state: a.LISTEN,
    intensity: 0.3
  }), m = x(0), u = x(!1);
  _(() => (Ae().catch(
    (l) => console.warn("[EmotionController] ML classifier warm-up failed (will use rule-based fallback):", l)
  ), () => {
    Se();
  }), []);
  const E = L(async (l) => {
    if (!l.trim())
      return { state: a.LISTEN, intensity: 0.3 };
    try {
      const o = await ne(l);
      let d = a.LISTEN, R = 0.5;
      if (o.modelEmotion)
        switch (o.modelEmotion) {
          case "joy":
          case "love":
            d = a.ENCOURAGE, R = 0.8;
            break;
          case "anger":
          case "fear":
          case "sadness":
            d = a.CAUTION, R = 0.7;
            break;
          case "surprise":
            d = a.THINK, R = 0.6;
            break;
          default:
            d = a.LISTEN;
        }
      else
        o.sentimentValence > 0.3 ? (d = a.ENCOURAGE, R = 0.7) : o.sentimentValence < -0.3 && (d = a.CAUTION, R = 0.6);
      return { state: d, intensity: R };
    } catch (o) {
      return console.warn("[EmotionController] Emotion analysis failed:", o), { state: a.LISTEN, intensity: 0.3 };
    }
  }, []);
  return _(() => {
    if (!r) return;
    const l = performance.now();
    u.current || l - m.current < re || (u.current = !0, m.current = l, E(r).then((o) => {
      i(o), u.current = !1;
    }).catch(() => {
      u.current = !1;
    }));
  }, [r, E]), _(() => {
    if (!t) return;
    const l = performance.now();
    u.current || l - m.current < re || (u.current = !0, m.current = l, E(t).then((o) => {
      i(o), u.current = !1;
    }).catch(() => {
      u.current = !1;
    }));
  }, [t, E]), _(() => {
    s ? i({ state: a.SPEAK_NEUTRAL, intensity: 0.7 }) : f && i({ state: a.LISTEN, intensity: 0.5 });
  }, [s, f]), {
    emotionState: c.state,
    intensity: c.intensity,
    analyzeText: E
  };
}
export {
  De as AnimatedAvatar,
  we as AvatarRenderer,
  ye as classifyEmotion,
  Se as disposeEmotionClassifier,
  xe as extractTextSignals,
  ne as extractTextSignalsWithML,
  Me as isEmotionClassifierReady,
  Pe as useAvatarController,
  Fe as useEmotionController,
  Ae as warmUpEmotionClassifier
};
