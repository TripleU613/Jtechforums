import { useEffect, useState, type MouseEvent } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { links } from "../lib/links.ts";
import { toggleScheme, useScheme } from "../lib/scheme.ts";
import Brand from "./Brand.tsx";
import { openPalette } from "./CommandPalette.tsx";
import Icon from "./Icon.tsx";

const nav = [
  ["Home", "/"],
  ["eGate", "/egate"],
  ["About", "/about"],
  ["Contact", "/contact"],
] as const;

/** Where a click happened, or the button's centre when it came from the keyboard. */
function pointFrom(event: MouseEvent<HTMLElement>): { x: number; y: number } {
  if (event.clientX || event.clientY) return { x: event.clientX, y: event.clientY };
  const box = event.currentTarget.getBoundingClientRect();
  return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
}

function NavLinks() {
  return nav.map(([label, to]) => (
    <NavLink viewTransition key={to} to={to} end={to === "/"}>
      {label}
    </NavLink>
  ));
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const scheme = useScheme();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  const other = scheme === "dark" ? "light" : "dark";
  return (
    <header className="site-header">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          <NavLinks />
        </nav>
        <div className="header-actions">
          <button type="button" className="palette-trigger" onClick={openPalette} aria-label="Jump to or search (Ctrl K)">
            <Icon name="search" size={16} />
            <span>Search</span>
            <kbd>⌘K</kbd>
          </button>
          <button
            type="button"
            className="scheme-toggle"
            onClick={(event) => toggleScheme(pointFrom(event))}
            aria-label={`Switch to ${other} mode`}
            title="Switch light / dark (the forum follows)"
          >
            <Icon name={scheme === "dark" ? "sun" : "moon"} size={18} />
          </button>
          <a className="button button-small" href={links.forum}>
            <span className="label-long">Go to the forum</span>
            <span className="label-short">Forum</span>
            <Icon name="arrow" size={16} />
          </a>
        </div>
        <button
          type="button"
          className="menu-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(!open)}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>
      {open && (
        <nav id="mobile-menu" className="mobile-nav" aria-label="Mobile navigation">
          <NavLinks />
          <button type="button" className="mobile-scheme" onClick={openPalette}>
            <Icon name="search" size={18} />
            Search
          </button>
          <button type="button" className="mobile-scheme" onClick={(event) => toggleScheme(pointFrom(event))}>
            <Icon name={scheme === "dark" ? "sun" : "moon"} size={18} />
            {scheme === "dark" ? "Light mode" : "Dark mode"}
          </button>
        </nav>
      )}
    </header>
  );
}
