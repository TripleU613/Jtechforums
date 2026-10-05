import { useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  EGATE_SECTIONS,
  EGATE_SETTING_COUNT,
  type EgateSection,
} from "../data/egate.ts";
import { forumSearch } from "../lib/links.ts";
import Icon from "./Icon.tsx";
import ThemedShot from "./ThemedShot.tsx";

const lower = (text: string) => text.toLowerCase();

function Mark({ text, query }: { text: string; query: string }) {
  const at = query ? lower(text).indexOf(lower(query)) : -1;
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <mark>{text.slice(at, at + query.length)}</mark>
      {text.slice(at + query.length)}
    </>
  );
}

/**
 * eGate's screen with one section open (or every section closed), scrolled to
 * the setting that was picked: `focus` runs from 0 (the top) to 1 (the end).
 */
function Phone({
  section,
  focus,
  className = "",
}: {
  section: EgateSection | null;
  focus: number;
  className?: string;
}) {
  const screen = useRef<HTMLDivElement>(null);
  const shown = useRef<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const id = section?.id ?? "overview";

  useLayoutEffect(() => {
    const el = screen.current;
    if (!el) return;
    const sameShot = shown.current === id;
    shown.current = id;
    if (!sameShot) setScrolled(false);
    const place = () => {
      const smooth =
        sameShot &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollTo({
        top: (el.scrollHeight - el.clientHeight) * focus,
        behavior: smooth ? "smooth" : "instant",
      });
    };
    place();
    // a capture that hasn't loaded yet has no height to scroll through
    const images = [...el.querySelectorAll("img")];
    for (const image of images) image.addEventListener("load", place);
    return () => {
      for (const image of images) image.removeEventListener("load", place);
    };
  }, [id, focus]);

  return (
    <figure className={`eg-phone ${className}`}>
      <div className="eg-phone-frame">
        <div className="eg-phone-glass">
          <div
            className="eg-phone-screen"
            ref={screen}
            tabIndex={section?.tall ? 0 : -1}
            onScroll={(event) => setScrolled(event.currentTarget.scrollTop > 8)}
          >
            <ThemedShot
              key={id}
              base={`/img/egate/settings-${id}`}
              alt={
                section
                  ? `eGate 1.47 with ${section.name} open`
                  : "eGate 1.47's settings, every section closed"
              }
              eager
            />
          </div>
          {section?.tall && (
            // the status bar, eGate's title and the nav bar stay put while the list scrolls, as on the phone
            <>
              <div className="eg-phone-bar eg-phone-bar-top" aria-hidden="true">
                <ThemedShot base={`/img/egate/settings-${id}`} alt="" eager />
              </div>
              <div
                className="eg-phone-bar eg-phone-bar-bottom"
                aria-hidden="true"
              >
                <ThemedShot base={`/img/egate/settings-${id}`} alt="" eager />
              </div>
            </>
          )}
        </div>
        {section?.tall && !scrolled && (
          <span className="eg-phone-more" aria-hidden="true">
            Scroll for more ↓
          </span>
        )}
      </div>
      <figcaption>
        {section ? section.name : "eGate 1.47, every section closed"}
      </figcaption>
    </figure>
  );
}

interface Row {
  item: EgateSection["items"][number];
  index: number;
}

function Items({
  section,
  rows,
  query,
  current,
  onPick,
}: {
  section: EgateSection;
  rows: Row[];
  query: string;
  current: number | null;
  onPick: (section: EgateSection, index: number) => void;
}) {
  return (
    <ul className="eg-items">
      {rows.map(({ item, index }) => (
        <li key={item.name}>
          <button
            type="button"
            className={`eg-item eg-item-${item.kind}`}
            aria-current={current === index ? "true" : undefined}
            onClick={() => onPick(section, index)}
          >
            <span className="eg-item-name">
              <Mark text={item.name} query={query} />
            </span>
            {item.note && (
              <span className="eg-item-note">
                <Mark text={item.note} query={query} />
              </span>
            )}
            <span className="eg-item-kind" aria-hidden="true" />
          </button>
        </li>
      ))}
    </ul>
  );
}

const allRows = (section: EgateSection): Row[] =>
  section.items.map((item, index) => ({ item, index }));

/** eGate 1.47's settings, searchable, with the phone showing whichever section is open. */
export default function EgateSettings() {
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<{
    id: string;
    index: number | null;
  } | null>(null);
  const q = query.trim();

  const results = useMemo(() => {
    if (!q) return null;
    return EGATE_SECTIONS.map((section) => {
      const whole = lower(section.name).includes(lower(q));
      const rows = allRows(section).filter(
        ({ item }) =>
          whole || lower(`${item.name} ${item.note ?? ""}`).includes(lower(q))
      );
      return { section, rows };
    }).filter((result) => result.rows.length > 0);
  }, [q]);

  // the phone follows what was picked, else the first match while searching
  const shown =
    EGATE_SECTIONS.find((section) => section.id === picked?.id) ??
    results?.[0]?.section ??
    null;
  const index = picked ? picked.index : (results?.[0]?.rows[0]?.index ?? null);
  const focus =
    shown && index !== null ? index / Math.max(1, shown.items.length - 1) : 0;
  const found = results?.reduce((n, result) => n + result.rows.length, 0) ?? 0;

  const pick = (section: EgateSection, at: number | null = null) =>
    setPicked({ id: section.id, index: at });
  const toggle = (section: EgateSection) =>
    picked?.id === section.id ? setPicked(null) : pick(section);

  return (
    <div className="eg-explorer">
      <div className="eg-explorer-main">
        <label className="eg-search">
          <Icon name="search" size={18} />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPicked(null);
            }}
            placeholder="Search, e.g. Bluetooth"
            aria-label="Search eGate's settings"
            autoComplete="off"
            spellCheck={false}
          />
          <span className="eg-search-count" aria-live="polite">
            {q ? `${found} found` : `${EGATE_SETTING_COUNT} settings`}
          </span>
        </label>

        {!q && !picked && (
          <Phone section={null} focus={0} className="eg-phone-inline" />
        )}

        {results ? (
          results.length > 0 ? (
            <ul className="eg-sections eg-sections-found">
              {results.map(({ section, rows }) => (
                <li
                  key={section.id}
                  className={shown?.id === section.id ? "is-open" : undefined}
                >
                  <button
                    type="button"
                    className="eg-section-head"
                    onClick={() => pick(section)}
                  >
                    <span className="eg-section-name">
                      <Mark text={section.name} query={q} />
                    </span>
                    <span className="eg-section-count">{rows.length}</span>
                  </button>
                  <div className="eg-section-body">
                    <Items
                      section={section}
                      rows={rows}
                      query={q}
                      current={shown?.id === section.id ? index : null}
                      onPick={pick}
                    />
                    {shown?.id === section.id && (
                      <Phone
                        section={section}
                        focus={focus}
                        className="eg-phone-inline"
                      />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="eg-empty">
              Nothing called “{q}” in eGate 1.47.{" "}
              <a href={forumSearch(`${q} category:75`)}>
                Ask in the eGate category <Icon name="arrow" size={14} />
              </a>
            </p>
          )
        ) : (
          <ul className="eg-sections">
            {EGATE_SECTIONS.map((section, i) => {
              const open = picked?.id === section.id;
              return (
                <li key={section.id} className={open ? "is-open" : undefined}>
                  <button
                    type="button"
                    className="eg-section-head"
                    aria-expanded={open}
                    aria-controls={`eg-section-${section.id}`}
                    onClick={() => toggle(section)}
                  >
                    <span className="eg-section-index">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="eg-section-name">{section.name}</span>
                    <span className="eg-section-count">
                      {section.items.length}
                    </span>
                    <Icon name="plus" size={16} />
                  </button>
                  <div
                    className="eg-section-body"
                    id={`eg-section-${section.id}`}
                    hidden={!open}
                  >
                    <p className="eg-section-summary">{section.summary}</p>
                    <Items
                      section={section}
                      rows={allRows(section)}
                      query=""
                      current={open ? index : null}
                      onPick={pick}
                    />
                    {open && (
                      <Phone
                        section={section}
                        focus={focus}
                        className="eg-phone-inline"
                      />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="eg-explorer-side">
        <Phone section={shown} focus={focus} />
      </div>
    </div>
  );
}
