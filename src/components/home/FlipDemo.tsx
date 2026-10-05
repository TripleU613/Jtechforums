import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import categories from "../../data/categories.ts";
import { useCategoryCounts } from "../../lib/categories.ts";
import { forumPaths, type LatestPayload, type Topic } from "../../lib/forum.ts";
import { FORUM, forumTopic, links } from "../../lib/links.ts";
import { toggleScheme } from "../../lib/scheme.ts";
import { useForum } from "../../lib/useForum.ts";
import Icon from "../Icon.tsx";

/**
 * A flip phone you can drive: the D-pad, OK, the soft keys and the number
 * keys work like the forum's keypad version (jtechforums.org/dumb), on the
 * forum's real latest topics and categories. Click the keys, or focus the
 * screen and use the keyboard. The red key folds the phone shut.
 */

type Screen = "list" | "detail" | "menu" | "help";
type Key = "up" | "down" | "left" | "right" | "ok" | "soft-left" | "soft-right" | "end" | string;

interface Row {
  id: string;
  title: string;
  meta: string;
  href: string;
  detail: ReactNode;
}

const TABS = ["Latest", "Categories"] as const;
const MENU = ["Latest", "Categories", "Light / dark", "Keys (0)", "Open the real one"] as const;
const KEYPAD = [
  ["1", ""],
  ["2", "abc"],
  ["3", "def"],
  ["4", "ghi"],
  ["5", "jkl"],
  ["6", "mno"],
  ["7", "pqrs"],
  ["8", "tuv"],
  ["9", "wxyz"],
  ["*", "menu"],
  ["0", "help"],
  ["#", "search"],
] as const;
const HELP: Array<[string, string]> = [
  ["↑ ↓", "move"],
  ["← →", "switch tabs"],
  ["OK", "open"],
  ["1 / 7", "top / bottom"],
  ["2 / 8", "page up / down"],
  ["4", "back"],
  ["*", "menu"],
  ["3 · 5", "reply · like (signed in)"],
];

const short = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";

function clock(): string {
  return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export default function FlipDemo() {
  const latest = useForum<LatestPayload>(forumPaths.latest);
  const counts = useCategoryCounts();
  const [tab, setTab] = useState(0);
  const [index, setIndex] = useState([0, 0]);
  const [screen, setScreen] = useState<Screen>("list");
  const [menuIndex, setMenuIndex] = useState(0);
  const [closed, setClosed] = useState(false);
  const [toast, setToast] = useState("");
  const [time, setTime] = useState(clock);
  const [pressed, setPressed] = useState<Key | null>(null);
  const [buzzing, setBuzzing] = useState(false);
  const screenRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const newest = latest.data?.topic_list?.topics?.find((t) => !t.pinned_globally)?.title;

  useEffect(() => {
    const timer = setInterval(() => setTime(clock()), 20000);
    return () => clearInterval(timer);
  }, []);
  // Left alone on screen for half a minute, the phone buzzes once with the newest topic.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !newest || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let visible = false;
    let last = Date.now();
    let done = false;
    const active = () => {
      last = Date.now();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting;
      last = Date.now();
    }, { threshold: 0.6 });
    observer.observe(section);
    const timer = setInterval(() => {
      if (done || !visible || document.hidden || Date.now() - last < 30000) return;
      done = true;
      setBuzzing(true);
      setToast(`New: ${newest}`);
      setTimeout(() => setBuzzing(false), 900);
    }, 3000);
    const events = ["pointermove", "keydown", "scroll", "touchstart"] as const;
    for (const name of events) window.addEventListener(name, active, { passive: true });
    return () => {
      observer.disconnect();
      clearInterval(timer);
      for (const name of events) window.removeEventListener(name, active);
    };
  }, [newest]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), toast.startsWith("New: ") ? 4200 : 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const rows = useMemo<Row[][]>(() => {
    const topics = (latest.data?.topic_list?.topics ?? []).filter((t) => !t.pinned_globally).slice(0, 12);
    const topicRows = topics.map((topic: Topic) => ({
      id: `t${topic.id}`,
      title: topic.title,
      meta: `${topic.reply_count ?? 0} replies · ${short(topic.bumped_at ?? topic.created_at)}`,
      href: forumTopic(topic.slug, topic.id),
      detail: (
        <>
          <p className="fs-detail-meta">
            {topic.reply_count ?? 0} replies · {(topic.views ?? 0).toLocaleString("en-US")} views
          </p>
          <p className="fs-detail-meta">Active {short(topic.bumped_at ?? topic.created_at)}</p>
          <p className="fs-detail-hint">OK opens the topic on the forum.</p>
        </>
      ),
    }));
    const categoryRows = categories.map((category) => {
      const live = counts.get(category.id);
      return {
        id: `c${category.id}`,
        title: category.name,
        meta: live ? `${live.topics.toLocaleString("en-US")} topics` : category.blurb,
        href: `${FORUM}${category.path}`,
        detail: (
          <>
            <p className="fs-detail-meta">{category.blurb}</p>
            {(live?.subs.length ? live.subs : category.subcategories).slice(0, 4).map((sub) => (
              <p className="fs-detail-sub" key={sub}>
                › {sub}
              </p>
            ))}
            <p className="fs-detail-hint">OK opens the category.</p>
          </>
        ),
      };
    });
    return [topicRows, categoryRows];
  }, [latest.data, counts]);

  const list = rows[tab] ?? [];
  const current = Math.min(index[tab] ?? 0, Math.max(0, list.length - 1));
  const selected = list[current];

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(".fs-row-selected")?.scrollIntoView({ block: "nearest" });
  }, [current, tab, screen]);

  const move = useCallback(
    (to: number) => {
      setIndex((all) => {
        const next = [...all];
        next[tab] = Math.max(0, Math.min(list.length - 1, to));
        return next;
      });
    },
    [tab, list.length],
  );

  const press = useCallback(
    (key: Key) => {
      setPressed(key);
      setTimeout(() => setPressed((k) => (k === key ? null : k)), 140);
      if (closed) {
        setClosed(false);
        return;
      }
      if (key === "end") {
        setClosed(true);
        setScreen("list");
        return;
      }
      if (screen === "menu") {
        if (key === "up") setMenuIndex((i) => (i + MENU.length - 1) % MENU.length);
        else if (key === "down") setMenuIndex((i) => (i + 1) % MENU.length);
        else if (key === "ok" || key === "soft-left") {
          const item = MENU[menuIndex];
          if (item === "Latest" || item === "Categories") {
            setTab(item === "Latest" ? 0 : 1);
            setScreen("list");
          } else if (item === "Light / dark") {
            const box = screenRef.current?.getBoundingClientRect();
            toggleScheme(box ? { x: box.left + box.width / 2, y: box.top + box.height / 2 } : undefined);
            setScreen("list");
          } else if (item === "Keys (0)") setScreen("help");
          else window.location.assign(links.dumbcourse);
        } else if (key === "soft-right" || key === "4") setScreen("list");
        return;
      }
      if (screen === "help") {
        setScreen("list");
        return;
      }
      if (screen === "detail") {
        if (key === "ok" && selected) window.location.assign(selected.href);
        else if (key === "soft-right" || key === "4" || key === "left") setScreen("list");
        else if (key === "soft-left" || key === "*") setScreen("menu");
        else if (key === "3" || key === "5") setToast(key === "3" ? "Sign in to reply" : "Sign in to like");
        return;
      }
      switch (key) {
        case "up":
          move(current - 1);
          break;
        case "down":
          move(current + 1);
          break;
        case "left":
        case "right":
          setTab((t) => (t + 1) % TABS.length);
          break;
        case "ok":
          if (selected) setScreen("detail");
          break;
        case "soft-left":
        case "*":
          setMenuIndex(0);
          setScreen("menu");
          break;
        case "0":
          setScreen("help");
          break;
        case "1":
          move(0);
          break;
        case "7":
          move(list.length - 1);
          break;
        case "2":
          move(current - 4);
          break;
        case "8":
          move(current + 4);
          break;
        case "#":
          setToast("Search is on the real one");
          break;
        case "3":
        case "5":
          setToast(key === "3" ? "Open a topic to reply" : "Open a topic to like");
          break;
        case "soft-right":
        case "4":
          setToast("You're on the home screen");
          break;
        default:
          break;
      }
    },
    [closed, screen, menuIndex, selected, current, list.length, move],
  );

  const keyFromEvent = (event: KeyboardEvent): Key | null => {
    const map: Record<string, Key> = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
      Enter: "ok",
      Backspace: "soft-right",
      Escape: "soft-right",
    };
    if (map[event.key]) return map[event.key] ?? null;
    if (/^[0-9*#]$/.test(event.key)) return event.key;
    return null;
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const key = keyFromEvent(event);
    if (!key || event.metaKey || event.ctrlKey || event.altKey) return;
    event.preventDefault();
    press(key);
  };

  // Mouse and touch keys act on the screen without taking its focus away.
  const keyButton = (key: Key, label: ReactNode, className: string, aria: string) => (
    <button
      key={aria}
      type="button"
      tabIndex={-1}
      className={`${className}${pressed === key ? " is-pressed" : ""}`}
      aria-label={aria}
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => {
        press(key);
        screenRef.current?.focus({ preventScroll: true });
      }}
    >
      {label}
    </button>
  );

  const softLeft = screen === "menu" ? "Select" : "Menu";
  const center = screen === "detail" ? "Open" : screen === "help" ? "Close" : "OK";
  const softRight = screen === "list" ? "" : "Back";
  const announce =
    screen === "menu"
      ? `Menu: ${MENU[menuIndex]}`
      : screen === "help"
        ? "Keys"
        : selected
          ? `${screen === "detail" ? "Opened " : ""}${TABS[tab]} ${current + 1} of ${list.length}: ${selected.title}`
          : "";

  return (
    <section className="flip-section container" aria-labelledby="flip-title" ref={sectionRef}>
      <div className="flip-copy">
        <span className="eyebrow">ON A FLIP PHONE?</span>
        <h2 id="flip-title">
          The whole forum,
          <br />
          <span>on a keypad.</span>
        </h2>
        <p>
          jtechforums.org/dumb is the forum rebuilt for flip phones and old browsers. The D-pad moves,
          OK opens, the number keys jump around, and you can sign in without typing a password. Phones
          that can't run the full forum are sent there by themselves.
        </p>
        <p className="flip-try">
          <Icon name="keypad" size={18} />
          Try it on this one: click its keys, or click the screen and use your arrow keys.
        </p>
        <div className="page-actions">
          <a className="button" href={links.dumbcourse}>
            Open jtechforums.org/dumb <Icon name="arrow" size={18} />
          </a>
        </div>
      </div>

      <div className={`flip-device${closed ? " is-closed" : ""}${buzzing ? " is-buzzing" : ""}`}>
        <div className="flip-lid">
          <div className="flip-lid-front">
            <span className="flip-earpiece" />
            <div
              className="flip-screen"
              ref={screenRef}
              tabIndex={0}
              role="application"
              aria-roledescription="flip phone"
              aria-label="A flip phone running the forum's keypad version. Arrow keys move, Enter opens, Backspace goes back, number keys jump."
              onKeyDown={onKeyDown}
            >
              <div className="fs-status" aria-hidden="true">
                <span>{time}</span>
                <span className="fs-bars">
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
              </div>
              {screen === "menu" ? (
                <div className="fs-body">
                  <p className="fs-title">Menu</p>
                  <ul className="fs-list">
                    {MENU.map((item, i) => (
                      <li key={item} className={`fs-row${i === menuIndex ? " fs-row-selected" : ""}`}>
                        <span className="fs-row-title">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : screen === "help" ? (
                <div className="fs-body">
                  <p className="fs-title">Keys</p>
                  <dl className="fs-help">
                    {HELP.map(([k, v]) => (
                      <div key={k}>
                        <dt>{k}</dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : screen === "detail" && selected ? (
                <div className="fs-body fs-detail">
                  <p className="fs-kicker">{TABS[tab] === "Latest" ? "Topic" : "Category"}</p>
                  <p className="fs-detail-title">{selected.title}</p>
                  {selected.detail}
                </div>
              ) : (
                <div className="fs-body">
                  <div className="fs-tabs" aria-hidden="true">
                    {TABS.map((name, i) => (
                      <span key={name} className={i === tab ? "is-active" : ""}>
                        {name}
                      </span>
                    ))}
                  </div>
                  <ul className="fs-list" ref={listRef}>
                    {list.length === 0 && (
                      <li className="fs-row">
                        <span className="fs-row-meta">{latest.status === "loading" ? "Loading…" : "Nothing here yet."}</span>
                      </li>
                    )}
                    {list.map((row, i) => (
                      <li key={row.id} className={`fs-row${i === current ? " fs-row-selected" : ""}`}>
                        <span className="fs-row-title">{row.title}</span>
                        <span className="fs-row-meta">{row.meta}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {toast && <p className="fs-toast">{toast}</p>}
              <div className="fs-softkeys" aria-hidden="true">
                <span>{softLeft}</span>
                <strong>{center}</strong>
                <span>{softRight}</span>
              </div>
              <span className="sr-only" aria-live="polite">
                {announce}
              </span>
            </div>
          </div>
          <div className="flip-lid-back" aria-hidden="true" onClick={() => press("ok")}>
            <span className="flip-outer-screen">
              <strong>{time}</strong>
              <small>JTech</small>
            </span>
          </div>
        </div>
        <div className="flip-hinge" />
        <div className="flip-base">
          <div className="flip-nav">
            {keyButton("soft-left", <i className="flip-soft-line" />, "flip-key flip-soft", "Left soft key")}
            <div className="flip-dpad">
              {keyButton("up", "", "flip-dir flip-up", "Up")}
              {keyButton("left", "", "flip-dir flip-left", "Left")}
              {keyButton("ok", "OK", "flip-ok", "OK")}
              {keyButton("right", "", "flip-dir flip-right", "Right")}
              {keyButton("down", "", "flip-dir flip-down", "Down")}
            </div>
            {keyButton("soft-right", <i className="flip-soft-line" />, "flip-key flip-soft", "Right soft key")}
          </div>
          <div className="flip-calls">
            {keyButton("ok", <Icon name="phone" size={13} />, "flip-key flip-call", "Call")}
            {keyButton("end", <Icon name="close" size={13} />, "flip-key flip-end", "End: fold the phone")}
          </div>
          <div className="flip-keys">
            {KEYPAD.map(([digit, letters]) =>
              keyButton(
                digit,
                <>
                  <b>{digit}</b>
                  <small>{letters}</small>
                </>,
                "flip-key flip-digit",
                `${digit}${letters ? ` (${letters})` : ""}`,
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
