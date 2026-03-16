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
}