import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Scroll-driven motion runs on wide screens, and only for people who haven't asked for less. */
export const DESKTOP_MOTION = "(min-width: 1100px) and (prefers-reduced-motion: no-preference)";
export const MOTION = "(prefers-reduced-motion: no-preference)";

export { gsap, ScrollTrigger };
