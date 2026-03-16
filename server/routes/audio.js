const express = require("express");
const multer = require("multer");
const { analyzeAudioWithGemini } = require("../services/geminiAudio");
const { validateAudioRequest, MAX_AUDIO_BYTES } = require("../middleware/validate");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_AUDIO_BYTES },
});

function mapErrorToApi(err) {
  const msg = String(err?.message || "");
  const status = err?.status || err?.statusCode;

  if (err?.code === "LIMIT_FILE_SIZE") {
    return {
      status: 400,
      body: { error: "File format not supported.", code: "UNSUPPORTED_FORMAT" },
    };
  }

  if (status === 429 || /429|rate limit/i.test(msg)) {
    return { status: 429, body: { error: "Too many requests. Wait 30 seconds.", code: "RATE_LIMIT" } };
  }

  if (/network|ENOTFOUND|ECONNRESET|ETIMEDOUT/i.test(msg)) {
    return { status: 502, body: { error: "Network error. Check your connection.", code: "NETWORK_ERROR" } };
  }

  return { status: 500, body: { error: "Analysis failed. Please try again.", code: "API_FAILURE" } };
}

router.post("/", upload.single("audio"), validateAudioRequest, async (req, res) => {
  try {
    const analysis = await analyzeAudioWithGemini({
      buffer: req.file.buffer,
      mimeType: req.file.mimetype,
    });
    return res.json(analysis);
  } catch (err) {
    console.error("POST /api/audio failed:", err);
    const mapped = mapErrorToApi(err);
    return res.status(mapped.status).json(mapped.body);
  }
});

module.exports = router;