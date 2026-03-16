import type { FlaggedPhrase } from "../types/analysis";

const TACTIC_META: Record<string, { emoji: string; label: string; cls: string }> = {
  URGENCY:        { emoji: "⏱️",  label: "Urgency Language",    cls: "urgency"      },
  OTP_REQUEST:    { emoji: "💰", label: "OTP / Payment Demand", cls: "otp"          },
  FAKE_AUTHORITY: { emoji: "👤", label: "Fake Authority Claim", cls: "authority"    },
  PAYMENT_DEMAND: { emoji: "💳", label: "Payment Demand",       cls: "otp"          },
  THREAT:         { emoji: "⚠️",  label: "Threat / Coercion",   cls: "threat"       },
  IMPERSONATION:  { emoji: "🎭", label: "Impersonation",        cls: "impersonation" },
};

export default function FlaggedList({ items }: { items: FlaggedPhrase[] }) {
  if (!items.length) {
    return (
      <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
        No specific flagged phrases detected.
      </p>
    );
  }

  return (
    <div>
      {items.map((item, idx) => {
        const meta = TACTIC_META[item.tactic] ?? { emoji: "🔍", label: item.tactic, cls: "default" };
        const isHigh = item.tactic === "URGENCY" || item.tactic === "THREAT" || item.tactic === "OTP_REQUEST" || item.tactic === "PAYMENT_DEMAND";
        return (
          <div key={idx} className={`flagged-item ${isHigh ? "high" : "suspicious"}`}>
            <span style={{ fontSize: "1.1rem", flexShrink: 0, marginTop: "1px" }}>{meta.emoji}</span>
            <div>
              <div className="flagged-phrase-text">"{item.phrase}"</div>
              <div className="flagged-phrase-reason">
                <span className={`tactic-chip ${meta.cls}`} style={{ display: "inline-flex", marginRight: "0.4rem", fontSize: "0.68rem", padding: "0.15rem 0.55rem" }}>
                  {meta.label}
                </span>
                {item.reason}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}