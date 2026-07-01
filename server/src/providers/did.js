const DID_API_BASE = "https://api.d-id.com";

const DEFAULT_SOURCE_URL = "https://d-id-public-bucket.s3.us-west-2.amazonaws.com/alice.jpg";

function authHeader() {
  const key = process.env.DID_API_KEY;
  if (!key) {
    throw new Error("DID_API_KEY is not configured on the server");
  }
  return `Basic ${Buffer.from(key).toString("base64")}`;
}

async function didFetch(path, options = {}) {
  const res = await fetch(`${DID_API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader(),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`D-ID API error ${res.status}: ${body || res.statusText}`);
  }
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

function createStream() {
  return didFetch("/talks/streams", {
    method: "POST",
    body: JSON.stringify({
      source_url: process.env.DID_SOURCE_URL || DEFAULT_SOURCE_URL,
    }),
  });
}

function sendAnswer(streamId, sessionId, answer) {
  return didFetch(`/talks/streams/${streamId}/sdp`, {
    method: "POST",
    body: JSON.stringify({ answer, session_id: sessionId }),
  });
}

function sendIceCandidate(streamId, sessionId, candidate) {
  return didFetch(`/talks/streams/${streamId}/ice`, {
    method: "POST",
    body: JSON.stringify({ session_id: sessionId, ...candidate }),
  });
}

function sendText(streamId, sessionId, text) {
  return didFetch(`/talks/streams/${streamId}`, {
    method: "POST",
    body: JSON.stringify({
      session_id: sessionId,
      script: {
        type: "text",
        input: text,
        provider: { type: "microsoft", voice_id: "en-US-JennyNeural" },
      },
      config: { fluent: true, pad_audio: 0 },
    }),
  });
}

function closeStream(streamId, sessionId) {
  return didFetch(`/talks/streams/${streamId}`, {
    method: "DELETE",
    body: JSON.stringify({ session_id: sessionId }),
  });
}

module.exports = {
  createStream,
  sendAnswer,
  sendIceCandidate,
  sendText,
  closeStream,
};
