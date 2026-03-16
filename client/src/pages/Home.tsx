import { useMemo, useState } from "react";
import type { AnalysisResult as AnalysisResultT, ApiError } from "../types/analysis";
import { analyzeAudio, analyzeText } from "../api/analyze";
import TextInput from "../components/TextInput";
import AudioUpload from "../components/AudioUpload";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBanner from "../components/ErrorBanner";
import AnalysisResult from "../components/AnalysisResult";

type Tab = "text" | "audio";

function errorMessageFromApi(err: ApiError) {
  return err.error;
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("text");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResultT | null>(null);
  const [history, setHistory] = useState<
    { id: string; kind: Tab; createdAt: number; inputLabel: string; result: AnalysisResultT }[]
  >([]);

  const originalMessage = useMemo(() => message, [message]);

  async function runText() {
    setError(null);
    setResult(null);
    const trimmed = message.trim();
    if (!trimmed) {
      setError("Please paste a message first.");
      return;
    }

    setLoading(true);
    try {
      const r = await analyzeText(trimmed);
      setResult(r);
      setHistory((prev) => [
        {
          id: crypto.randomUUID(),
          kind: "text" as Tab,
          createdAt: Date.now(),
          inputLabel: trimmed.slice(0, 60),
          result: r,
        },
        ...prev,
      ].slice(0, 8));
    } catch (e: any) {
      const apiErr = e as ApiError;
      setError(errorMessageFromApi(apiErr) || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function runAudio(file: File) {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const r = await analyzeAudio(file);
      setResult(r);
      setHistory((prev) => [
        {
          id: crypto.randomUUID(),
          kind: "audio" as Tab,
          createdAt: Date.now(),
          inputLabel: file.name,
          result: r,
        },
        ...prev,
      ].slice(0, 8));
    } catch (e: any) {
      const apiErr = e as ApiError;
      setError(errorMessageFromApi(apiErr) || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          className={`rounded px-3 py-2 text-sm font-semibold ${
            tab === "text" ? "bg-black text-white" : "bg-white text-gray-900 border"
          }`}
          onClick={() => setTab("text")}
          disabled={loading}
        >
          Text
        </button>
        <button
          type="button"
          className={`rounded px-3 py-2 text-sm font-semibold ${
            tab === "audio" ? "bg-black text-white" : "bg-white text-gray-900 border"
          }`}
          onClick={() => setTab("audio")}
          disabled={loading}
        >
          Audio
        </button>
      </div>

      <div className="rounded border bg-white p-4">
        {tab === "text" ? (
          <TextInput value={message} onChange={setMessage} onAnalyze={runText} disabled={loading} />
        ) : (
          <AudioUpload onAnalyze={runAudio} disabled={loading} />
        )}
      </div>

      {loading ? <LoadingSpinner /> : null}
      {error ? <ErrorBanner message={error} /> : null}
      {result ? <AnalysisResult result={result} originalMessage={originalMessage} /> : null}

      {history.length ? (
        <div className="rounded border bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Recent analyses</div>
            <button
              type="button"
              className="text-xs font-semibold text-gray-700 underline"
              onClick={() => setHistory([])}
              disabled={loading}
            >
              Clear
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {history.map((h) => (
              <button
                key={h.id}
                type="button"
                className="w-full rounded border bg-gray-50 p-3 text-left hover:bg-gray-100"
                onClick={() => setResult(h.result)}
                disabled={loading}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs font-semibold text-gray-700">
                    {h.kind.toUpperCase()} • {new Date(h.createdAt).toLocaleTimeString()}
                  </div>
                  <div className="text-xs font-semibold">{h.result.risk_level}</div>
                </div>
                <div className="mt-1 text-sm text-gray-900">{h.inputLabel}</div>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="text-xs text-gray-600">
        Tip: if you keep getting “Analysis failed”, confirm you set <code>GEMINI_API_KEY</code> in{" "}
        <code>phishguard/.env</code> and restarted the backend.
      </div>
    </div>
  );
}