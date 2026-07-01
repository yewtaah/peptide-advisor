import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { products } from "../data/products";
import {
  ArrowRightIcon,
  CartIcon,
  LockIcon,
  FlaskIcon,
  SparkleIcon,
  CheckIcon,
  AlertIcon,
  SendIcon,
} from "../components/icons";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

function generateAdvisorReply(question: string, productName: string): string {
  const q = question.toLowerCase();
  if (q.includes("dose") || q.includes("dosing") || q.includes("how much")) {
    return `Dosing for ${productName} varies by goals and body weight. See the "Dosing Considerations" panel above for the commonly researched range, and confirm with a licensed practitioner before starting — this isn't personalized medical advice.`;
  }
  if (q.includes("side effect") || q.includes("risk") || q.includes("safe")) {
    return `The main risks noted for ${productName} are listed in the Risks & Considerations panel. If you have an existing condition or take other medications, a practitioner consult is recommended before use.`;
  }
  if (q.includes("stack") || q.includes("combine") || q.includes("with")) {
    return `Stacking depends on your goals — many customers pair recovery peptides with longevity or metabolic protocols. I'd recommend a Health Assessment or practitioner consult to confirm compatibility with ${productName}.`;
  }
  return `Good question about ${productName}. Based on current research, this product is generally used as described in the overview above. For anything specific to your health history, please consult one of our licensed practitioners.`;
}

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: product
        ? `Hi, I'm your AI Peptide Advisor. Ask me anything about ${product.name} — dosing, safety, or how it fits your goals.`
        : "Hi, I'm your AI Peptide Advisor.",
    },
  ]);
  const [input, setInput] = useState("");

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-ink">Product not found</h1>
        <Link to="/catalog" className="mt-4 inline-block text-teal-glow hover:underline">
          Back to catalog
        </Link>
      </div>
    );
  }

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    const reply = generateAdvisorReply(text, product!.name);
    setMessages((prev) => [
      ...prev,
      { role: "user", text },
      { role: "assistant", text: reply },
    ]);
    setInput("");
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <Link to="/catalog" className="text-sm text-muted hover:text-ink">
        ← Back to Catalog
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="flex h-80 items-center justify-center rounded-xl border border-border bg-surface">
          <FlaskIcon className="h-24 w-24 text-border" />
        </div>

        <div>
          <div className="text-xs font-semibold tracking-wide text-teal-glow">
            {product.category.toUpperCase()}
          </div>
          <h1 className="mt-1.5 font-display text-3xl font-bold text-ink">{product.name}</h1>
          <p className="mt-3 text-muted">{product.description}</p>
          <div className="mt-6 font-display text-3xl font-bold text-ink">
            ${product.price.toFixed(2)}
          </div>

          <div className="mt-6">
            {product.rxRequired ? (
              <button type="button" className="flex items-center gap-2 rounded-lg border border-rx-border bg-rx-bg px-5 py-3 text-sm font-semibold text-rx">
                <LockIcon className="h-4 w-4" />
                Rx Required — Consult a Practitioner
              </button>
            ) : (
              <button type="button" className="flex items-center gap-2 rounded-lg bg-teal px-5 py-3 text-sm font-semibold text-bg hover:bg-teal-glow">
                <CartIcon className="h-4 w-4" />
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>

      <section className="mt-16 rounded-2xl border border-teal-dark/40 bg-surface/60 p-8">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-dark/20 text-teal-glow">
            <SparkleIcon className="h-5 w-5" />
          </span>
          <h2 className="font-display text-xl font-bold text-ink">AI Peptide Advisor</h2>
        </div>
        <p className="mt-2 text-sm text-muted">
          An AI-generated summary and interactive Q&amp;A for {product.name}. This is
          educational information, not a substitute for medical advice.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-bg/60 p-5 md:col-span-1">
            <h3 className="text-sm font-semibold text-ink">Overview</h3>
            <p className="mt-2 text-sm text-muted">{product.overview}</p>
          </div>
          <div className="rounded-xl border border-border bg-bg/60 p-5 md:col-span-1">
            <h3 className="text-sm font-semibold text-ink">Potential Benefits</h3>
            <ul className="mt-2 space-y-2">
              {product.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-muted">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-teal-glow" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-bg/60 p-5 md:col-span-1">
            <h3 className="text-sm font-semibold text-ink">Risks &amp; Considerations</h3>
            <ul className="mt-2 space-y-2">
              {product.risks.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-muted">
                  <AlertIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-light" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-border bg-bg/60 p-5">
          <h3 className="text-sm font-semibold text-ink">Dosing Considerations</h3>
          <p className="mt-2 text-sm text-muted">{product.dosingNotes}</p>
        </div>

        <div className="mt-8 rounded-xl border border-border bg-bg/60">
          <div className="max-h-80 space-y-4 overflow-y-auto p-5">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
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
      </section>

      <div className="mt-10">
        <Link
          to="/health-assessment"
          className="inline-flex items-center gap-2 text-sm font-semibold text-teal-glow hover:underline"
        >
          Get a personalized protocol via Health Assessment
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
