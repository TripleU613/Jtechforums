import { css } from "./css.ts";

/** The home page's newer areas: categories, the phones strip, the flip-phone demo, the palette. */
export default css`
  /* The live pulse in the numbers strip (components/home/CommunityStrip.tsx) */
  .strip-pulse {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
    color: var(--ink);
    font-weight: 550;
  }
  .strip-pulse > i {
    flex-shrink: 0;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--ink);
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--ink) 40%, transparent);
  }
  .strip-pulse > span {
    animation: pulse-fact 0.45s cubic-bezier(0.2, 0, 0, 1);
  }
  @media (prefers-reduced-motion: no-preference) {
    .strip-pulse > i {
      animation: pulse-dot 2s ease-out infinite;
    }
  }
  @keyframes pulse-dot {
    0% {
      box-shadow: 0 0 0 0 color-mix(in srgb, var(--ink) 45%, transparent);
    }
    100% {
      box-shadow: 0 0 0 8px transparent;
    }
  }
  @keyframes pulse-fact {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
  }

  /* Four tabs on a phone: one row that scrolls sideways */
  @media (max-width: 760px) {
    .topic-tabs {
      flex-wrap: nowrap;
      justify-content: flex-start;
      gap: 4px;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .topic-tabs::-webkit-scrollbar {
      display: none;
    }
    .topic-tabs button {
      flex-shrink: 0;
      white-space: nowrap;
    }
    .topic-tabs > span {
      display: none;
    }
  }

  /* Find your corner */
  .corners-section {
    padding-block: 100px 40px;
  }
  .corners-section .section-top h2 {
    font-size: 45px;
  }
  .corners-section .section-top h2 span {
    color: var(--ink-subtle);
  }
  .corner-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
  }
  .corner-grid > li:first-child {
    grid-column: span 2;
  }
  .corner {
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 100%;
    padding: 22px 22px 18px;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    background: var(--surface);
    transition: border-color var(--motion), transform var(--motion);
  }
  .corner:hover {
    border-color: var(--border-strong);
  }
  .corner:active {
    transform: scale(0.99);
  }
  .corner-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  .corner-icon {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--fill);
    transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1.4);
  }
  .corner:hover .corner-icon {
    transform: rotate(-8deg) scale(1.06);
  }
  .corner-new {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.8px;
    color: var(--ink-muted);
    padding: 3px 8px;
    border: 1px solid var(--border);
    border-radius: var(--radius-pill);
  }
  .corner h3 {
    font-size: 18px;
    font-weight: 600;
    letter-spacing: -0.015em;
  }
  .corner p {
    color: var(--ink-muted);
    font-size: 14px;
    line-height: 1.55;
  }
  .corner-subs {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .corner-subs span {
    padding: 3px 9px;
    border: 1px solid var(--border);
    border-radius: var(--radius-pill);
    color: var(--ink-subtle);
    font-size: 11.5px;
  }
  .corner-count {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    padding-top: 12px;
    border-top: 1px solid var(--border);
    color: var(--ink-subtle);
    font-size: 12.5px;
  }
  .corner-count svg {
    transition: transform var(--motion);
  }
  .corner:hover .corner-count {
    color: var(--ink);
  }
  .corner:hover .corner-count svg {
    transform: translateX(3px);
  }

  /* Phones people ask about */
  .phone-marquee {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-top: 40px;
  }
  .phone-marquee-window {
    flex: 1;
    min-width: 0;
    overflow: hidden;
  }
  .phone-marquee-label {
    flex-shrink: 0;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 1.9px;
    color: var(--ink-subtle);
  }
  .phone-marquee-track {
    display: flex;
    width: max-content;
  }
  .phone-marquee-track ul {
    display: flex;
    gap: 10px;
    padding-inline-end: 10px;
  }
  .phone-marquee-track a {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 14px;
    border: 1px solid var(--border);
    border-radius: var(--radius-control);
    color: var(--ink-muted);
    font-size: 13px;
    white-space: nowrap;
    transition: color var(--motion), border-color var(--motion), background-color var(--motion);
  }
  .phone-marquee-track a:hover {
    color: var(--ink);
    border-color: var(--border-strong);
    background: var(--hover);
  }
  @media (prefers-reduced-motion: no-preference) {
    .phone-marquee-window {
      mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
    }
    .phone-marquee-track {
      animation: marquee 48s linear infinite;
    }
    .phone-marquee:hover .phone-marquee-track,
    .phone-marquee:focus-within .phone-marquee-track {
      animation-play-state: paused;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .phone-marquee {
      flex-wrap: wrap;
    }
    .phone-marquee-track ul + ul {
      display: none;
    }
    .phone-marquee-track,
    .phone-marquee-track ul {
      flex-wrap: wrap;
      width: auto;
    }
  }
  @keyframes marquee {
    to {
      transform: translateX(-50%);
    }
  }


  /* On a flip phone? (components/home/FlipDemo.tsx) */
  .flip-section {
    display: grid;
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    gap: 64px;
    align-items: center;
    padding-block: 110px;
  }
  .flip-copy h2 {
    margin-top: 14px;
    font-size: 45px;
    letter-spacing: -2px;
    line-height: 1.1;
  }
  .flip-copy h2 span {
    color: var(--ink-subtle);
  }
  .flip-copy > p {
    max-width: 540px;
    margin-top: 20px;
    color: var(--ink-muted);
    font-size: 16px;
    line-height: 1.7;
  }
  .flip-copy .flip-try {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--ink-subtle);
    font-size: 13.5px;
  }
  .flip-device {
    --lid-h: 384px;
    position: relative;
    width: 268px;
    margin-inline: auto;
    perspective: 1400px;
    filter: drop-shadow(0 30px 50px var(--shade-a40, rgb(0 0 0 / 40%)));
  }
  .flip-lid {
    position: relative;
    z-index: 2;
    height: var(--lid-h);
    transform-style: preserve-3d;
    transform-origin: 50% calc(100% + 8px);
    transition: transform 0.75s cubic-bezier(0.3, 1.25, 0.5, 1);
  }
  .flip-device.is-closed .flip-lid {
    transform: rotateX(-180deg);
  }
  .flip-lid-front,
  .flip-lid-back {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    border: 1px solid var(--border-strong);
    background: var(--phone-body);
  }
  .flip-lid-front {
    padding: 14px 14px 20px;
    border-radius: 30px 30px 12px 12px;
  }
  .flip-lid-back {
    display: grid;
    place-items: center;
    border-radius: 12px 12px 30px 30px;
    transform: rotateX(180deg);
    cursor: pointer;
  }
  .flip-outer-screen {
    display: grid;
    place-items: center;
    gap: 2px;
    width: 110px;
    height: 70px;
    border-radius: 12px;
    background: #050505;
    color: #f2f2f2;
    font-family: var(--font-mono);
  }
  .flip-outer-screen strong {
    font-size: 18px;
    font-weight: 500;
  }
  .flip-outer-screen small {
    font-size: 8px;
    letter-spacing: 2px;
    text-transform: uppercase;
    opacity: 0.6;
  }
  .flip-earpiece {
    display: block;
    width: 46px;
    height: 5px;
    margin: 0 auto 12px;
    border-radius: 3px;
    background: var(--phone-key);
  }
  .flip-screen {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 240px;
    height: 320px;
    overflow: hidden;
    border-radius: 8px;
    outline: 5px solid #050505;
    background: var(--bg);
    color: var(--ink);
    font-size: 12px;
    cursor: pointer;
  }
  .flip-screen:focus-visible {
    box-shadow: 0 0 0 7px var(--ink);
    outline-offset: 0;
  }
  .fs-status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 8px;
    border-bottom: 1px solid var(--border);
    font-family: var(--font-mono);
    font-size: 10px;
  }
  .fs-bars {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    height: 9px;
  }
  .fs-bars i {
    width: 3px;
    background: var(--ink);
  }
  .fs-bars i:nth-child(1) { height: 3px; }
  .fs-bars i:nth-child(2) { height: 5px; }
  .fs-bars i:nth-child(3) { height: 7px; }
  .fs-bars i:nth-child(4) { height: 9px; }
  .fs-body {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
  }
  .fs-tabs {
    display: flex;
    gap: 14px;
    padding: 6px 8px 0;
    border-bottom: 1px solid var(--border);
    font-size: 11px;
  }
  .fs-tabs span {
    padding-bottom: 4px;
    color: var(--ink-subtle);
  }
  .fs-tabs .is-active {
    color: var(--ink);
    font-weight: 600;
    box-shadow: inset 0 -2px 0 var(--ink);
  }
  .fs-title {
    padding: 7px 8px;
    border-bottom: 1px solid var(--border);
    font-weight: 700;
  }
  .fs-list {
    flex: 1;
    overflow: hidden auto;
    scrollbar-width: none;
  }
  .fs-row {
    display: grid;
    gap: 2px;
    padding: 7px 8px;
    border-bottom: 1px solid var(--border);
  }
  .fs-row-title {
    display: -webkit-box;
    overflow: hidden;
    font-size: 12px;
    font-weight: 600;
    line-height: 1.25;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .fs-row-meta {
    color: var(--ink-subtle);
    font-size: 10px;
  }
  .fs-row-selected {
    background: var(--ink);
    color: var(--on-ink);
  }
  .fs-row-selected .fs-row-meta {
    color: inherit;
    opacity: 0.7;
  }
  .fs-detail {
    gap: 6px;
    padding: 10px;
    overflow: hidden auto;
    scrollbar-width: none;
  }
  .fs-kicker {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--ink-subtle);
  }
  .fs-detail-title {
    font-size: 14px;
    font-weight: 650;
    line-height: 1.3;
  }
  .fs-detail-meta,
  .fs-detail-sub {
    color: var(--ink-muted);
    font-size: 11px;
    line-height: 1.45;
  }
  .fs-detail-hint {
    margin-top: auto;
    padding-top: 8px;
    color: var(--ink-subtle);
    font-size: 10px;
  }
  .fs-help {
    margin: 0;
    padding: 2px 0;
  }
  .fs-help div {
    display: flex;
    justify-content: space-between;
    padding: 5px 8px;
    border-bottom: 1px solid var(--border);
    font-size: 11px;
  }
  .fs-help dt {
    font-family: var(--font-mono);
    font-weight: 600;
  }
  .fs-help dd {
    margin: 0;
    color: var(--ink-muted);
  }
  .fs-softkeys {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    padding: 5px 8px;
    border-top: 1px solid var(--border);
    font-size: 11px;
  }
  .fs-softkeys strong {
    font-weight: 700;
    text-transform: uppercase;
  }
  .fs-softkeys span:last-child {
    text-align: end;
  }
  .fs-toast {
    position: absolute;
    inset: auto 8px 32px;
    padding: 6px 8px;
    border-radius: 6px;
    background: var(--ink);
    color: var(--on-ink);
    font-size: 11px;
    text-align: center;
    animation: fs-toast 0.2s ease-out;
  }
  @keyframes fs-toast {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
  }
  .flip-hinge {
    position: relative;
    z-index: 1;
    height: 16px;
    margin: 0 12px;
    border-radius: 8px;
    background: linear-gradient(var(--phone-key), var(--phone-body) 70%);
    border: 1px solid var(--border);
  }
  .flip-base {
    display: flex;
    flex-direction: column;
    height: var(--lid-h);
    padding: 18px 18px 22px;
    border: 1px solid var(--border-strong);
    border-radius: 12px 12px 32px 32px;
    background: var(--phone-body);
  }
  .flip-key,
  .flip-ok,
  .flip-dir {
    border: 0;
    color: var(--ink);
    transition: transform 0.12s, filter 0.12s;
  }
  .flip-key.is-pressed,
  .flip-ok.is-pressed,
  .flip-dir.is-pressed {
    transform: translateY(1px) scale(0.95);
    filter: brightness(0.85);
  }
  .flip-nav {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 8px;
  }
  .flip-soft {
    display: grid;
    place-items: center;
    width: 54px;
    height: 28px;
    border-radius: 10px 10px 14px 14px;
    background: var(--phone-key);
  }
  .flip-nav .flip-soft:last-child {
    justify-self: end;
  }
  .flip-soft-line {
    width: 18px;
    height: 3px;
    border-radius: 2px;
    background: var(--ink-subtle);
  }
  .flip-dpad {
    position: relative;
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background: var(--phone-key);
    box-shadow: inset 0 0 0 1px var(--border-strong);
  }
  .flip-dir {
    position: absolute;
    background: transparent;
  }
  .flip-dir::before {
    content: "";
    position: absolute;
    inset: 0;
    margin: auto;
    width: 0;
    height: 0;
    border: 5px solid transparent;
  }
  .flip-up,
  .flip-down {
    left: 30px;
    width: 36px;
    height: 30px;
  }
  .flip-up { top: 0; }
  .flip-down { bottom: 0; }
  .flip-left,
  .flip-right {
    top: 30px;
    width: 30px;
    height: 36px;
  }
  .flip-left { left: 0; }
  .flip-right { right: 0; }
  .flip-up::before { border-bottom-color: var(--ink-muted); margin-top: 6px; }
  .flip-down::before { border-top-color: var(--ink-muted); margin-bottom: 6px; }
  .flip-left::before { border-right-color: var(--ink-muted); margin-left: 6px; }
  .flip-right::before { border-left-color: var(--ink-muted); margin-right: 6px; }
  .flip-ok {
    position: absolute;
    inset: 0;
    width: 40px;
    height: 40px;
    margin: auto;
    border-radius: 50%;
    background: var(--phone-body);
    box-shadow: 0 0 0 1px var(--border-strong);
    font-size: 10px;
    font-weight: 700;
  }
  .flip-calls {
    display: flex;
    justify-content: space-between;
    margin: 12px 4px 14px;
  }
  .flip-call,
  .flip-end {
    display: grid;
    place-items: center;
    width: 54px;
    height: 24px;
    border-radius: 12px;
    background: var(--phone-key);
  }
  .flip-keys {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px 10px;
  }
  .flip-digit {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 5px;
    height: 32px;
    border-radius: 14px;
    background: var(--phone-key);
  }
  .flip-digit b {
    font-size: 14px;
    font-weight: 600;
  }
  .flip-digit small {
    color: var(--ink-subtle);
    font-size: 8px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  @media (prefers-reduced-motion: reduce) {
    .flip-lid,
    .fs-toast {
      transition: none;
      animation: none;
    }
  }
  @media (max-width: 1000px) {
    .flip-section {
      grid-template-columns: 1fr;
      gap: 48px;
    }
  }
  @media (max-width: 760px) {
    .flip-section {
      padding-block: 64px;
    }
    .flip-copy h2 {
      font-size: 33px;
    }
  }


  /* The people in the latest threads (components/home/Conversation.tsx) */
  .aside-people {
    display: grid;
    gap: 10px;
    margin-top: 22px;
  }
  .aside-people > span {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 1.6px;
    text-transform: uppercase;
    color: var(--ink-subtle);
  }
  .aside-people ul {
    display: flex;
    flex-wrap: wrap;
    padding-inline-start: 8px;
  }
  .aside-people li {
    margin-inline-start: -8px;
    transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1.4);
  }
  .aside-people li:hover {
    z-index: 1;
    transform: translateY(-4px) scale(1.12);
  }
  .aside-people .avatar {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    overflow: hidden;
    border: 2px solid var(--surface);
    border-radius: var(--radius-avatar);
    background: var(--fill);
    font-size: 10px;
  }
  .aside-people .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Keyboard shortcuts (components/Shortcuts.tsx) */
  .palette.shortcuts {
    width: min(440px, calc(100% - 32px));
    padding: 0;
  }
  .shortcuts-head {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px 18px;
    border-bottom: 1px solid var(--border);
  }
  .shortcuts-head h2 {
    flex: 1;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  .shortcuts-head button {
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    border-radius: var(--radius-control);
    color: var(--ink-subtle);
  }
  .shortcuts-head button:hover {
    background: var(--hover);
    color: var(--ink);
  }
  .shortcuts-list {
    margin: 0;
    padding: 8px 18px;
    max-height: 50vh;
    overflow: auto;
  }
  .shortcuts-list div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid var(--border);
  }
  .shortcuts-list div:last-child {
    border-bottom: 0;
  }
  .shortcuts-list dt {
    display: flex;
    gap: 4px;
  }
  .shortcuts-list dd {
    margin: 0;
    color: var(--ink-muted);
    font-size: 13.5px;
  }
  .shortcuts-foot {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 12px 18px;
    border-top: 1px solid var(--border);
    color: var(--ink-subtle);
    font-size: 12.5px;
  }

  /* Live results under the forum search (components/home/Conversation.tsx) */
  .search-live {
    margin-top: 8px;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    background: var(--surface);
    overflow: hidden;
    animation: fs-toast 0.18s ease-out;
  }
  .search-live li + li {
    border-top: 1px solid var(--border);
  }
  .search-live a {
    display: grid;
    gap: 3px;
    padding: 12px 16px;
    transition: background-color var(--motion);
  }
  .search-live a:hover {
    background: var(--hover);
  }
  .search-live strong {
    font-size: 14px;
    font-weight: 600;
  }
  .search-live span {
    overflow: hidden;
    color: var(--ink-subtle);
    font-size: 12.5px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .search-live p {
    padding: 14px 16px;
    color: var(--ink-subtle);
    font-size: 13px;
  }

  /* ⌘K (components/CommandPalette.tsx) */
  .palette-trigger {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 40px;
    padding: 0 8px 0 12px;
    border: 1px solid var(--border);
    border-radius: var(--radius-control);
    background: var(--fill);
    color: var(--ink-subtle);
    font-size: 13px;
  }
  .palette-trigger:hover {
    border-color: var(--border-strong);
    color: var(--ink);
  }
  .palette-trigger kbd,
  .palette kbd {
    padding: 1px 6px;
    border: 1px solid var(--border);
    border-radius: 5px;
    background: var(--surface);
    font-family: var(--font-mono);
    font-size: 10.5px;
    color: var(--ink-subtle);
  }
  .palette {
    width: min(640px, calc(100% - 32px));
    max-height: min(70vh, 560px);
    margin: 12vh auto auto;
    padding: 0;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-xl);
    background: var(--surface);
    color: var(--ink);
    box-shadow: var(--shadow-card);
    overflow: hidden;
  }
  .palette::backdrop {
    background: rgb(0 0 0 / 45%);
    -webkit-backdrop-filter: blur(4px);
    backdrop-filter: blur(4px);
  }
  .palette[open] {
    animation: palette-in 0.18s cubic-bezier(0.2, 0, 0, 1);
  }
  @keyframes palette-in {
    from {
      opacity: 0;
      transform: translateY(-8px) scale(0.98);
    }
  }
  .palette-box {
    display: flex;
    flex-direction: column;
    max-height: inherit;
  }
  .palette-input {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 18px;
    border-bottom: 1px solid var(--border);
    color: var(--ink-subtle);
  }
  .palette-input input {
    flex: 1;
    min-width: 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: var(--ink);
    font-size: 16px;
  }
  .palette-results {
    flex: 1;
    overflow: auto;
    padding: 6px 8px 10px;
  }
  .palette-group {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 10px 6px;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 1.6px;
    text-transform: uppercase;
    color: var(--ink-subtle);
  }
  .palette-item {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 9px 10px;
    border-radius: var(--radius-control);
    text-align: start;
    color: var(--ink-muted);
  }
  .palette-item.is-active {
    background: var(--active);
    color: var(--ink);
  }
  .palette-label {
    display: grid;
    flex: 1;
    min-width: 0;
    font-size: 14px;
  }
  .palette-label small {
    overflow: hidden;
    color: var(--ink-subtle);
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .palette-hint {
    flex-shrink: 0;
    color: var(--ink-subtle);
    font-size: 12px;
  }
  .palette-note {
    padding: 14px 10px;
    color: var(--ink-subtle);
    font-size: 13px;
  }
  .palette-spinner {
    width: 10px;
    height: 10px;
    border: 1.5px solid var(--border-strong);
    border-top-color: var(--ink);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(1turn);
    }
  }
  .palette-foot {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 18px;
    padding: 10px 18px;
    border-top: 1px solid var(--border);
    color: var(--ink-subtle);
    font-size: 11.5px;
  }
  .palette-foot span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  @media (max-width: 1000px) {
    .palette-trigger span,
    .palette-trigger kbd {
      display: none;
    }
    .palette-trigger {
      width: 40px;
      justify-content: center;
      padding: 0;
    }
  }
  @media (max-width: 480px) {
    .palette-trigger {
      display: none;
    }
    .palette {
      margin-top: 8vh;
    }
    .palette-foot span:last-child {
      display: none;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .palette[open],
    .palette-spinner {
      animation: none;
    }
  }

  @media (max-width: 1100px) {
    .corner-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 760px) {
    .corners-section {
      padding-block: 64px 24px;
    }
    .corners-section .section-top {
      display: block;
    }
    .corners-section .section-top > .text-link {
      margin-top: 16px;
    }
    .corners-section .section-top h2 {
      font-size: 33px;
    }
    .corner-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }
    .corner {
      gap: 8px;
      padding: 16px 14px 12px;
    }
    .corner-grid > li:not(:first-child) .corner p,
    .corner-grid > li:not(:first-child) .corner-subs,
    .corner-new {
      display: none;
    }
    .corner h3 {
      font-size: 15px;
    }
    .corner-icon {
      width: 34px;
      height: 34px;
    }
    .corner-count {
      padding-top: 10px;
      font-size: 11.5px;
    }
    .phone-marquee {
      flex-direction: column;
      align-items: stretch;
      gap: 14px;
    }
  }
`;
