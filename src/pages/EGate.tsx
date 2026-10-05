import { Card, PageHero, SectionHead } from "../components/page/Page.tsx";
import EgateScreens from "../components/EgateScreens.tsx";
import Icon from "../components/Icon.tsx";
import ThemedShot from "../components/ThemedShot.tsx";
import { links } from "../lib/links.ts";

/** A keypad phone, its screen cycling through eGate's own screens. */
function PhoneMock() {
  return (
    <svg viewBox="0 0 280 628" role="img" aria-label="eGate 1.47 on a keypad phone" className="egate-phone">
      <defs>
        <clipPath id="egate-phone-screen">
          <rect width="210" height="280" rx="10" x="35" y="57" />
        </clipPath>
      </defs>
      <rect className="egate-phone-body" x="10" y="10" width="260" height="605" rx="35" />
      <rect className="egate-phone-glass" x="25" y="40" width="230" height="315" rx="12" />
      <foreignObject x="35" y="57" width="210" height="280" clipPath="url(#egate-phone-screen)">
        <EgateScreens className="phone-screen-fill" />
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

const STEPS = [
  {
    base: "/img/egate/setup",
    title: "Set up from a computer",
    text: "eGate becomes the phone's device owner over ADB, then asks for one more permission the same way.",
    alt: "eGate 1.47 asking for secure settings access from a connected computer",
  },
  {
    base: "/img/egate/login",
    title: "Locked with your password",
    text: "Nothing in eGate changes without it.",
    alt: "eGate 1.47's password screen",
  },
  {
    base: "/img/egate/activate",
    title: "One license, in the app",
    text: "Enter a license code, or buy one right there. Resellers buy in bulk at volume pricing, with a web dashboard for their licenses.",
    alt: "eGate 1.47 asking for a license code",
  },
] as const;

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
            <a className="button button-ghost" href={links.egateInstall}>
              How to install it <Icon name="arrow" size={18} />
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
            Hide or disable any app, system apps included, or allow only the ones you pick.
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
        <SectionHead eyebrow="SEE IT" title="Straight from eGate 1.47" />
        <div className="egate-steps">
          {STEPS.map((step, i) => (
            <article className="egate-step" key={step.base}>
              <span className="egate-step-number">{String(i + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              <div className="egate-step-screen">
                <ThemedShot base={step.base} alt={step.alt} />
              </div>
            </article>
          ))}
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
                Most Android phones work. There's a build for LG Classic phones, and an add-on for the
                Qin F21 Pro.
              </li>
            </ul>
            <div className="page-actions">
              <a className="button" href={links.egateCategory}>
                eGate on the forum <Icon name="arrow" size={18} />
              </a>
              <a className="button button-ghost" href={links.egateVendor} target="_blank" rel="noreferrer">
                Offline Software Solutions <Icon name="external" size={18} />
              </a>
            </div>
          </div>
          <a className="egate-forum-shot" href={links.egateCategory} aria-label="The forum's eGate category">
            <ThemedShot base="/img/forum/egate" alt="The forum's eGate category, as it looks today" />
          </a>
        </div>
      </section>
    </div>
  );
}
