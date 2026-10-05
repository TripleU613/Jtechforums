import { css } from "./css.ts";
import { darkTones, lightTones } from "./tones.ts";

/**
 * The forum's look, in tokens: JTech Light and JTech Dark (black and white,
 * translucent hairlines), the squircle radii and Geist. Light by default,
 * dark when the system asks for it, and either when the visitor picked one
 * on the forum or here (<html data-scheme>, from the forced_color_mode
 * cookie).
 */

const light = css`
  color-scheme: light;
  ${lightTones}
  --bg: #ffffff;
  --surface: #ffffff;
  --surface-sunken: #fafafa;
  --fill: #ffffff;
  --hover: rgb(0 0 0 / 4%);
  --active: rgb(0 0 0 / 8%);
  --border: rgb(0 0 0 / 8%);
  --border-strong: rgb(0 0 0 / 14%);
  --ink: #000000;
  --ink-rgb: 0, 0, 0;
  --ink-muted: #666666;
  --ink-subtle: #737373;
  --on-ink: #ffffff;
  --ink-hover: #383838;
  --glow: rgb(0 0 0 / 4%);
  --grid: rgb(0 0 0 / 5%);
  --glass: rgb(255 255 255 / 72%);
  --header-bg: rgb(255 255 255 / 80%);
  --danger: #da2f35;
  --success: #297c3b;
  --shadow-menu: 0 4px 12px rgb(0 0 0 / 8%), 0 0 0 1px rgb(0 0 0 / 8%);
  --shadow-card: 0 16px 48px rgb(0 0 0 / 8%), 0 0 0 1px rgb(0 0 0 / 6%);
  --logo-filter: invert(1);
  --only-light: block;
  --only-dark: none;
  --phone-body: #e4e4e4;
  --phone-key: #c4c4c4;
  --image-filter: grayscale(1);
`;

const dark = css`
  color-scheme: dark;
  ${darkTones}
  --bg: #000000;
  --surface: #0a0a0a;
  --surface-sunken: #0a0a0a;
  --fill: rgb(255 255 255 / 4.5%);
  --hover: rgb(255 255 255 / 6%);
  --active: rgb(255 255 255 / 9%);
  --border: rgb(255 255 255 / 10%);
  --border-strong: rgb(255 255 255 / 16%);
  --ink: #ffffff;
  --ink-rgb: 255, 255, 255;
  --ink-muted: #a1a1a1;
  --ink-subtle: #8f8f8f;
  --on-ink: #000000;
  --ink-hover: #d4d4d4;
  --glow: rgb(255 255 255 / 9%);
  --grid: rgb(255 255 255 / 5%);
  --glass: rgb(10 10 10 / 62%);
  --header-bg: rgb(0 0 0 / 75%);
  --danger: #ff6166;
  --success: #62c073;
  --shadow-menu: 0 0 0 1px rgb(255 255 255 / 10%);
  --shadow-card: 0 0 0 1px rgb(255 255 255 / 12%), 0 16px 48px rgb(0 0 0 / 60%);
  --logo-filter: none;
  --only-light: none;
  --only-dark: block;
  --phone-body: #232323;
  --phone-key: #575757;
  --image-filter: grayscale(1);
`;

export default css`
  @font-face {
    font-family: "Geist";
    src: url("/home/fonts/Geist-Variable.woff2") format("woff2");
    font-weight: 100 900;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: "Geist Mono";
    src: url("/home/fonts/GeistMono-Variable.woff2") format("woff2");
    font-weight: 100 900;
    font-style: normal;
    font-display: swap;
  }

  :root {
    ${light}
    --font-sans: "Geist", ui-sans-serif, system-ui, -apple-system, "Segoe UI", roboto, "Helvetica Neue", arial, sans-serif;
    --font-mono: "Geist Mono", ui-monospace, sfmono-regular, "SF Mono", menlo, consolas, monospace;
    --radius-sm: 6px;
    --radius-md: 8px;
    --radius-lg: 13px;
    --radius-xl: 16px;
    --radius-control: 8px;
    --radius-pill: 6px;
    --radius-avatar: 30%;
    --motion: 0.18s cubic-bezier(0.2, 0, 0, 1);
    --fade: min(2.5rem, 20%);
  }

  /* A squircle hugs its corner more tightly than a circle, so it takes bigger
     radii to read the same size (as on the forum). */
  @supports (corner-shape: squircle) {
    :root {
      --radius-sm: 10px;
      --radius-md: 14px;
      --radius-lg: 22px;
      --radius-xl: 28px;
      --radius-control: 12px;
      --radius-pill: 10px;
      --radius-avatar: 50%;
    }
    * {
      corner-shape: squircle;
    }
  }

  @media (prefers-color-scheme: dark) {
    :root:not([data-scheme="light"]) {
      ${dark}
    }
  }
  :root[data-scheme="dark"] {
    ${dark}
  }

  html {
    background: var(--bg);
    color: var(--ink);
  }
  body {
    background: var(--bg);
  }
`;
