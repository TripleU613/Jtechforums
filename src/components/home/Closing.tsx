import type { CSSProperties } from "react";
import { links } from "../../lib/links.ts";
import { openRandomThread } from "../../lib/random.ts";
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
      <div className="closing-actions">
        <a className="button magnetic" href={links.signup}>
          Join the forum <Icon name="arrow" size={18} />
        </a>
        <button type="button" className="text-link" onClick={() => void openRandomThread()}>
          Or open a random thread <Icon name="sparkle" size={16} />
        </button>
      </div>
      <div className="closing-watermark" aria-hidden="true">
        {[..."jtech."].map((letter, i) => (
          <span key={i} style={{ "--i": i } as CSSProperties}>
            {letter}
          </span>
        ))}
      </div>
    </section>
  );
}
