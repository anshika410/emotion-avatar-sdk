import React from "react";
import ReactDOM from "react-dom/client";
import * as ort from "onnxruntime-web";
import ortWasmModuleUrl from "onnxruntime-web/dist/ort-wasm-simd-threaded.asyncify.mjs?url"; 
import ortWasmBinaryUrl from "onnxruntime-web/dist/ort-wasm-simd-threaded.asyncify.wasm?url";
import { App } from "./App";

// Vite pre-bundling does not copy ONNX Runtime's worker/WASM sidecars next to
// the optimized module. Give the standalone demo stable URLs before the SDK
// creates its first inference session.
ort.env.wasm.wasmPaths = {
  mjs: ortWasmModuleUrl,
  wasm: ortWasmBinaryUrl,
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
