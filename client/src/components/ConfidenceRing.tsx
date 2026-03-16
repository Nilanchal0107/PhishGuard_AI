import { useEffect, useRef } from "react";

interface ConfidenceRingProps {
  score: number; // 0–100
  riskLevel: "SAFE" | "SUSPICIOUS" | "HIGH_RISK";
  size?: number;
}

const COLOR_MAP = {
  SAFE:       { stroke: "#22c55e", shadow: "drop-shadow(0 0 8px rgba(34,197,94,0.6))"  },
  SUSPICIOUS: { stroke: "#f59e0b", shadow: "drop-shadow(0 0 8px rgba(245,158,11,0.6))" },
  HIGH_RISK:  { stroke: "#ef4444", shadow: "drop-shadow(0 0 10px rgba(239,68,68,0.7))" },
};

const LABEL_MAP = {
  SAFE:       { emoji: "✅", label: "Safe" },
  SUSPICIOUS: { emoji: "⚠️", label: "Suspicious" },
  HIGH_RISK:  { emoji: "🔴", label: "High Risk" },
};

export default function ConfidenceRing({ score, riskLevel, size = 100 }: ConfidenceRingProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const radius = 40;
  const circumference = 2 * Math.PI * radius; // ≈ 251.33
  const offset = circumference - (score / 100) * circumference;
  const { stroke, shadow } = COLOR_MAP[riskLevel];
  const { emoji, label } = LABEL_MAP[riskLevel];

  useEffect(() => {
    const el = circleRef.current;
    if (!el) return;
    el.style.strokeDashoffset = String(circumference);
    const raf = requestAnimationFrame(() => {
      el.style.transition = "stroke-dashoffset 1s cubic-bezier(0.34, 1.56, 0.64, 1)";
      el.style.strokeDashoffset = String(offset);
    });
    return () => cancelAnimationFrame(raf);
  }, [score, offset, circumference]);

  return (
    <div className="confidence-wrap" style={{ width: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
        {/* Track */}
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke="rgba(56,139,253,0.12)"
          strokeWidth="8"
        />
        {/* Fill */}
        <circle
          ref={circleRef}
          cx="50" cy="50" r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          transform="rotate(-90 50 50)"
          style={{ filter: shadow }}
        />
        {/* Centre label */}
        <text x="50" y="46" textAnchor="middle" fontSize="18" fontWeight="800" fill="currentColor" style={{ fill: stroke }}>
          {score}%
        </text>
        <text x="50" y="60" textAnchor="middle" fontSize="8.5" fill="var(--text-muted)" fontWeight="600" style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>
          scam prob.
        </text>
      </svg>
      <div className="confidence-label" style={{ color: stroke }}>
        {emoji} {label}
      </div>
    </div>
  );
}
