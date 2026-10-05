import tokens from "./tokens.ts";
import reset from "./reset.ts";
import honors from "./layout/honors.ts";
import base from "./layout/base.ts";
import scenes from "./layout/scenes.ts";
import phones from "./layout/phones.ts";
import theme from "./theme.ts";
import pages from "./pages.ts";
import motion from "./motion.ts";
import areas from "./areas.ts";
import quirks from "./quirks.ts";

/**
 * The site's one stylesheet, in cascade order. Each module is a css``
 * template literal; build/plugins.ts hands the result to Vite as a single
 * CSS file.
 *
 * - tokens: JTech Light / JTech Dark, radii, Geist (and tones.ts, the
 *   layout's greys on both themes)
 * - reset
 * - layout/*: the home page, layered base -> scenes -> phones (later rules
 *   refine earlier ones, so keep the order)
 * - theme: the forum's buttons, wordmark and pictures over the layout
 * - pages: About, eGate, Contact, the legal pages and notices
 * - motion: page transitions, the light/dark sweep, the card spotlight
 * - areas: the home page's categories, phones strip, flip-phone demo and palette
 * - quirks: toasts, developer options and the other hidden things
 */
export default function stylesheet(): string {
  return [tokens, reset, honors, base, scenes, phones, theme, pages, areas, quirks, motion].join("\n");
}
