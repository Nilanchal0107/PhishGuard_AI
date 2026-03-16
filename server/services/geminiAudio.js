const { GoogleGenerativeAI } = require("@google/generative-ai");
const { stripCodeFences } = require("./gemini");

const AUDIO_PROMPT = `
You are a phishing detection expert for Indian languages.

First, transcribe the audio file completely.
Then analyze the transcription for phishing intent.

Return ONLY a valid JSON object. No markdown. No extra text.

{
  "transcript": "full transcription of the audio",
  "risk_level": "SAFE" | "SUSPICIOUS" | "HIGH_RISK",
  "overall_reason": "one sentence explaining the verdict",
  "flagged_phrases": [
    {
      "phrase": "exact phrase from transcript",
      "reason": "why this phrase is suspicious",
      "tactic": "URGENCY|OTP_REQUEST|FAKE_AUTHORITY|PAYMENT_DEMAND|THREAT|IMPERSONATION"
    }
  ],
  "language_detected": "Hindi|Marathi|Tamil|English|Mixed"
}
`;

function isValidAudioResultShape(obj) {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.transcript === "string" &&
    typeof obj.risk_level === "string" &&
    Array.isArray(obj.flagged_phrases)
  );
}

async function analyzeAudioWithGemini({ buffer, mimeType }) {
  if (!process.env.GEMINI_API_KEY) {
    // ⚠️ SIMPLE IMPLEMENTATION — can improve later
    throw new Error("Missing GEMINI_API_KEY");
  }

  const base64 = Buffer.from(buffer).toString("base64");

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const modelCandidates = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash-001",
    "gemini-flash-latest",
    "gemini-2.5-flash",
  ];

  let result;
  let lastErr;
  for (const modelName of modelCandidates) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      result = await model.generateContent([
        { text: AUDIO_PROMPT.trim() },
        { inlineData: { data: base64, mimeType } },
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

  if (!isValidAudioResultShape(parsed)) {
    throw new Error("Invalid response shape from Gemini");
  }

  return parsed;
}

module.exports = {
  analyzeAudioWithGemini,
};