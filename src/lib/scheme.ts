import { useSyncExternalStore } from "react";

/**
 * Light or dark, shared with the forum. The forum remembers a visitor's
 * choice in the `forced_color_mode` cookie (auto, light or dark) on the
 * same domain, so the page reads it, and its own switch writes it: pick
 * dark here and the forum opens dark too. "auto" follows the system.
 *
 * The <head> applies the cookie before anything paints (src/document.ts);
 * this module keeps <html data-scheme> current after that.
 */

export type Scheme = "light" | "dark";

const COOKIE = "forced_color_mode";
const darkQuery = (): MediaQueryList | null =>
  typeof window === "undefined" ? null : window.matchMedia("(prefers-color-scheme: dark)");

function forced(): Scheme | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE}=(light|dark)`));
  return (match?.[1] as Scheme | undefined) ?? null;
}

function current(): Scheme {
  return forced() ?? (darkQuery()?.matches ? "dark" : "light");
}

const listeners = new Set<() => void>();
function emit(): void {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const query = darkQuery();
  query?.addEventListener("change", listener);
  return () => {
    listeners.delete(listener);
    query?.removeEventListener("change", listener);
  };
}

export function useScheme(): Scheme {
  return useSyncExternalStore(subscribe, current, () => "dark");
}

function store(next: Scheme): void {
  const system: Scheme = darkQuery()?.matches ? "dark" : "light";
  const value = next === system ? "auto" : next;
  const year = 60 * 60 * 24 * 365;
  document.cookie = `${COOKIE}=${value}; path=/; max-age=${year}; SameSite=Lax; Secure`;
  if (value === "auto") delete document.documentElement.dataset.scheme;
  else document.documentElement.dataset.scheme = next;
  emit();
}

/**
 * Flip light/dark, for this page and the forum alike. Like the forum's own
 * switch, a choice that matches the system is stored as "auto", so it keeps
 * following the system from then on. Given the point it came from (the
 * switch), the new mode spreads out from there as a circle.
 */
export function toggleScheme(from?: { x: number; y: number }): void {
  const next: Scheme = current() === "dark" ? "light" : "dark";
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!from || calm || typeof document.startViewTransition !== "function") {
    store(next);
    return;
  }
  const root = document.documentElement;
  root.classList.add("scheme-transition");
  const transition = document.startViewTransition(() => store(next));
  const radius = Math.hypot(Math.max(from.x, innerWidth - from.x), Math.max(from.y, innerHeight - from.y));
  transition.ready
    .then(() =>
      root.animate(
        { clipPath: [`circle(0px at ${from.x}px ${from.y}px)`, `circle(${radius}px at ${from.x}px ${from.y}px)`] },
        { duration: 560, easing: "cubic-bezier(0.2, 0, 0, 1)", pseudoElement: "::view-transition-new(root)" },
      ),
    )
    .catch(() => {});
  transition.finished.finally(() => root.classList.remove("scheme-transition"));
}

/** Subscribe outside React (the particle canvas). */
export function onSchemeChange(listener: () => void): () => void {
  return subscribe(listener);
}

export { current as currentScheme };
