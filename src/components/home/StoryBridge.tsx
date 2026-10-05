import { useLayoutEffect, useRef } from "react";
import Icon from "../Icon.tsx";
import AndroidMark from "./AndroidMark.tsx";
import { DESKTOP_MOTION, gsap } from "./gsap.ts";

export default function StoryBridge() {
  const root = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(DESKTOP_MOTION, () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".story-image",
          { scale: 0.72, rotate: -5, opacity: 0.25 },
          {
            scale: 1.1,
            rotate: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top 95%", end: "bottom 70%", scrub: 1 },
          },
        );
        gsap.from(".story-words span", {
          y: 90,
          opacity: 0,
          stagger: 0.12,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 65%", once: true },
        });
      }, root);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);
  return (
    <section className="story-bridge" ref={root}>
      <div className="story-image">
        <AndroidMark />
      </div>
      <div className="story-content">
        <span className="eyebrow">SINCE 2023</span>
        <h2 className="story-words">
          <span>Made by</span>
          <span>
            its members<span className="story-dot">.</span>
          </span>
        </h2>
        <p>
          Guides, ROMs, apps, even the flip-phone version of the forum. Most of it started with
          someone solving their own problem, then posting how.
        </p>
        <a href="#resources" className="text-link">
          See where to start <Icon />
        </a>
      </div>
      <span className="story-marker">[ JTECH / SINCE 2023 ]</span>
    </section>
  );
}
