const express = require("express");
const { analyzeTextWithGemini } = require("../services/gemini");
const { validateAnalyzeRequest } = require("../middleware/validate");

const router = express.Router();

function mapErrorToApi(err) {
  const msg = String(err?.message || "");
  const status = err?.status || err?.statusCode;

  if (status === 429 || /429|rate limit/i.test(msg)) {
    return { status: 429, body: { error: "Too many requests. Wait 30 seconds.", code: "RATE_LIMIT" } };
  }

  if (/network|ENOTFOUND|ECONNRESET|ETIMEDOUT/i.test(msg)) {
    return { status: 502, body: { error: "Network error. Check your connection.", code: "NETWORK_ERROR" } };
  }

  return { status: 500, body: { error: "Analysis failed. Please try again.", code: "API_FAILURE" } };
}

router.post("/", validateAnalyzeRequest, async (req, res) => {
  try {
    const analysis = await analyzeTextWithGemini(req.body.message);
    return res.json(analysis);
  } catch (err) {
    console.error("POST /api/analyze failed:", err);
    const mapped = mapErrorToApi(err);
    return res.status(mapped.status).json(mapped.body);
  }
});

module.exports = router;