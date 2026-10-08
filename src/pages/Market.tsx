import Icon, { type IconName } from "../components/Icon.tsx";
import ThemedShot from "../components/ThemedShot.tsx";
import { SectionHead } from "../components/page/Page.tsx";
import { links } from "../lib/links.ts";

const categories: { name: string; slug: string; icon: IconName; detail: string }[] = [
  { name: "Phones", slug: "phones", icon: "phone", detail: "Flip phones to smartphones" },
  { name: "Computers", slug: "computers", icon: "terminal", detail: "Your next daily driver" },
  { name: "PC components", slug: "pc-components", icon: "chip", detail: "Build it. Upgrade it." },
  { name: "Software", slug: "software", icon: "code", detail: "Digital tools & licenses" },
];

export default function Market() {
  return (
    <div className="page market-page">
      <section className="market-hero" aria-labelledby="market-title">
        <div className="market-intro">
          <span className="eyebrow"><span className="market-status" />JTECH MARKET</span>
          <h1 id="market-title">Your next<br />tech find.</h1>
          <p className="market-lede">The marketplace for the JTech community. Find your next device, sell your last one, or pick up the missing piece for your setup.</p>
          <div className="page-actions">
            <a className="button" href={links.market}>Explore the market <Icon /></a>
            <a className="market-sell-link" href={`${links.market}sell`}>Start selling <Icon name="external" size={16} /></a>
          </div>
          <div className="market-note"><Icon name="users" size={16} /><span>Built for the people who know their tech.</span></div>
        </div>
        <a className="market-preview" href={links.market} aria-label="Explore JTech Market">
          <span className="market-preview-bar"><span><Icon name="grid" size={14} />JTech Market</span><span>market.jtechforums.org <Icon name="external" size={14} /></span></span>
          <div className="market-preview-screen"><ThemedShot base="/img/market/store" alt="A preview of JTech Market, with phones, audio gear, tablets and accessories" eager /></div>
          <span className="market-preview-caption">A look inside <Icon name="arrow" size={16} /></span>
        </a>
      </section>

      <section className="market-categories" aria-labelledby="market-categories-title">
        <div className="market-section-heading"><h2 id="market-categories-title">What are you looking for?</h2><a className="page-link" href={links.market}>See everything <Icon size={16} /></a></div>
        <div className="market-category-grid">
          {categories.map((category) => (
            <a className="market-category spotlight" href={`${links.market}category/${category.slug}`} key={category.slug}>
              <span className="market-category-icon"><Icon name={category.icon} size={28} /></span>
              <span className="market-category-copy"><strong>{category.name}</strong><span>{category.detail}</span></span>
              <Icon name="external" size={16} />
            </a>
          ))}
        </div>
      </section>

      <section className="market-how" aria-labelledby="market-how-title">
        <div><span className="eyebrow">FROM ONE SETUP TO THE NEXT</span><h2 id="market-how-title">Good tech deserves<br />another chapter.</h2><p>The forum is where we talk tech. The market is where it changes hands.</p></div>
        <ol className="market-steps">
          <li><span>01</span><div><h3>Find your next thing</h3><p>Browse by category. Check the photos, condition, and details before you buy.</p></div><Icon name="search" /></li>
          <li><span>02</span><div><h3>Make room for something new</h3><p>Give the gear you no longer need a listing of its own.</p></div><Icon name="plus" /></li>
          <li><span>03</span><div><h3>Keep it all in one place</h3><p>Checkout, messages, and order updates stay on JTech Market.</p></div><Icon name="chat" /></li>
        </ol>
      </section>

      <section className="market-closing">
        <SectionHead eyebrow="MEET JTECH MARKET" title="Find it. List it. Pass it on." />
        <p>Phones, computers, components, software, and everything that goes with them.</p>
        <a className="button" href={links.market}>Take a look <Icon /></a>
      </section>
    </div>
  );
}
