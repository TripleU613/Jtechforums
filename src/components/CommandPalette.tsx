import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import faq, { faqId } from "../data/faq.ts";
import { FORUM, forumSearch, links } from "../lib/links.ts";
import { openRandomThread } from "../lib/random.ts";
import { toggleScheme } from "../lib/scheme.ts";
import { useForumSearch } from "../lib/search.ts";
import Icon, { type IconName } from "./Icon.tsx";

/**
 * ⌘K (or Ctrl+K, or "/"): jump anywhere on the site or the forum, flip
 * light/dark, or search the forum as you type. The forum has the same
 * shortcut, so it works the same on both.
 */

interface Action {
  label: string;
  hint: string;
  icon: IconName;
  keywords: string;
  run: (go: (to: string) => void) => void;
}

const page = (to: string) => (go: (to: string) => void) => go(to);
const away = (href: string) => () => window.location.assign(href);

const ACTIONS: Action[] = [
  { label: "The forum", hint: "jtechforums.org", icon: "chat", keywords: "forum home discourse", run: away(links.forum) },
  { label: "JTech Market", hint: "Buy & sell tech", icon: "grid", keywords: "market marketplace buy sell shop devices software", run: away(links.market) },
  { label: "Latest topics", hint: "Forum", icon: "chat", keywords: "new recent latest", run: away(links.latest) },
  { label: "Guides", hint: "Forum", icon: "book", keywords: "how to tutorial guide", run: away(links.guides) },
  { label: "Android Apps", hint: "Forum", icon: "grid", keywords: "apk apps download", run: away(links.androidApps) },
  { label: "All categories", hint: "Forum", icon: "layers", keywords: "categories topics", run: away(`${FORUM}/categories`) },
  { label: "Leaderboard", hint: "Forum", icon: "users", keywords: "points champions top", run: away(links.leaderboard) },
  { label: "Flip-phone version", hint: "jtechforums.org/dumb", icon: "keypad", keywords: "dumbcourse keypad kaios flip dumb", run: away(links.dumbcourse) },
  { label: "MDM installer", hint: "installer.jtechforums.org", icon: "terminal", keywords: "install filter mdm adb", run: away(links.installer) },
  { label: "eGate", hint: "This site", icon: "shield", keywords: "egate filter mdm", run: page("/egate") },
  { label: "About JTech", hint: "This site", icon: "users", keywords: "about team who", run: page("/about") },
  { label: "Contact the team", hint: "This site", icon: "mail", keywords: "contact email help", run: page("/contact") },
  { label: "Home", hint: "This site", icon: "arrow", keywords: "home start", run: page("/") },
  { label: "Sign up", hint: "Forum", icon: "users", keywords: "join register account", run: away(links.signup) },
  {
    label: "Open a random thread",
    hint: "Feeling curious?",
    icon: "sparkle",
    keywords: "random surprise lucky shuffle",
    run: () => void openRandomThread(),
  },
  {
    label: "Switch light / dark",
    hint: "Also on the forum",
    icon: "sun",
    keywords: "theme dark light mode night",
    run: () => toggleScheme({ x: innerWidth / 2, y: innerHeight / 2 }),
  },
];

function matches(action: Action, query: string): boolean {
  const haystack = `${action.label} ${action.keywords}`.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

const OPEN_EVENT = "jt:open-palette";

/** Open the palette from anywhere (the header button uses this). */
export function openPalette(): void {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export default function CommandPalette() {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const search = useForumSearch(open ? query : "");

  const show = useCallback(() => {
    setQuery("");
    setActive(0);
    setOpen(true);
  }, []);

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      // Another sheet (keyboard shortcuts) is open: leave it be.
      const other = document.querySelector("dialog[open]");
      if (other && other !== dialog.current) return;
      const typing = event.target instanceof HTMLElement && event.target.closest("input, textarea, select, [contenteditable='true'], [role='application']");
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        show();
      } else if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        show();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, show);
    };
  }, [show]);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      input.current?.focus();
    } else if (!open && el.open) el.close();
  }, [open]);

  const actions = useMemo(() => {
    const found = ACTIONS.filter((action) => matches(action, query)).slice(0, query ? 6 : 8);
    if (query.trim().length < 3) return found;
    // Questions from the FAQ, opened in place on the home page
    const answers: Action[] = faq
      .filter((entry) => matches({ label: entry.question, keywords: entry.answer } as Action, query))
      .slice(0, 3)
      .map((entry) => ({
        label: entry.question,
        hint: "FAQ",
        icon: "book",
        keywords: "",
        run: page(`/#${faqId(entry.question)}`),
      }));
    return [...found, ...answers];
  }, [query]);
  const hits = query.trim().length >= 3 ? search.hits : [];
  const searchAll = query.trim().length >= 3;
  const total = actions.length + hits.length + (searchAll ? 1 : 0);
  useEffect(() => setActive(0), [query]);

  const go = (to: string) => navigate(to, { viewTransition: true });
  const choose = (index: number) => {
    setOpen(false);
    if (index < actions.length) actions[index]?.run(go);
    else if (index < actions.length + hits.length) {
      const hit = hits[index - actions.length];
      if (hit) window.location.assign(hit.href);
    } else window.location.assign(forumSearch(query.trim()));
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => (total ? (i + 1) % total : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (total ? (i - 1 + total) % total : 0));
    } else if (event.key === "Enter" && total) {
      event.preventDefault();
      choose(active);
    }
  };

  useEffect(() => {
    dialog.current?.querySelector(".palette-item.is-active")?.scrollIntoView({ block: "nearest" });
  }, [active]);

  let row = -1;
  const item = (key: string, icon: IconName, label: string, hint: string, extra?: string) => {
    row += 1;
    const index = row;
    return (
      <li key={key}>
        <button
          type="button"
          className={`palette-item${index === active ? " is-active" : ""}`}
          onMouseMove={() => setActive(index)}
          onClick={() => choose(index)}
        >
          <Icon name={icon} size={16} />
          <span className="palette-label">
            {label}
            {extra && <small>{extra}</small>}
          </span>
          <span className="palette-hint">{hint}</span>
        </button>
      </li>
    );
  };

  return (
    <dialog
      ref={dialog}
      className="palette"
      aria-label="Jump to or search"
      onClose={() => setOpen(false)}
      onClick={(event) => {
        if (event.target === event.currentTarget) setOpen(false);
      }}
    >
      <div className="palette-box">
        <label className="palette-input">
          <Icon name="search" size={18} />
          <input
            ref={input}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Jump to… or search the forum"
            aria-label="Jump to or search the forum"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd>Esc</kbd>
        </label>
        <div className="palette-results">
          {actions.length > 0 && (
            <>
              <p className="palette-group">Go to</p>
              <ul>{actions.map((action) => item(action.label, action.icon, action.label, action.hint))}</ul>
            </>
          )}
          {searchAll && (
            <>
              <p className="palette-group">
                On the forum
                {search.status === "searching" && <span className="palette-spinner" aria-label="Searching" />}
              </p>
              <ul>
                {hits.map((hit) => item(`hit-${hit.id}`, "chat", hit.title, "Topic", hit.blurb))}
                {item("search-all", "search", `Search the forum for “${query.trim()}”`, "↵")}
              </ul>
              {search.status === "error" && <p className="palette-note">Live results didn't load; the full search still works.</p>}
            </>
          )}
          {!actions.length && !searchAll && <p className="palette-note">Type to search the forum.</p>}
        </div>
        <p className="palette-foot">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> move
          </span>
          <span>
            <kbd>↵</kbd> open
          </span>
          <span>
            <kbd>⌘</kbd>
            <kbd>K</kbd> works on the forum too
          </span>
        </p>
      </div>
    </dialog>
  );
}
