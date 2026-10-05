import { useEffect, useRef } from "react";
import timeline from "../../data/timeline.ts";
import Icon from "../Icon.tsx";

const label = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", year: "numeric" });

/** The forum's milestones, each fading in as it scrolls into view. */
export default function Timeline() {
  const list = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const items = list.current?.querySelectorAll<HTMLElement>("li");
    if (!items) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            entry.target.classList.add("is-seen");
            observer.unobserve(entry.target);
          }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
  return (
    <ol className="timeline" ref={list}>
      {timeline.map((m) => (
        <li key={m.date + m.title}>
          <time dateTime={m.date}>{label(m.date)}</time>
          <div>
            <h3>{m.title}</h3>
            <p>{m.text}</p>
            {m.href && (
              <a className="page-link" href={m.href}>
                The thread <Icon size={15} />
              </a>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
