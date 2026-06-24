import de, { useState as C, useRef as P, useEffect as v, useCallback as L } from "react";
import { env as Q, pipeline as me } from "@huggingface/transformers";
var j = { exports: {} }, I = {};
var J;
function Ee() {
  if (J) return I;
  J = 1;
  var r = /* @__PURE__ */ Symbol.for("react.transitional.element"), t = /* @__PURE__ */ Symbol.for("react.fragment");
  function a(f, c, i) {
    var m = null;
    if (i !== void 0 && (m = "" + i), c.key !== void 0 && (m = "" + c.key), "key" in c) {
      i = {};
      for (var d in c)
        d !== "key" && (i[d] = c[d]);
    } else i = c;
    return c = i.ref, {
      $$typeof: r,
      type: f,
      key: m,
      ref: c !== void 0 ? c : null,
      props: i
    };
  }
  return I.Fragment = t, I.jsx = a, I.jsxs = a, I;
}
var O = {};
var H;
function pe() {
  return H || (H = 1, process.env.NODE_ENV !== "production" && (function() {
    function r(e) {
      if (e == null) return null;
      if (typeof e == "function")
        return e.$$typeof === ce ? null : e.displayName || e.name || null;
      if (typeof e == "string") return e;
      switch (e) {
        case A:
          return "Fragment";
        case g:
          return "Profiler";
        case x:
          return "StrictMode";
        case ae:
          return "Suspense";
        case se:
          return "SuspenseList";
        case le:
          return "Activity";
      }
      if (typeof e == "object")
        switch (typeof e.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), e.$$typeof) {
          case y:
            return "Portal";
          case ne:
            return e.displayName || "Context";
          case te:
            return (e._context.displayName || "Context") + ".Consumer";
          case oe:
            var o = e.render;
            return e = e.displayName, e || (e = o.displayName || o.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
          case ie:
            return o = e.displayName || null, o !== null ? o : r(e.type) || "Memo";
          case U:
            o = e._payload, e = e._init;
            try {
              return r(e(o));
            } catch {
            }
        }
      return null;
    }
    function t(e) {
      return "" + e;
    }
    function a(e) {
      try {
        t(e);
        var o = !1;
      } catch {
        o = !0;
      }
      if (o) {
        o = console;
        var p = o.error, b = typeof Symbol == "function" && Symbol.toStringTag && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return p.call(
          o,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          b
        ), t(e);
      }
    }
    function f(e) {
      if (e === A) return "<>";
      if (typeof e == "object" && e !== null && e.$$typeof === U)
        return "<...>";
      try {
        var o = r(e);
        return o ? "<" + o + ">" : "<...>";
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
        var o = Object.getOwnPropertyDescriptor(e, "key").get;
        if (o && o.isReactWarning) return !1;
      }
      return e.key !== void 0;
    }
    function d(e, o) {
      function p() {
        G || (G = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          o
        ));
      }
      p.isReactWarning = !0, Object.defineProperty(e, "key", {
        get: p,
        configurable: !0
      });
    }
    function E() {
      var e = r(this.type);
      return z[e] || (z[e] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), e = this.props.ref, e !== void 0 ? e : null;
    }
    function l(e, o, p, b, k, M) {
      var R = p.ref;
      return e = {
        $$typeof: w,
        type: e,
        key: o,
        props: p,
        _owner: b
      }, (R !== void 0 ? R : null) !== null ? Object.defineProperty(e, "ref", {
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
        value: M
      }), Object.freeze && (Object.freeze(e.props), Object.freeze(e)), e;
    }
    function n(e, o, p, b, k, M) {
      var R = o.children;
      if (R !== void 0)
        if (b)
          if (ue(R)) {
            for (b = 0; b < R.length; b++)
              u(R[b]);
            Object.freeze && Object.freeze(R);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else u(R);
      if (W.call(o, "key")) {
        R = r(e);
        var h = Object.keys(o).filter(function(fe) {
          return fe !== "key";
        });
        b = 0 < h.length ? "{key: someKey, " + h.join(": ..., ") + ": ...}" : "{key: someKey}", B[R + b] || (h = 0 < h.length ? "{" + h.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          b,
          R,
          h,
          R
        ), B[R + b] = !0);
      }
      if (R = null, p !== void 0 && (a(p), R = "" + p), m(o) && (a(o.key), R = "" + o.key), "key" in o) {
        p = {};
        for (var F in o)
          F !== "key" && (p[F] = o[F]);
      } else p = o;
      return R && d(
        p,
        typeof e == "function" ? e.displayName || e.name || "Unknown" : e
      ), l(
        e,
        R,
        p,
        c(),
        k,
        M
      );
    }
    function u(e) {
      T(e) ? e._store && (e._store.validated = 1) : typeof e == "object" && e !== null && e.$$typeof === U && (e._payload.status === "fulfilled" ? T(e._payload.value) && e._payload.value._store && (e._payload.value._store.validated = 1) : e._store && (e._store.validated = 1));
    }
    function T(e) {
      return typeof e == "object" && e !== null && e.$$typeof === w;
    }
    var _ = de, w = /* @__PURE__ */ Symbol.for("react.transitional.element"), y = /* @__PURE__ */ Symbol.for("react.portal"), A = /* @__PURE__ */ Symbol.for("react.fragment"), x = /* @__PURE__ */ Symbol.for("react.strict_mode"), g = /* @__PURE__ */ Symbol.for("react.profiler"), te = /* @__PURE__ */ Symbol.for("react.consumer"), ne = /* @__PURE__ */ Symbol.for("react.context"), oe = /* @__PURE__ */ Symbol.for("react.forward_ref"), ae = /* @__PURE__ */ Symbol.for("react.suspense"), se = /* @__PURE__ */ Symbol.for("react.suspense_list"), ie = /* @__PURE__ */ Symbol.for("react.memo"), U = /* @__PURE__ */ Symbol.for("react.lazy"), le = /* @__PURE__ */ Symbol.for("react.activity"), ce = /* @__PURE__ */ Symbol.for("react.client.reference"), $ = _.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, W = Object.prototype.hasOwnProperty, ue = Array.isArray, Y = console.createTask ? console.createTask : function() {
      return null;
    };
    _ = {
      react_stack_bottom_frame: function(e) {
        return e();
      }
    };
    var G, z = {}, K = _.react_stack_bottom_frame.bind(
      _,
      i
    )(), q = Y(f(i)), B = {};
    O.Fragment = A, O.jsx = function(e, o, p) {
      var b = 1e4 > $.recentlyCreatedOwnerStacks++;
      return n(
        e,
        o,
        p,
        !1,
        b ? Error("react-stack-top-frame") : K,
        b ? Y(f(e)) : q
      );
    }, O.jsxs = function(e, o, p) {
      var b = 1e4 > $.recentlyCreatedOwnerStacks++;
      return n(
        e,
        o,
        p,
        !0,
        b ? Error("react-stack-top-frame") : K,
        b ? Y(f(e)) : q
      );
    };
  })()), O;
}
var X;
function Te() {
  return X || (X = 1, process.env.NODE_ENV === "production" ? j.exports = Ee() : j.exports = pe()), j.exports;
}
var D = Te(), s = /* @__PURE__ */ ((r) => (r.LISTEN = "LISTEN", r.SPEAK_NEUTRAL = "SPEAK_NEUTRAL", r.ENCOURAGE = "ENCOURAGE", r.THINK = "THINK", r.CAUTION = "CAUTION", r.CELEBRATE = "CELEBRATE", r))(s || {});
const be = {
  [s.LISTEN]: "/assets/listening.webp",
  [s.SPEAK_NEUTRAL]: "/assets/speaking-edited.webp",
  [s.ENCOURAGE]: "/assets/ballbounce.webp",
  [s.THINK]: "/assets/regular-thinking.webp",
  [s.CAUTION]: "/assets/glassadjustment.webp",
  [s.CELEBRATE]: "/assets/bubblepop.webp"
};
function Re({
  emotionState: r,
  intensity: t,
  size: a,
  customImages: f
}) {
  const [c, i] = C(!1), m = P(null), d = P(/* @__PURE__ */ new Set()), E = { ...be, ...f };
  v(() => {
    const n = (T) => new Promise((_) => {
      const w = new Image();
      w.onload = () => {
        d.current.add(T), _();
      }, w.onerror = () => _(), w.src = T;
    });
    Object.values(E).forEach((T) => n(T));
  }, [E]), v(() => {
    const n = m.current;
    if (!n) return;
    const u = E[r];
    if (!u || n.dataset.srcKey === u) return;
    i(!0), n.dataset.srcKey = u, n.src = u;
    const T = () => {
      i(!1), d.current.add(u);
    };
    if (d.current.has(u))
      i(!1);
    else
      return n.addEventListener("load", T, { once: !0 }), () => {
        n.removeEventListener("load", T);
      };
  }, [r, E]), v(() => {
    const n = m.current;
    if (!n) return;
    const u = E[s.LISTEN];
    n.dataset.srcKey = u, n.src = u;
  }, [E]);
  const l = {
    width: `${a}px`,
    height: `${a}px`,
    objectFit: "cover",
    borderRadius: "50%",
    opacity: 0.6 + 0.4 * t,
    transform: `scale(${1 + 0.05 * t})`,
    filter: `brightness(${0.9 + 0.2 * t})`,
    transition: "opacity 0.15s ease, transform 0.15s ease, filter 0.15s ease"
  };
  return /* @__PURE__ */ D.jsx(
    "img",
    {
      ref: m,
      alt: "Avatar",
      style: l,
      className: `avatar-image ${c ? "loading" : ""}`
    }
  );
}
Q.allowRemoteModels = !0;
Q.useBrowserCache = !0;
const ve = "Xenova/distilbert-base-uncased-emotion", _e = "q8";
let S = null, N = null, V = !1;
async function ee() {
  return S || N || (N = (async () => {
    console.log("[EmotionClassifier] Loading DistilBERT emotion model (INT8 quantized)...");
    const r = performance.now();
    try {
      const t = await me("text-classification", ve, {
        dtype: _e,
        device: "wasm"
      }), a = performance.now() - r;
      return console.log(`[EmotionClassifier] Model loaded in ${a.toFixed(0)}ms`), S = t, V = !0, t;
    } catch (t) {
      throw console.error("[EmotionClassifier] Failed to load model:", t), N = null, t;
    }
  })(), N);
}
async function we() {
  await ee(), S && (await S("hello", { top_k: 6 }), console.log("[EmotionClassifier] Warm-up inference complete"));
}
function $e() {
  return V;
}
async function ye(r) {
  if (!r.trim()) return null;
  try {
    const t = await ee(), a = performance.now(), f = await t(r, { top_k: 6 }), c = performance.now() - a, i = {}, m = Array.isArray(f[0]) ? f[0] : f;
    for (const l of m)
      i[l.label] = l.score;
    let d = "joy", E = 0;
    for (const [l, n] of Object.entries(i))
      n > E && (E = n, d = l);
    return {
      topEmotion: d,
      confidence: E,
      scores: i,
      inferenceMs: c
    };
  } catch (t) {
    return console.error("[EmotionClassifier] Inference error:", t), null;
  }
}
async function Ae() {
  S && (await S.dispose(), S = null, N = null, V = !1, console.log("[EmotionClassifier] Model disposed"));
}
const Se = /\b(situation|context|background|project|when|at that time|while working)\b/i, he = /\b(task|goal|objective|challenge|responsible for|assigned|needed to)\b/i, Ne = /\b(action|i did|i built|i implemented|i designed|i created|i wrote|i developed|i used|i refactored|i optimized|my approach|steps i took)\b/i, ge = /\b(result|outcome|impact|improved|reduced|increased|saved|achieved|delivered|metric|percentage|percent|%|\d+x)\b/i;
function Ie(r) {
  if (!r.trim()) return 0;
  let t = 0;
  return Se.test(r) && (t += 0.25), he.test(r) && (t += 0.25), Ne.test(r) && (t += 0.25), ge.test(r) && (t += 0.25), t;
}
const Oe = /* @__PURE__ */ new Set([
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
]), Ce = /* @__PURE__ */ new Set([
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
function ke(r) {
  if (!r.trim()) return 0;
  const t = r.toLowerCase().split(/\W+/);
  let a = 0, f = 0;
  for (const i of t)
    Oe.has(i) && a++, Ce.has(i) && f++;
  const c = a + f;
  return c === 0 ? 0 : (a - f) / c;
}
const je = {
  modelEmotion: null,
  modelConfidence: 0,
  emotionScores: {}
};
function Le(r) {
  return {
    contentCompleteness: Ie(r),
    sentimentValence: ke(r),
    ...je
  };
}
async function re(r) {
  const t = Le(r), a = await ye(r);
  return a ? {
    ...t,
    modelEmotion: a.topEmotion,
    modelConfidence: a.confidence,
    emotionScores: a.scores
  } : t;
}
function Pe({
  isSpeaking: r = !1,
  isListening: t = !1,
  onEmotionChange: a
}) {
  const [f, c] = C(s.LISTEN), [i, m] = C(0.3), d = L((l) => {
    c(l), m(0.8), a?.(l, 0.8);
  }, [a]), E = L(async (l) => {
    if (!l.trim()) return s.LISTEN;
    try {
      const n = await re(l);
      if (n.modelEmotion)
        switch (n.modelEmotion) {
          case "joy":
          case "love":
            return s.ENCOURAGE;
          case "anger":
          case "fear":
          case "sadness":
            return s.CAUTION;
          case "surprise":
            return s.THINK;
          default:
            return s.LISTEN;
        }
      return n.sentimentValence > 0.3 ? s.ENCOURAGE : n.sentimentValence < -0.3 ? s.CAUTION : s.LISTEN;
    } catch (n) {
      return console.warn("[useAvatarController] Emotion analysis failed:", n), s.LISTEN;
    }
  }, []);
  return L(() => {
    r ? (c(s.SPEAK_NEUTRAL), m(0.7)) : t && (c(s.LISTEN), m(0.5));
  }, [r, t]), {
    emotionState: f,
    intensity: i,
    setEmotion: d,
    analyzeEmotion: E
  };
}
function Ye({
  aiMessage: r = "",
  userMessage: t = "",
  emotionDetection: a = !0,
  autoAnimate: f = !0,
  isSpeaking: c = !1,
  isListening: i = !1,
  overrideEmotion: m,
  onEmotionChange: d,
  customImages: E,
  size: l = 260,
  className: n = ""
}) {
  const [u, T] = C(!1), {
    emotionState: _,
    intensity: w,
    setEmotion: y,
    analyzeEmotion: A
  } = Pe({
    isSpeaking: c,
    isListening: i,
    onEmotionChange: d
  });
  v(() => {
    T(!0);
  }, []), v(() => {
    a && r && u && f && A(r).then((g) => {
      y(g);
    });
  }, [r, a, u, f, A, y]), v(() => {
    a && t && u && f && A(t).then((g) => {
      y(g);
    });
  }, [t, a, u, f, A, y]), v(() => {
    m && y(m);
  }, [m, y]);
  const x = {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: l,
    height: l
  };
  return /* @__PURE__ */ D.jsx("div", { className: n, style: x, children: /* @__PURE__ */ D.jsx(
    Re,
    {
      emotionState: _,
      intensity: w,
      size: l,
      customImages: E
    }
  ) });
}
const Z = 1e3;
function Me({
  aiMessage: r = "",
  userMessage: t = "",
  isSpeaking: a = !1,
  isListening: f = !1
}) {
  const [c, i] = C({
    state: s.LISTEN,
    intensity: 0.3
  }), m = P(0), d = P(!1);
  v(() => (we().catch(
    (l) => console.warn("[EmotionController] ML classifier warm-up failed (will use rule-based fallback):", l)
  ), () => {
    Ae();
  }), []);
  const E = L(async (l) => {
    if (!l.trim())
      return { state: s.LISTEN, intensity: 0.3 };
    try {
      const n = await re(l);
      let u = s.LISTEN, T = 0.5;
      if (n.modelEmotion)
        switch (n.modelEmotion) {
          case "joy":
          case "love":
            u = s.ENCOURAGE, T = 0.8;
            break;
          case "anger":
          case "fear":
          case "sadness":
            u = s.CAUTION, T = 0.7;
            break;
          case "surprise":
            u = s.THINK, T = 0.6;
            break;
          default:
            u = s.LISTEN;
        }
      else
        n.sentimentValence > 0.3 ? (u = s.ENCOURAGE, T = 0.7) : n.sentimentValence < -0.3 && (u = s.CAUTION, T = 0.6);
      return { state: u, intensity: T };
    } catch (n) {
      return console.warn("[EmotionController] Emotion analysis failed:", n), { state: s.LISTEN, intensity: 0.3 };
    }
  }, []);
  return v(() => {
    if (!r) return;
    const l = performance.now();
    d.current || l - m.current < Z || (d.current = !0, m.current = l, E(r).then((n) => {
      i(n), d.current = !1;
    }).catch(() => {
      d.current = !1;
    }));
  }, [r, E]), v(() => {
    if (!t) return;
    const l = performance.now();
    d.current || l - m.current < Z || (d.current = !0, m.current = l, E(t).then((n) => {
      i(n), d.current = !1;
    }).catch(() => {
      d.current = !1;
    }));
  }, [t, E]), v(() => {
    a ? i({ state: s.SPEAK_NEUTRAL, intensity: 0.7 }) : f && i({ state: s.LISTEN, intensity: 0.5 });
  }, [a, f]), {
    emotionState: c.state,
    intensity: c.intensity,
    analyzeText: E
  };
}
export {
  Ye as AnimatedAvatar,
  Re as AvatarRenderer,
  ye as classifyEmotion,
  Ae as disposeEmotionClassifier,
  Le as extractTextSignals,
  re as extractTextSignalsWithML,
  $e as isEmotionClassifierReady,
  Pe as useAvatarController,
  Me as useEmotionController,
  we as warmUpEmotionClassifier
};
