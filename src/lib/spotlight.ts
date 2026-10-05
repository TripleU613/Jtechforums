/**
 * Pointer effects for the whole page, from one listener:
 * - .spotlight cards get --spot-x / --spot-y, where the stylesheet draws a
 *   soft light;
 * - .tilt cards lean a few degrees towards the pointer (--tilt-x / --tilt-y);
 * - .magnetic buttons drift a little towards a pointer that comes near.
 * Mouse only; tilting and drifting stay off for reduced motion.
 */
export function startSpotlight(): () => void {
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
  let tilted: HTMLElement | null = null;
  let frame = 0;
  let last: PointerEvent | null = null;

  const settle = (card: HTMLElement | null) => {
    card?.style.removeProperty("--tilt-x");
    card?.style.removeProperty("--tilt-y");
  };

  const update = () => {
    frame = 0;
    const event = last;
    if (!event) return;
    const target = event.target as Element | null;
    const spot = target?.closest<HTMLElement>(".spotlight");
    if (spot) {
      const box = spot.getBoundingClientRect();
      spot.style.setProperty("--spot-x", `${event.clientX - box.left}px`);
      spot.style.setProperty("--spot-y", `${event.clientY - box.top}px`);
    }
    if (calm.matches) return;
    const tilt = target?.closest<HTMLElement>(".tilt") ?? null;
    if (tilt !== tilted) {
      settle(tilted);
      tilted = tilt;
    }
    if (tilt) {
      const box = tilt.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      tilt.style.setProperty("--tilt-x", `${(x * 7).toFixed(2)}deg`);
      tilt.style.setProperty("--tilt-y", `${(-y * 7).toFixed(2)}deg`);
    }
    for (const magnet of document.querySelectorAll<HTMLElement>(".magnetic")) {
      const box = magnet.getBoundingClientRect();
      const dx = event.clientX - (box.left + box.width / 2);
      const dy = event.clientY - (box.top + box.height / 2);
      const near = Math.abs(dx) < box.width / 2 + 50 && Math.abs(dy) < box.height / 2 + 50;
      magnet.style.setProperty("--mag-x", near ? `${Math.max(-8, Math.min(8, dx * 0.16)).toFixed(1)}px` : "0px");
      magnet.style.setProperty("--mag-y", near ? `${Math.max(-6, Math.min(6, dy * 0.22)).toFixed(1)}px` : "0px");
    }
  };

  const move = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    last = event;
    frame ||= requestAnimationFrame(update);
  };
  const leave = () => {
    settle(tilted);
    tilted = null;
  };
  document.addEventListener("pointermove", move, { passive: true });
  document.addEventListener("pointerleave", leave);
  return () => {
    document.removeEventListener("pointermove", move);
    document.removeEventListener("pointerleave", leave);
    cancelAnimationFrame(frame);
  };
}
