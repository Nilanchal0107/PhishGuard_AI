<<<<<<< HEAD
import type { AnalysisResult, ApiError } from "../types/analysis";

const API_BASE = "http://localhost:5000";

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
=======
import type { AnalysisResult, ApiError } from "../types/analysis";

const API_BASE = "http://localhost:5000";

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
>>>>>>> 60e30398828e4645438e4781d4c5132c751f3dd6
