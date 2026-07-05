import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as sdk from "@d-id/client-sdk";
import type { AgentManager, ConnectionState, Message } from "@d-id/client-sdk";
import { categories, products, type Category } from "../data/products";
import { attachAndPlay } from "../lib/media";
import {
  SparkleIcon,
  SendIcon,
  MicIcon,
  VideoIcon,
  AlertIcon,
  VolumeOffIcon,
  ArrowRightIcon,
} from "../components/icons";

type Status = "idle" | "connecting" | "connected" | "error";
const READY_TIMEOUT_MS = 20000;

const AGENT_ID = import.meta.env.VITE_DID_AGENT_ID as string | undefined;
const CLIENT_KEY = import.meta.env.VITE_DID_AGENT_CLIENT_KEY as string | undefined;

const QUESTION_OPTIONS: string[][] = [
  ["Recovery", "Longevity", "Metabolic", "Hormone", "Sleep & Stress"],
  ["Low", "Moderate", "Good", "Great"],
  ["Yes, I have one", "No", "I'm open to one"],
  ["Yes, open to Rx", "Non-Rx only", "Not sure"],
  ["Complete beginner", "Some experience", "Very experienced"],
];

const CATEGORY_NAMES = categories.map((c) => c.name);

function findRecommendedCategory(text: string): Category | null {
  const match = CATEGORY_NAMES.find((name) => text.toLowerCase().includes(name.toLowerCase()));
  return (match as Category) ?? null;
}

interface SpeechRecognitionResultLike {
  transcript: string;
}
interface SpeechRecognitionEventLike {
  results: { [index: number]: { [index: number]: SpeechRecognitionResultLike } };
}
interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start(): void;
  stop(): void;
}
type SpeechRecognitionCtorType = new () => SpeechRecognitionLike;

const SpeechRecognitionCtor: SpeechRecognitionCtorType | undefined = (
  window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtorType;
    webkitSpeechRecognition?: SpeechRecognitionCtorType;
  }
).SpeechRecognition ?? (window as unknown as { webkitSpeechRecognition?: SpeechRecognitionCtorType }).webkitSpeechRecognition;

export default function HealthAssessment() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [needsUnmute, setNeedsUnmute] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [turnCount, setTurnCount] = useState(0);
  const [listening, setListening] = useState(false);
  const [recommendedCategory, setRecommendedCategory] = useState<Category | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const managerRef = useRef<AgentManager | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const readyTimeoutRef = useRef<number | null>(null);

  function clearReadyTimeout() {
    if (readyTimeoutRef.current !== null) {
      window.clearTimeout(readyTimeoutRef.current);
      readyTimeoutRef.current = null;
    }
  }

  useEffect(() => {
    return () => {
      clearReadyTimeout();
      void managerRef.current?.disconnect();
    };
  }, []);

  async function connect() {
    if (!AGENT_ID || !CLIENT_KEY) {
      setStatus("error");
      setErrorMessage("Health assessment is not configured yet.");
      return;
    }
    setStatus("connecting");
    setErrorMessage(null);
    setVideoReady(false);
    setNeedsUnmute(false);
    try {
      const manager = await sdk.createAgentManager(AGENT_ID, {
        auth: { type: "key", clientKey: CLIENT_KEY },
        callbacks: {
          onSrcObjectReady: (stream) => {
            if (videoRef.current) attachAndPlay(videoRef.current, stream, () => setNeedsUnmute(true));
          },
          onConnectionStateChange: (state: ConnectionState) => {
            if (state === "connected") {
              setStatus("connected");
              clearReadyTimeout();
              readyTimeoutRef.current = window.setTimeout(() => {
                if (!videoRef.current || videoRef.current.readyState < 2) {
                  setStatus("error");
                  setErrorMessage(
                    "The assessment is taking longer than expected to respond. Please try again in a moment.",
                  );
                  void managerRef.current?.disconnect();
                }
              }, READY_TIMEOUT_MS);
            } else if (state === "fail" || state === "disconnected" || state === "closed") {
              clearReadyTimeout();
              setStatus("error");
              setErrorMessage("The assessment connection was lost.");
            }
          },
          onNewMessage: (msgs, type) => {
            if (type === "partial") return;
            setMessages(msgs);
            const last = msgs[msgs.length - 1];
            if (last?.role === "assistant") {
              const found = findRecommendedCategory(last.content);
              if (found) setRecommendedCategory(found);
            }
          },
          onError: (err) => {
            setStatus("error");
            setErrorMessage(err.message || "Could not connect to the health assessment.");
          },
        },
      });
      managerRef.current = manager;
      await manager.connect();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Could not start the health assessment.");
    }
  }

  function sendAnswer(text: string) {
    const trimmed = text.trim();
    if (!trimmed || !managerRef.current) return;
    managerRef.current.chat(trimmed).catch(() => {});
    setTurnCount((n) => Math.min(n + 1, QUESTION_OPTIONS.length));
    setInput("");
  }

  function toggleListening() {
    if (!SpeechRecognitionCtor) return;
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) sendAnswer(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  const recommendedProducts = recommendedCategory
    ? products.filter((p) => p.category === recommendedCategory).slice(0, 3)
    : [];
  const currentOptions = turnCount < QUESTION_OPTIONS.length ? QUESTION_OPTIONS[turnCount] : [];

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-dark/50 bg-teal-dark/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-teal-glow">
          <SparkleIcon className="h-3.5 w-3.5" />
          AI HEALTH ASSESSMENT
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold text-ink">Find Your Fit in 5 Questions</h1>
        <p className="mt-2 text-sm text-muted">
          Tap, type, or speak your answers — takes under a minute.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-bg/80">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              onPlaying={() => {
                clearReadyTimeout();
                setVideoReady(true);
              }}
              className={`h-full w-full object-contain ${status === "connected" ? "" : "hidden"}`}
            />
            {status === "connected" && !videoReady && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-bg/80 p-4 text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-dark/40 border-t-teal-glow" />
                <p className="text-xs text-muted">Connecting…</p>
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
                    <p className="text-xs text-muted">Meet your AI health guide.</p>
                    <button
                      type="button"
                      onClick={connect}
                      disabled={status === "connecting"}
                      className="rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-bg hover:bg-teal-glow disabled:opacity-60"
                    >
                      {status === "connecting" ? "Connecting…" : "Start Assessment"}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-bg/60 md:col-span-3">
          <div className="max-h-72 space-y-4 overflow-y-auto p-5">
            {messages.length === 0 && (
              <p className="text-sm text-muted">
                {status === "connected"
                  ? "Waiting for your guide to say hello…"
                  : status === "connecting"
                    ? "Connecting to your health guide…"
                    : "Click Start Assessment to begin."}
              </p>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2.5 text-sm ${
                    m.role === "user"
                      ? "bg-teal-dark/25 text-ink"
                      : "border border-border bg-surface text-muted"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          {status === "connected" && turnCount < QUESTION_OPTIONS.length && currentOptions.length > 0 && (
            <div className="flex flex-wrap gap-2 border-t border-border p-4">
              {currentOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => sendAnswer(option)}
                  className="rounded-lg border border-teal-dark/50 px-3 py-1.5 text-sm font-medium text-teal-glow hover:bg-teal-dark/10"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 border-t border-border p-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendAnswer(input)}
              disabled={status !== "connected"}
              placeholder="Type your answer..."
              className="flex-1 rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted-dark focus:border-teal-dark focus:outline-none disabled:opacity-60"
            />
            {SpeechRecognitionCtor && (
              <button
                type="button"
                onClick={toggleListening}
                disabled={status !== "connected"}
                aria-label="Speak your answer"
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${
                  listening ? "border-teal-glow text-teal-glow" : "border-border text-ink/80"
                } hover:bg-surface disabled:opacity-60`}
              >
                <MicIcon className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => sendAnswer(input)}
              disabled={status !== "connected"}
              aria-label="Send"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal text-bg hover:bg-teal-glow disabled:opacity-60"
            >
              <SendIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {recommendedCategory && (
        <div className="mt-8 rounded-2xl border border-teal-dark/40 bg-surface/60 p-8">
          <h2 className="font-display text-xl font-bold text-ink">
            Recommended for you: <span className="text-teal-glow">{recommendedCategory}</span>
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {recommendedProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group rounded-xl border border-border bg-bg/60 p-5 transition-colors hover:border-teal-dark/60"
              >
                <div className="text-xs font-semibold tracking-wide text-teal-glow">
                  {product.category.toUpperCase()}
                </div>
                <h3 className="mt-1.5 font-display font-semibold text-ink">{product.name}</h3>
                <p className="mt-1.5 text-sm text-muted">{product.description}</p>
                <div className="mt-3 font-display text-lg font-bold text-ink">
                  ${product.price.toFixed(2)}
                </div>
              </Link>
            ))}
          </div>
          <Link
            to={`/catalog?category=${encodeURIComponent(recommendedCategory)}`}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-glow hover:underline"
          >
            See all {recommendedCategory} products
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
