import { useRef, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FlaskIcon, CartIcon, UserIcon, ChevronDownIcon } from "./icons";
import { categories } from "../data/products";
import { useClickOutside } from "../lib/useClickOutside";

const navLinkBase =
  "text-sm font-medium transition-colors hover:text-ink";

const dropdownItemClass =
  "block rounded-lg px-3 py-2 text-sm text-ink/80 hover:bg-surface hover:text-ink";

export default function Header() {
  const navigate = useNavigate();
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const catalogRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  useClickOutside(catalogRef, () => setCatalogOpen(false));
  useClickOutside(accountRef, () => setAccountOpen(false));

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-dark/20 text-teal-glow">
            <FlaskIcon className="h-5 w-5" />
          </span>
          <span className="font-display leading-tight">
            <span className="block text-[15px] font-bold text-ink">The Peptide</span>
            <span className="block text-[15px] font-bold text-teal-glow -mt-1">Formula</span>
          </span>
        </NavLink>

        <nav className="hidden items-center gap-8 md:flex">
          <div className="relative" ref={catalogRef}>
            <button
              type="button"
              onClick={() => setCatalogOpen((o) => !o)}
              aria-expanded={catalogOpen ? "true" : "false"}
              className={`${navLinkBase} flex items-center gap-1 text-ink`}
            >
              Catalog
              <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform ${catalogOpen ? "rotate-180" : ""}`} />
            </button>
            {catalogOpen && (
              <div className="absolute left-0 top-full mt-2 w-56 rounded-xl border border-border bg-surface p-2 shadow-lg">
                <Link to="/catalog" onClick={() => setCatalogOpen(false)} className={dropdownItemClass}>
                  All Products
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    to={`/catalog?category=${encodeURIComponent(cat.name)}`}
                    onClick={() => setCatalogOpen(false)}
                    className={dropdownItemClass}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <NavLink to="/practitioners" className={`${navLinkBase} text-ink`}>
            Practitioners
          </NavLink>
          <NavLink to="/health-assessment" className={`${navLinkBase} text-ink`}>
            Health Assessment
          </NavLink>
          <NavLink to="/wholesale" className={`${navLinkBase} text-amber-light`}>
            Wholesale
          </NavLink>
          <NavLink to="/join-network" className={`${navLinkBase} text-green`}>
            Join Network
          </NavLink>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/cart" aria-label="Cart" className="text-ink/80 hover:text-ink">
            <CartIcon className="h-5 w-5" />
          </Link>
          <div className="relative" ref={accountRef}>
            <button
              type="button"
              onClick={() => setAccountOpen((o) => !o)}
              aria-expanded={accountOpen ? "true" : "false"}
              className="flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-medium text-ink"
            >
              <UserIcon className="h-4 w-4 text-teal-glow" />
              Scott
              <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform ${accountOpen ? "rotate-180" : ""}`} />
            </button>
            {accountOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-surface p-2 shadow-lg">
                <Link to="/account/profile" onClick={() => setAccountOpen(false)} className={dropdownItemClass}>
                  Profile
                </Link>
                <Link to="/account/orders" onClick={() => setAccountOpen(false)} className={dropdownItemClass}>
                  Orders
                </Link>
                <Link to="/account/settings" onClick={() => setAccountOpen(false)} className={dropdownItemClass}>
                  Settings
                </Link>
                <div className="my-1 border-t border-border" />
                <button
                  type="button"
                  onClick={() => {
                    setAccountOpen(false);
                    navigate("/");
                  }}
                  className={`${dropdownItemClass} w-full text-left`}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
