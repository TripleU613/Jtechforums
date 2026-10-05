/**
 * Section eyebrows ("WHERE PEOPLE START") decode once as they scroll into
 * view: random characters settle into the words, left to right. Plain-text
 * eyebrows only, and not for people who prefer less motion.
 */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#*_";
const decoded = new WeakSet<Element>();

function decode(el: HTMLElement): void {
  if (decoded.has(el)) return;
  decoded.add(el);
  // Only an eyebrow that is one text node, and that node is edited in
  // place, so React's own reference to it stays good.
  const text = el.firstChild;
  if (el.childNodes.length !== 1 || !(text instanceof Text)) return;
  const final = text.nodeValue ?? "";
  if (!final.trim()) return;
  el.setAttribute("aria-label", final);
  const frames = 18;
  let frame = 0;
  const tick = () => {
    frame += 1;
    const settled = Math.floor((frame / frames) * final.length);
    text.nodeValue = [...final]
      .map((ch, i) => (i < settled || ch === " " ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
      .join("");
    if (frame < frames) requestAnimationFrame(() => setTimeout(tick, 28));
    else {
      text.nodeValue = final;
      el.removeAttribute("aria-label");
    }
  };
  tick();
}

export function startScramble(): () => void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  const seen = new WeakSet<Element>();
  const view = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        view.unobserve(entry.target);
        decode(entry.target as HTMLElement);
      }
    },
    { threshold: 1 },
  );
  const watch = (root: ParentNode) => {
    for (const el of root.querySelectorAll<HTMLElement>(".eyebrow")) {
      if (seen.has(el)) continue;
      seen.add(el);
      view.observe(el);
    }
  };
  watch(document);
  const added = new MutationObserver((records) => {
    for (const record of records)
      for (const node of record.addedNodes) if (node instanceof HTMLElement) watch(node.parentElement ?? node);
  });
  added.observe(document.body, { childList: true, subtree: true });
  return () => {
    view.disconnect();
    added.disconnect();
  };
}
