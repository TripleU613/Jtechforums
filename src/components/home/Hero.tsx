import { useLayoutEffect, useRef, useState } from "react";
import { asset } from "../../lib/asset.ts";
import { setDevOptions, useDevOptions } from "../../lib/devmode.ts";
import { links } from "../../lib/links.ts";
import { toast } from "../../lib/toast.ts";
import Icon from "../Icon.tsx";
import { DESKTOP_MOTION, gsap } from "./gsap.ts";
import ParticleScene from "./ParticleScene.tsx";

const WIDE = "(min-width: 1100px)";

/**
 * Tapping the big logo seven times, like a phone's build number, turns on
 * developer options (lib/devmode.ts).
 */
function useBuildNumberTaps(): () => void {
  const taps = useRef({ count: 0, last: 0 });
  const options = useDevOptions();
  return () => {
    const now = Date.now();
    const t = taps.current;
    t.count = now - t.last < 1500 ? t.count + 1 : 1;
    t.last = now;
    if (options.unlocked) {
      if (t.count >= 3) toast("No need, you are already a developer.");
      return;
    }
    const left = 7 - t.count;
    if (left <= 0) {
      t.count = 0;
      setDevOptions({ unlocked: true });
      toast("You are now a developer!");
    } else if (left <= 4) {
      toast(`You are now ${left} step${left === 1 ? "" : "s"} away from being a developer.`, 1200);
    }
  };
}

/** Between midnight and five, the hero notices. */
function lateNight(): boolean {
  const hour = new Date().getHours();
  return hour < 5;
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const tapLogo = useBuildNumberTaps();
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
            onClick={tapLogo}
            draggable={false}
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
        <span>{lateNight() ? "Still up? So is the forum." : "Asked about, answered and built by the people who use them."}</span>
        <a className="button magnetic" href={links.signup}>
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
