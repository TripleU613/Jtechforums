import { useRef, useState, type KeyboardEvent } from "react";
import ThemedShot from "./ThemedShot.tsx";

/** eGate 1.47's settings screen, one section open at a time (Maintenance left out: it shows the license key). */
const SECTIONS = [
  {
    id: "overview",
    name: "At a glance",
    text: "Everything sits on one screen behind your password, and each section says what it's blocking.",
  },
  {
    id: "reset",
    name: "Reset protection",
    text: "Block factory reset, or require the managed account after one.",
  },
  {
    id: "users",
    name: "User control",
    text: "Stop new users and profiles, keep app settings out of reach, and add a managed user.",
  },
  {
    id: "apps",
    name: "App control",
    text: "Hide apps, block uninstalls, installs, sideloading and Google Play, and hide known apps the moment they're installed.",
    tall: true,
  },
  {
    id: "categories",
    name: "Block apps by category",
    text: "Turn off whole groups at once: adult content, crypto and trading, gaming and gambling apps.",
  },
  {
    id: "connectivity",
    name: "Connectivity",
    text: "Wi-Fi and new networks, Bluetooth, tethering, airplane mode, VPN setup, outgoing calls, printing and wallpaper.",
    tall: true,
  },
  {
    id: "system",
    name: "System",
    text: "SMS and MMS, USB and physical media, ADB debugging, plus a DNS filter and a proxy.",
    tall: true,
  },
  {
    id: "accessibility",
    name: "Accessibility filter",
    text: "Reaches inside other apps: blocks WebView content, video playback and Telegram search, or chosen apps outright.",
    tall: true,
  },
  {
    id: "store",
    name: "App store",
    text: "eGate's own app store, optionally shown on startup, can hide apps that have a browser built in.",
  },
  {
    id: "security",
    name: "Security",
    text: "Change the password, add a reset email, and push or pull the settings to and from the server.",
  },
  {
    id: "appearance",
    name: "Appearance",
    text: "Your own startup image.",
  },
] as const;

const KEYS: Record<string, (at: number) => number> = {
  ArrowDown: (at) => (at + 1) % SECTIONS.length,
  ArrowRight: (at) => (at + 1) % SECTIONS.length,
  ArrowUp: (at) => (at - 1 + SECTIONS.length) % SECTIONS.length,
  ArrowLeft: (at) => (at - 1 + SECTIONS.length) % SECTIONS.length,
  Home: () => 0,
  End: () => SECTIONS.length - 1,
};

export default function EgateSettings() {
  const [at, setAt] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const screen = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = SECTIONS[at] ?? SECTIONS[0];
  const tall = "tall" in current;

  const pick = (i: number) => {
    setAt(i);
    setScrolled(false);
    screen.current?.scrollTo({ top: 0 });
    tabs.current[i]?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };
  const onKey = (event: KeyboardEvent) => {
    const move = KEYS[event.key];
    if (!move) return;
    event.preventDefault();
    const next = move(at);
    pick(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="egate-settings">
      <div className="egate-settings-list" role="tablist" aria-label="eGate's settings" onKeyDown={onKey}>
        {SECTIONS.map((section, i) => (
          <button
            type="button"
            role="tab"
            key={section.id}
            id={`egate-tab-${section.id}`}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            aria-selected={i === at}
            aria-controls="egate-settings-screen"
            tabIndex={i === at ? 0 : -1}
            onClick={() => pick(i)}
          >
            <span className="egate-settings-index">{String(i + 1).padStart(2, "0")}</span>
            <strong>{section.name}</strong>
            <span className="egate-settings-text">{section.text}</span>
          </button>
        ))}
      </div>
      <figure className="egate-settings-figure">
        <div className="egate-settings-phone">
          <div
            className="egate-settings-screen"
            id="egate-settings-screen"
            role="tabpanel"
            aria-labelledby={`egate-tab-${current.id}`}
            tabIndex={0}
            ref={screen}
            onScroll={(event) => setScrolled(event.currentTarget.scrollTop > 8)}
          >
            <ThemedShot
              key={current.id}
              base={`/img/egate/settings-${current.id}`}
              alt={`eGate 1.47, ${current.name}: ${current.text}`}
              eager
            />
          </div>
          {tall && !scrolled && (
            <span className="egate-settings-more" aria-hidden="true">
              Scroll for more ↓
            </span>
          )}
        </div>
        <figcaption>{current.text}</figcaption>
      </figure>
    </div>
  );
}
