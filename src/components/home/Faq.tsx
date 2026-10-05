import { useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import faq, { faqId } from "../../data/faq.ts";
import Icon from "../Icon.tsx";

export default function Faq() {
  const intro = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  // The intro is sticky beside the list; the list needs its height.
  useLayoutEffect(() => {
    const node = intro.current;
    if (!node) return;
    const measure = () => node.style.setProperty("--faq-height", `${node.getBoundingClientRect().height}px`);
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    measure();
    return () => observer.disconnect();
  }, []);
  // Arriving at #faq-… (from ⌘K) opens that answer.
  const { hash } = useLocation();
  useLayoutEffect(() => {
    if (!hash.startsWith("#faq-")) return;
    const details = document.getElementById(hash.slice(1));
    if (details instanceof HTMLDetailsElement) {
      details.open = true;
      details.scrollIntoView({ block: "center" });
    }
  }, [hash]);
  const needle = query.trim().toLowerCase();
  const matches = faq.filter((entry) => `${entry.question} ${entry.answer}`.toLowerCase().includes(needle));
  return (
    <section className="faq-section container">
      <div className="faq-intro" ref={intro}>
        <span className="eyebrow">GOOD TO KNOW</span>
        <h2>
          A few common{" "}
          <br />
          <em>questions.</em>
        </h2>
        <p>The short version of the rules, and what people ask most.</p>
        <label className="faq-search">
          <Icon name="search" size={18} />
          <input
            aria-label="Search the questions"
            placeholder="Find an answer…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <Link viewTransition to="/contact" className="text-link">
          Still stuck? Contact us <Icon />
        </Link>
      </div>
      <div className="faq-list">
        {matches.map((entry) => (
          <details key={entry.question} id={faqId(entry.question)}>
            <summary>
              {entry.question}
              <Icon name="plus" size={18} />
            </summary>
            <p>
              {entry.answer}
              {entry.link && (
                <>
                  {" "}
                  {entry.link.internal ? (
                    <Link viewTransition className="faq-link" to={entry.link.href}>
                      {entry.link.label}
                    </Link>
                  ) : (
                    <a className="faq-link" href={entry.link.href}>
                      {entry.link.label}
                    </a>
                  )}
                </>
              )}
            </p>
          </details>
        ))}
        {matches.length === 0 && (
          <p className="empty-state">No question matches that. Try another word, or contact us.</p>
        )}
      </div>
    </section>
  );
}
