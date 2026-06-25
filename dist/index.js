import me, { useState as C, useRef as P, useEffect as w, useCallback as V } from "react";
import { env as W, pipeline as Ee } from "@huggingface/transformers";
var L = { exports: {} }, g = {};
var X;
function pe() {
  if (X) return g;
  X = 1;
  var r = /* @__PURE__ */ Symbol.for("react.transitional.element"), t = /* @__PURE__ */ Symbol.for("react.fragment");
  function i(c, u, l) {
    var f = null;
    if (l !== void 0 && (f = "" + l), u.key !== void 0 && (f = "" + u.key), "key" in u) {
      l = {};
      for (var d in u)
        d !== "key" && (l[d] = u[d]);
    } else l = u;
    return u = l.ref, {
      $$typeof: r,
      type: c,
      key: f,
      ref: u !== void 0 ? u : null,
      props: l
    };
  }
  return g.Fragment = t, g.jsx = i, g.jsxs = i, g;
}
var O = {};
var Z;
function Te() {
  return Z || (Z = 1, process.env.NODE_ENV !== "production" && (function() {
    function r(e) {
      if (e == null) return null;
      if (typeof e == "function")
        return e.$$typeof === ue ? null : e.displayName || e.name || null;
      if (typeof e == "string") return e;
      switch (e) {
        case v:
          return "Fragment";
        case j:
          return "Profiler";
        case A:
          return "StrictMode";
        case ae:
          return "Suspense";
        case ie:
          return "SuspenseList";
        case le:
          return "Activity";
      }
      if (typeof e == "object")
        switch (typeof e.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), e.$$typeof) {
          case x:
            return "Portal";
          case oe:
            return e.displayName || "Context";
          case N:
            return (e._context.displayName || "Context") + ".Consumer";
          case se:
            var s = e.render;
            return e = e.displayName, e || (e = s.displayName || s.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
          case ce:
            return s = e.displayName || null, s !== null ? s : r(e.type) || "Memo";
          case U:
            s = e._payload, e = e._init;
            try {
              return r(e(s));
            } catch {
            }
        }
      return null;
    }
    function t(e) {
      return "" + e;
    }
    function i(e) {
      try {
        t(e);
        var s = !1;
      } catch {
        s = !0;
      }
      if (s) {
        s = console;
        var E = s.error, p = typeof Symbol == "function" && Symbol.toStringTag && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return E.call(
          s,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          p
        ), t(e);
      }
    }
    function c(e) {
      if (e === v) return "<>";
      if (typeof e == "object" && e !== null && e.$$typeof === U)
        return "<...>";
      try {
        var s = r(e);
        return s ? "<" + s + ">" : "<...>";
      } catch {
        return "<...>";
      }
    }
    function u() {
      var e = $.A;
      return e === null ? null : e.getOwner();
    }
    function l() {
      return Error("react-stack-top-frame");
    }
    function f(e) {
      if (K.call(e, "key")) {
        var s = Object.getOwnPropertyDescriptor(e, "key").get;
        if (s && s.isReactWarning) return !1;
      }
      return e.key !== void 0;
    }
    function d(e, s) {
      function E() {
        z || (z = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          s
        ));
      }
      E.isReactWarning = !0, Object.defineProperty(e, "key", {
        get: E,
        configurable: !0
      });
    }
    function b() {
      var e = r(this.type);
      return q[e] || (q[e] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), e = this.props.ref, e !== void 0 ? e : null;
    }
    function n(e, s, E, p, k, F) {
      var T = E.ref;
      return e = {
        $$typeof: I,
        type: e,
        key: s,
        props: E,
        _owner: p
      }, (T !== void 0 ? T : null) !== null ? Object.defineProperty(e, "ref", {
        enumerable: !1,
        get: b
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
        value: F
      }), Object.freeze && (Object.freeze(e.props), Object.freeze(e)), e;
    }
    function o(e, s, E, p, k, F) {
      var T = s.children;
      if (T !== void 0)
        if (p)
          if (fe(T)) {
            for (p = 0; p < T.length; p++)
              m(T[p]);
            Object.freeze && Object.freeze(T);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else m(T);
      if (K.call(s, "key")) {
        T = r(e);
        var y = Object.keys(s).filter(function(de) {
          return de !== "key";
        });
        p = 0 < y.length ? "{key: someKey, " + y.join(": ..., ") + ": ...}" : "{key: someKey}", B[T + p] || (y = 0 < y.length ? "{" + y.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          p,
          T,
          y,
          T
        ), B[T + p] = !0);
      }
      if (T = null, E !== void 0 && (i(E), T = "" + E), f(s) && (i(s.key), T = "" + s.key), "key" in s) {
        E = {};
        for (var M in s)
          M !== "key" && (E[M] = s[M]);
      } else E = s;
      return T && d(
        E,
        typeof e == "function" ? e.displayName || e.name || "Unknown" : e
      ), n(
        e,
        T,
        E,
        u(),
        k,
        F
      );
    }
    function m(e) {
      R(e) ? e._store && (e._store.validated = 1) : typeof e == "object" && e !== null && e.$$typeof === U && (e._payload.status === "fulfilled" ? R(e._payload.value) && e._payload.value._store && (e._payload.value._store.validated = 1) : e._store && (e._store.validated = 1));
    }
    function R(e) {
      return typeof e == "object" && e !== null && e.$$typeof === I;
    }
    var _ = me, I = /* @__PURE__ */ Symbol.for("react.transitional.element"), x = /* @__PURE__ */ Symbol.for("react.portal"), v = /* @__PURE__ */ Symbol.for("react.fragment"), A = /* @__PURE__ */ Symbol.for("react.strict_mode"), j = /* @__PURE__ */ Symbol.for("react.profiler"), N = /* @__PURE__ */ Symbol.for("react.consumer"), oe = /* @__PURE__ */ Symbol.for("react.context"), se = /* @__PURE__ */ Symbol.for("react.forward_ref"), ae = /* @__PURE__ */ Symbol.for("react.suspense"), ie = /* @__PURE__ */ Symbol.for("react.suspense_list"), ce = /* @__PURE__ */ Symbol.for("react.memo"), U = /* @__PURE__ */ Symbol.for("react.lazy"), le = /* @__PURE__ */ Symbol.for("react.activity"), ue = /* @__PURE__ */ Symbol.for("react.client.reference"), $ = _.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, K = Object.prototype.hasOwnProperty, fe = Array.isArray, Y = console.createTask ? console.createTask : function() {
      return null;
    };
    _ = {
      react_stack_bottom_frame: function(e) {
        return e();
      }
    };
    var z, q = {}, H = _.react_stack_bottom_frame.bind(
      _,
      l
    )(), J = Y(c(l)), B = {};
    O.Fragment = v, O.jsx = function(e, s, E) {
      var p = 1e4 > $.recentlyCreatedOwnerStacks++;
      return o(
        e,
        s,
        E,
        !1,
        p ? Error("react-stack-top-frame") : H,
        p ? Y(c(e)) : J
      );
    }, O.jsxs = function(e, s, E) {
      var p = 1e4 > $.recentlyCreatedOwnerStacks++;
      return o(
        e,
        s,
        E,
        !0,
        p ? Error("react-stack-top-frame") : H,
        p ? Y(c(e)) : J
      );
    };
  })()), O;
}
var Q;
function be() {
  return Q || (Q = 1, process.env.NODE_ENV === "production" ? L.exports = pe() : L.exports = Te()), L.exports;
}
var D = be(), a = /* @__PURE__ */ ((r) => (r.LISTEN = "LISTEN", r.SPEAK_NEUTRAL = "SPEAK_NEUTRAL", r.ENCOURAGE = "ENCOURAGE", r.THINK = "THINK", r.CAUTION = "CAUTION", r.CELEBRATE = "CELEBRATE", r))(a || {});
function Re({
  emotionState: r,
  intensity: t,
  size: i,
  emotionImages: c
}) {
  const [u, l] = C(!1), f = P(null), d = P(/* @__PURE__ */ new Set());
  w(() => {
    const n = (o) => new Promise((m) => {
      const R = new Image();
      R.onload = () => {
        d.current.add(o), m();
      }, R.onerror = () => m(), R.src = o;
    });
    Object.values(c).forEach((o) => n(o));
  }, [c]), w(() => {
    const n = f.current;
    if (!n) return;
    const o = c[r];
    if (!(!o || n.dataset.srcKey === o))
      if (l(!0), n.dataset.srcKey = o, n.src = o, d.current.has(o))
        l(!1);
      else {
        const m = () => {
          l(!1), d.current.add(o);
        };
        return n.addEventListener("load", m, { once: !0 }), () => n.removeEventListener("load", m);
      }
  }, [r, c]), w(() => {
    const n = f.current;
    if (!n) return;
    const o = c[a.LISTEN];
    n.dataset.srcKey = o, n.src = o;
  }, [c]);
  const b = {
    width: `${i}px`,
    height: `${i}px`,
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
      ref: f,
      alt: "Avatar",
      style: b,
      className: `avatar-image ${u ? "loading" : ""}`
    }
  );
}
W.allowLocalModels = !0;
W.allowRemoteModels = !0;
W.useBrowserCache = !0;
const ee = new URL("../models/onnx/", import.meta.url).href;
let h = null, S = null, G = !1;
async function te() {
  return h || S || (S = (async () => {
    console.log("[EmotionClassifier] Loading bundled model from:", ee);
    const r = performance.now();
    try {
      const t = await Ee(
        "text-classification",
        ee,
        {
          device: "wasm",
          dtype: "q8"
        }
      );
      return console.log(
        `[EmotionClassifier] Model loaded in ${(performance.now() - r).toFixed(0)}ms`
      ), h = t, G = !0, t;
    } catch (t) {
      throw console.error("[EmotionClassifier] Failed to load model:", t), S = null, t;
    }
  })(), S);
}
async function we() {
  await (await te())("hello world"), console.log("[EmotionClassifier] Warm-up complete");
}
function Ue() {
  return G;
}
async function ve(r) {
  if (!r?.trim()) return null;
  try {
    const t = await te(), i = performance.now(), c = await t(r, {
      top_k: 13
      // match your model's actual label count
    }), u = performance.now() - i, l = Array.isArray(c[0]) ? c[0] : c, f = {};
    for (const n of l)
      f[n.label] = n.score;
    let d = "neutral", b = 0;
    for (const [n, o] of Object.entries(f))
      (o ?? 0) > b && (b = o ?? 0, d = n);
    return {
      topEmotion: d,
      confidence: b,
      scores: f,
      inferenceMs: u
    };
  } catch (t) {
    return console.error("[EmotionClassifier] Inference error:", t), null;
  }
}
async function _e() {
  h && (await h.dispose(), h = null, S = null, G = !1, console.log("[EmotionClassifier] Model disposed"));
}
const Ae = /\b(situation|context|background|project|when|at that time|while working)\b/i, ye = /\b(task|goal|objective|challenge|responsible for|assigned|needed to)\b/i, Se = /\b(action|i did|i built|i implemented|i designed|i created|i wrote|i developed|i used|i refactored|i optimized|my approach|steps i took)\b/i, he = /\b(result|outcome|impact|improved|reduced|increased|saved|achieved|delivered|metric|percentage|percent|%|\d+x)\b/i;
function Ne(r) {
  if (!r.trim()) return 0;
  let t = 0;
  return Ae.test(r) && (t += 0.25), ye.test(r) && (t += 0.25), Se.test(r) && (t += 0.25), he.test(r) && (t += 0.25), t;
}
const ge = /* @__PURE__ */ new Set([
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
]), Oe = /* @__PURE__ */ new Set([
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
function Ce(r) {
  if (!r.trim()) return 0;
  const t = r.toLowerCase().split(/\W+/);
  let i = 0, c = 0;
  for (const l of t)
    ge.has(l) && i++, Oe.has(l) && c++;
  const u = i + c;
  return u === 0 ? 0 : (i - c) / u;
}
const Ie = {
  modelEmotion: null,
  modelConfidence: 0,
  emotionScores: {}
};
function ke(r) {
  return {
    contentCompleteness: Ne(r),
    sentimentValence: Ce(r),
    ...Ie
  };
}
async function ne(r) {
  const t = ke(r), i = await ve(r);
  return i ? {
    ...t,
    modelEmotion: i.topEmotion,
    modelConfidence: i.confidence,
    emotionScores: i.scores
  } : t;
}
function Le({
  isSpeaking: r = !1,
  isListening: t = !1,
  onEmotionChange: i
}) {
  const [c, u] = C(a.LISTEN), [l, f] = C(0.3), d = V((n) => {
    u(n), f(0.8), i?.(n, 0.8);
  }, [i]), b = V(async (n) => {
    if (!n.trim()) return a.LISTEN;
    try {
      const o = await ne(n);
      if (o.modelEmotion)
        switch (o.modelEmotion) {
          case "happiness":
          case "love":
          case "desire":
            return a.ENCOURAGE;
          case "anger":
          case "fear":
          case "sadness":
          case "disgust":
          case "shame":
          case "guilt":
            return a.CAUTION;
          case "surprise":
          case "confusion":
            return a.THINK;
          case "sarcasm":
            return a.CAUTION;
          default:
            return a.LISTEN;
        }
      return o.sentimentValence > 0.3 ? a.ENCOURAGE : o.sentimentValence < -0.3 ? a.CAUTION : a.LISTEN;
    } catch (o) {
      return console.warn("[useAvatarController] Emotion analysis failed:", o), a.LISTEN;
    }
  }, []);
  return w(() => {
    r ? (u(a.SPEAK_NEUTRAL), f(0.7)) : t && (u(a.LISTEN), f(0.5));
  }, [r, t]), {
    emotionState: c,
    intensity: l,
    setEmotion: d,
    analyzeEmotion: b
  };
}
const Pe = {
  [a.LISTEN]: "/assets/listening.webp",
  [a.SPEAK_NEUTRAL]: "/assets/speaking-edited.webp",
  [a.ENCOURAGE]: "/assets/ballbounce.webp",
  [a.THINK]: "/assets/regular-thinking.webp",
  [a.CAUTION]: "/assets/glassadjustment.webp",
  [a.CELEBRATE]: "/assets/bubblepop.webp"
};
function $e({
  aiMessage: r = "",
  userMessage: t = "",
  emotionDetection: i = !0,
  autoAnimate: c = !0,
  isSpeaking: u = !1,
  isListening: l = !1,
  overrideEmotion: f,
  onEmotionChange: d,
  emotionImages: b,
  size: n = 260,
  className: o = ""
}) {
  const [m, R] = C(!1), _ = {
    ...Pe,
    ...b
  }, { emotionState: I, intensity: x, setEmotion: v, analyzeEmotion: A } = Le({ isSpeaking: u, isListening: l, onEmotionChange: d });
  w(() => {
    R(!0);
  }, []), w(() => {
    i && r && m && c && A(r).then((N) => v(N));
  }, [r, i, m, c, A, v]), w(() => {
    i && t && m && c && A(t).then((N) => v(N));
  }, [t, i, m, c, A, v]), w(() => {
    f && v(f);
  }, [f, v]);
  const j = {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: n,
    height: n
  };
  return /* @__PURE__ */ D.jsx("div", { className: o, style: j, children: /* @__PURE__ */ D.jsx(
    Re,
    {
      emotionState: I,
      intensity: x,
      size: n,
      emotionImages: _
    }
  ) });
}
const re = 1e3;
function Ye({
  aiMessage: r = "",
  userMessage: t = "",
  isSpeaking: i = !1,
  isListening: c = !1
}) {
  const [u, l] = C({
    state: a.LISTEN,
    intensity: 0.3
  }), f = P(0), d = P(!1);
  w(() => (we().catch(
    (n) => console.warn("[EmotionController] ML classifier warm-up failed (will use rule-based fallback):", n)
  ), () => {
    _e();
  }), []);
  const b = V(async (n) => {
    if (!n.trim())
      return { state: a.LISTEN, intensity: 0.3 };
    try {
      const o = await ne(n);
      let m = a.LISTEN, R = 0.5;
      if (o.modelEmotion)
        switch (o.modelEmotion) {
          case "happiness":
          case "love":
          case "desire":
            m = a.ENCOURAGE, R = 0.8;
            break;
          case "anger":
          case "fear":
          case "sadness":
          case "disgust":
          case "shame":
          case "guilt":
            m = a.CAUTION, R = 0.7;
            break;
          case "surprise":
          case "confusion":
            m = a.THINK, R = 0.6;
            break;
          case "sarcasm":
            m = a.CAUTION, R = 0.4;
            break;
          default:
            m = a.LISTEN;
        }
      else
        o.sentimentValence > 0.3 ? (m = a.ENCOURAGE, R = 0.7) : o.sentimentValence < -0.3 && (m = a.CAUTION, R = 0.6);
      return { state: m, intensity: R };
    } catch (o) {
      return console.warn("[EmotionController] Emotion analysis failed:", o), { state: a.LISTEN, intensity: 0.3 };
    }
  }, []);
  return w(() => {
    if (!r) return;
    const n = performance.now();
    d.current || n - f.current < re || (d.current = !0, f.current = n, b(r).then((o) => {
      l(o), d.current = !1;
    }).catch(() => {
      d.current = !1;
    }));
  }, [r, b]), w(() => {
    if (!t) return;
    const n = performance.now();
    d.current || n - f.current < re || (d.current = !0, f.current = n, b(t).then((o) => {
      l(o), d.current = !1;
    }).catch(() => {
      d.current = !1;
    }));
  }, [t, b]), w(() => {
    i ? l({ state: a.SPEAK_NEUTRAL, intensity: 0.7 }) : c && l({ state: a.LISTEN, intensity: 0.5 });
  }, [i, c]), {
    emotionState: u.state,
    intensity: u.intensity,
    analyzeText: b
  };
}
export {
  $e as AnimatedAvatar,
  Re as AvatarRenderer,
  a as EmotionState,
  ve as classifyEmotion,
  _e as disposeEmotionClassifier,
  ke as extractTextSignals,
  ne as extractTextSignalsWithML,
  Ue as isEmotionClassifierReady,
  Le as useAvatarController,
  Ye as useEmotionController,
  we as warmUpEmotionClassifier
};
