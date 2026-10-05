import { useEffect, useRef, useState } from "react";
import Icon from "./Icon.tsx";

/** After a screen or so of scrolling, a way back up, ringed by how far down you are. */
export default function BackToTop() {
  const [shown, setShown] = useState(false);
  const ring = useRef<SVGCircleElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      const progress = max > 0 ? scrollY / max : 0;
      setShown(scrollY > innerHeight * 1.2);
      ring.current?.style.setProperty("stroke-dashoffset", String(100 - progress * 100));
    };
    const onScroll = () => {
      frame ||= requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <button
      type="button"
      className={`back-to-top${shown ? " is-shown" : ""}`}
      aria-label="Back to top"
      tabIndex={shown ? 0 : -1}
      onClick={() =>
        window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })
      }
    >
      <svg viewBox="0 0 36 36" aria-hidden="true">
        <circle cx="18" cy="18" r="15.9" pathLength="100" className="back-to-top-track" />
        <circle ref={ring} cx="18" cy="18" r="15.9" pathLength="100" className="back-to-top-ring" />
      </svg>
      <Icon name="arrow" size={16} style={{ transform: "rotate(-90deg)" }} />
    </button>
  );
}
