<<<<<<< HEAD
import { useRef, useState } from "react";

interface Props {
  onAnalyze: (file: File) => void;
  disabled?: boolean;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AudioUpload({ onAnalyze, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  function handleFiles(files: FileList | null) {
    const f = files?.[0] ?? null;
    setFile(f);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      {/* Drop zone */}
      <div
        className={`dropzone${dragOver ? " drag-over" : ""}`}
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{ cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.6 : 1 }}
      >
        <div className="dropzone-icon">🎤</div>
        <div className="dropzone-title">
          {file ? "File selected — ready to analyze" : "Drop audio file here, or click to browse"}
        </div>
        <div className="dropzone-sub">
          {file ? "" : "Supports voice recordings, scam call clips, and voicemails"}
        </div>
        <div className="dropzone-formats">
          {["MP3", "WAV", "M4A"].map(f => (
            <span key={f} className="format-pill">{f}</span>
          ))}
          <span className="format-pill">Max 10 MB</span>
        </div>
      </div>

      {/* Selected file info */}
      {file && (
        <div className="file-selected">
          <span style={{ fontSize: "1.1rem" }}>🎵</span>
          <span className="file-selected-name">{file.name}</span>
          <span className="file-selected-size">{formatSize(file.size)}</span>
          <button
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "0.85rem", padding: 0, flexShrink: 0 }}
            onClick={(e) => { e.stopPropagation(); setFile(null); }}
            disabled={disabled}
            aria-label="Remove file"
          >
            ✕
          </button>
        </div>
      )}

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        accept=".mp3,.wav,.m4a,audio/*"
        style={{ display: "none" }}
        onChange={(e) => handleFiles(e.target.files)}
      />

      <button
        id="analyze-audio-btn"
        className="btn-primary"
        type="button"
        disabled={disabled || !file}
        onClick={() => { if (file) onAnalyze(file); }}
      >
        {disabled ? (
          <>
            <span style={{ display: "inline-block", width: "1rem", height: "1rem", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
            Transcribing & Analyzing…
          </>
        ) : (
          <>🎤 Upload &amp; Analyze</>
        )}
      </button>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
=======
import { useRef, useState } from "react";

export default function AudioUpload({
  onAnalyze,
  disabled,
}: {
  onAnalyze: (file: File) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept=".mp3,.wav,.m4a,audio/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <div className="text-xs text-gray-700">
        {file ? `Selected: ${file.name}` : "Choose an audio file (.mp3, .wav, .m4a) up to 10MB."}
      </div>
      <button
        type="button"
        className="rounded bg-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        disabled={disabled || !file}
        onClick={() => {
          if (file) onAnalyze(file);
        }}
      >
        Upload & Analyze
      </button>
    </div>
  );
>>>>>>> 60e30398828e4645438e4781d4c5132c751f3dd6
}