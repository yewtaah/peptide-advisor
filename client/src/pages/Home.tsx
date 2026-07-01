import { Link } from "react-router-dom";
import {
  SparkleIcon,
  ArrowRightIcon,
  ShieldIcon,
  LockIcon,
  UsersIcon,
  FlaskIcon,
  categoryIcons,
} from "../components/icons";
import { categories } from "../data/products";

const stats = [
  { value: "500+", label: "Clinical Products" },
  { value: "200+", label: "Verified Practitioners" },
  { value: "50+", label: "Partner Clinics" },
  { value: "HIPAA", label: "Compliant Platform" },
];

const trustItems = [
  { icon: ShieldIcon, title: "HIPAA Compliant", desc: "Your health data is protected" },
  { icon: LockIcon, title: "Rx Authorization", desc: "Prescription products gated" },
  { icon: UsersIcon, title: "Licensed Practitioners", desc: "Verified medical network" },
  { icon: FlaskIcon, title: "Clinical Grade", desc: "Pharmaceutical quality standards" },
];

const categoryCopy: Record<string, string> = {
  Peptides: "Growth, repair, and performance peptides",
  Longevity: "Cellular health and healthy-aging protocols",
  Metabolic: "Weight management and metabolic support",
  Hormone: "Hormone optimization and replacement",
  Recovery: "Injury recovery and tissue repair",
  Telehealth: "Licensed practitioner consultations",
};

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-7xl px-6 pt-20 pb-14">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-dark/50 bg-teal-dark/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-teal-glow">
          <SparkleIcon className="h-3.5 w-3.5" />
          ADVANCED HEALTH OPTIMIZATION
        </span>

        <h1 className="mt-6 max-w-3xl font-display text-5xl font-bold leading-tight text-ink md:text-6xl">
          Precision Protocols for{" "}
          <span className="text-teal-glow">Peak Human Performance</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-muted">
          The Peptide Formula delivers clinically curated peptides, longevity
          compounds, and telehealth services for consumers and medical
          professionals — with AI-guided personalization and verified
          practitioner access.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            to="/health-assessment"
            className="inline-flex items-center gap-2 rounded-lg bg-teal px-5 py-3 text-sm font-semibold text-bg hover:bg-teal-glow"
          >
            <SparkleIcon className="h-4 w-4" />
            Take Health Assessment
          </Link>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-semibold text-ink hover:bg-surface"
          >
            Browse Catalog
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-display text-3xl font-bold text-teal-glow">{s.value}</div>
              <div className="mt-1 text-sm text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface/40">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-dark/15 text-teal-glow">
                <item.icon className="h-5 w-5" />
              </span>
              <div>
                <div className="text-sm font-semibold text-ink">{item.title}</div>
                <div className="text-sm text-muted">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 text-center">
        <div className="mx-auto mb-6 h-0.5 w-10 bg-teal" />
        <h2 className="font-display text-3xl font-bold text-ink md:text-4xl">
          Health Categories
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Comprehensive protocols spanning every dimension of human health
          optimization
        </p>

        <div className="mt-12 grid grid-cols-1 gap-5 text-left sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.icon];
            return (
              <Link
                key={cat.name}
                to={`/catalog?category=${encodeURIComponent(cat.name)}`}
                className="group rounded-xl border border-border bg-surface p-6 transition-colors hover:border-teal-dark/60 hover:bg-surface-hover"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-dark/15 text-teal-glow">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                  {cat.name}
                </h3>
                <p className="mt-1 text-sm text-muted">{categoryCopy[cat.name]}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
