import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import BackToTop from "./BackToTop.tsx";
import CommandPalette from "./CommandPalette.tsx";
import DevOptions from "./DevOptions.tsx";
import Footer from "./Footer.tsx";
import Header from "./Header.tsx";
import Shortcuts from "./Shortcuts.tsx";
import Toaster from "./Toaster.tsx";
import { startKonami } from "../lib/konami.ts";
import { startScramble } from "../lib/scramble.ts";
import { startSpotlight } from "../lib/spotlight.ts";

const titles: Record<string, string> = {
  "/": "JTech Forums",
  "/egate": "eGate · JTech Forums",
  "/market": "JTech Market · JTech Forums",
  "/about": "About · JTech Forums",
  "/contact": "Contact · JTech Forums",
  "/privacy-policy": "Privacy Policy · JTech Forums",
  "/terms": "Terms of Service · JTech Forums",
  "/terms-of-service": "Terms of Service · JTech Forums",
};

export default function PageShell({ children }: { children: ReactNode }) {
  const { pathname, hash } = useLocation();
  useEffect(() => startSpotlight(), []);
  useEffect(() => startKonami(), []);
  useEffect(() => startScramble(), []);
  useEffect(() => {
    document.title = titles[pathname] ?? "JTech Forums";
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, hash]);
  return (
    <div className="site-shell">
      <Header />
      <main id="main" className={pathname === "/" ? "home-main" : "inner-page"}>
        {children}
      </main>
      <Footer />
      <CommandPalette />
      <DevOptions />
      <Shortcuts />
      <Toaster />
      <BackToTop />
    </div>
  );
}
