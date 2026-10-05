import { css } from "./css.ts";

/** The forum's look on top of the original layout: ink buttons, the wordmark per theme, greyscale pictures. */
export default css`
  ::selection {
    background: var(--ink);
    color: var(--on-ink);
  }
  a:focus-visible,
  button:focus-visible,
  input:focus-visible,
  textarea:focus-visible,
  summary:focus-visible {
    outline: 2px solid var(--ink);
    outline-offset: 3px;
  }

  /* Buttons: the inverse of the page, as on the forum */
  .button {
    background: var(--ink);
    border-color: var(--ink);
    color: var(--on-ink);
    box-shadow: none;
    font-weight: 600;
    transition:
      background-color var(--motion),
      border-color var(--motion),
      color var(--motion),
      transform var(--motion);
  }
  .button:hover {
    background: var(--ink-hover);
    border-color: var(--ink-hover);
    color: var(--on-ink);
    box-shadow: none;
  }
  .button-small,
  .button-ghost {
    background: transparent;
    color: var(--ink);
    border: 1px solid var(--border-strong);
  }
  .button-small:hover,
  .button-ghost:hover {
    background: var(--hover);
    border-color: var(--ink-subtle);
    color: var(--ink);
  }
  .text-link:hover {
    color: var(--ink-muted);
  }

  /* The wordmark is white artwork: black on the light theme */
  .logo,
  .brand img {
    filter: var(--logo-filter);
    mix-blend-mode: normal;
  }
  .hero-brand-logo {
    filter: var(--logo-filter) drop-shadow(0 2px 20px var(--glow));
  }

  /* One picture per mode */
  .only-light {
    display: var(--only-light) !important;
  }
  .only-dark {
    display: var(--only-dark) !important;
  }

  /* Pictures in black and white */
  .rail-app-wall img,
  .rail-phone video,
  .demo-video video,
  .egate-shot {
    filter: var(--image-filter);
  }

  /* Light / dark switch, shared with the forum */
  .scheme-toggle {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    padding: 0;
    border: 1px solid transparent;
    border-radius: var(--radius-control);
    background: transparent;
    color: var(--ink-muted);
  }
  .scheme-toggle:hover {
    background: var(--hover);
    color: var(--ink);
  }
  .label-short {
    display: none;
  }
  @media (max-width: 420px) {
    .label-long {
      display: none;
    }
    .label-short {
      display: inline;
    }
  }
  .mobile-scheme {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 0;
    border: 0;
    border-top: 1px solid var(--border);
    background: none;
    color: var(--ink-muted);
    font-size: 15px;
    text-align: start;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* The story's Android, drawn in ink */
  .story-image .android-mark {
    width: 100%;
    height: 100%;
    display: block;
  }
  .android-mark-grid path {
    stroke: var(--grid);
    stroke-width: 1;
  }
  .android-mark-robot {
    fill: var(--hover);
    stroke: var(--hover);
  }
  .android-mark-ink {
    fill: var(--ink);
    opacity: 0.42;
  }

  .closing-section h2 {
    text-wrap: balance;
  }
  .page .local-notice {
    width: auto;
  }

  .faq-link {
    color: var(--ink);
    font-weight: 550;
    text-decoration: underline;
    text-decoration-color: var(--border-strong);
    text-underline-offset: 3px;
    white-space: nowrap;
  }
  .faq-link:hover {
    text-decoration-color: currentColor;
  }

  /* Member projects */
  .projects-section {
    padding-block: 100px;
  }
  .projects-section .section-top h2 {
    font-size: 45px;
  }
  .project-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .project {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 12px;
    height: 100%;
    padding: 28px 28px 24px;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    background: var(--surface);
    transition:
      border-color var(--motion),
      background-color var(--motion);
  }
  .project:hover {
    border-color: var(--border-strong);
    background: var(--hover);
  }
  .project > svg {
    position: absolute;
    top: 26px;
    right: 24px;
    color: var(--ink-subtle);
    transition: transform var(--motion);
  }
  .project:hover > svg {
    color: var(--ink);
    transform: translateX(3px);
  }
  .project-kind {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 1.6px;
    text-transform: uppercase;
    color: var(--ink-subtle);
  }
  .project h3 {
    font-size: 22px;
    font-weight: 600;
    letter-spacing: -0.02em;
  }
  .project p {
    color: var(--ink-muted);
    font-size: 15px;
    line-height: 1.65;
  }
  .project-author {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: auto;
    padding-top: 10px;
    font-size: 12px;
    color: var(--ink-subtle);
  }
  .project-author strong {
    color: var(--ink);
    font-weight: 550;
  }
  .project-author .avatar {
    width: 28px;
    height: 28px;
    font-size: 10px;
  }
  .project-note {
    margin-top: 28px;
    color: var(--ink-subtle);
    font-size: 13px;
  }
  .project-note a {
    color: var(--ink);
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  @media (max-width: 1000px) {
    .project-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 760px) {
    .projects-section {
      padding-block: 64px;
    }
    .projects-section .section-top {
      display: block;
    }
    .projects-section .section-top > .text-link {
      margin-top: 16px;
    }
    .projects-section .section-top h2 {
      font-size: 33px;
    }
    .project-grid {
      grid-template-columns: 1fr;
    }
    .project {
      padding: 24px 22px 20px;
    }
  }
`;
