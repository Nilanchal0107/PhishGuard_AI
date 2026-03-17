const { GoogleGenerativeAI } = require("@google/generative-ai");

const TEXT_PROMPT = `
You are a phishing detection expert specializing in Indian
languages including Hindi, Marathi, Tamil, and English.

Analyze the given message and return ONLY a valid JSON object.
No explanation. No markdown. No extra text. Only raw JSON.

Return this exact structure:
{
  "risk_level": "SAFE" | "SUSPICIOUS" | "HIGH_RISK",
  "overall_reason": "one sentence explaining the verdict",
  "flagged_phrases": [
    {
      "phrase": "exact phrase from the message",
      "reason": "why this phrase is suspicious",
      "tactic": "URGENCY|OTP_REQUEST|FAKE_AUTHORITY|PAYMENT_DEMAND|THREAT|IMPERSONATION"
    }
  ],
  "language_detected": "Hindi|Marathi|Tamil|English|Mixed"
}

If the message is safe, return an empty array for flagged_phrases.
`;

function stripCodeFences(text) {
  if (!text) return "";
  return String(text)
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function isValidResultShape(obj) {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.risk_level === "string" &&
    Array.isArray(obj.flagged_phrases)
  );
}

async function analyzeTextWithGemini(message) {
  if (!process.env.GEMINI_API_KEY) {
    // ⚠️ SIMPLEST IMPLEMENTATION — can be improved
    throw new Error("Missing GEMINI_API_KEY");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  // Prefer the requested model, but fall back if the API key/version doesn't expose it.
  const modelCandidates = [
    "gemini-2.5-flash",
  ];

  let result;
  let lastErr;
  for (const modelName of modelCandidates) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      result = await model.generateContent([
        { text: TEXT_PROMPT.trim() },
        { text: `Message:\n${message}` },
      ]);
      lastErr = null;
      break;
    } catch (e) {
      lastErr = e;
      const msg = String(e?.message || "");
      const status = e?.status || e?.statusCode;
      if (status === 404 || /models\/.* is not found/i.test(msg)) {
        continue;
      }
      throw e;
    }
  }

  if (!result) {
    throw lastErr || new Error("Gemini model not available");
  }

  const raw = result?.response?.text?.() ?? "";
  const cleaned = stripCodeFences(raw);

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    throw new Error("Invalid JSON from Gemini");
  }

  if (!isValidResultShape(parsed)) {
    throw new Error("Invalid response shape from Gemini");
  }

  return parsed;
}

module.exports = {
  analyzeTextWithGemini,
  stripCodeFences,
};
