import { css } from "./css.ts";

/** The inner pages: About, eGate, Contact, the legal pages and the notices. */
export default css`
  .page {
    width: min(1240px, calc(100% - 96px));
    margin-inline: auto;
  }
  .page .eyebrow {
    text-transform: uppercase;
  }

  .page-hero {
    max-width: 880px;
  }
  .page-hero-center {
    margin: 48px auto 0;
    text-align: center;
  }
  .page-hero-center .eyebrow {
    justify-content: center;
  }
  .page-title {
    margin-top: 18px;
    font-size: clamp(40px, 6vw, 72px);
    font-weight: 650;
    line-height: 1.02;
    letter-spacing: -0.045em;
    text-wrap: balance;
  }
  .lede {
    margin-top: 22px;
    color: var(--ink-muted);
    font-size: clamp(16px, 1.5vw, 19px);
    line-height: 1.6;
    text-wrap: pretty;
  }
  .page-hero-center .lede {
    margin-inline: auto;
    max-width: 720px;
  }

  .page-stats {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 24px 72px;
    margin-top: 52px;
  }
  .page-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .page-stat strong {
    font-size: 44px;
    font-weight: 600;
    line-height: 1;
    letter-spacing: -0.04em;
    font-variant-numeric: tabular-nums;
  }
  .page-stats .page-stat-label {
    order: 2;
  }
  .page-stat-label {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 1.9px;
    text-transform: uppercase;
    color: var(--ink-subtle);
  }
  .page-stat-detail {
    color: var(--ink-subtle);
    font-size: 13px;
  }
  .page-footnote {
    margin-top: 22px;
    text-align: center;
    color: var(--ink-subtle);
    font-size: 12px;
  }

  .page-section {
    margin-top: 104px;
  }
  .page-section-last {
    margin-bottom: 32px;
  }
  .page-section-head {
    margin-bottom: 28px;
  }
  .page-section-head h2 {
    margin-top: 12px;
    font-size: clamp(28px, 3.4vw, 42px);
    letter-spacing: -0.035em;
    line-height: 1.15;
    text-wrap: balance;
  }

  .page-panel {
    padding: clamp(24px, 4vw, 44px);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    background: var(--surface);
  }
  .page-prose p {
    max-width: 820px;
    color: var(--ink-muted);
    font-size: 17px;
    line-height: 1.75;
  }
  .page-prose p + p {
    margin-top: 16px;
  }

  .page-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
    gap: 16px;
  }
  .page-card {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 28px;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    background: var(--surface);
    transition: border-color var(--motion);
  }
  .page-card:hover {
    border-color: var(--border-strong);
  }
  .page-card h3 {
    font-size: 18px;
    font-weight: 600;
    letter-spacing: -0.015em;
  }
  .page-card p {
    color: var(--ink-muted);
    font-size: 14.5px;
    line-height: 1.65;
  }
  .page-card-icon {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    margin-bottom: 4px;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--fill);
  }
  .page-card-stat {
    align-items: center;
    text-align: center;
  }
  .page-card-stat .page-stat strong {
    font-size: 36px;
  }
  .page-link {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-top: auto;
    padding-top: 6px;
    font-size: 13px;
    font-weight: 550;
  }
  .page-link:hover {
    color: var(--ink-muted);
  }

  .page-columns {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 32px;
  }
  .page-columns h3 {
    font-size: 18px;
    font-weight: 600;
  }
  .page-columns p {
    margin-top: 10px;
    color: var(--ink-muted);
    font-size: 15px;
    line-height: 1.65;
  }
  .page-legal-line {
    margin-top: 32px;
    padding-top: 18px;
    border-top: 1px solid var(--border);
    color: var(--ink-subtle);
    font-size: 12px;
    line-height: 1.7;
  }
  .page-legal-line a,
  .contact-alternatives a,
  .notice a:not(.button) {
    color: var(--ink);
    text-decoration: underline;
    text-decoration-color: var(--border-strong);
    text-underline-offset: 3px;
  }

  .page-cta {
    position: relative;
    overflow: hidden;
    isolation: isolate;
    padding: clamp(36px, 6vw, 72px) clamp(24px, 5vw, 60px);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    background:
      radial-gradient(ellipse at 80% 110%, var(--glow), transparent 65%),
      var(--surface);
    text-align: center;
  }
  .page-cta .eyebrow {
    justify-content: center;
  }
  .page-cta h2 {
    margin: 14px auto 0;
    max-width: 720px;
    font-size: clamp(30px, 4vw, 48px);
    letter-spacing: -0.04em;
    line-height: 1.1;
    text-wrap: balance;
  }
  .page-cta p {
    margin: 16px auto 0;
    max-width: 620px;
    color: var(--ink-muted);
    font-size: 16px;
    line-height: 1.65;
  }
  .page-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 28px;
  }
  .page-cta .page-actions,
  .page-actions-center {
    justify-content: center;
  }
  .page-cta-split {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    gap: 48px;
    align-items: center;
    text-align: start;
  }
  .page-cta-split .eyebrow,
  .page-cta-split .page-actions {
    justify-content: flex-start;
  }
  .page-cta-split h2,
  .page-cta-split p {
    margin-inline: 0;
  }
  .page-checklist {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .page-checklist li {
    display: flex;
    gap: 14px;
    padding: 16px 0;
    border-bottom: 1px solid var(--border);
    color: var(--ink-muted);
    font-size: 15px;
    line-height: 1.55;
  }
  .page-checklist li:first-child {
    border-top: 1px solid var(--border);
  }
  .page-checklist svg {
    flex-shrink: 0;
    margin-top: 2px;
    color: var(--ink);
  }
  .page-note {
    max-width: 560px;
    margin-top: 28px;
    padding: 16px 20px;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    background: var(--fill);
    color: var(--ink-muted);
    font-size: 14px;
    line-height: 1.6;
  }

  /* eGate */
  .egate-hero {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
    gap: 56px;
    align-items: center;
    margin-top: 40px;
  }
  .egate-hero .page-title {
    font-size: clamp(40px, 5vw, 64px);
  }
  .egate-hero-visual {
    display: flex;
    justify-content: center;
  }
  .egate-phone {
    width: 15.5rem;
    max-width: 100%;
    filter: drop-shadow(0 30px 60px var(--shade-a40, rgb(0 0 0 / 40%)));
  }
  .egate-phone-body {
    fill: var(--phone-body);
  }
  .egate-phone-glass {
    fill: #050505;
  }
  .egate-phone-key {
    fill: var(--phone-key);
  }
  .egate-highlights {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-auto-rows: auto;
    gap: 16px;
  }
  .egate-highlight {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 28px;
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    background: var(--surface);
  }
  .egate-highlight h3 {
    font-size: 20px;
    font-weight: 600;
    letter-spacing: -0.02em;
  }
  .egate-highlight > p {
    color: var(--ink-muted);
    font-size: 14.5px;
    line-height: 1.6;
  }
  .egate-screen {
    height: 22rem;
    margin-top: auto;
    padding: 14px;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    background: #000;
  }
  .egate-shot {
    width: 100%;
    margin-top: auto;
    object-fit: cover;
    object-position: top left;
    max-height: 22rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
  }
  .password-badge {
    margin-top: auto;
    padding: 24px;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    background: var(--fill);
    text-align: center;
  }
  .password-badge-icon {
    display: grid;
    place-items: center;
    width: 60px;
    height: 60px;
    margin: 0 auto;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-md);
  }
  .password-badge-title {
    margin-top: 14px;
    font-size: 17px;
    font-weight: 600;
  }
  .password-badge-kicker {
    margin-top: 4px;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--ink-subtle);
  }
  .password-badge ul {
    display: grid;
    gap: 6px;
    margin: 16px 0 0;
    padding: 0;
    list-style: none;
    color: var(--ink-muted);
    font-size: 13px;
  }
  .password-badge li::before {
    content: "";
    display: inline-block;
    width: 5px;
    height: 5px;
    margin-inline-end: 8px;
    border-radius: 50%;
    background: var(--ink);
    vertical-align: middle;
  }
  .demo-video {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .demo-video video {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: var(--radius-md);
    background: #000;
  }
  .demo-video-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .demo-video-overlay button,
  .demo-video-overlay a {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border: 1px solid rgb(255 255 255 / 25%);
    border-radius: var(--radius-control);
    background: rgb(0 0 0 / 70%);
    color: #fff;
    font-size: 11px;
    font-weight: 600;
  }

  /* Contact */
  .contact-form {
    max-width: 860px;
    margin: 48px auto 0;
  }
  .contact-fields {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
  }
  .field {
    display: grid;
    gap: 8px;
  }
  .field > span {
    font-size: 13px;
    font-weight: 600;
  }
  .field-wide {
    grid-column: 1 / -1;
  }
  .field input,
  .field textarea {
    width: 100%;
    padding: 13px 16px;
    border: 1px solid var(--border-strong);
    border-radius: min(var(--radius-control), var(--radius-md));
    background: var(--fill);
    color: var(--ink);
    font: inherit;
    font-size: 16px;
    transition: border-color var(--motion);
  }
  .field textarea {
    resize: vertical;
    min-height: 140px;
  }
  .field input::placeholder,
  .field textarea::placeholder {
    color: var(--ink-subtle);
  }
  .field input:focus,
  .field textarea:focus {
    border-color: var(--ink-subtle);
  }
  .contact-submit {
    width: 100%;
    margin-top: 24px;
  }
  .contact-submit:disabled {
    cursor: progress;
    opacity: 0.7;
  }
  .contact-fineprint {
    margin-top: 14px;
    text-align: center;
    color: var(--ink-subtle);
    font-size: 12px;
  }
  .honeypot {
    position: absolute;
    left: -10000px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }
  .notice {
    margin-top: 20px;
    padding: 16px 20px;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-lg);
    background: var(--fill);
    color: var(--ink-muted);
    font-size: 14px;
    line-height: 1.6;
  }
  .notice strong {
    color: var(--ink);
  }
  .notice p + p,
  .notice strong + p {
    margin-top: 8px;
  }
  .notice-ok {
    color: var(--ink);
  }
  .notice-error {
    border-color: var(--danger);
  }
  .notice-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px 24px;
    margin-top: 14px !important;
  }
  .contact-alternatives {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 6px 12px;
    margin: 28px 0 24px;
    color: var(--ink-subtle);
    font-size: 13px;
  }

  /* Legal */
  .legal-page .legal {
    max-width: 960px;
    margin: 48px auto 0;
  }
  .legal section + section {
    margin-top: 28px;
    padding-top: 28px;
    border-top: 1px solid var(--border);
  }
  .legal h2 {
    font-size: 22px;
    letter-spacing: -0.02em;
    line-height: 1.3;
  }
  .legal p,
  .legal li {
    color: var(--ink-muted);
    font-size: 14.5px;
    line-height: 1.75;
  }
  .legal p {
    margin-top: 12px;
  }
  .legal ul {
    display: grid;
    gap: 8px;
    margin: 12px 0 0;
    padding-inline-start: 20px;
    list-style: disc;
  }

  /* Notices */
  .notice-page {
    display: grid;
    align-content: center;
    min-height: 52vh;
  }

  @media (max-width: 1000px) {
    .egate-hero,
    .page-cta-split {
      grid-template-columns: 1fr;
    }
    .egate-highlights {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 760px) {
    .page {
      width: calc(100% - 40px);
    }
    .page-hero-center {
      margin-top: 24px;
    }
    .page-section {
      margin-top: 72px;
    }
    .page-stats {
      gap: 28px 40px;
    }
    .page-stat strong {
      font-size: 34px;
    }
    .page-columns,
    .contact-fields {
      grid-template-columns: 1fr;
    }
    .page-card {
      padding: 24px;
    }
    .egate-hero {
      gap: 40px;
      margin-top: 16px;
    }
    .page-actions .button {
      flex: 1 1 auto;
    }
  }
`;
