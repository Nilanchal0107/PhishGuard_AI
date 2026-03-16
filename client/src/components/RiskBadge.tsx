const CONFIG = {
  SAFE:       { emoji: "✅", label: "Safe",       cls: "safe"      },
  SUSPICIOUS: { emoji: "⚠️",  label: "Suspicious", cls: "suspicious" },
  HIGH_RISK:  { emoji: "🔴", label: "High Risk",  cls: "high-risk" },
};

export default function RiskBadge({ level }: { level: "SAFE" | "SUSPICIOUS" | "HIGH_RISK" }) {
  const { emoji, label, cls } = CONFIG[level] ?? CONFIG.SAFE;
  return (
    <span className={`risk-badge ${cls}`}>
      <span>{emoji}</span>
      <span>{label}</span>
    </span>
  );
}