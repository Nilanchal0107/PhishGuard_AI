const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: "../.env" });

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server tools and same-origin requests without Origin header.
      if (!origin) return callback(null, true);

      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json({ limit: "1mb" }));

// Routes will be implemented in later steps.
app.use("/api/analyze", require("./routes/analyze"));
app.use("/api/audio", require("./routes/audio"));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// Serve built React frontend for all non-API routes
const clientDist = path.join(__dirname, "../client/dist");
app.use(express.static(clientDist));
app.get("*", (_req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
app.listen(PORT, () => {
  console.log(`PhishGuard server listening on ${PORT}`);
});
