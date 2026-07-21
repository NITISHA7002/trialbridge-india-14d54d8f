import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/find-trials", label: "Find Trials" },
  { to: "/eligibility", label: "Eligibility Checker" },
  { to: "/faq", label: "FAQ" },
  { to: "/assistant", label: "AI Assistant" },
  { to: "/about", label: "About" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 inset-x-0 z-50 tb-navbar bg-background/90 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center" onClick={() => setOpen(false)}>
            <Logo />
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "text-primary bg-[color:var(--brand-soft)]" }}
                inactiveProps={{ className: "text-foreground/80 hover:bg-[color:var(--brand-soft)]" }}
                className="px-3 py-2 rounded-md text-sm font-medium tb-nav-link"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-foreground hover:bg-[color:var(--brand-soft)]"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open && (
          <nav className="md:hidden pb-4 flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "text-primary bg-[color:var(--brand-soft)]" }}
                inactiveProps={{ className: "text-foreground/80 hover:bg-[color:var(--brand-soft)]" }}
                className="px-3 py-2 rounded-md text-sm font-medium tb-nav-link"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}