import { useRef, useState } from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onAnalyze: () => void;
  disabled?: boolean;
}

export default function TextInput({ value, onChange, onAnalyze, disabled }: Props) {
  const [touched, setTouched] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const showError = touched && value.trim().length === 0;

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) onChange(text);
    } catch {
      // clipboard access denied — silently ignore
    }
  }

  function handleFileRead(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (text) onChange(text);
    };
    reader.readAsText(file);
    // reset so the same file can be re-selected
    e.target.value = "";
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <textarea
        id="text-input-area"
        className="pg-textarea"
        placeholder="Paste an SMS, WhatsApp, or chat message here…&#10;Supports Hindi · Marathi · Tamil · English"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        disabled={disabled}
        rows={6}
      />

      {/* Char counter + helper buttons */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button className="btn-secondary" type="button" onClick={handlePaste} disabled={disabled}>
            📋 Paste
          </button>
          <button
            className="btn-secondary"
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={disabled}
          >
            📁 .txt File
          </button>
          {value && (
            <button
              className="btn-secondary"
              type="button"
              onClick={() => { onChange(""); setTouched(false); }}
              disabled={disabled}
            >
              ✕ Clear
            </button>
          )}
        </div>
        <span className="char-counter">{value.length} chars</span>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept=".txt,text/plain"
        style={{ display: "none" }}
        onChange={handleFileRead}
      />

      {showError && (
        <p style={{ fontSize: "0.78rem", color: "#f87171", margin: 0 }}>
          Please paste or type a message to analyze.
        </p>
      )}

      <button
        id="analyze-text-btn"
        className="btn-primary"
        type="button"
        disabled={disabled}
        onClick={() => { setTouched(true); onAnalyze(); }}
      >
        {disabled ? (
          <>
            <span style={{ display: "inline-block", width: "1rem", height: "1rem", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
            Analyzing…
          </>
        ) : (
          <>🔍 Analyze Message</>
        )}
      </button>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}