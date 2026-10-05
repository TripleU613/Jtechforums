import { css } from "./css.ts";

/** Page transitions, the light/dark sweep, and the glow that follows the pointer over cards. */
export default css`
  /* Moving between pages: the old page fades, the new one rises in */
  ::view-transition-old(root) {
    animation: page-out 160ms cubic-bezier(0.4, 0, 1, 1) both;
  }
  ::view-transition-new(root) {
    animation: page-in 260ms cubic-bezier(0, 0, 0.2, 1) both;
  }
  @keyframes page-out {
    to {
      opacity: 0;
    }
  }
  @keyframes page-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
  }

  /* Light/dark: the new mode spreads out from the switch (lib/scheme.ts) */
  .scheme-transition::view-transition-old(root),
  .scheme-transition::view-transition-new(root) {
    animation: none;
    mix-blend-mode: normal;
  }
  .scheme-transition::view-transition-new(root) {
    z-index: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    ::view-transition-group(*),
    ::view-transition-old(*),
    ::view-transition-new(*) {
      animation: none !important;
    }
  }

  /* A soft light under the pointer (lib/spotlight.ts) */
  .spotlight {
    position: relative;
    isolation: isolate;
  }
  .spotlight::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: inherit;
    background: radial-gradient(
      260px circle at var(--spot-x, 50%) var(--spot-y, 50%),
      var(--spot),
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.25s;
    pointer-events: none;
  }
  @media (hover: hover) {
    .spotlight:hover::after {
      opacity: 1;
    }
  }

  .count-up {
    font-variant-numeric: tabular-nums;
  }
`;
