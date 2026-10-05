import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { links } from "../lib/links.ts";
import { toggleScheme } from "../lib/scheme.ts";
import { toast } from "../lib/toast.ts";
import { openPalette } from "./CommandPalette.tsx";
import Icon from "./Icon.tsx";

/**
 * Keyboard shortcuts in the forum's style: "?" lists them, "t" switches
 * light/dark, and "g" then a letter goes somewhere. They stay out of the
 * way while someone is typing or driving the flip phone.
 */

const GO: Record<string, { label: string; to: string; internal?: boolean }> = {
  h: { label: "Home", to: "/", internal: true },
  e: { label: "eGate", to: "/egate", internal: true },
  a: { label: "About", to: "/about", internal: true },
  c: { label: "Contact", to: "/contact", internal: true },
  f: { label: "The forum", to: links.forum },
  l: { label: "Latest topics", to: links.latest },
  g: { label: "Guides", to: links.guides },
  d: { label: "Flip-phone version", to: links.dumbcourse },
};

export default function Shortcuts() {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let pendingG = 0;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (target?.closest("input, textarea, select, [contenteditable='true'], [role='application'], dialog")) return;
      const key = event.key.toLowerCase();
      if (pendingG && Date.now() - pendingG < 1200) {
        pendingG = 0;
        const place = GO[key];
        if (!place) return;
        event.preventDefault();
        if (place.internal) navigate(place.to, { viewTransition: true });
        else window.location.assign(place.to);
        return;
      }
      if (key === "g") {
        pendingG = Date.now();
        toast("g… then h, e, a, c, f, l, g or d", 1200);
      } else if (event.key === "?") {
        event.preventDefault();
        setOpen(true);
      } else if (key === "t") {
        toggleScheme({ x: innerWidth - 60, y: 40 });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    else if (!open && el.open) el.close();
  }, [open]);

  const rows: Array<[string[], string]> = [
    [["⌘", "K"], "Jump to or search"],
    [["/"], "Same, with one key"],
    [["t"], "Light / dark"],
    [["?"], "This list"],
    ...Object.entries(GO).map(([key, place]): [string[], string] => [["g", key], place.label]),
  ];

  return (
    <dialog
      ref={dialog}
      className="palette shortcuts"
      aria-label="Keyboard shortcuts"
      onClose={() => setOpen(false)}
      onClick={(event) => {
        if (event.target === event.currentTarget) setOpen(false);
      }}
    >
      <div className="shortcuts-head">
        <Icon name="command" size={18} />
        <h2>Keyboard shortcuts</h2>
        <button type="button" onClick={() => setOpen(false)} aria-label="Close">
          <Icon name="close" size={16} />
        </button>
      </div>
      <dl className="shortcuts-list">
        {rows.map(([keys, label]) => (
          <div key={label}>
            <dt>
              {keys.map((k, i) => (
                <kbd key={i}>{k}</kbd>
              ))}
            </dt>
            <dd>{label}</dd>
          </div>
        ))}
      </dl>
      <p className="shortcuts-foot">
        <span>
          The forum has its own: press <kbd>?</kbd> there too.
        </span>
        <button type="button" className="text-link" onClick={() => { setOpen(false); openPalette(); }}>
          Open ⌘K <Icon name="arrow" size={14} />
        </button>
      </p>
    </dialog>
  );
}
