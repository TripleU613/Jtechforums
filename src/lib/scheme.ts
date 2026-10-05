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

/**
 * Flip light/dark, for this page and the forum alike. Like the forum's own
 * switch, a choice that matches the system is stored as "auto", so it keeps
 * following the system from then on.
 */
export function toggleScheme(): void {
  const next: Scheme = current() === "dark" ? "light" : "dark";
  const system: Scheme = darkQuery()?.matches ? "dark" : "light";
  const value = next === system ? "auto" : next;
  const year = 60 * 60 * 24 * 365;
  document.cookie = `${COOKIE}=${value}; path=/; max-age=${year}; SameSite=Lax; Secure`;
  if (value === "auto") delete document.documentElement.dataset.scheme;
  else document.documentElement.dataset.scheme = next;
  emit();
}

/** Subscribe outside React (the particle canvas). */
export function onSchemeChange(listener: () => void): () => void {
  return subscribe(listener);
}

export { current as currentScheme };
