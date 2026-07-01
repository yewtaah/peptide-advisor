import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { categories, products, type Category } from "../data/products";
import {
  SearchIcon,
  FlaskIcon,
  CartIcon,
  LockIcon,
  categoryIcons,
} from "../components/icons";

const sidebarIcons: Record<Category, string> = {
  Peptides: "sparkle",
  Longevity: "infinity",
  Metabolic: "bolt",
  Hormone: "pulse",
  Recovery: "heart",
  Telehealth: "video",
};

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") as Category | null;
  const [query, setQuery] = useState("");
  const [rxOnly, setRxOnly] = useState(false);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (activeCategory && p.category !== activeCategory) return false;
      if (rxOnly && !p.rxRequired) return false;
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [activeCategory, rxOnly, query]);

  function setCategory(cat: Category | null) {
    if (!cat) {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat);
    }
    setSearchParams(searchParams);
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <p className="text-muted">Clinically curated health optimization protocols</p>
      <div className="mt-6 border-b border-border" />

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-6">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-dark" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-lg border border-border bg-surface py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-muted-dark focus:border-teal-dark focus:outline-none"
            />
          </div>

          <div>
            <div className="mb-2 text-xs font-semibold tracking-wide text-muted-dark">
              CATEGORIES
            </div>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => setCategory(null)}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                  !activeCategory
                    ? "bg-teal-dark/20 text-teal-glow"
                    : "text-ink/80 hover:bg-surface"
                }`}
              >
                <FlaskIcon className="h-4 w-4" />
                All Products
              </button>
              {categories.map((cat) => {
                const Icon = categoryIcons[sidebarIcons[cat.name]];
                const active = activeCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setCategory(cat.name)}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                      active
                        ? "bg-teal-dark/20 text-teal-glow"
                        : "text-ink/80 hover:bg-surface"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs font-semibold tracking-wide text-muted-dark">
              FILTERS
            </div>
            <label className="flex items-center gap-2 text-sm text-ink/80">
              <input
                type="checkbox"
                checked={rxOnly}
                onChange={(e) => setRxOnly(e.target.checked)}
                className="h-4 w-4 rounded border-border bg-surface accent-teal"
              />
              Rx Products Only
            </label>
          </div>

          <div className="rounded-xl border border-amber/30 bg-amber/5 p-4">
            <div className="text-sm font-semibold text-amber-light">Wholesale Pricing</div>
            <p className="mt-1 text-sm text-muted">
              Clinics &amp; practitioners save up to 40% with wholesale access.
            </p>
            <Link
              to="/wholesale"
              className="mt-2 inline-block text-sm font-semibold text-amber-light hover:underline"
            >
              Apply Now →
            </Link>
          </div>
        </aside>

        <div>
          <p className="mb-4 text-sm text-muted">{filtered.length} products</p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-teal-dark/60"
              >
                <div className="relative flex h-44 items-center justify-center bg-bg">
                  {product.rxRequired && (
                    <span className="absolute left-0 top-0 rounded-br-lg bg-rx px-2.5 py-1 text-xs font-bold text-bg">
                      RX
                    </span>
                  )}
                  {product.subscription && (
                    <span className="absolute left-0 top-0 rounded-br-lg bg-amber px-2.5 py-1 text-xs font-bold text-bg">
                      SUB
                    </span>
                  )}
                  <FlaskIcon className="h-14 w-14 text-border" />
                </div>
                <div className="p-5">
                  <div className="text-xs font-semibold tracking-wide text-teal-glow">
                    {product.category.toUpperCase()}
                  </div>
                  <h3 className="mt-1.5 font-display font-semibold text-ink">
                    {product.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted">{product.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-display text-lg font-bold text-ink">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.rxRequired ? (
                      <span className="flex items-center gap-1.5 rounded-lg border border-rx-border bg-rx-bg px-3 py-1.5 text-xs font-semibold text-rx">
                        <LockIcon className="h-3.5 w-3.5" />
                        Rx Required
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 rounded-lg border border-teal-dark/50 px-3 py-1.5 text-xs font-semibold text-teal-glow">
                        <CartIcon className="h-3.5 w-3.5" />
                        Add to Cart
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
