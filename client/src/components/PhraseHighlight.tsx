import type { FlaggedPhrase } from "../types/analysis";

interface Props {
  fullMessage: string;
  flaggedPhrases: FlaggedPhrase[];
}

export default function PhraseHighlight({ fullMessage, flaggedPhrases }: Props) {
  if (!flaggedPhrases.length) {
    return <p className="phrase-block">{fullMessage}</p>;
  }

  // Build sorted list of ranges to highlight
  type Range = { start: number; end: number; phrase: FlaggedPhrase };
  const ranges: Range[] = [];

  for (const fp of flaggedPhrases) {
    const idx = fullMessage.indexOf(fp.phrase);
    if (idx !== -1) {
      ranges.push({ start: idx, end: idx + fp.phrase.length, phrase: fp });
    }
  }

  // Sort by start position, remove overlaps
  ranges.sort((a, b) => a.start - b.start);
  const merged: Range[] = [];
  for (const r of ranges) {
    if (merged.length && r.start < merged[merged.length - 1].end) continue;
    merged.push(r);
  }

  const HIGH_TACTICS = new Set(["URGENCY", "THREAT", "OTP_REQUEST", "PAYMENT_DEMAND"]);

  // Build React nodes
  const nodes: React.ReactNode[] = [];
  let cursor = 0;

  for (const r of merged) {
    if (r.start > cursor) {
      nodes.push(<span key={`t-${cursor}`}>{fullMessage.slice(cursor, r.start)}</span>);
    }
    const cls = HIGH_TACTICS.has(r.phrase.tactic) ? "high" : "suspicious";
    nodes.push(
      <mark key={`m-${r.start}`} className={`phrase-mark ${cls}`}>
        {r.phrase.phrase}
        <span className="phrase-tooltip">
          <strong>{r.phrase.tactic.replace(/_/g, " ")}</strong>
          <br />
          {r.phrase.reason}
        </span>
      </mark>
    );
    cursor = r.end;
  }

  if (cursor < fullMessage.length) {
    nodes.push(<span key={`t-end`}>{fullMessage.slice(cursor)}</span>);
  }

  return <p className="phrase-block">{nodes}</p>;
}
