require("dotenv").config();
const express = require("express");
const cors = require("cors");
const advisorRoutes = require("./routes/advisor");

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/advisor", advisorRoutes);

const port = process.env.PORT || 8787;
app.listen(port, () => {
  console.log(`Advisor server listening on http://localhost:${port}`);
});
