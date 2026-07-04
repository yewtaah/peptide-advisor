import { Link, useNavigate, useParams } from "react-router-dom";
import { products } from "../data/products";
import AvatarAdvisor from "../components/AvatarAdvisor";
import {
  ArrowRightIcon,
  CartIcon,
  LockIcon,
  FlaskIcon,
  SparkleIcon,
  CheckIcon,
  AlertIcon,
} from "../components/icons";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === id);

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
              <button
                type="button"
                onClick={() => navigate("/practitioners")}
                className="flex items-center gap-2 rounded-lg border border-rx-border bg-rx-bg px-5 py-3 text-sm font-semibold text-rx"
              >
                <LockIcon className="h-4 w-4" />
                Rx Required — Consult a Practitioner
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate("/cart")}
                className="flex items-center gap-2 rounded-lg bg-teal px-5 py-3 text-sm font-semibold text-bg hover:bg-teal-glow"
              >
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

        <AvatarAdvisor product={product} />
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
