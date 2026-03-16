# PhishGuard Project Documentation

## Overview

PhishGuard is an AI-powered phishing detection tool focused on Indian languages (Hindi, Marathi, Tamil, and English). It analyzes both text and audio messages to detect phishing attempts, providing risk levels, flagged phrases, and language detection.

---

## Project Structure

```
phishguard/
│
├── client/   # Frontend React app (Vite + Tailwind)
│
└── server/   # Backend Node.js/Express API
```

---

## 1. Server (Backend)

### Main Entry: `server/index.js`
- Sets up an Express server with CORS and JSON parsing.
- Loads environment variables.
- Registers API routes:
  - `/api/analyze` (text analysis)
  - `/api/audio` (audio analysis)
- Health check endpoint: `/health`

### Routes

#### `server/routes/analyze.js`
- POST `/api/analyze`
- Validates request body for a message.
- Calls `analyzeTextWithGemini` to analyze text.
- Handles errors (rate limit, network, generic).

#### `server/routes/audio.js`
- POST `/api/audio`
- Accepts audio file uploads (mp3, wav, m4a, up to 10MB).
- Validates file type and size.
- Calls `analyzeAudioWithGemini` to analyze audio.
- Handles errors (file size, rate limit, network, generic).

### Middleware

#### `server/middleware/validate.js`
- `validateAnalyzeRequest`: Ensures message is present and non-empty.
- `validateAudioRequest`: Ensures a valid audio file is uploaded.

### Services

#### `server/services/gemini.js`
- Prepares a prompt for Google Gemini AI to analyze text for phishing.
- Expects a strict JSON response with:
  - `risk_level`
  - `overall_reason`
  - `flagged_phrases` (array)
  - `language_detected`
- Validates and parses Gemini's response.

#### `server/services/geminiAudio.js`
- Prepares a prompt for Gemini to:
  1. Transcribe the audio.
  2. Analyze the transcription for phishing.
- Expects a JSON response with:
  - `transcript`
  - `risk_level`
  - `overall_reason`
  - `flagged_phrases`
  - `language_detected`
- Validates and parses Gemini's response.

---

## 2. Client (Frontend)

### Main Entry: `client/src/main.tsx`
- Renders the React app into the DOM.

### App Layout: `client/src/App.tsx`
- Provides the main UI structure and title.
- Renders the `Home` page.

### Home Page: `client/src/pages/Home.tsx`
- Manages state for:
  - Current tab (text/audio)
  - Input message
  - Loading/error/result states
  - Analysis history
- Handles:
  - Text analysis (calls backend API)
  - Audio analysis (calls backend API)
  - Error handling and result display
- Renders:
  - Tab switcher (Text/Audio)
  - Input components
  - Analysis results and history

### API Layer: `client/src/api/analyze.ts`
- `analyzeText(message)`: Sends POST to `/api/analyze`.
- `analyzeAudio(file)`: Sends POST to `/api/audio`.
- Handles API errors and response parsing.

### Components

- **TextInput**: For entering/pasting text messages.
- **AudioUpload**: For uploading audio files.
- **LoadingSpinner**: Shows loading state.
- **ErrorBanner**: Displays error messages.
- **AnalysisResult**: Shows analysis results, risk badges, flagged phrases, etc.
- **FlaggedList, PhraseHighlight, RiskBadge, LanguageTag**: UI helpers for displaying analysis details.

### Types

#### `client/src/types/analysis.ts`
- `FlaggedPhrase`: Structure for flagged phrases.
- `AnalysisResult`: Structure for analysis results (risk, reason, phrases, language, transcript).
- `ApiError`: Structure for API error responses.

---

## 3. Configuration & Build

- **Vite**: Used for fast frontend development.
- **Tailwind CSS**: For styling.
- **PostCSS**: For CSS processing.
- **TypeScript**: For type safety in frontend.

---

## 4. How It Works

1. **User Input**: User pastes a message or uploads an audio file.
2. **Frontend**: Sends the input to the backend API.
3. **Backend**: Validates input, calls Gemini AI for analysis.
4. **Gemini AI**: Returns a structured JSON with risk assessment and details.
5. **Frontend**: Displays the result, risk level, flagged phrases, and language.

---

## 5. Detailed Flow: Text Analysis

This section explains the exact execution path when a user analyzes text.

### Step 1: User submits text in the frontend
- In the Home page, the user enters a message and clicks analyze.
- The `runText()` function trims the input.
- If the trimmed value is empty, the frontend immediately shows `Please paste or type a message first.` and stops.

### Step 2: Frontend sends request to backend
- The frontend API function `analyzeText(message)` sends a `POST` request to:
  - `http://localhost:5000/api/analyze`
- Request body is JSON:

```json
{
  "message": "<user message>"
}
```

- If `fetch` itself fails (server down, network issue), frontend throws:
  - `code: NETWORK_ERROR`
  - `error: Network error. Check your connection.`

### Step 3: Backend route receives and validates
- Route: `POST /api/analyze` in `server/routes/analyze.js`.
- Middleware `validateAnalyzeRequest` checks:
  - `req.body.message` exists and is a string.
  - Trimmed content is not empty.
- If invalid, backend returns HTTP `400` with:

```json
{
  "error": "Please paste a message first.",
  "code": "EMPTY_INPUT"
}
```

### Step 4: Backend calls Gemini text service
- Route calls `analyzeTextWithGemini(message)`.
- Service verifies `GEMINI_API_KEY` is present.
- Builds Gemini client via `@google/generative-ai`.
- Uses a strict phishing prompt that forces JSON output with fields:
  - `risk_level`
  - `overall_reason`
  - `flagged_phrases`
  - `language_detected`

### Step 5: Gemini generation and response cleanup
- Service sends two parts to Gemini:
  - Instruction prompt.
  - Actual message content (`Message:\n...`).
- Receives model text response.
- Runs `stripCodeFences()` to remove accidental markdown fences like ```json.
- Parses cleaned string as JSON.

### Step 6: Response shape validation
- Service validates minimum required structure:
  - object exists
  - `risk_level` is string
  - `flagged_phrases` is array
- If parsing or shape validation fails, service throws internal error.

### Step 7: Error mapping in route
- Route maps thrown errors to stable API responses:
  - Rate limit related -> HTTP `429`, `RATE_LIMIT`
  - Network/provider issues -> HTTP `502`, `NETWORK_ERROR`
  - Any other failure -> HTTP `500`, `API_FAILURE`

### Step 8: Frontend displays result
- On success, frontend stores the analysis in state.
- Result is also appended to local history list (max 8 entries).
- UI renders:
  - Risk badge (`SAFE`, `SUSPICIOUS`, `HIGH_RISK`)
  - Language tag
  - Highlighted suspicious phrases
  - Tactic summary and explanation
- For `HIGH_RISK`, a modal warning is shown.

---

## 6. Detailed Flow: Audio Analysis

This section explains the exact execution path when a user analyzes audio.

### Step 1: User selects audio file in frontend
- User uploads a file through `AudioUpload` component.
- Accepted extensions in browser input: `.mp3`, `.wav`, `.m4a` (plus `audio/*`).
- Analyze button stays disabled until a file is selected.

### Step 2: Frontend sends multipart upload
- Home page calls `runAudio(file)`.
- API function `analyzeAudio(file)` creates `FormData` and appends:
  - key: `audio`
  - value: selected file
- Sends `POST` request to:
  - `http://localhost:5000/api/audio`
- No manual `Content-Type` header is set; browser sets multipart boundary automatically.

### Step 3: Backend receives file with multer
- Route uses `upload.single("audio")` with in-memory storage (`memoryStorage`).
- File size limit is enforced by multer using `MAX_AUDIO_BYTES` (10 MB).
- Uploaded bytes are available in `req.file.buffer`.

### Step 4: Audio validation middleware
- `validateAudioRequest` checks:
  - file exists
  - MIME type is one of supported audio values (`audio/mpeg`, `audio/wav`, `audio/m4a`, and aliases)
  - size does not exceed 10 MB
- Invalid file type -> HTTP `400`, `INVALID_FILE`.
- Oversized/format failure path returns HTTP `400`, `UNSUPPORTED_FORMAT`.

### Step 5: Backend calls Gemini audio service
- Route calls `analyzeAudioWithGemini({ buffer, mimeType })`.
- Service checks `GEMINI_API_KEY`.
- Converts raw audio bytes to base64 string.
- Sends Gemini request containing:
  - Text instruction prompt (transcribe first, then detect phishing)
  - Inline binary audio payload (`inlineData` with base64 + MIME type)

### Step 6: Model fallback behavior
- Audio service attempts several model names in sequence:
  1. `gemini-1.5-flash`
  2. `gemini-1.5-flash-latest`
  3. `gemini-1.5-flash-001`
  4. `gemini-flash-latest`
  5. `gemini-2.5-flash`
- If a model returns `404 model not found`, service tries next.
- Non-404 provider errors are thrown immediately.

### Step 7: Parse and validate audio analysis JSON
- Expected JSON fields:
  - `transcript`
  - `risk_level`
  - `overall_reason`
  - `flagged_phrases`
  - `language_detected`
- Service strips markdown fences, parses JSON, validates shape.
- Invalid JSON/shape causes service failure.

### Step 8: Audio error mapping and frontend render
- Route maps errors similarly to text route:
  - Multer size/code issues -> `UNSUPPORTED_FORMAT`
  - Rate limit -> `RATE_LIMIT`
  - Provider/network -> `NETWORK_ERROR`
  - Unknown -> `API_FAILURE`
- On success, frontend displays:
  - transcript text
  - risk assessment
  - flagged phrases and tactics
  - language detection
- Result is saved to recent history for quick recall.

---

## 7. Key Features

- Detects phishing in text and audio (with transcription).
- Supports multiple Indian languages.
- Provides detailed risk assessment and highlights suspicious phrases.
- User-friendly UI with history and error handling.

---

If you need a more detailed breakdown of any file or function, let me know!
