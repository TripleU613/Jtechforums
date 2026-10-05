import { toast } from "./toast.ts";

/**
 * ↑ ↑ ↓ ↓ ← → ← → B A. On the home page's wide hero the particles spell out
 * the logo (components/home/ParticleScene.tsx); anywhere else the page does
 * a barrel roll.
 */
export const KONAMI_EVENT = "jt:konami";
const CODE = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];

let handled = false;
/** The particle scene calls this when it takes the code. */
export function claimKonami(): void {
  handled = true;
}

export function startKonami(): () => void {
  let at = 0;
  const onKey = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest("input, textarea, select, [contenteditable='true'], [role='application']")) return;
    const key = event.key.toLowerCase();
    at = key === CODE[at] ? at + 1 : key === CODE[0] ? 1 : 0;
    if (at < CODE.length) return;
    at = 0;
    handled = false;
    window.dispatchEvent(new Event(KONAMI_EVENT));
    toast("Cheat code accepted.");
    if (!handled && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelector(".site-shell")?.animate(
        [{ transform: "rotate(0)" }, { transform: "rotate(360deg)" }],
        { duration: 1100, easing: "cubic-bezier(0.6, 0, 0.4, 1)" },
      );
    }
  };
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}
