<<<<<<< HEAD
import type { AnalysisResult as AnalysisResultT } from "../types/analysis";
import RiskBadge from "./RiskBadge";
import LanguageTag from "./LanguageTag";
import PhraseHighlight from "./PhraseHighlight";
import FlaggedList from "./FlaggedList";
import ConfidenceRing from "./ConfidenceRing";

interface Props {
  result: AnalysisResultT;
  originalMessage: string;
}

const TACTIC_MAP: Record<string, { emoji: string; label: string; cls: string }> = {
  urgency:        { emoji: "⏱️",  label: "Urgency Language",    cls: "urgency"       },
  otp_demand:     { emoji: "💰", label: "OTP / Payment",        cls: "otp"           },
  fake_authority: { emoji: "👤", label: "Fake Authority",       cls: "authority"     },
  payment_demand: { emoji: "💳", label: "Payment Demand",       cls: "otp"           },
  threat:         { emoji: "⚠️",  label: "Threat / Coercion",   cls: "threat"        },
  impersonation:  { emoji: "🎭", label: "Impersonation",        cls: "impersonation" },
  suspicious_link:{ emoji: "🔗", label: "Suspicious Link",      cls: "link"          },
};

function getTacticList(result: AnalysisResultT): { emoji: string; label: string; cls: string }[] {
  if (result.tactics && result.tactics.length > 0) {
    return result.tactics.map(t => TACTIC_MAP[t] ?? { emoji: "🔍", label: t.replace(/_/g, " "), cls: "default" });
  }
  // Derive from flagged_phrases if tactics array not provided
  const seen = new Set<string>();
  return result.flagged_phrases
    .filter(fp => { const key = fp.tactic; if (seen.has(key)) return false; seen.add(key); return true; })
    .map(fp => {
      const keyMap: Record<string, string> = {
        URGENCY: "urgency", OTP_REQUEST: "otp_demand",
        FAKE_AUTHORITY: "fake_authority", PAYMENT_DEMAND: "payment_demand",
        THREAT: "threat", IMPERSONATION: "impersonation",
      };
      return TACTIC_MAP[keyMap[fp.tactic] ?? ""] ?? { emoji: "🔍", label: fp.tactic.replace(/_/g, " "), cls: "default" };
    });
}

function getConfidenceScore(result: AnalysisResultT): number {
  if (result.confidenceScore !== undefined) return result.confidenceScore;
  // Derive a fallback score
  if (result.risk_level === "SAFE")       return 8;
  if (result.risk_level === "SUSPICIOUS") return 55;
  return 88;
}

export default function AnalysisResult({ result, originalMessage }: Props) {
  const displayText = result.transcript ?? originalMessage;
  const confidenceScore = getConfidenceScore(result);
  const tactics = getTacticList(result);
  const summary = result.summary ?? result.overall_reason;
  const suggestedAction = result.suggestedAction;

  return (
    <div className="results-wrapper">
      {/* ── Section 1: Primary result card ── */}
      <div className="glass-card" style={{ padding: "1.5rem", marginBottom: "1rem" }}>
        {/* Risk badge + ring */}
        <div className="results-header-grid" style={{ marginBottom: "1.25rem" }}>
          <div>
            <RiskBadge level={result.risk_level} />
            <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap" }}>
              <LanguageTag language={result.language_detected} />
            </div>
          </div>
          <ConfidenceRing score={confidenceScore} riskLevel={result.risk_level} size={108} />
        </div>

        {/* Risk bar */}
        <div style={{ marginTop: "0.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)" }}>
              Risk Meter
            </span>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-primary)" }}>
              {confidenceScore}% scam probability
            </span>
          </div>
          <div className="risk-bar-track">
            <div
              className={`risk-bar-fill ${result.risk_level === "SAFE" ? "safe" : result.risk_level === "SUSPICIOUS" ? "suspicious" : "high"}`}
              style={{ width: `${confidenceScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Section 2: Detected Tactics ── */}
      {tactics.length > 0 && (
        <div className="glass-card" style={{ padding: "1.25rem", marginBottom: "1rem" }}>
          <div className="results-section-label">Detected Tactics</div>
          <div className="tactic-chips">
            {tactics.map((t, i) => (
              <span key={i} className={`tactic-chip ${t.cls}`}>
                {t.emoji} {t.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Section 3: Message / Transcript (with inline highlights) ── */}
      <div className="glass-card" style={{ padding: "1.25rem", marginBottom: "1rem" }}>
        <div className="results-section-label">
          {result.transcript ? "Transcript" : "Analyzed Message"}
        </div>
        <div className="message-box">
          <PhraseHighlight fullMessage={displayText} flaggedPhrases={result.flagged_phrases} />
        </div>
        {result.flagged_phrases.length > 0 && (
          <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.6rem", marginBottom: 0 }}>
            💡 Hover over <span style={{ borderBottom: "2px solid #ef4444", color: "#fca5a5", fontWeight: 600 }}>highlighted phrases</span> to see why they were flagged
          </p>
        )}
      </div>

      {/* ── Section 4: Plain-English Summary ── */}
      <div className="glass-card" style={{ padding: "1.25rem", marginBottom: "1rem" }}>
        <div className="results-section-label">AI Summary</div>
        <div className="summary-box">{summary}</div>
        {suggestedAction && (
          <div className="suggested-action-box" style={{ marginTop: "0.85rem" }}>
            <span style={{ fontSize: "1.25rem", flexShrink: 0 }}>🚫</span>
            <div>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#f87171", marginBottom: "0.2rem" }}>
                Suggested Action
              </div>
              {suggestedAction}
            </div>
          </div>
        )}
      </div>

      {/* ── Section 5: Detailed Flagged List ── */}
      {result.flagged_phrases.length > 0 && (
        <div className="glass-card" style={{ padding: "1.25rem" }}>
          <div className="results-section-label">
            Flagged Phrases ({result.flagged_phrases.length})
          </div>
          <FlaggedList items={result.flagged_phrases} />
        </div>
      )}
    </div>
  );
=======
import type { AnalysisResult as AnalysisResultT } from "../types/analysis";
import RiskBadge from "./RiskBadge";
import LanguageTag from "./LanguageTag";
import PhraseHighlight from "./PhraseHighlight";
import FlaggedList from "./FlaggedList";

export default function AnalysisResult({ result, originalMessage }: { result: AnalysisResultT; originalMessage: string }) {
  const messageToHighlight = result.transcript ?? originalMessage;
  const total = result.flagged_phrases.length;

  const tacticCounts = result.flagged_phrases.reduce<Record<string, number>>((acc, fp) => {
    acc[fp.tactic] = (acc[fp.tactic] ?? 0) + 1;
    return acc;
  }, {});

  const tacticRows = Object.entries(tacticCounts).sort((a, b) => b[1] - a[1]);

  const riskScore = result.risk_level === "SAFE" ? 10 : result.risk_level === "SUSPICIOUS" ? 55 : 90;
  const riskColor =
    result.risk_level === "SAFE"
      ? "bg-green-600"
      : result.risk_level === "SUSPICIOUS"
        ? "bg-yellow-500"
        : "bg-red-600";

  const alert =
    result.risk_level === "HIGH_RISK"
      ? {
          title: "High risk scam detected",
          body: "Do not share OTPs, click unknown links, or make payments. Verify using official channels.",
          cls: "border-red-200 bg-red-50 text-red-900",
        }
      : result.risk_level === "SUSPICIOUS"
        ? {
            title: "Suspicious message",
            body: "Be cautious. Avoid sharing sensitive info and verify the sender.",
            cls: "border-yellow-200 bg-yellow-50 text-yellow-900",
          }
        : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <RiskBadge level={result.risk_level} />
        <LanguageTag language={result.language_detected} />
      </div>

      {alert ? (
        <div className={`rounded border px-3 py-2 text-sm ${alert.cls}`}>
          <div className="font-semibold">{alert.title}</div>
          <div className="mt-1 text-xs">{alert.body}</div>
        </div>
      ) : null}

      <div className="rounded border bg-white p-3">
        <div className="text-xs font-semibold text-gray-600">Verdict</div>
        <div className="mt-1 text-sm text-gray-900">{result.overall_reason}</div>
      </div>

      <div className="rounded border bg-white p-3">
        <div className="text-xs font-semibold text-gray-600">Visual insights</div>
        <div className="mt-3 space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs text-gray-700">
              <span>Risk meter</span>
              <span className="font-semibold">{result.risk_level}</span>
            </div>
            <div className="mt-2 h-2 w-full rounded bg-gray-200">
              <div className={`h-2 rounded ${riskColor}`} style={{ width: `${riskScore}%` }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-gray-700">
              <span>Flagged phrases</span>
              <span className="font-semibold">{total}</span>
            </div>
            {tacticRows.length === 0 ? (
              <div className="mt-2 text-sm text-gray-700">No tactics detected.</div>
            ) : (
              <div className="mt-2 space-y-2">
                {tacticRows.map(([tactic, count]) => {
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={tactic} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-gray-700">
                        <span className="font-medium">{tactic}</span>
                        <span>
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded bg-gray-200">
                        <div className="h-2 rounded bg-gray-800" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {result.transcript ? (
        <div className="rounded border bg-white p-3">
          <div className="text-xs font-semibold text-gray-600">Transcript</div>
          <div className="mt-2">
            <PhraseHighlight fullMessage={result.transcript} flaggedPhrases={result.flagged_phrases} />
          </div>
        </div>
      ) : (
        <div className="rounded border bg-white p-3">
          <div className="text-xs font-semibold text-gray-600">Message</div>
          <div className="mt-2">
            <PhraseHighlight fullMessage={messageToHighlight} flaggedPhrases={result.flagged_phrases} />
          </div>
        </div>
      )}

      <div className="rounded border bg-white p-3">
        <div className="text-xs font-semibold text-gray-600">Flagged phrases</div>
        <div className="mt-2">
          <FlaggedList items={result.flagged_phrases} />
        </div>
      </div>
    </div>
  );
>>>>>>> 60e30398828e4645438e4781d4c5132c751f3dd6
}