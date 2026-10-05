import { useEffect, useRef } from "react";

/**
 * The Android robot between code brackets, drawn in the page's own ink so it
 * sits in black and white on either theme. Its eyes follow the pointer, it
 * blinks now and then, and a click near it makes its antennae twitch.
 */
export default function AndroidMark() {
  const svg = useRef<SVGSVGElement>(null);
  const eyes = useRef<SVGGElement>(null);
  const antennae = useRef<SVGGElement>(null);

  useEffect(() => {
    const root = svg.current;
    const eyeGroup = eyes.current;
    const antennaGroup = antennae.current;
    if (!root || !eyeGroup || !antennaGroup) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let target = { x: 0, y: 0 };
    let visible = false;
    const look = () => {
      frame = 0;
      eyeGroup.style.transform = `translate(${target.x}px, ${target.y}px)`;
    };
    const move = (event: PointerEvent) => {
      if (!visible) return;
      const box = root.getBoundingClientRect();
      // the eyes sit around (768, 546) in a 1536 x 1024 drawing
      const cx = box.left + (768 / 1536) * box.width;
      const cy = box.top + (546 / 1024) * box.height;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const distance = Math.hypot(dx, dy) || 1;
      const reach = Math.min(1, distance / 400) * 26;
      target = { x: (dx / distance) * reach, y: (dy / distance) * reach * 0.7 };
      frame ||= requestAnimationFrame(look);
    };
    const twitch = (event: PointerEvent) => {
      const box = root.getBoundingClientRect();
      const x = ((event.clientX - box.left) / box.width) * 1536;
      const y = ((event.clientY - box.top) / box.height) * 1024;
      if (x > 400 && x < 1140 && y > 180 && y < 700) {
        antennaGroup.classList.remove("is-twitching");
        void antennaGroup.getBoundingClientRect();
        antennaGroup.classList.add("is-twitching");
      }
    };
    let blinkTimer = 0;
    const blink = () => {
      eyeGroup.classList.add("is-blinking");
      setTimeout(() => eyeGroup.classList.remove("is-blinking"), 160);
      blinkTimer = window.setTimeout(blink, 2800 + Math.random() * 4200);
    };
    blinkTimer = window.setTimeout(blink, 2000);
    const observer = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting;
    });
    observer.observe(root);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", twitch, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(blinkTimer);
      observer.disconnect();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", twitch);
    };
  }, []);

  return (
    <svg ref={svg} className="android-mark" viewBox="0 0 1536 1024" role="presentation" aria-hidden="true">
      <defs>
        <pattern id="android-mark-grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0H0v32" fill="none" />
        </pattern>
      </defs>
      <rect className="android-mark-grid" width="1536" height="1024" fill="url(#android-mark-grid)" />
      <g className="android-mark-robot">
        <g ref={antennae} className="android-antennae">
          <path className="android-antenna-l" d="M600 314 548 222" strokeWidth="22" strokeLinecap="round" />
          <path className="android-antenna-r" d="M936 314l52-92" strokeWidth="22" strokeLinecap="round" />
        </g>
        <path d="M460 666a308 308 0 0 1 616 0Z" />
      </g>
      <g className="android-mark-ink">
        <g ref={eyes} className="android-eyes">
          <ellipse cx="618" cy="546" rx="28" ry="34" />
          <ellipse cx="918" cy="546" rx="28" ry="34" />
        </g>
        <path d="M402 412 218 516l184 104v-64l-80-40 80-40Z" />
        <path d="m1134 412 184 104-184 104v-64l80-40-80-40Z" />
      </g>
    </svg>
  );
}
