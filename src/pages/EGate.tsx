import { useEffect, useRef, useState } from "react";
import { SectionHead } from "../components/page/Page.tsx";
import EgatePhoneCheck from "../components/EgatePhoneCheck.tsx";
import EgateScreens from "../components/EgateScreens.tsx";
import EgateSettings from "../components/EgateSettings.tsx";
import EgateThreads from "../components/EgateThreads.tsx";
import Icon from "../components/Icon.tsx";
import ThemedShot from "../components/ThemedShot.tsx";
import { EGATE_SETTING_COUNT } from "../data/egate.ts";
import { links } from "../lib/links.ts";

const HERO_SCREENS = [
  { base: "/img/egate/login", alt: "eGate 1.47 asking for its password" },
  { base: "/img/egate/settings-overview", alt: "eGate 1.47's settings, every section closed" },
  { base: "/img/egate/settings-categories", alt: "eGate 1.47 blocking apps by category" },
] as const;

/** A keypad phone, its screen cycling through eGate's own screens. */
function PhoneMock() {
  return (
    <svg viewBox="0 0 280 628" role="img" aria-label="eGate 1.47 on a keypad phone" className="eg-keypad">
      <defs>
        <clipPath id="eg-keypad-screen">
          <rect width="210" height="280" rx="10" x="35" y="57" />
        </clipPath>
      </defs>
      <rect className="eg-keypad-body" x="10" y="10" width="260" height="605" rx="35" />
      <rect className="eg-keypad-glass" x="25" y="40" width="230" height="315" rx="12" />
      <foreignObject x="35" y="57" width="210" height="280" clipPath="url(#eg-keypad-screen)">
        <EgateScreens className="phone-screen-fill" screens={HERO_SCREENS} />
      </foreignObject>
      <rect className="eg-keypad-key" x="120" y="25" width="40" height="6" rx="3" />
      <g className="eg-keypad-key">
        <circle cx="140" cy="410" r="35" />
        <circle className="eg-keypad-body" cx="140" cy="410" r="30" />
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

/** A command to run on the computer, with a Copy button. */
function Command({ children }: { children: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const copy = () =>
    navigator.clipboard?.writeText(children).then(
      () => {
        setCopied(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCopied(false), 1600);
      },
      () => undefined,
    );
  return (
    <div className="eg-command">
      <code>
        <span aria-hidden="true">$ </span>
        {children}
      </code>
      <button type="button" onClick={copy} aria-label={copied ? "Copied" : "Copy the command"}>
        {copied ? <Icon name="check" size={16} /> : "Copy"}
      </button>
    </div>
  );
}

const STEPS = [
  {
    title: "Install the app",
    text: "Download the APK from eGate's releases on GitHub, plug the phone in with USB debugging on, and install it.",
    command: "adb install app-general-release.apk",
  },
  {
    title: "Make eGate the device owner",
    text: "This is what lets it lock things down, and why setup starts from a factory reset: Android only allows it on a phone with no accounts on it.",
    command: "adb shell dpm set-device-owner com.oss.egate/.a",
    note: (
      <>
        On an LG Classic, eGate's own build uses{" "}
        <code>dpm set-device-owner com.android.cts.egate/com.oss.egate.a</code>.
      </>
    ),
  },
  {
    title: "Grant one more permission",
    text: "It lets eGate reach into other apps' settings, for switches like WebView blocking.",
    command: "adb shell pm grant com.oss.egate android.permission.WRITE_SECURE_SETTINGS",
  },
  {
    title: "Open eGate",
    text: "Choose your password, then enter a license key, or buy one right there in the app. Then work through the settings.",
  },
] as const;

const SCREENS = [
  { base: "/img/egate/setup", caption: "Missed step 3? eGate shows the command.", alt: "eGate 1.47 asking for secure settings access from a computer" },
  { base: "/img/egate/login", caption: "Your password guards every setting.", alt: "eGate 1.47's password screen" },
  { base: "/img/egate/activate", caption: "Enter a license, or buy one in the app.", alt: "eGate 1.47 asking for a license code" },
] as const;

const FAQ = [
  {
    q: "Is there a subscription?",
    a: "No. A license is bought once, per phone, and updates stay free.",
  },
  {
    q: "Do I have to factory reset the phone?",
    a: "Yes. eGate has to become the phone's device owner, and Android only allows that on a phone with no accounts on it, so you set it up right after a reset.",
  },
  {
    q: "What if I forget the password?",
    a: "Give eGate a password reset email under Security when you set it up. That's the way back in.",
  },
  {
    q: "Can I move a license to another phone?",
    a: "No. Each license is entered once, on one phone. If that phone is reset and eGate goes on again, it needs a new license.",
  },
  {
    q: "Does it work on flip phones?",
    a: "Many. Most Android phones from 6.0 on work, keypad ones included. The LG Classic has its own build and the Qin F21 Pro has an add-on. Look your phone up above before you buy.",
  },
  {
    q: "Can it block websites?",
    a: "Through its DNS filter, which uses Mullvad's filters for ads, malware, gambling, adult content and social media. The accessibility filter can also block web pages inside apps (WebView) and video playback.",
  },
  {
    q: "Who makes it?",
    a: "Offline Software Solutions, the developer who founded JTech. Help, release notes and setup questions live in the forum's eGate category.",
  },
] as const;

export default function EGate() {
  return (
    <div className="page eg-page">
      <section className="eg-hero">
        <div className="eg-hero-copy">
          <span className="eyebrow">EGATE 1.47 · OFFLINE SOFTWARE SOLUTIONS</span>
          <h1 className="eg-title">
            Lock down an Android phone. <span>Pay once.</span>
          </h1>
          <p className="lede">
            eGate is a device manager that runs on the phone itself. You decide what stays, from apps and Wi-Fi to
            texting, video inside apps and factory reset, then lock it all with a password only you know. No monthly
            subscription.
          </p>
          <div className="page-actions">
            <a className="button" href={links.egateDownload} target="_blank" rel="noreferrer">
              Download eGate <Icon name="download" size={18} />
            </a>
            <a className="button button-ghost" href="#setup">
              How to set it up <Icon name="arrow" size={18} />
            </a>
          </div>
          <dl className="eg-facts">
            <div>
              <dt>$40</dt>
              <dd>per phone, once</dd>
            </div>
            <div>
              <dt>{EGATE_SETTING_COUNT}</dt>
              <dd>settings to lock</dd>
            </div>
            <div>
              <dt>6.0+</dt>
              <dd>Android version</dd>
            </div>
            <div>
              <dt>Free</dt>
              <dd>updates, for good</dd>
            </div>
          </dl>
        </div>
        <div className="eg-hero-visual">
          <PhoneMock />
        </div>
      </section>

      <section className="page-section" id="settings">
        <SectionHead eyebrow="EVERY SETTING" title="Everything it can lock, on the phone itself" />
        <p className="eg-intro">
          This is eGate 1.47's own settings screen, section by section. Search it, or open a section to see it on the
          phone.
        </p>
        <EgateSettings />
      </section>

      <section className="page-section" id="setup">
        <SectionHead eyebrow="SETUP" title="Four steps, from a computer" />
        <ul className="eg-needs">
          <li>
            <Icon name="phone" size={18} /> An Android 6.0+ phone you can factory reset
          </li>
          <li>
            <Icon name="terminal" size={18} /> A computer with ADB, or a browser with WebADB
          </li>
          <li>
            <Icon name="lock" size={18} /> A license: $40, bought in the app
          </li>
        </ul>
        <div className="eg-setup">
          <ol className="eg-steps">
            {STEPS.map((step, i) => (
              <li className="eg-step" key={step.title}>
                <span className="eg-step-number">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                  {"command" in step && <Command>{step.command}</Command>}
                  {"note" in step && <p className="eg-step-note">{step.note}</p>}
                </div>
              </li>
            ))}
          </ol>
          <aside className="eg-installer">
            <Icon name="code" size={20} />
            <h3>Rather not type commands?</h3>
            <p>
              The JTech MDM Installer installs eGate from your browser. It checks the phone and walks you through USB
              debugging first.
            </p>
            <a className="page-link" href={links.installer}>
              Open the installer <Icon />
            </a>
            <a className="page-link" href={links.egateInstall}>
              The forum's full install guide <Icon />
            </a>
          </aside>
        </div>
        <div className="eg-screens">
          {SCREENS.map((screen) => (
            <figure key={screen.base}>
              <div className="eg-screens-frame">
                <ThemedShot base={screen.base} alt={screen.alt} />
              </div>
              <figcaption>{screen.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="page-section eg-split" id="phones">
        <div>
          <SectionHead eyebrow="WILL IT WORK" title="Check your phone first" />
          <p className="eg-intro">
            Most Android phones from 6.0 on work, keypad phones included. Type your model to see what the eGate category
            says about it.
          </p>
          <EgatePhoneCheck />
          <ul className="page-checklist">
            <li>
              <Icon name="check" size={18} />
              The LG Classic has its own build of eGate.
            </li>
            <li>
              <Icon name="check" size={18} />
              The Qin F21 Pro has an add-on.
            </li>
            <li>
              <Icon name="check" size={18} />
              Setup starts from a factory reset, so back the phone up first.
            </li>
          </ul>
        </div>
        <div className="eg-price">
          <span className="eyebrow">THE LICENSE</span>
          <p className="eg-price-amount">
            $40<span>per phone</span>
          </p>
          <p>Paid once, in the eGate app. Updates are free, for good.</p>
          <ul>
            <li>Each license is entered once, on one phone. After a reset, eGate needs a new one.</li>
            <li>Resellers and volume buyers get discounts, and resellers manage their licenses from a web dashboard.</li>
          </ul>
          <a className="button button-ghost" href={links.egateVendor} target="_blank" rel="noreferrer">
            Offline Software Solutions <Icon name="external" size={18} />
          </a>
        </div>
      </section>

      <section className="page-section">
        <SectionHead eyebrow="QUESTIONS" title="Before you buy" />
        <div className="eg-faq">
          {FAQ.map((entry) => (
            <details key={entry.q}>
              <summary>
                {entry.q}
                <Icon name="plus" size={18} />
              </summary>
              <p>{entry.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="page-section page-section-last eg-split eg-forum">
        <div>
          <SectionHead eyebrow="ON THE FORUM" title="Latest in the eGate category" />
          <p className="eg-intro">
            Release notes, setup help and phone-by-phone answers, from the people using it and the developer who makes
            it.
          </p>
          <div className="page-actions">
            <a className="button" href={links.egateCategory}>
              eGate on the forum <Icon name="arrow" size={18} />
            </a>
            <a className="button button-ghost" href={links.egateExplained}>
              What is eGate? <Icon name="arrow" size={18} />
            </a>
          </div>
        </div>
        <EgateThreads />
      </section>
    </div>
  );
}
