import categories, { phoneModels } from "../../data/categories.ts";
import { useCategoryCounts } from "../../lib/categories.ts";
import { FORUM, forumSearch } from "../../lib/links.ts";
import CountUp from "../CountUp.tsx";
import Icon from "../Icon.tsx";

const number = (n: number): string => n.toLocaleString("en-US");

export default function Corners() {
  const counts = useCategoryCounts();
  return (
    <section className="corners-section container" aria-labelledby="corners-title">
      <div className="section-top">
        <div>
          <span className="eyebrow">FIND YOUR CORNER</span>
          <h2 id="corners-title">
            Every topic
            <br />
            <span>has a home.</span>
          </h2>
        </div>
        <a className="text-link" href={`${FORUM}/categories`}>
          All categories <Icon name="arrow" size={17} />
        </a>
      </div>
      <ul className="corner-grid">
        {categories.map((category) => {
          const live = counts.get(category.id);
          const subs = (live?.subs.length ? live.subs : category.subcategories).slice(0, 4);
          return (
            <li key={category.id}>
              <a className="corner spotlight" href={`${FORUM}${category.path}`}>
                <span className="corner-top">
                  <span className="corner-icon">
                    <Icon name={category.icon} size={20} />
                  </span>
                  {live && live.week > 0 && <span className="corner-new">+{live.week} this week</span>}
                </span>
                <h3>{category.name}</h3>
                <p>{category.blurb}</p>
                {subs.length > 0 && (
                  <span className="corner-subs">
                    {subs.map((sub) => (
                      <span key={sub}>{sub}</span>
                    ))}
                  </span>
                )}
                <span className="corner-count">
                  <span>
                    {live ? (
                      <>
                        <CountUp value={live.topics} format={number} /> topics
                      </>
                    ) : (
                      "Browse"
                    )}
                  </span>
                  <Icon name="arrow" size={15} />
                </span>
              </a>
            </li>
          );
        })}
      </ul>
      <div className="phone-marquee" aria-label="Phones people ask about">
        <span className="phone-marquee-label">PHONES PEOPLE ASK ABOUT</span>
        <div className="phone-marquee-window">
          <div className="phone-marquee-track">
          {/* Twice over, so the strip loops without a seam; the copy is hidden from screen readers. */}
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1 ? "true" : undefined}>
              {phoneModels.map((model) => (
                <li key={model}>
                  <a href={forumSearch(model)} tabIndex={copy === 1 ? -1 : undefined}>
                    <Icon name="phone" size={14} />
                    {model}
                  </a>
                </li>
              ))}
            </ul>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}
