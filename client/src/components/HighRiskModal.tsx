import type { AnalysisResult } from "../types/analysis";

interface Props {
  result: AnalysisResult;
  onDismiss: () => void;
}

export default function HighRiskModal({ result, onDismiss }: Props) {
  const action = result.suggestedAction ?? "Do not respond. Block this number immediately.";
  const phrases = result.flagged_phrases.slice(0, 5);

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-card">
        <div className="modal-icon">🔴</div>
        <h2 id="modal-title" className="modal-title">High Risk Scam Detected!</h2>
        <p className="modal-subtitle">
          Our AI flagged this message as a high-probability phishing scam.<br />
          <strong style={{ color: "var(--text-primary)" }}>Do not share any personal information.</strong>
        </p>

        {phrases.length > 0 && (
          <div className="modal-phrases">
            <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.65rem" }}>
              Flagged Phrases
            </div>
            {phrases.map((p, i) => (
              <div key={i} className="modal-phrase-item">
                <div>
                  <div className="phrase-text">"{p.phrase}"</div>
                  <div className="phrase-reason">{p.reason}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="modal-action-box">
          <span style={{ fontSize: "1.3rem", flexShrink: 0 }}>🚫</span>
          <div>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#f87171", marginBottom: "0.2rem" }}>
              Suggested Action
            </div>
            <div>{action}</div>
          </div>
        </div>

        <button id="modal-dismiss-btn" className="modal-dismiss" onClick={onDismiss}>
          ✓ Got It — I'll Stay Safe
        </button>
      </div>
    </div>
  );
}
