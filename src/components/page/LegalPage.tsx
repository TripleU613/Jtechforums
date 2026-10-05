import { useEffect, useState } from "react";
import { PageHero } from "./Page.tsx";

export interface LegalSection {
  title: string;
  body?: string;
  list?: string[];
}

const slug = (title: string) => `s-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;

/** A legal page: its sections, with contents beside them that follow along. */
export default function LegalPage({
  eyebrow,
  title,
  updated,
  sections,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  sections: LegalSection[];
}) {
  const [current, setCurrent] = useState(slug(sections[0]?.title ?? ""));
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setCurrent(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    for (const section of sections) {
      const el = document.getElementById(slug(section.title));
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sections]);
  return (
    <div className="page legal-page">
      <PageHero eyebrow={eyebrow} title={title}>
        <p className="lede">Last updated: {updated}</p>
      </PageHero>
      <div className="legal-layout">
        <nav className="legal-toc" aria-label="Sections">
          <p>On this page</p>
          <ol>
            {sections.map((section) => {
              const id = slug(section.title);
              return (
                <li key={id}>
                  <a href={`#${id}`} aria-current={current === id ? "true" : undefined}>
                    {section.title.replace(/^\d+\.\s*/, "")}
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>
        <div className="page-panel legal">
          {sections.map((section) => (
            <section key={section.title} id={slug(section.title)}>
              <h2>{section.title}</h2>
              {section.body && <p>{section.body}</p>}
              {section.list && (
                <ul>
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
