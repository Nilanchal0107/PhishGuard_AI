import { useMemo, useState } from "react";
import type { AnalysisResult as AnalysisResultT, ApiError } from "../types/analysis";
import { analyzeAudio, analyzeText } from "../api/analyze";
import TextInput from "../components/TextInput";
import AudioUpload from "../components/AudioUpload";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBanner from "../components/ErrorBanner";
import AnalysisResult from "../components/AnalysisResult";
import HighRiskModal from "../components/HighRiskModal";

type Tab = "text" | "audio";

function apiErrMsg(err: ApiError) {
  return err?.error ?? "Analysis failed. Please try again.";
}

function historyRiskCls(r: "SAFE" | "SUSPICIOUS" | "HIGH_RISK") {
  return r === "SAFE" ? "safe" : r === "SUSPICIOUS" ? "suspicious" : "high-risk";
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("text");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResultT | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showApiTip, setShowApiTip] = useState(false);
  const [history, setHistory] = useState<
    { id: string; kind: Tab; createdAt: number; inputLabel: string; result: AnalysisResultT }[]
  >([]);

  const originalMessage = useMemo(() => message, [result]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleResult(r: AnalysisResultT, label: string, kind: Tab) {
    setResult(r);
    if (r.risk_level === "HIGH_RISK") setShowModal(true);
    setHistory(prev =>
      [{ id: crypto.randomUUID(), kind, createdAt: Date.now(), inputLabel: label, result: r }, ...prev].slice(0, 8)
    );
  }

  async function runText() {
    setError(null);
    setResult(null);
    const trimmed = message.trim();
    if (!trimmed) { setError("Please paste or type a message first."); return; }
    setLoading(true);
    try {
      const r = await analyzeText(trimmed);
      handleResult(r, trimmed.slice(0, 70), "text");
    } catch (e: unknown) {
      const err = e as ApiError;
      setError(apiErrMsg(err));
      if (err?.code === "API_FAILURE" || err?.code === "NETWORK_ERROR") setShowApiTip(true);
    } finally {
      setLoading(false);
    }
  }

  async function runAudio(file: File) {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const r = await analyzeAudio(file);
      handleResult(r, file.name, "audio");
    } catch (e: unknown) {
      const err = e as ApiError;
      setError(apiErrMsg(err));
      if (err?.code === "API_FAILURE" || err?.code === "NETWORK_ERROR") setShowApiTip(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* ── HIGH RISK MODAL ── */}
      {showModal && result && (
        <HighRiskModal result={result} onDismiss={() => setShowModal(false)} />
      )}

      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-eyebrow">
          <span>🛡️</span> Powered by Gemini AI
        </div>
        <h1 className="hero-headline">
          Check messages for scams in{" "}
          <span className="highlight">Hindi, Marathi &amp; Tamil</span>
        </h1>
        <p className="hero-sub">
          Paste a suspicious SMS, WhatsApp message, or upload an audio recording.
          Our AI instantly detects phishing tactics and tells you exactly what's dangerous.
        </p>
      </section>

      {/* ── TAB SWITCHER ── */}
      <div className="tab-bar">
        <button
          className={`tab-btn${tab === "text" ? " active" : ""}`}
          onClick={() => { setTab("text"); setError(null); }}
          disabled={loading}
          id="tab-text"
        >
          💬 Text Message
        </button>
        <button
          className={`tab-btn${tab === "audio" ? " active" : ""}`}
          onClick={() => { setTab("audio"); setError(null); }}
          disabled={loading}
          id="tab-audio"
        >
          🎤 Audio Recording
        </button>
      </div>

      {/* ── ACTION CARDS ── */}
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {tab === "text" ? (
          <div className="glass-card action-card active-card">
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <div className="action-card-icon">💬</div>
              <div>
                <div className="action-card-title">Analyze Text Message</div>
                <div className="action-card-desc" style={{ margin: 0 }}>
                  Paste an SMS, WhatsApp, or any chat message — supports Hindi, Marathi, Tamil &amp; English
                </div>
              </div>
            </div>
            <TextInput
              value={message}
              onChange={setMessage}
              onAnalyze={runText}
              disabled={loading}
            />
          </div>
        ) : (
          <div className="glass-card action-card active-card">
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <div className="action-card-icon">🎤</div>
              <div>
                <div className="action-card-title">Analyze Audio Recording</div>
                <div className="action-card-desc" style={{ margin: 0 }}>
                  Upload a voice message, scam call recording, or voicemail. AI will transcribe and analyze it.
                </div>
              </div>
            </div>
            <AudioUpload onAnalyze={runAudio} disabled={loading} />
          </div>
        )}
      </div>

      {/* ── ERROR ── */}
      {error && (
        <div style={{ maxWidth: 900, margin: "1rem auto 0" }}>
          <ErrorBanner message={error} />
        </div>
      )}

      {/* ── TIP — only shown after an API/network failure ── */}
      {showApiTip && (
        <div style={{ maxWidth: 900, margin: "0.75rem auto 0", textAlign: "center" }}>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>
            💡 Tip: make sure the backend is running and{" "}
            <code style={{ background: "rgba(59,130,246,0.1)", padding: "0.1rem 0.4rem", borderRadius: "0.3rem", fontSize: "0.75rem", color: "var(--accent-cyan)" }}>
              GEMINI_API_KEY
            </code>{" "}
            is set in{" "}
            <code style={{ background: "rgba(59,130,246,0.1)", padding: "0.1rem 0.4rem", borderRadius: "0.3rem", fontSize: "0.75rem", color: "var(--accent-cyan)" }}>phishguard/.env</code>
          </p>
        </div>
      )}

      {/* ── LOADING SKELETON ── */}
      {loading && (
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <LoadingSpinner />
        </div>
      )}

      {/* ── RESULTS DASHBOARD ── */}
      {result && !loading && (
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <AnalysisResult result={result} originalMessage={originalMessage} />
        </div>
      )}

      {/* ── HISTORY ── */}
      {history.length > 0 && (
        <div style={{ maxWidth: 900, margin: "2rem auto 0" }}>
          <div className="glass-card" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem" }}>
              <span className="section-heading">Recent Analyses</span>
              <button
                style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}
                onClick={() => setHistory([])}
                disabled={loading}
              >
                Clear Log
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.5rem" }}>
              {history.map(h => (
                <button
                  key={h.id}
                  className="history-item"
                  onClick={() => { setResult(h.result); if (h.result.risk_level === "HIGH_RISK") setShowModal(true); }}
                  disabled={loading}
                >
                  <div className="history-meta">
                    <span className="history-kind">
                      {h.kind === "text" ? "💬" : "🎤"} {h.kind}
                    </span>
                    <span className={`history-risk ${historyRiskCls(h.result.risk_level)}`}>
                      {h.result.risk_level.replace("_", " ")}
                    </span>
                  </div>
                  <div className="history-time">{new Date(h.createdAt).toLocaleTimeString()}</div>
                  <div className="history-label">{h.inputLabel}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── FEATURE TEASE (empty state) ── */}
      {!result && !loading && (
        <div style={{ maxWidth: 900, margin: "2.5rem auto 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            {[
              { emoji: "🌐", title: "4 Languages", desc: "Hindi, Marathi, Tamil & English — with native script detection" },
              { emoji: "⚡", title: "Instant Results", desc: "Gemini AI analyzes and returns results in seconds" },
              { emoji: "🎯", title: "Tactic Breakdown", desc: "Urgency, OTP demands, fake authority, impersonation — all surfaced" },
              { emoji: "🔊", title: "Audio Support", desc: "Upload voice recordings, scam call clips, or voicemails" },
            ].map(f => (
              <div key={f.title} className="glass-card-sm" style={{ padding: "1.1rem 1.25rem" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{f.emoji}</div>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.3rem" }}>{f.title}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
