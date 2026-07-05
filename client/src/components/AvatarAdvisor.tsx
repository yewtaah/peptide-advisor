import { useEffect, useRef, useState } from "react";
import type { Product } from "../data/products";
import { generateAdvisorReply, type ChatMessage } from "../lib/advisor";
import { attachAndPlay } from "../lib/media";
import { SendIcon, VideoIcon, AlertIcon, VolumeOffIcon } from "./icons";

type Status = "idle" | "connecting" | "connected" | "error";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL ?? ""}/api/advisor`;

interface StreamStartResponse {
  id: string;
  session_id: string;
  offer: RTCSessionDescriptionInit;
  ice_servers?: RTCIceServer[];
}

export default function AvatarAdvisor({ product }: { product: Product }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [needsUnmute, setNeedsUnmute] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: `Hi, I'm your AI Peptide Advisor. Ask me anything about ${product.name} — dosing, safety, or how it fits your goals.`,
    },
  ]);
  const [input, setInput] = useState("");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const streamIdRef = useRef<string | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const greetedRef = useRef(false);

  function speak(text: string) {
    if (!streamIdRef.current) return;
    fetch(`${API_BASE}/stream/${streamIdRef.current}/speak`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionIdRef.current, text }),
    }).catch(() => {});
  }

  useEffect(() => {
    return () => {
      void disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function connect() {
    greetedRef.current = false;
    setStatus("connecting");
    setErrorMessage(null);
    setVideoReady(false);
    setNeedsUnmute(false);
    try {
      const res = await fetch(`${API_BASE}/stream`, { method: "POST" });
      if (!res.ok) throw new Error("Could not start the avatar session");
      const { id, session_id, offer, ice_servers }: StreamStartResponse = await res.json();
      streamIdRef.current = id;
      sessionIdRef.current = session_id;

      const pc = new RTCPeerConnection({ iceServers: ice_servers });
      pcRef.current = pc;

      pc.ontrack = (event) => {
        if (videoRef.current) {
          attachAndPlay(videoRef.current, event.streams[0], () => setNeedsUnmute(true));
        }
      };

      pc.onicecandidate = (event) => {
        fetch(`${API_BASE}/stream/${id}/ice`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id,
            candidate: event.candidate?.candidate ?? null,
            sdpMid: event.candidate?.sdpMid ?? null,
            sdpMLineIndex: event.candidate?.sdpMLineIndex ?? null,
          }),
        }).catch(() => {});
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "connected") {
          setStatus("connected");
          if (!greetedRef.current) {
            greetedRef.current = true;
            speak(messages[0].text);
          }
        } else if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
          setStatus("error");
          setErrorMessage("The avatar connection was lost.");
        }
      };

      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      await fetch(`${API_BASE}/stream/${id}/sdp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer, session_id }),
      });
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Could not connect to the avatar advisor",
      );
    }
  }

  async function disconnect() {
    const id = streamIdRef.current;
    const sessionId = sessionIdRef.current;
    pcRef.current?.close();
    pcRef.current = null;
    streamIdRef.current = null;
    sessionIdRef.current = null;
    if (id) {
      try {
        await fetch(`${API_BASE}/stream/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        });
      } catch {
        // best-effort cleanup
      }
    }
  }

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    const reply = generateAdvisorReply(text, product.name);
    setMessages((prev) => [...prev, { role: "user", text }, { role: "assistant", text: reply }]);
    setInput("");

    if (status === "connected" && streamIdRef.current) {
      fetch(`${API_BASE}/stream/${streamIdRef.current}/speak`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionIdRef.current, text: reply }),
      }).catch(() => {});
    }
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-5">
      <div className="md:col-span-2">
        <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-bg/80">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            onPlaying={() => setVideoReady(true)}
            className={`h-full w-full object-contain ${status === "connected" ? "" : "hidden"}`}
          />
          {status === "connected" && !videoReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-bg/80 p-4 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-dark/40 border-t-teal-glow" />
              <p className="text-xs text-muted">Loading avatar…</p>
            </div>
          )}
          {status === "connected" && videoReady && needsUnmute && (
            <button
              type="button"
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.muted = false;
                  setNeedsUnmute(false);
                }
              }}
              className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-bg/90 px-3 py-2 text-xs font-semibold text-ink hover:bg-bg"
            >
              <VolumeOffIcon className="h-4 w-4" />
              Tap for sound
            </button>
          )}
          {status !== "connected" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center">
              {status === "error" ? (
                <>
                  <AlertIcon className="h-8 w-8 text-amber-light" />
                  <p className="text-xs text-muted">{errorMessage}</p>
                  <button
                    type="button"
                    onClick={connect}
                    className="rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-bg hover:bg-teal-glow"
                  >
                    Try Again
                  </button>
                </>
              ) : (
                <>
                  <VideoIcon className="h-8 w-8 text-teal-glow" />
                  <p className="text-xs text-muted">
                    Talk face-to-face with your AI Peptide Advisor.
                  </p>
                  <button
                    type="button"
                    onClick={connect}
                    disabled={status === "connecting"}
                    className="rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-bg hover:bg-teal-glow disabled:opacity-60"
                  >
                    {status === "connecting" ? "Connecting…" : "Start Video Chat"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-bg/60 md:col-span-3">
        <div className="max-h-80 space-y-4 overflow-y-auto p-5">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2.5 text-sm ${
                  m.role === "user"
                    ? "bg-teal-dark/25 text-ink"
                    : "border border-border bg-surface text-muted"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 border-t border-border p-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={`Ask about dosing, safety, or stacking ${product.name}...`}
            className="flex-1 rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted-dark focus:border-teal-dark focus:outline-none"
          />
          <button
            type="button"
            onClick={handleSend}
            aria-label="Send"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal text-bg hover:bg-teal-glow"
          >
            <SendIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
