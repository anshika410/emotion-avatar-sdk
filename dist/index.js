import Ee, { useState as O, useRef as L, useMemo as pe, useEffect as v, useCallback as j } from "react";
import { env as V, pipeline as Te } from "@huggingface/transformers";
var k = { exports: {} }, N = {};
var H;
function be() {
  if (H) return N;
  H = 1;
  var r = /* @__PURE__ */ Symbol.for("react.transitional.element"), t = /* @__PURE__ */ Symbol.for("react.fragment");
  function i(f, l, c) {
    var d = null;
    if (c !== void 0 && (d = "" + c), l.key !== void 0 && (d = "" + l.key), "key" in l) {
      c = {};
      for (var u in l)
        u !== "key" && (c[u] = l[u]);
    } else c = l;
    return l = c.ref, {
      $$typeof: r,
      type: f,
      key: d,
      ref: l !== void 0 ? l : null,
      props: c
    };
  }
  return N.Fragment = t, N.jsx = i, N.jsxs = i, N;
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
        case P:
          return "Profiler";
        case x:
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
          case w:
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
    function i(e) {
      try {
        t(e);
        var n = !1;
      } catch {
        n = !0;
      }
      if (n) {
        n = console;
        var m = n.error, p = typeof Symbol == "function" && Symbol.toStringTag && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return m.call(
          n,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          p
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
    function l() {
      var e = $.A;
      return e === null ? null : e.getOwner();
    }
    function c() {
      return Error("react-stack-top-frame");
    }
    function d(e) {
      if (G.call(e, "key")) {
        var n = Object.getOwnPropertyDescriptor(e, "key").get;
        if (n && n.isReactWarning) return !1;
      }
      return e.key !== void 0;
    }
    function u(e, n) {
      function m() {
        z || (z = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          n
        ));
      }
      m.isReactWarning = !0, Object.defineProperty(e, "key", {
        get: m,
        configurable: !0
      });
    }
    function b() {
      var e = r(this.type);
      return K[e] || (K[e] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), e = this.props.ref, e !== void 0 ? e : null;
    }
    function o(e, n, m, p, C, F) {
      var T = m.ref;
      return e = {
        $$typeof: I,
        type: e,
        key: n,
        props: m,
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
        value: C
      }), Object.defineProperty(e, "_debugTask", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: F
      }), Object.freeze && (Object.freeze(e.props), Object.freeze(e)), e;
    }
    function a(e, n, m, p, C, F) {
      var T = n.children;
      if (T !== void 0)
        if (p)
          if (de(T)) {
            for (p = 0; p < T.length; p++)
              E(T[p]);
            Object.freeze && Object.freeze(T);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else E(T);
      if (G.call(n, "key")) {
        T = r(e);
        var S = Object.keys(n).filter(function(me) {
          return me !== "key";
        });
        p = 0 < S.length ? "{key: someKey, " + S.join(": ..., ") + ": ...}" : "{key: someKey}", J[T + p] || (S = 0 < S.length ? "{" + S.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          p,
          T,
          S,
          T
        ), J[T + p] = !0);
      }
      if (T = null, m !== void 0 && (i(m), T = "" + m), d(n) && (i(n.key), T = "" + n.key), "key" in n) {
        m = {};
        for (var Y in n)
          Y !== "key" && (m[Y] = n[Y]);
      } else m = n;
      return T && u(
        m,
        typeof e == "function" ? e.displayName || e.name || "Unknown" : e
      ), o(
        e,
        T,
        m,
        l(),
        C,
        F
      );
    }
    function E(e) {
      R(e) ? e._store && (e._store.validated = 1) : typeof e == "object" && e !== null && e.$$typeof === U && (e._payload.status === "fulfilled" ? R(e._payload.value) && e._payload.value._store && (e._payload.value._store.validated = 1) : e._store && (e._store.validated = 1));
    }
    function R(e) {
      return typeof e == "object" && e !== null && e.$$typeof === I;
    }
    var A = Ee, I = /* @__PURE__ */ Symbol.for("react.transitional.element"), w = /* @__PURE__ */ Symbol.for("react.portal"), y = /* @__PURE__ */ Symbol.for("react.fragment"), x = /* @__PURE__ */ Symbol.for("react.strict_mode"), P = /* @__PURE__ */ Symbol.for("react.profiler"), oe = /* @__PURE__ */ Symbol.for("react.consumer"), ae = /* @__PURE__ */ Symbol.for("react.context"), se = /* @__PURE__ */ Symbol.for("react.forward_ref"), ie = /* @__PURE__ */ Symbol.for("react.suspense"), le = /* @__PURE__ */ Symbol.for("react.suspense_list"), ce = /* @__PURE__ */ Symbol.for("react.memo"), U = /* @__PURE__ */ Symbol.for("react.lazy"), ue = /* @__PURE__ */ Symbol.for("react.activity"), fe = /* @__PURE__ */ Symbol.for("react.client.reference"), $ = A.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, G = Object.prototype.hasOwnProperty, de = Array.isArray, M = console.createTask ? console.createTask : function() {
      return null;
    };
    A = {
      react_stack_bottom_frame: function(e) {
        return e();
      }
    };
    var z, K = {}, q = A.react_stack_bottom_frame.bind(
      A,
      c
    )(), B = M(f(c)), J = {};
    h.Fragment = y, h.jsx = function(e, n, m) {
      var p = 1e4 > $.recentlyCreatedOwnerStacks++;
      return a(
        e,
        n,
        m,
        !1,
        p ? Error("react-stack-top-frame") : q,
        p ? M(f(e)) : B
      );
    }, h.jsxs = function(e, n, m) {
      var p = 1e4 > $.recentlyCreatedOwnerStacks++;
      return a(
        e,
        n,
        m,
        !0,
        p ? Error("react-stack-top-frame") : q,
        p ? M(f(e)) : B
      );
    };
  })()), h;
}
var Z;
function ve() {
  return Z || (Z = 1, process.env.NODE_ENV === "production" ? k.exports = be() : k.exports = Re()), k.exports;
}
var D = ve(), s = /* @__PURE__ */ ((r) => (r.LISTEN = "LISTEN", r.SPEAK_NEUTRAL = "SPEAK_NEUTRAL", r.ENCOURAGE = "ENCOURAGE", r.THINK = "THINK", r.CAUTION = "CAUTION", r.CELEBRATE = "CELEBRATE", r))(s || {});
const _e = {
  [s.LISTEN]: "/assets/listening.webp",
  [s.SPEAK_NEUTRAL]: "/assets/speaking-edited.webp",
  [s.ENCOURAGE]: "/assets/ballbounce.webp",
  [s.THINK]: "/assets/regular-thinking.webp",
  [s.CAUTION]: "/assets/glassadjustment.webp",
  [s.CELEBRATE]: "/assets/bubblepop.webp"
};
function we({
  emotionState: r,
  size: t,
  customImages: i
}) {
  const [f, l] = O(!1), c = L(null), d = L(/* @__PURE__ */ new Set()), u = pe(
    () => ({ ..._e, ...i }),
    [i]
  );
  v(() => {
    const o = (a) => new Promise((E) => {
      const R = new Image();
      R.onload = () => {
        d.current.add(a), E();
      }, R.onerror = () => E(), R.src = a;
    });
    Object.values(u).forEach(o);
  }, [u]), v(() => {
    const o = c.current;
    if (!o) return;
    const a = u[r];
    if (!a || o.dataset.srcKey === a) return;
    if (l(!0), o.dataset.srcKey = a, o.src = a, console.log(`[AvatarRenderer] Updating avatar: ${a}, emotion: ${r}`), d.current.has(a)) {
      l(!1);
      return;
    }
    const E = () => {
      l(!1), d.current.add(a);
    };
    return o.addEventListener("load", E, { once: !0 }), () => o.removeEventListener("load", E);
  }, [r, u]);
  const b = {
    width: `${t}px`,
    height: `${t}px`,
    objectFit: "cover",
    borderRadius: "50%",
    transition: "opacity 0.15s ease, transform 0.15s ease, filter 0.15s ease"
  };
  return /* @__PURE__ */ D.jsx(
    "img",
    {
      ref: c,
      src: u[s.LISTEN],
      alt: "Avatar",
      style: b,
      className: `avatar-image ${f ? "loading" : ""}`
    }
  );
}
V.allowRemoteModels = !1;
V.allowLocalModels = !0;
V.useBrowserCache = !0;
const Q = "/emotion-model", ee = "fp32";
let _ = null, g = null, W = !1;
async function te() {
  return _ || g || (g = (async () => {
    console.log("[EmotionClassifier] Loading DistilBERT emotion model (INT8 quantized)...");
    const r = performance.now();
    try {
      console.log(`[EmotionClassifier] Using emotion model: ${Q} (${ee})`);
      const t = await Te("text-classification", Q, {
        dtype: ee,
        device: "wasm"
      }), i = performance.now() - r;
      return console.log(`[EmotionClassifier] Model loaded in ${i.toFixed(0)}ms`), _ = t, W = !0, t;
    } catch (t) {
      throw console.error("[EmotionClassifier] Failed to load model:", t), g = null, t;
    }
  })(), g);
}
async function ye() {
  await te(), _ && (await _("hello", { top_k: 6 }), console.log("[EmotionClassifier] Warm-up inference complete"));
}
function Me() {
  return W;
}
async function Ae(r) {
  if (!r.trim()) return null;
  try {
    const t = await te(), i = performance.now(), f = await t(r, { top_k: 6 }), l = performance.now() - i, c = {}, d = Array.isArray(f[0]) ? f[0] : f;
    for (const o of d)
      c[o.label] = o.score;
    let u = "joy", b = 0;
    for (const [o, a] of Object.entries(c))
      a > b && (b = a, u = o);
    return console.log(`[package/services/emotionClassifier.ts]
User text: "${r}"
topEmotion=${u}
confidence=${b.toFixed(3)}
inferenceMs=${l.toFixed(0)}ms`), {
      topEmotion: u,
      confidence: b,
      scores: c,
      inferenceMs: l
    };
  } catch (t) {
    return console.error("[EmotionClassifier] Inference error:", t), null;
  }
}
async function Se() {
  _ && (await _.dispose(), _ = null, g = null, W = !1, console.log("[EmotionClassifier] Model disposed"));
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
  let i = 0, f = 0;
  for (const c of t)
    Ce.has(c) && i++, ke.has(c) && f++;
  const l = i + f;
  return l === 0 ? 0 : (i - f) / l;
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
  const t = xe(r), i = await Ae(r);
  return i ? {
    ...t,
    modelEmotion: i.topEmotion,
    modelConfidence: i.confidence,
    emotionScores: i.scores
  } : t;
}
function Pe({
  isSpeaking: r = !1,
  isListening: t = !1,
  onEmotionChange: i
}) {
  const [f, l] = O(s.LISTEN), [c, d] = O(0.3), u = j((o) => {
    l(o), d(0.8), i?.(o, 0.8);
  }, [i]), b = j(async (o) => {
    if (!o.trim()) return s.LISTEN;
    try {
      const a = await ne(o);
      if (a.modelEmotion)
        switch (a.modelEmotion) {
          case "joy":
            return s.CELEBRATE;
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
      return a.sentimentValence > 0.3 ? s.ENCOURAGE : a.sentimentValence < -0.3 ? s.CAUTION : s.LISTEN;
    } catch (a) {
      return console.warn("[useAvatarController] Emotion analysis failed:", a), s.LISTEN;
    }
  }, []);
  return j(() => {
    r ? (l(s.SPEAK_NEUTRAL), d(0.7)) : t && (l(s.LISTEN), d(0.5));
  }, [r, t]), {
    emotionState: f,
    intensity: c,
    setEmotion: u,
    analyzeEmotion: b
  };
}
function Fe({
  aiMessage: r = "",
  userMessage: t = "",
  emotionDetection: i = !0,
  autoAnimate: f = !0,
  isSpeaking: l = !1,
  isListening: c = !1,
  overrideEmotion: d,
  onEmotionChange: u,
  customImages: b,
  size: o = 260,
  className: a = ""
}) {
  const [E, R] = O(!1), {
    emotionState: A,
    intensity: I,
    setEmotion: w,
    analyzeEmotion: y
  } = Pe({
    isSpeaking: l,
    isListening: c,
    onEmotionChange: u
  });
  v(() => {
    R(!0);
  }, []), v(() => {
  }, [r, i, E, f, y, w]), v(() => {
    i && t && E && f && !l && y(t).then((P) => {
      w(P);
    });
  }, [t, i, E, f, y, w]), v(() => {
    d && w(d);
  }, [d, w]);
  const x = {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: o,
    height: o
  };
  return /* @__PURE__ */ D.jsx("div", { className: a, style: x, children: /* @__PURE__ */ D.jsx(
    we,
    {
      emotionState: A,
      intensity: I,
      size: o,
      customImages: b
    }
  ) });
}
const re = 1e3;
function Ye({
  aiMessage: r = "",
  userMessage: t = "",
  isSpeaking: i = !1,
  isListening: f = !1
}) {
  const [l, c] = O({
    state: s.LISTEN,
    intensity: 0.3
  }), d = L(0), u = L(!1);
  v(() => (ye().catch(
    (o) => console.warn("[EmotionController] ML classifier warm-up failed (will use rule-based fallback):", o)
  ), () => {
    Se();
  }), []);
  const b = j(async (o) => {
    if (!o.trim())
      return { state: s.LISTEN, intensity: 0.3 };
    try {
      const a = await ne(o);
      let E = s.LISTEN, R = 0.5;
      if (a.modelEmotion)
        switch (a.modelEmotion) {
          case "joy":
          case "love":
            E = s.ENCOURAGE, R = 0.8;
            break;
          case "anger":
          case "fear":
          case "sadness":
            E = s.CAUTION, R = 0.7;
            break;
          case "surprise":
            E = s.THINK, R = 0.6;
            break;
          default:
            E = s.LISTEN;
        }
      else
        a.sentimentValence > 0.3 ? (E = s.ENCOURAGE, R = 0.7) : a.sentimentValence < -0.3 && (E = s.CAUTION, R = 0.6);
      return { state: E, intensity: R };
    } catch (a) {
      return console.warn("[EmotionController] Emotion analysis failed:", a), { state: s.LISTEN, intensity: 0.3 };
    }
  }, []);
  return v(() => {
    if (!r) return;
    const o = performance.now();
    u.current || o - d.current < re || (u.current = !0, d.current = o, b(r).then((a) => {
      c(a), u.current = !1;
    }).catch(() => {
      u.current = !1;
    }));
  }, [r, b]), v(() => {
    if (!t) return;
    const o = performance.now();
    u.current || o - d.current < re || (u.current = !0, d.current = o, b(t).then((a) => {
      c(a), u.current = !1;
    }).catch(() => {
      u.current = !1;
    }));
  }, [t, b]), v(() => {
    i ? c({ state: s.SPEAK_NEUTRAL, intensity: 0.7 }) : f && c({ state: s.LISTEN, intensity: 0.5 });
  }, [i, f]), {
    emotionState: l.state,
    intensity: l.intensity,
    analyzeText: b
  };
}
export {
  Fe as AnimatedAvatar,
  we as AvatarRenderer,
  Ae as classifyEmotion,
  Se as disposeEmotionClassifier,
  xe as extractTextSignals,
  ne as extractTextSignalsWithML,
  Me as isEmotionClassifierReady,
  Pe as useAvatarController,
  Ye as useEmotionController,
  ye as warmUpEmotionClassifier
};
