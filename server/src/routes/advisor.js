const express = require("express");
const did = require("../providers/did");

const router = express.Router();

router.post("/stream", async (_req, res) => {
  try {
    const stream = await did.createStream();
    res.json(stream);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

router.post("/stream/:id/sdp", async (req, res) => {
  try {
    const { answer, session_id } = req.body;
    const result = await did.sendAnswer(req.params.id, session_id, answer);
    res.json(result ?? { ok: true });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

router.post("/stream/:id/ice", async (req, res) => {
  try {
    const { session_id, candidate, sdpMid, sdpMLineIndex } = req.body;
    const result = await did.sendIceCandidate(req.params.id, session_id, {
      candidate,
      sdpMid,
      sdpMLineIndex,
    });
    res.json(result ?? { ok: true });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

router.post("/stream/:id/speak", async (req, res) => {
  try {
    const { session_id, text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "text is required" });
    }
    const result = await did.sendText(req.params.id, session_id, text);
    res.json(result ?? { ok: true });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

router.delete("/stream/:id", async (req, res) => {
  try {
    const { session_id } = req.body;
    await did.closeStream(req.params.id, session_id);
    res.status(204).end();
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

module.exports = router;
