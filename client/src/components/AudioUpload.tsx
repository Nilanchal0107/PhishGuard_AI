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
}