const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config({ path: "../.env" });

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Routes will be implemented in later steps.
app.use("/api/analyze", require("./routes/analyze"));
app.use("/api/audio", require("./routes/audio"));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
app.listen(PORT, () => {
  console.log(`PhishGuard server listening on ${PORT}`);
<<<<<<< HEAD
});
=======
});
>>>>>>> 60e30398828e4645438e4781d4c5132c751f3dd6
