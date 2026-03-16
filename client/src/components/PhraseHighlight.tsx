<<<<<<< HEAD
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
=======
import type { FlaggedPhrase } from "../types/analysis";

type Segment =
  | { type: "plain"; text: string }
  | { type: "highlighted"; text: string; tactic: FlaggedPhrase["tactic"]; reason: string };

function colorFor(tactic: FlaggedPhrase["tactic"]) {
  if (tactic === "URGENCY" || tactic === "OTP_REQUEST" || tactic === "THREAT") {
    return "bg-red-200 text-red-900 cursor-pointer rounded px-1";
  }
  return "bg-orange-200 text-orange-900 cursor-pointer rounded px-1";
}

export default function PhraseHighlight({
  fullMessage,
  flaggedPhrases,
}: {
  fullMessage: string;
  flaggedPhrases: FlaggedPhrase[];
}) {
  // Algorithm required by prompt:
  let segments: Segment[] = [{ type: "plain", text: fullMessage }];

  for (const fp of flaggedPhrases) {
    const phrase = fp.phrase;
    if (!phrase) continue;

    const next: Segment[] = [];
    let replacedOnce = false;

    for (const seg of segments) {
      if (replacedOnce || seg.type !== "plain") {
        next.push(seg);
        continue;
      }

      const idx = seg.text.indexOf(phrase);
      if (idx === -1) {
        next.push(seg);
        continue;
      }

      const before = seg.text.slice(0, idx);
      const after = seg.text.slice(idx + phrase.length);

      next.push({ type: "plain", text: before });
      next.push({ type: "highlighted", text: phrase, tactic: fp.tactic, reason: fp.reason });
      next.push({ type: "plain", text: after });
      replacedOnce = true;
    }

    segments = next;
  }

  return (
    <div className="leading-7">
      {segments.map((seg, i) => {
        if (seg.type === "plain") {
          return <span key={i}>{seg.text}</span>;
        }
        return (
          <span
            key={i}
            className={colorFor(seg.tactic)}
            title={`${seg.reason} (${seg.tactic})`}
          >
            {seg.text}
          </span>
        );
      })}
    </div>
  );
>>>>>>> 60e30398828e4645438e4781d4c5132c751f3dd6
}