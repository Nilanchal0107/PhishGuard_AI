import type { FlaggedPhrase } from "../types/analysis";

export default function FlaggedList({ items }: { items: FlaggedPhrase[] }) {
  if (items.length === 0) {
    return <div className="text-sm text-gray-700">No suspicious phrases found.</div>;
  }

  return (
    <ul className="space-y-2">
      {items.map((it, idx) => (
        <li key={`${it.phrase}-${idx}`} className="rounded border bg-white p-3">
          <div className="text-sm font-semibold">{it.phrase}</div>
          <div className="mt-1 text-xs text-gray-700">{it.reason}</div>
          <div className="mt-1 text-[11px] font-medium text-gray-600">Tactic: {it.tactic}</div>
        </li>
      ))}
    </ul>
  );
}