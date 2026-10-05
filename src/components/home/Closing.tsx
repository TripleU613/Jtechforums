import { links } from "../../lib/links.ts";
import Icon from "../Icon.tsx";

export default function Closing() {
  return (
    <section className="container closing-section">
      <span className="eyebrow">STUCK ON SOMETHING?</span>
      <h2>
        Someone here has <em>done it before.</em>
      </h2>
      <p>
        A flip phone that won't cooperate, a filter that's too strict, a script that won't run.{" "}
        <br />
        Post the details, and the people who've been there will chime in.
      </p>
      <a className="button" href={links.signup}>
        Join the forum <Icon name="arrow" size={18} />
      </a>
      <div className="closing-watermark" aria-hidden="true">
        jtech.
      </div>
    </section>
  );
}
