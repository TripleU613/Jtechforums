/**
 * eGate 1.47's settings, as its own settings screen lists them, section by
 * section. Each section has a capture in both modes at
 * public/img/egate/settings-<id>-{light,dark}.webp ("overview" is the screen
 * with every section closed); the tall ones were stitched from two captures.
 */

export interface EgateSetting {
  name: string;
  /** The grey line eGate shows under the name, if any. */
  note?: string;
  /** A switch, or a row that opens a page. */
  kind: "switch" | "page";
}

export interface EgateSection {
  id: string;
  name: string;
  summary: string;
  tall?: boolean;
  items: EgateSetting[];
}

const on = (name: string, note?: string): EgateSetting => ({ name, note, kind: "switch" });
const page = (name: string, note?: string): EgateSetting => ({ name, note, kind: "page" });

export const EGATE_SECTIONS: EgateSection[] = [
  {
    id: "reset",
    name: "Reset protection",
    summary: "Keeps the phone from being wiped to get rid of eGate.",
    items: [on("Block factory reset"), on("Factory reset protection", "Require the managed account after a reset")],
  },
  {
    id: "users",
    name: "User control",
    summary: "No second profile to slip around the rules.",
    items: [
      on("Block adding users"),
      on("Block app settings control", "Stop the user from modifying apps in Settings"),
      page("Add managed user"),
      on("Manage users on login"),
    ],
  },
  {
    id: "apps",
    name: "App control",
    summary: "Which apps exist on the phone, and whether new ones can arrive.",
    tall: true,
    items: [
      page("Hide apps"),
      page("Unhide apps"),
      page("Block uninstall"),
      page("Allow uninstall"),
      on("Block all uninstalls"),
      on("Block all app installs", "Blocks every install, the Play Store included"),
      on("Block unknown sources", "Blocks sideloading only; the Play Store keeps working"),
      on("Block default app changes"),
      on("Chrome certificate integration"),
      on("Disable Google Play"),
      page("Installation blacklist", "Auto-hide known apps when installed"),
    ],
  },
  {
    id: "categories",
    name: "Block apps by category",
    summary: "Whole kinds of apps at once.",
    items: [on("Adult content apps"), on("Crypto and trading apps"), on("Gaming apps"), on("Gambling apps")],
  },
  {
    id: "connectivity",
    name: "Connectivity",
    summary: "Wi-Fi, Bluetooth, hotspot, VPN and calls.",
    tall: true,
    items: [
      on("Block Wi-Fi"),
      on("Block adding Wi-Fi networks"),
      on("Block Bluetooth sharing"),
      on("Block Bluetooth"),
      on("Block tethering"),
      on("Block airplane mode"),
      on("Block VPN configuration"),
      on("Block outgoing calls"),
      on("Block printing"),
      on("Block wallpaper changes"),
    ],
  },
  {
    id: "system",
    name: "System",
    summary: "Texting, USB and ADB, and filtering for the whole phone's traffic.",
    tall: true,
    items: [
      on("Block MMS"),
      on("Block SMS"),
      on("Block USB and physical media"),
      on("Block ADB debugging"),
      page("DNS filter"),
      page("Proxy"),
    ],
  },
  {
    id: "accessibility",
    name: "Accessibility filter",
    summary: "Reaches inside other apps, for what a switch can't block from outside.",
    tall: true,
    items: [
      on("Enable accessibility filter"),
      on("Use external service", "Only needed in special cases"),
      on("Block WebView content"),
      page("Add WebView exception"),
      page("Remove WebView exception"),
      on("Block video playback"),
      on("Block Telegram search"),
      page("Block apps with accessibility"),
      page("Unblock apps"),
      on("Debug accessibility", "Show diagnostic notifications"),
    ],
  },
  {
    id: "store",
    name: "App store",
    summary: "eGate's own store, for apps you've decided are fine.",
    items: [page("Open app store"), on("Show app store on startup"), on("Hide apps with built-in browsers")],
  },
  {
    id: "security",
    name: "Security",
    summary: "Your password, a way back in, and a copy of the settings on the server.",
    items: [
      page("Set password"),
      page("Password reset email"),
      page("Force push configuration", "Overwrite the server copy with this device's settings"),
      page("Force pull configuration", "Replace this device's settings with the server copy"),
    ],
  },
  {
    id: "appearance",
    name: "Appearance",
    summary: "The picture the phone shows when it starts.",
    items: [page("Customize startup image"), page("Reset startup image")],
  },
  {
    id: "maintenance",
    name: "Maintenance",
    summary: "The manual, updates and your license.",
    items: [
      page("User manual", "Opens in the device's browser"),
      page("Check for updates"),
      page("Test browser"),
      page("License key"),
      page("Purchase license"),
    ],
  },
];

export const EGATE_SETTING_COUNT = EGATE_SECTIONS.reduce((n, section) => n + section.items.length, 0);
