<<<<<<< HEAD
# PhishGuard AI — Project Guidelines

## What This Is
AI-powered phishing detection for Indian languages.
Hackathon project. Speed and correctness above everything.

## Tech Stack
Frontend : React + TypeScript + Tailwind (Vite) — port 5173
Backend  : Node.js + Express — port 5000
AI       : Gemini 1.5 Flash API only
Upload   : Multer

## Hard Rules
- NO database
- NO Whisper — Gemini handles audio
- NO authentication
- NO React Router
- NO axios — use fetch
- NO keyword detection
- GEMINI_API_KEY in .env only

## Response Contract
All responses follow AnalysisResult interface in:
client/src/types/analysis.ts — never rename fields

## Start Commands
cd server && npm install && node index.js
cd client && npm install && npm run dev

## Build Priority
1. Backend /api/analyze  ← HIGHEST
2. Backend /api/audio    ← HIGH
3. Frontend PhraseHighlight + RiskBadge ← HIGH
4. Frontend AudioUpload tab ← MEDIUM
5. Bar chart ← LOWEST — skip if time is tight
=======
# PhishGuard AI — Project Guidelines

## What This Is
AI-powered phishing detection for Indian languages.
Hackathon project. Speed and correctness above everything.

## Tech Stack
Frontend : React + TypeScript + Tailwind (Vite) — port 5173
Backend  : Node.js + Express — port 5000
AI       : Gemini 1.5 Flash API only
Upload   : Multer

## Hard Rules
- NO database
- NO Whisper — Gemini handles audio
- NO authentication
- NO React Router
- NO axios — use fetch
- NO keyword detection
- GEMINI_API_KEY in .env only

## Response Contract
All responses follow AnalysisResult interface in:
client/src/types/analysis.ts — never rename fields

## Start Commands
cd server && npm install && node index.js
cd client && npm install && npm run dev

## Build Priority
1. Backend /api/analyze  ← HIGHEST
2. Backend /api/audio    ← HIGH
3. Frontend PhraseHighlight + RiskBadge ← HIGH
4. Frontend AudioUpload tab ← MEDIUM
5. Bar chart ← LOWEST — skip if time is tight
>>>>>>> 60e30398828e4645438e4781d4c5132c751f3dd6
