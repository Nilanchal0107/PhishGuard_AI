import type { AnalysisResult, ApiError } from "../types/analysis";

// Empty string = relative URL (works via Vite proxy in dev, and same-origin in prod)
const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ?? "";

async function parseJsonOrThrow(res: Response): Promise<any> {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw { error: "Analysis failed. Please try again.", code: "API_FAILURE" } satisfies ApiError;
  }
}

function isApiError(x: any): x is ApiError {
  return x && typeof x === "object" && typeof x.error === "string" && typeof x.code === "string";
}

export async function analyzeText(message: string): Promise<AnalysisResult> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
  } catch {
    throw { error: "Network error. Check your connection.", code: "NETWORK_ERROR" } satisfies ApiError;
  }

  const json = await parseJsonOrThrow(res);
  if (!res.ok) {
    if (isApiError(json)) throw json;
    throw { error: "Analysis failed. Please try again.", code: "API_FAILURE" } satisfies ApiError;
  }
  return json as AnalysisResult;
}

export async function analyzeAudio(file: File): Promise<AnalysisResult> {
  const form = new FormData();
  form.append("audio", file);

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/audio`, {
      method: "POST",
      body: form,
    });
  } catch {
    throw { error: "Network error. Check your connection.", code: "NETWORK_ERROR" } satisfies ApiError;
  }

  const json = await parseJsonOrThrow(res);
  if (!res.ok) {
    if (isApiError(json)) throw json;
    throw { error: "Analysis failed. Please try again.", code: "API_FAILURE" } satisfies ApiError;
  }
  return json as AnalysisResult;
}
