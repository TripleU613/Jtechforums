import sealed from "virtual:taglines";
import { opener } from "./open.ts";
import "./styles.scss";

/**
 * The landing page's runtime: the line under the logo changes on a timer,
 * decoding from random characters into the next line the way the home page's
 * eyebrows do.
 *
 * The lines arrive sealed (see `sealed.ts`), so each one is opened during the
 * hold before it is due rather than all of them up front.
 */

/** How long a line holds before the next one comes in. */
const ROTATE_MS = 7000;
/** Frames, and the gap between them, of the decode. */
const FRAMES = 26;
const FRAME_MS = 28;
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#*_";

function need<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (element === null) throw new Error(`landing: missing ${selector}`);
  return element;
}

const line = need<HTMLElement>(".landing-line-text");
const announcer = need<HTMLElement>(".landing-line-live");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

/** mulberry32: small, fast, and good enough to spread a clock seed out. */
function seeded(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = seeded(Date.now());

function gcd(a: number, b: number): number {
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}

/**
 * A stride coprime with the list length, so stepping by it visits every line
 * once before any repeats. Seeding the start and the stride from the clock
 * means a reload takes a different route through the whole list.
 */
function stride(length: number): number {
  if (length < 3) return 1;
  let step = 1 + Math.floor(random() * (length - 1));
  while (gcd(step, length) !== 1) step = (step % (length - 1)) + 1;
  return step;
}

const count = sealed.lines.length;
const open = opener(sealed);
const step = stride(count);
let index = Math.floor(random() * count);

/** Cancels a decode still running when the next one starts. */
let decoding = 0;

/**
 * Settles random characters into the next line, left to right. The live region
 * gets the line once it has settled, so a screen reader is never read the noise.
 */
function changeover(next: string): void {
  const run = ++decoding;
  if (reduceMotion.matches) {
    line.textContent = next;
    announcer.textContent = next;
    return;
  }
  line.classList.add("is-decoding");
  let frame = 0;
  const tick = () => {
    if (run !== decoding) return;
    frame += 1;
    const settled = Math.floor((frame / FRAMES) * next.length);
    line.textContent = [...next]
      .map((ch, i) => (i < settled || ch === " " ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
      .join("");
    if (frame < FRAMES) {
      window.setTimeout(() => requestAnimationFrame(tick), FRAME_MS);
    } else {
      line.textContent = next;
      line.classList.remove("is-decoding");
      announcer.textContent = next;
    }
  };
  tick();
}

/** The line the next beat will show, once it has come open. */
let upcoming: string | undefined;
let opening = false;

function lookAhead(): void {
  if (opening || upcoming !== undefined) return;
  opening = true;
  void open((index + step) % count).then(
    (text) => {
      upcoming = text;
      opening = false;
    },
    () => {
      // The next beat asks again.
      opening = false;
    },
  );
}

const rotating = window.setInterval(() => {
  if (upcoming === undefined) {
    // Still opening: hold this line another beat rather than decode into nothing.
    lookAhead();
    return;
  }
  index = (index + step) % count;
  const text = upcoming;
  upcoming = undefined;
  changeover(text);
  lookAhead();
}, ROTATE_MS);

// The page ships with the description already showing, so there is something
// to read while this visit's first line comes open.
void open(index).then(
  (text) => {
    changeover(text);
    lookAhead();
  },
  () => {
    // No crypto.subtle (an insecure origin): keep the line the page was served.
    window.clearInterval(rotating);
  },
);
