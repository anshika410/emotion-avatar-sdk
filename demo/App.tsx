import React, { useState, useCallback } from "react";
import { AnimatedAvatar } from "../src/components/AnimatedAvatar";
import { AvatarRenderer } from "../src/components/AvatarRenderer";
import {
  resolveBaseMascotKey,
  getMascotAssetUrl,
} from "../src/constants/emotionAssets";
import type { EmotionDebugInfo } from "../src/hooks/useAvatarController";

const EMOTION_GROUPS: Record<string, string[]> = {
  "Love-Strong": ["love", "desire"],
  "gentle-love": ["caring", "admiration", "gratitude"],
  happy_strong: ["joy", "amusement", "excitement", "pride"],
  happy_gentle: ["approval", "optimism", "relief"],
  thinking: ["neutral", "curiosity", "realization", "confusion"],
  surprise: ["surprise"],
  anger: ["anger", "annoyance"],
  disgust: ["disgust", "disapproval"],
  fear: ["fear", "nervousness"],
  "sad-Strong": ["sadness", "grief", "disappointment", "remorse", "embarrassment"],
};

const PRESET_CONVERSATIONS = [
  {
    label: "😃 Happy & Celebratory",
    text: "I finally finished the project and it turned out absolutely amazing! I'm so proud and excited!",
    aiResponse: "That is wonderful news! I'm super happy for you!",
  },
  {
    label: "😔 Sadness & Disappointment",
    text: "I was really hoping to pass the exam, but I failed... I feel so disappointed and remorseful.",
    aiResponse: "I'm so sorry to hear that. Take a breath, we can figure this out together.",
  },
  {
    label: "😠 Anger & Annoyance",
    text: "This constant lag and unexpected server crash is so frustrating and annoying!",
    aiResponse: "I understand your frustration. Let's look into the error logs immediately.",
  },
  {
    label: "😨 Fear & Anxiety",
    text: "I'm really nervous and terrified about presenting in front of the huge crowd tomorrow.",
    aiResponse: "It's completely normal to feel nervous. You've prepared well, you will do great!",
  },
  {
    label: "🤔 Confusion & Realization",
    text: "Wait, I was confused at first, but now I suddenly realize how the formula actually works!",
    aiResponse: "Aha! That lightbulb moment is great when things fall into place.",
  },
  {
    label: "💖 Caring & Love",
    text: "Thank you so much for your kind support. I really admire and appreciate your help!",
    aiResponse: "You're very welcome! I'm always here to support you.",
  },
];

export function App() {
  const [activeTab, setActiveTab] = useState<"explorer" | "liveChat">("liveChat");

  // State for Explorer tab
  const [selectedEmotion, setSelectedEmotion] = useState<string>("joy");
  const [isSpeakingExplorer, setIsSpeakingExplorer] = useState<boolean>(false);

  // State for Live Chat Simulator tab
  const [userInterim, setUserInterim] = useState<string>("");
  const [userFinal, setUserFinal] = useState<string>("");
  const [aiMessage, setAiMessage] = useState<string>("");
  const [isSpeakingChat, setIsSpeakingChat] = useState<boolean>(false);
  const [debugLog, setDebugLog] = useState<EmotionDebugInfo | null>(null);

  const baseMascotKey = resolveBaseMascotKey(selectedEmotion);

  const handleEmotionDebug = useCallback((info: EmotionDebugInfo) => {
    setDebugLog(info);
  }, []);

  const handleSimulatePreset = (preset: (typeof PRESET_CONVERSATIONS)[0]) => {
    setUserFinal(preset.text);
    setAiMessage(preset.aiResponse);
    setIsSpeakingChat(true);

    setTimeout(() => {
      setIsSpeakingChat(false);
    }, 4000);
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInterim.trim()) return;
    setUserFinal(userInterim);
    setUserInterim("");
  };

  return (
    <div style={{ padding: "32px 24px", maxWidth: "1280px", margin: "0 auto" }}>
      {/* Top Header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "28px",
          paddingBottom: "16px",
          borderBottom: "1px solid #334155",
        }}
      >
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#38bdf8" }}>
            Emotion Avatar SDK Interactive Suite
          </h1>
          <p style={{ color: "#94a3b8", marginTop: "6px" }}>
            Test live ONNX model inference, real-time streaming transcripts & WebP avatar rendering
          </p>
        </div>

        {/* Tab Selector Buttons */}
        <div
          style={{
            display: "flex",
            background: "#1e293b",
            padding: "4px",
            borderRadius: "12px",
            border: "1px solid #334155",
          }}
        >
          <button
            onClick={() => setActiveTab("liveChat")}
            style={{
              background: activeTab === "liveChat" ? "#0284c7" : "transparent",
              color: "#fff",
              border: "none",
              padding: "8px 18px",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "14px",
              transition: "all 0.2s ease",
            }}
          >
            💬 Live Chat & Model Simulator
          </button>
          <button
            onClick={() => setActiveTab("explorer")}
            style={{
              background: activeTab === "explorer" ? "#0284c7" : "transparent",
              color: "#fff",
              border: "none",
              padding: "8px 18px",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "14px",
              transition: "all 0.2s ease",
            }}
          >
            🎨 28 Emotion Asset Grid
          </button>
        </div>
      </header>

      {/* TAB 1: LIVE CHAT & ONNX MODEL SIMULATOR */}
      {activeTab === "liveChat" && (
        <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "32px" }}>
          {/* Left: Real SDK Animated Avatar */}
          <div
            style={{
              background: "#1e293b",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid #334155",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ width: "100%", textAlign: "center", marginBottom: "16px" }}>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#38bdf8" }}>
                AnimatedAvatar SDK Component
              </span>
            </div>

            {/* Avatar Container with Clean White Background */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                padding: "16px",
                margin: "8px 0",
                border: "2px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
              }}
            >
              <AnimatedAvatar
                userMessageInterim={userInterim}
                userMessageFinal={userFinal}
                aiMessage={aiMessage}
                isSpeaking={isSpeakingChat}
                onEmotionDebug={handleEmotionDebug}
              />
            </div>

            {/* Live Model Prediction Card */}
            <div
              style={{
                width: "100%",
                marginTop: "16px",
                background: "#0f172a",
                borderRadius: "10px",
                padding: "14px",
                border: "1px solid #334155",
                fontSize: "13px",
              }}
            >
              <div style={{ fontWeight: "700", color: "#f8fafc", marginBottom: "8px" }}>
                Live Model Output
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div>
                  <span style={{ color: "#94a3b8" }}>Detected Emotion: </span>
                  <strong style={{ color: "#38bdf8" }}>
                    {debugLog?.modelEmotion || debugLog?.state || "Initializing model..."}
                  </strong>
                </div>
                <div>
                  <span style={{ color: "#94a3b8" }}>Model Confidence: </span>
                  <strong style={{ color: "#10b981" }}>
                    {debugLog?.modelConfidence
                      ? `${(debugLog.modelConfidence * 100).toFixed(1)}%`
                      : "0%"}
                  </strong>
                </div>
                <div>
                  <span style={{ color: "#94a3b8" }}>Avatar Asset Key: </span>
                  <strong style={{ color: "#f59e0b" }}>
                    {resolveBaseMascotKey(debugLog?.modelEmotion || debugLog?.state || "")}
                  </strong>
                </div>
                <div>
                  <span style={{ color: "#94a3b8" }}>Avatar Mode: </span>
                  <strong style={{ color: isSpeakingChat ? "#10b981" : "#cbd5e1" }}>
                    {isSpeakingChat ? "Speaking Asset" : "Idle Asset"}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Simulation Controls & Conversation Presets */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Conversation Presets */}
            <div
              style={{
                background: "#1e293b",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid #334155",
              }}
            >
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#f8fafc", marginBottom: "8px" }}>
                Simulate Live Chat Scenarios
              </h3>
              <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "16px" }}>
                Click any preset to simulate user speech transcript and AI voice response
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {PRESET_CONVERSATIONS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSimulatePreset(preset)}
                    style={{
                      background: "#0f172a",
                      border: "1px solid #334155",
                      borderRadius: "10px",
                      padding: "14px",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ fontWeight: "700", color: "#38bdf8", marginBottom: "4px" }}>
                      {preset.label}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#cbd5e1",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      "{preset.text}"
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input Form */}
            <div
              style={{
                background: "#1e293b",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid #334155",
              }}
            >
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#f8fafc", marginBottom: "12px" }}>
                Type Custom Live User Message
              </h3>
              <form onSubmit={handleUserSubmit} style={{ display: "flex", gap: "12px" }}>
                <input
                  type="text"
                  placeholder="Type what user is saying (e.g. 'I am feeling so hopeful and grateful today!')"
                  value={userInterim}
                  onChange={(e) => setUserInterim(e.target.value)}
                  style={{
                    flex: 1,
                    background: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    color: "#fff",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: "#0284c7",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "12px 24px",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Send & Classify
                </button>
              </form>

              <div style={{ display: "flex", gap: "12px", marginTop: "16px", alignItems: "center" }}>
                <button
                  onClick={() => setIsSpeakingChat(!isSpeakingChat)}
                  style={{
                    background: isSpeakingChat ? "#10b981" : "#334155",
                    color: "#fff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "600",
                  }}
                >
                  {isSpeakingChat ? "🔊 AI Speaking ON" : "🔈 AI Speaking OFF"}
                </button>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                  Toggle speaking state to test speaking WebP assets live
                </span>
              </div>
            </div>

            {/* Real-Time ONNX Signal Breakdown */}
            {debugLog && (
              <div
                style={{
                  background: "#1e293b",
                  borderRadius: "16px",
                  padding: "24px",
                  border: "1px solid #334155",
                }}
              >
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#f8fafc", marginBottom: "12px" }}>
                  ONNX Model Real-Time Diagnostics
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "13px" }}>
                  <div style={{ background: "#0f172a", padding: "12px", borderRadius: "8px" }}>
                    <div style={{ color: "#94a3b8", marginBottom: "4px" }}>Analyzed Transcript</div>
                    <div style={{ color: "#f8fafc", fontWeight: "500" }}>"{debugLog.transcript}"</div>
                  </div>
                  <div style={{ background: "#0f172a", padding: "12px", borderRadius: "8px" }}>
                    <div style={{ color: "#94a3b8", marginBottom: "4px" }}>Sentiment Valence</div>
                    <div style={{ color: debugLog.sentimentValence > 0 ? "#10b981" : "#ef4444", fontWeight: "700" }}>
                      {debugLog.sentimentValence.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: 28 EMOTION ASSET GRID EXPLORER */}
      {activeTab === "explorer" && (
        <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "32px" }}>
          {/* Left Column: Active Avatar Card */}
          <div
            style={{
              background: "#1e293b",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid #334155",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#94a3b8" }}>
                Active Avatar Render
              </span>
              <button
                onClick={() => setIsSpeakingExplorer(!isSpeakingExplorer)}
                style={{
                  background: isSpeakingExplorer ? "#10b981" : "#334155",
                  color: "#fff",
                  border: "none",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "13px",
                  transition: "all 0.2s ease",
                }}
              >
                {isSpeakingExplorer ? "🔊 Speaking ON" : "🔇 Idle Mode"}
              </button>
            </div>

            {/* Avatar Render Box with Clean White Background */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                padding: "16px",
                margin: "12px 0",
                border: "2px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
              }}
            >
              <AvatarRenderer emotionId={selectedEmotion} isSpeaking={isSpeakingExplorer} />
            </div>

            {/* Metadata info */}
            <div style={{ width: "100%", marginTop: "16px" }}>
              <div
                style={{
                  background: "#0f172a",
                  borderRadius: "8px",
                  padding: "12px",
                  fontSize: "13px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div>
                  <span style={{ color: "#94a3b8" }}>Selected Emotion: </span>
                  <strong style={{ color: "#38bdf8" }}>{selectedEmotion}</strong>
                </div>
                <div>
                  <span style={{ color: "#94a3b8" }}>Base Mascot Key: </span>
                  <strong style={{ color: "#f59e0b" }}>{baseMascotKey}</strong>
                </div>
                <div>
                  <span style={{ color: "#94a3b8" }}>State: </span>
                  <strong style={{ color: isSpeakingExplorer ? "#10b981" : "#cbd5e1" }}>
                    {isSpeakingExplorer ? "Speaking Asset" : "Idle Mascot"}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Emotion Grid */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div
              style={{
                background: "#1e293b",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid #334155",
              }}
            >
              <h3 style={{ fontSize: "18px", marginBottom: "16px", color: "#f8fafc" }}>
                Select from all 28 Supported Model Emotions
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {Object.entries(EMOTION_GROUPS).map(([baseKey, emotions]) => (
                  <div
                    key={baseKey}
                    style={{
                      background: "#0f172a",
                      borderRadius: "12px",
                      padding: "14px 18px",
                      border: "1px solid #1e293b",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: "700",
                        color: "#f59e0b",
                        marginBottom: "10px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Mascot: {baseKey}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {emotions.map((emotion) => {
                        const isSelected = selectedEmotion === emotion;
                        return (
                          <button
                            key={emotion}
                            onClick={() => setSelectedEmotion(emotion)}
                            style={{
                              background: isSelected ? "#0284c7" : "#1e293b",
                              color: isSelected ? "#fff" : "#cbd5e1",
                              border: isSelected ? "1px solid #38bdf8" : "1px solid #334155",
                              padding: "6px 14px",
                              borderRadius: "6px",
                              fontSize: "13px",
                              fontWeight: isSelected ? "600" : "400",
                              cursor: "pointer",
                              transition: "all 0.15s ease",
                            }}
                          >
                            {emotion}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
