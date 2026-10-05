import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Card, PageHero, SectionHead } from "../components/page/Page.tsx";
import Icon from "../components/Icon.tsx";
import { asset } from "../lib/asset.ts";
import { links } from "../lib/links.ts";

const DEMO = asset("/img/qinf21.mp4");

/** A muted, looping demo that offers a play button when the browser won't autoplay it. */
function DemoVideo({ label, style }: { label: string; style?: CSSProperties }) {
  const video = useRef<HTMLVideoElement>(null);
  const [blocked, setBlocked] = useState(false);
  const [failed, setFailed] = useState(false);
  const [started, setStarted] = useState(false);
  const play = () => {
    const el = video.current;
    if (!el) return;
    el.muted = true;
    el.playbackRate = 0.8;
    el.play().catch((error: unknown) => {
      if (!(error instanceof DOMException && error.name === "AbortError")) setBlocked(true);
    });
  };
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setBlocked(true);
      return;
    }
    const playing = () => setBlocked(false);
    el.addEventListener("loadeddata", play);
    el.addEventListener("play", playing);
    play();
    return () => {
      el.removeEventListener("loadeddata", play);
      el.removeEventListener("play", playing);
    };
  }, []);
  return (
    <div className="demo-video">
      <video
        ref={video}
        style={style}
        loop
        muted
        playsInline
        preload="metadata"
        poster={asset("/img/home/egatesquare.webp")}
        controls={started || failed}
        aria-label={label}
        onError={() => setFailed(true)}
      >
        <source src={DEMO} type="video/mp4" />
      </video>
      {(blocked || failed) && (
        <div className="demo-video-overlay">
          {failed ? (
            <a href={DEMO} download>
              <Icon name="download" size={14} /> Download the demo
            </a>
          ) : (
            <button
              type="button"
              onClick={() => {
                setBlocked(false);
                setStarted(true);
                play();
              }}
            >
              <Icon name="play" size={14} /> Play the demo
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function PhoneMock() {
  return (
    <svg viewBox="0 0 280 628" role="img" aria-label="eGate on a keypad phone" className="egate-phone">
      <defs>
        <clipPath id="egate-phone-screen">
          <rect width="190" height="270" rx="16" x="45" y="60" />
        </clipPath>
      </defs>
      <rect className="egate-phone-body" x="10" y="10" width="260" height="605" rx="35" />
      <rect className="egate-phone-glass" x="25" y="40" width="230" height="315" rx="12" />
      <foreignObject x="45" y="60" width="190" height="270" clipPath="url(#egate-phone-screen)">
        <DemoVideo label="eGate running on a Qin F21 Pro" style={{ transform: "scale(0.92)" }} />
      </foreignObject>
      <rect className="egate-phone-key" x="120" y="25" width="40" height="6" rx="3" />
      <g className="egate-phone-key">
        <circle cx="140" cy="410" r="35" />
        <circle className="egate-phone-body" cx="140" cy="410" r="30" />
        <circle cx="140" cy="410" r="28" />
        <rect x="35" y="375" width="60" height="30" rx="15" />
        <rect x="35" y="415" width="60" height="30" rx="15" />
        <rect x="185" y="375" width="60" height="30" rx="15" />
        <rect x="185" y="415" width="60" height="30" rx="15" />
        {[470, 515, 560].map((y) =>
          [35, 110, 185].map((x) => <rect key={`${x}-${y}`} x={x} y={y} width="60" height="30" rx="15" />),
        )}
      </g>
    </svg>
  );
}

function PasswordBadge() {
  return (
    <div className="password-badge">
      <span className="password-badge-icon">
        <Icon name="lock" size={30} />
      </span>
      <p className="password-badge-title">Password protected</p>
      <p className="password-badge-kicker">Works offline</p>
      <ul>
        <li>Set during setup</li>
        <li>Asked for before every change</li>
      </ul>
    </div>
  );
}

export default function EGate() {
  return (
    <div className="page egate-page">
      <section className="egate-hero">
        <div className="egate-hero-copy">
          <PageHero eyebrow="EGATE" title="An offline device manager for Android." align="start">
            <p className="lede">
              eGate locks down an Android phone with a password you choose: which apps run, what can
              be changed, and which sites load. It's made by Offline Software Solutions, and it
              doesn't need a subscription.
            </p>
          </PageHero>
          <div className="page-actions">
            <a className="button" href={links.egateDownload} target="_blank" rel="noreferrer">
              Download eGate <Icon name="download" size={18} />
            </a>
            <a className="button button-ghost" href={links.egateExplained}>
              What is eGate? <Icon name="arrow" size={18} />
            </a>
          </div>
          <p className="page-note">
            Made and sold by Offline Software Solutions, the developer who founded JTech. Help and
            release notes live in the forum's eGate category.
          </p>
        </div>
        <div className="egate-hero-visual">
          <PhoneMock />
        </div>
      </section>

      <section className="page-section">
        <SectionHead eyebrow="WHAT IT DOES" title="What eGate can lock" />
        <div className="page-grid">
          <Card icon="lock" title="One-time license">
            Bought once, in the app. No monthly subscription, and updates stay free.
          </Card>
          <Card icon="shield" title="Password protected">
            You set a password during setup, and nothing changes without it.
          </Card>
          <Card icon="ban" title="Closes the back doors">
            Blocks factory reset, extra user profiles, ADB, and installing APK files.
          </Card>
          <Card icon="grid" title="App control">
            Disable any app, system apps included, or allow only the ones you pick.
          </Card>
          <Card icon="globe" title="DNS filtering">
            Blocks ads, malware, gambling, adult content and social media through Mullvad's DNS
            filters.
          </Card>
          <Card icon="sliders" title="Finer controls">
            Turns off WebView inside apps, video playback, Wi-Fi tethering and Wi-Fi settings.
          </Card>
        </div>
      </section>

      <section className="page-section">
        <SectionHead eyebrow="SEE IT" title="What it looks like" />
        <div className="egate-highlights">
          <article className="egate-highlight">
            <h3>Made for small screens</h3>
            <p>The demo runs on a Qin F21 Pro, a keypad phone.</p>
            <div className="egate-screen">
              <DemoVideo label="eGate's settings on a Qin F21 Pro" style={{ transform: "scale(0.92)" }} />
            </div>
          </article>
          <article className="egate-highlight">
            <h3>Locked with your password</h3>
            <p>Nothing changes without it.</p>
            <PasswordBadge />
          </article>
          <article className="egate-highlight">
            <h3>For resellers</h3>
            <p>
              People who set up phones for others get volume pricing and a web dashboard for their
              licenses.
            </p>
            <img
              className="egate-shot"
              src={asset("/img/home/reseller.webp")}
              alt="The eGate reseller dashboard"
              loading="lazy"
            />
          </article>
        </div>
      </section>

      <section className="page-section page-section-last">
        <div className="page-cta page-cta-split">
          <div>
            <span className="eyebrow">BEFORE YOU BUY</span>
            <h2>Questions about eGate?</h2>
            <p>
              Setup help, compatibility and release notes are in the forum's eGate category. If you're
              not sure your phone will work, ask there first.
            </p>
            <div className="page-actions">
              <a className="button" href={links.egateCategory}>
                eGate on the forum <Icon name="arrow" size={18} />
              </a>
              <a className="button button-ghost" href={links.egateVendor} target="_blank" rel="noreferrer">
                Offline Software Solutions <Icon name="external" size={18} />
              </a>
            </div>
          </div>
          <ul className="page-checklist">
            <li>
              <Icon name="check" size={18} />
              Setting it up takes ADB and a factory reset.
            </li>
            <li>
              <Icon name="check" size={18} />
              Each license can be entered once. Reinstalling after a reset needs a new one.
            </li>
            <li>
              <Icon name="check" size={18} />
              Most Android phones work, keypad phones included.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
