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
}