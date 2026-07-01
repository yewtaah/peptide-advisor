import { NavLink } from "react-router-dom";
import { FlaskIcon, CartIcon, UserIcon, ChevronDownIcon } from "./icons";

const navLinkBase =
  "text-sm font-medium transition-colors hover:text-ink";

export default function Header() {
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
          <button type="button" className={`${navLinkBase} flex items-center gap-1 text-ink`}>
            Catalog
            <ChevronDownIcon className="h-3.5 w-3.5" />
          </button>
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
          <button type="button" aria-label="Cart" className="text-ink/80 hover:text-ink">
            <CartIcon className="h-5 w-5" />
          </button>
          <button type="button" className="flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-medium text-ink">
            <UserIcon className="h-4 w-4 text-teal-glow" />
            Scott
          </button>
        </div>
      </div>
    </header>
  );
}
