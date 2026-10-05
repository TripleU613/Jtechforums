import { useLayoutEffect, useRef, useState } from "react";
import { asset } from "../../lib/asset.ts";
import { links } from "../../lib/links.ts";
import Icon from "../Icon.tsx";
import { DESKTOP_MOTION, gsap } from "./gsap.ts";
import ParticleScene from "./ParticleScene.tsx";

const WIDE = "(min-width: 1100px)";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [wide, setWide] = useState(() => window.matchMedia(WIDE).matches);
  useLayoutEffect(() => {
    const query = window.matchMedia(WIDE);
    const update = () => setWide(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(DESKTOP_MOTION, () => {
      const ctx = gsap.context(() => {
        gsap.from(".hero-brand-logo", {
          y: 40,
          opacity: 0,
          scale: 0.96,
          duration: 1.15,
          ease: "power3.out",
          clearProps: "all",
        });
        gsap.from(".hero-caption, .hero-bottom", {
          y: 20,
          opacity: 0,
          delay: 0.3,
          duration: 0.85,
          clearProps: "all",
        });
        gsap.to(".hero-brand", {
          y: -40,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "20% top", end: "bottom top", scrub: 1 },
        });
      }, root);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);
  return (
    <section className="immersive-hero branded-hero" ref={root}>
      <div className="hero-blueprint" aria-hidden="true" />
      <div className="hero-ambient" aria-hidden="true" />
      {wide && <ParticleScene />}
      <div className="hero-brand">
        <h1>
          <img
            className="hero-brand-logo logo"
            src={asset("/img/whitelogo.webp")}
            alt="JTech Forums"
            width="860"
            height="250"
          />
        </h1>
        <span className="brand-light-line" aria-hidden="true" />
      </div>
      <div className="hero-caption">
        <p>
          Flip phones, filters,{" "}
          <br />
          ROMs and code.
        </p>
        <span>Asked about, answered and built by the people who use them.</span>
        <a className="button" href={links.signup}>
          Join the forum <Icon name="arrow" />
        </a>
      </div>
      <div className="hero-bottom">
        <a href="#resources" className="scroll-cue">
          <span>↓</span> Scroll to explore
        </a>
      </div>
    </section>
  );
}
