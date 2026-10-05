import { css } from "./css.ts";

/** Toasts, developer options, and the other things nobody is told about. */
export default css`
  /* Toasts (components/Toaster.tsx) */
  .toaster {
    position: fixed;
    inset: auto 0 28px;
    z-index: 80;
    display: flex;
    justify-content: center;
    pointer-events: none;
  }
  .toast {
    max-width: min(90vw, 420px);
    padding: 10px 18px;
    border-radius: 999px;
    background: var(--ink);
    color: var(--on-ink);
    font-size: 13.5px;
    line-height: 1.4;
    text-align: center;
    box-shadow: var(--shadow-menu);
    animation: toast-in 0.22s cubic-bezier(0.2, 0, 0, 1);
  }
  @keyframes toast-in {
    from {
      opacity: 0;
      transform: translateY(10px) scale(0.96);
    }
  }

  /* Developer options (components/DevOptions.tsx) */
  .hero-brand-logo {
    cursor: default;
    -webkit-user-select: none;
    user-select: none;
    touch-action: manipulation;
    -webkit-touch-callout: none;
  }
  .dev-panel {
    position: fixed;
    left: 16px;
    bottom: 16px;
    z-index: 70;
    width: min(320px, calc(100vw - 32px));
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-lg);
    background: var(--surface);
    color: var(--ink);
    box-shadow: var(--shadow-card);
    overflow: hidden;
    animation: toast-in 0.25s cubic-bezier(0.2, 0, 0, 1);
  }
  .dev-head {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 12px 14px;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 1.2px;
    text-transform: uppercase;
  }
  .dev-head span {
    flex: 1;
    text-align: start;
  }
  .dev-body {
    border-top: 1px solid var(--border);
  }
  .dev-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    width: 100%;
    padding: 11px 14px;
    text-align: start;
    transition: background-color var(--motion);
  }
  .dev-row:hover {
    background: var(--hover);
  }
  .dev-row span {
    display: grid;
    gap: 2px;
  }
  .dev-row strong {
    font-size: 13.5px;
    font-weight: 550;
  }
  .dev-row small {
    color: var(--ink-subtle);
    font-size: 11.5px;
  }
  .dev-switch {
    position: relative;
    flex-shrink: 0;
    width: 34px;
    height: 20px;
    border: 1px solid var(--border-strong);
    border-radius: 999px;
    background: var(--fill);
    transition: background-color var(--motion);
  }
  .dev-switch::after {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--ink-subtle);
    transition: transform var(--motion), background-color var(--motion);
  }
  .dev-switch.is-on {
    background: var(--ink);
  }
  .dev-switch.is-on::after {
    background: var(--on-ink);
    transform: translateX(14px);
  }
  .dev-off {
    width: 100%;
    padding: 12px 14px;
    border-top: 1px solid var(--border);
    color: var(--ink-muted);
    font-size: 12.5px;
    text-align: start;
  }
  .dev-off:hover {
    color: var(--ink);
  }
  /* Show layout bounds: every box gets its outline */
  .dev-bounds body *:not(.dev-panel, .dev-panel *, .toaster, .toaster *) {
    outline: 1px dashed color-mix(in srgb, var(--ink) 38%, transparent) !important;
    outline-offset: -1px;
  }
  /* Pointer location */
  .dev-pointer {
    position: fixed;
    inset: 0;
    z-index: 75;
    pointer-events: none;
  }
  .dev-pointer-strip {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 18px;
    padding: 6px 12px;
    background: color-mix(in srgb, var(--bg) 85%, transparent);
    border-bottom: 1px solid var(--border-strong);
    font-family: var(--font-mono);
    font-size: 11px;
  }
  .dev-cross-x,
  .dev-cross-y {
    position: absolute;
    top: 0;
    left: 0;
    background: var(--ink);
    opacity: 0.5;
  }
  .dev-cross-x {
    width: 100%;
    height: 1px;
  }
  .dev-cross-y {
    width: 1px;
    height: 100%;
  }
  /* Show taps */
  .dev-taps {
    position: fixed;
    inset: 0;
    z-index: 76;
    pointer-events: none;
  }
  .dev-taps i {
    position: absolute;
    width: 36px;
    height: 36px;
    margin: -18px 0 0 -18px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--ink) 30%, transparent);
    animation: tap-fade 0.65s ease-out forwards;
  }
  @keyframes tap-fade {
    to {
      opacity: 0;
      transform: scale(1.6);
    }
  }

  /* The story's Android (components/home/AndroidMark.tsx) */
  .android-eyes {
    transform-box: view-box;
    transition: transform 0.18s ease-out;
  }
  .android-eyes ellipse {
    transform-box: fill-box;
    transform-origin: center;
    transition: transform 0.08s;
  }
  .android-eyes.is-blinking ellipse {
    transform: scaleY(0.1);
  }
  .android-antenna-l,
  .android-antenna-r {
    transform-box: fill-box;
  }
  .android-antenna-l {
    transform-origin: 100% 100%;
  }
  .android-antenna-r {
    transform-origin: 0% 100%;
  }
  .android-antennae.is-twitching .android-antenna-l {
    animation: antenna-l 0.6s ease-in-out;
  }
  .android-antennae.is-twitching .android-antenna-r {
    animation: antenna-r 0.6s ease-in-out;
  }
  @keyframes antenna-l {
    25% { transform: rotate(-14deg); }
    60% { transform: rotate(9deg); }
  }
  @keyframes antenna-r {
    25% { transform: rotate(14deg); }
    60% { transform: rotate(-9deg); }
  }

  .closing-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 14px 28px;
  }

  /* The closing watermark's letters jump when the pointer finds them */
  .closing-watermark span {
    display: inline-block;
    pointer-events: auto;
  }
  @media (hover: hover) and (prefers-reduced-motion: no-preference) {
    .closing-watermark:hover span {
      animation: letter-hop 0.7s cubic-bezier(0.3, 1.6, 0.5, 1) calc(var(--i) * 60ms);
    }
  }
  @keyframes letter-hop {
    40% {
      transform: translateY(-14%);
    }
  }

  /* The flip phone buzzes once if it's left alone */
  .flip-device.is-buzzing {
    animation: buzz 0.9s linear;
  }
  @keyframes buzz {
    0%, 100% { transform: translateX(0) rotate(0); }
    10%, 30%, 50%, 70% { transform: translateX(-3px) rotate(-1deg); }
    20%, 40%, 60%, 80% { transform: translateX(3px) rotate(1deg); }
  }

  /* Back to top (components/BackToTop.tsx) */
  .back-to-top {
    position: fixed;
    right: 18px;
    bottom: 18px;
    z-index: 60;
    display: grid;
    place-items: center;
    width: 46px;
    height: 46px;
    border: 1px solid var(--border-strong);
    border-radius: 50%;
    background: var(--glass);
    -webkit-backdrop-filter: blur(12px);
    backdrop-filter: blur(12px);
    color: var(--ink);
    opacity: 0;
    transform: translateY(12px) scale(0.9);
    pointer-events: none;
    transition:
      opacity 0.25s,
      transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1.2);
  }
  .back-to-top.is-shown {
    opacity: 1;
    transform: none;
    pointer-events: auto;
  }
  .back-to-top:hover {
    background: var(--hover);
  }
  .back-to-top svg {
    position: absolute;
    inset: 3px;
    transform: rotate(-90deg);
  }
  .back-to-top circle {
    fill: none;
    stroke-width: 2;
  }
  .back-to-top-track {
    stroke: var(--border);
  }
  .back-to-top-ring {
    stroke: var(--ink);
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
    stroke-linecap: round;
  }
  @media (max-width: 760px) {
    .back-to-top {
      right: 14px;
      bottom: 14px;
    }
  }

  /* Snake on the 404 page (components/Snake.tsx) */
  .snake-section {
    display: grid;
    justify-items: center;
    gap: 16px;
    margin: 8px auto 40px;
  }
  .snake {
    display: grid;
    justify-items: center;
    gap: 18px;
    padding: 18px 18px 22px;
    border: 1px solid var(--border-strong);
    border-radius: 30px;
    background: var(--phone-body);
  }
  .snake-screen {
    position: relative;
    padding: 8px;
    border-radius: 10px;
    outline: 5px solid #050505;
    background: var(--bg);
    color: var(--ink);
  }
  .snake-bar {
    display: flex;
    justify-content: space-between;
    padding: 0 2px 6px;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 1px;
  }
  .snake canvas {
    display: block;
    width: 210px;
    height: 210px;
    border: 1px solid var(--border-strong);
    touch-action: none;
    cursor: pointer;
  }
  .snake canvas:focus-visible {
    outline: 2px solid var(--ink);
    outline-offset: 3px;
  }
  .snake-message {
    position: absolute;
    inset: auto 8px 12px;
    padding: 6px 10px;
    border-radius: 6px;
    background: var(--ink);
    color: var(--on-ink);
    font-family: var(--font-mono);
    font-size: 11px;
    text-align: center;
    pointer-events: none;
  }
  .snake-pad {
    display: grid;
    grid-template: repeat(3, 34px) / repeat(3, 34px);
    gap: 2px;
    padding: 6px;
    border-radius: 50%;
    background: var(--phone-key);
  }
  .snake-pad button {
    border-radius: 8px;
    color: var(--ink);
    font-size: 10px;
    font-weight: 700;
  }
  .snake-pad button:active {
    background: var(--active);
  }
  .snake-up { grid-area: 1 / 2; }
  .snake-left { grid-area: 2 / 1; }
  .snake-ok { grid-area: 2 / 2; border-radius: 50% !important; background: var(--phone-body) !important; }
  .snake-right { grid-area: 2 / 3; }
  .snake-down { grid-area: 3 / 2; }
  .snake-up::before,
  .snake-down::before,
  .snake-left::before,
  .snake-right::before {
    content: "";
    display: block;
    width: 0;
    height: 0;
    margin: auto;
    border: 5px solid transparent;
  }
  .snake-up::before { border-bottom-color: var(--ink-muted); margin-top: 6px; }
  .snake-down::before { border-top-color: var(--ink-muted); margin-bottom: 6px; }
  .snake-left::before { border-right-color: var(--ink-muted); margin-left: 6px; }
  .snake-right::before { border-left-color: var(--ink-muted); margin-right: 6px; }

  /* The terminal that takes commands (components/home/TerminalToy.tsx) */
  .rail-terminal {
    position: relative;
    cursor: text;
    transition: transform 0.45s cubic-bezier(0.2, 0, 0, 1);
  }
  .rail-terminal:not(.is-live)::after {
    content: "click to type";
    position: absolute;
    right: 16px;
    bottom: 12px;
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 1px;
    color: var(--ink-subtle);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .rail-terminal:hover::after,
  .rail-terminal:focus-visible::after {
    opacity: 1;
  }
  .rail-terminal.is-live {
    transform: none;
  }
  .terminal-live {
    height: 260px;
    overflow: auto;
    font-size: 12px;
    line-height: 1.7;
    white-space: pre-wrap;
    scrollbar-width: thin;
  }
  .terminal-live p {
    margin-bottom: 2px;
    color: var(--ink-muted);
  }
  .terminal-live .terminal-cmd {
    color: var(--ink);
  }
  .terminal-prompt {
    display: flex;
    gap: 10px;
    color: var(--ink);
  }
  .terminal-prompt input {
    flex: 1;
    min-width: 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: var(--ink);
    font: inherit;
    caret-color: var(--ink);
  }

  @media (prefers-reduced-motion: reduce) {
    .rail-terminal {
      transition: none;
    }
    .flip-device.is-buzzing {
      animation: none;
    }
    .toast,
    .dev-panel,
    .dev-taps i {
      animation: none;
    }
  }
`;
