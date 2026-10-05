import { useSyncExternalStore } from "react";
import { gsap } from "gsap";

/**
 * Developer options, Android style: tap the big logo on the home page seven
 * times. Each option does what its namesake on a phone does, to this page:
 * outlines every box, slows or stops the animations, marks every tap, or
 * tracks the pointer. Kept for the visit (sessionStorage).
 */

export interface DevOptions {
  unlocked: boolean;
  bounds: boolean;
  taps: boolean;
  pointer: boolean;
  /** Animator duration scale: 0 (off), 0.5, 1, 1.5, 2, 5, 10 */
  scale: number;
}

export const SCALES = [0, 0.5, 1, 1.5, 2, 5, 10] as const;
const KEY = "jt-dev-options";
const OFF: DevOptions = { unlocked: false, bounds: false, taps: false, pointer: false, scale: 1 };

function load(): DevOptions {
  try {
    const saved = sessionStorage.getItem(KEY);
    return saved ? { ...OFF, ...(JSON.parse(saved) as Partial<DevOptions>) } : OFF;
  } catch {
    return OFF;
  }
}

let options: DevOptions = typeof window === "undefined" ? OFF : load();
const listeners = new Set<() => void>();
let syncTimer = 0;

/** Animations run at 1/scale speed; "off" makes them finish at once. */
export function animationScale(): number {
  return options.unlocked ? options.scale : 1;
}

function applyScale(): void {
  const scale = animationScale();
  const rate = scale === 0 ? 1000 : 1 / scale;
  gsap.globalTimeline.timeScale(rate);
  for (const animation of document.getAnimations()) animation.playbackRate = rate;
}

function apply(): void {
  const root = document.documentElement;
  root.classList.toggle("dev-bounds", options.unlocked && options.bounds);
  applyScale();
  clearInterval(syncTimer);
  // CSS animations that start later need the rate too.
  if (animationScale() !== 1) syncTimer = window.setInterval(applyScale, 400);
}

export function setDevOptions(patch: Partial<DevOptions>): void {
  options = { ...options, ...patch };
  try {
    if (options.unlocked) sessionStorage.setItem(KEY, JSON.stringify(options));
    else sessionStorage.removeItem(KEY);
  } catch {
    // private windows: the options last until the page closes
  }
  apply();
  for (const listener of listeners) listener();
}

export function useDevOptions(): DevOptions {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => options,
    () => OFF,
  );
}

if (typeof window !== "undefined") queueMicrotask(apply);
