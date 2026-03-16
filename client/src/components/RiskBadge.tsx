<<<<<<< HEAD
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
=======
import type { AnalysisResult } from "../types/analysis";

const MAP: Record<AnalysisResult["risk_level"], { label: string; cls: string }> = {
  SAFE: { label: "SAFE", cls: "bg-green-100 text-green-900" },
  SUSPICIOUS: { label: "SUSPICIOUS", cls: "bg-yellow-100 text-yellow-900" },
  HIGH_RISK: { label: "HIGH RISK", cls: "bg-red-200 text-red-900" },
};

export default function RiskBadge({ level }: { level: AnalysisResult["risk_level"] }) {
  const m = MAP[level];
  return (
    <span className={`inline-flex items-center rounded px-2 py-1 text-xs font-semibold ${m.cls}`}>
      {m.label}
    </span>
  );
>>>>>>> 60e30398828e4645438e4781d4c5132c751f3dd6
}