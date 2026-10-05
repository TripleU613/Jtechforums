import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { links } from "../lib/links.ts";
import { toggleScheme, useScheme } from "../lib/scheme.ts";
import Brand from "./Brand.tsx";
import Icon from "./Icon.tsx";

const nav = [
  ["Home", "/"],
  ["eGate", "/egate"],
  ["About", "/about"],
  ["Contact", "/contact"],
] as const;

function NavLinks() {
  return nav.map(([label, to]) => (
    <NavLink key={to} to={to} end={to === "/"}>
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
          <button
            type="button"
            className="scheme-toggle"
            onClick={toggleScheme}
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
          <button type="button" className="mobile-scheme" onClick={toggleScheme}>
            <Icon name={scheme === "dark" ? "sun" : "moon"} size={18} />
            {scheme === "dark" ? "Light mode" : "Dark mode"}
          </button>
        </nav>
      )}
    </header>
  );
}
