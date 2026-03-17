# PhishGuard AI

Minimal full-stack demo for phishing detection in Indian-language text and audio, powered by Gemini 1.5 Flash.

## Setup

1. Put your API key in `phishguard/.env`:

```
GEMINI_API_KEY=YOUR_KEY_HERE
CORS_ORIGIN=http://localhost:5173
```

2. Start backend:

```
cd server
npm install
node index.js
```

3. Start frontend:

```
cd client
npm install
npm run dev
```

## Deploy On Render

Deploy frontend and backend as separate services:

1. Backend as a Render Web Service
	 - Root directory: `server`
	 - Build command: `npm install`
	 - Start command: `npm start`
	 - Environment variables:
		 - `GEMINI_API_KEY=YOUR_KEY_HERE`
		 - `CORS_ORIGIN=https://YOUR-FRONTEND.onrender.com`

2. Frontend as a Render Static Site
	 - Root directory: `client`
	 - Build command: `npm install && npm run build`
	 - Publish directory: `dist`
	 - Environment variable:
		 - `VITE_API_BASE_URL=https://YOUR-BACKEND.onrender.com`

3. Optional: use the included `render.yaml` Blueprint to create both services at once.

