import { useLayoutEffect } from "react";
import { MOTION, gsap } from "./gsap.ts";

/** Section headings rise into place, and a thin bar tracks how far down the page you are. */
export default function MotionAtmosphere() {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION, () => {
      const ctx = gsap.context(() => {
        gsap.utils
          .toArray<HTMLElement>(
            ".conversation-section .section-top, .people-section .section-top, .projects-section .section-top",
          )
          .forEach((el) =>
            gsap.from(el, {
              y: 45,
              opacity: 0.15,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 92%", once: true },
            }),
          );
        gsap.to(".site-scroll-progress", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
        });
      });
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);
  return <div className="site-scroll-progress" aria-hidden="true" />;
}
