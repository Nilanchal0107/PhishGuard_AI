<<<<<<< HEAD
const MAX_AUDIO_BYTES = 10 * 1024 * 1024; // 10MB

const SUPPORTED_MIME_TYPES = new Set(["audio/mp3", "audio/wav", "audio/m4a"]);

function validateAnalyzeRequest(req, res, next) {
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  if (!message) {
    return res.status(400).json({ error: "Please paste a message first.", code: "EMPTY_INPUT" });
  }
  req.body.message = message;
  return next();
}

function validateAudioRequest(req, res, next) {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: "Unsupported file. Use .mp3, .wav or .m4a", code: "INVALID_FILE" });
  }

  const mimeType = file.mimetype;
  if (!SUPPORTED_MIME_TYPES.has(mimeType)) {
    return res.status(400).json({ error: "Unsupported file. Use .mp3, .wav or .m4a", code: "INVALID_FILE" });
  }

  if (typeof file.size === "number" && file.size > MAX_AUDIO_BYTES) {
    return res.status(400).json({ error: "File format not supported.", code: "UNSUPPORTED_FORMAT" });
  }

  return next();
}

module.exports = {
  validateAnalyzeRequest,
  validateAudioRequest,
  MAX_AUDIO_BYTES,
  SUPPORTED_MIME_TYPES,
=======
const MAX_AUDIO_BYTES = 10 * 1024 * 1024; // 10MB

const SUPPORTED_MIME_TYPES = new Set(["audio/mp3", "audio/wav", "audio/m4a"]);

function validateAnalyzeRequest(req, res, next) {
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  if (!message) {
    return res.status(400).json({ error: "Please paste a message first.", code: "EMPTY_INPUT" });
  }
  req.body.message = message;
  return next();
}

function validateAudioRequest(req, res, next) {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: "Unsupported file. Use .mp3, .wav or .m4a", code: "INVALID_FILE" });
  }

  const mimeType = file.mimetype;
  if (!SUPPORTED_MIME_TYPES.has(mimeType)) {
    return res.status(400).json({ error: "Unsupported file. Use .mp3, .wav or .m4a", code: "INVALID_FILE" });
  }

  if (typeof file.size === "number" && file.size > MAX_AUDIO_BYTES) {
    return res.status(400).json({ error: "File format not supported.", code: "UNSUPPORTED_FORMAT" });
  }

  return next();
}

module.exports = {
  validateAnalyzeRequest,
  validateAudioRequest,
  MAX_AUDIO_BYTES,
  SUPPORTED_MIME_TYPES,
>>>>>>> 60e30398828e4645438e4781d4c5132c751f3dd6
};