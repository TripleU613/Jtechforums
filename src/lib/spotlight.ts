/**
 * Cards marked .spotlight light up under a mouse pointer: one listener for
 * the whole page sets --spot-x / --spot-y on the card being hovered, and
 * the stylesheet draws a soft glow there.
 */
export function startSpotlight(): () => void {
  let last: HTMLElement | null = null;
  const move = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    const card = (event.target as Element | null)?.closest<HTMLElement>(".spotlight") ?? null;
    if (card !== last) last = card;
    if (!card) return;
    const box = card.getBoundingClientRect();
    card.style.setProperty("--spot-x", `${event.clientX - box.left}px`);
    card.style.setProperty("--spot-y", `${event.clientY - box.top}px`);
  };
  document.addEventListener("pointermove", move, { passive: true });
  return () => document.removeEventListener("pointermove", move);
}
