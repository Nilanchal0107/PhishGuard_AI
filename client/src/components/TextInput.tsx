import { useState } from "react";

export default function TextInput({
  value,
  onChange,
  onAnalyze,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onAnalyze: () => void;
  disabled?: boolean;
}) {
  const [touched, setTouched] = useState(false);
  const showError = touched && value.trim().length === 0;

  return (
    <div className="space-y-3">
      <textarea
        className="h-36 w-full resize-none rounded border bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-gray-300"
        placeholder="Paste an SMS/WhatsApp message here (Hindi/Marathi/Tamil/English)…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
      />
      {showError ? <div className="text-xs text-red-700">Please paste a message first.</div> : null}
      <button
        type="button"
        className="rounded bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        onClick={() => {
          setTouched(true);
          onAnalyze();
        }}
        disabled={disabled}
      >
        Analyze
      </button>
    </div>
  );
}