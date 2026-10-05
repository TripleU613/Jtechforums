import { useEffect, useRef } from "react";
import { currentScheme, onSchemeChange } from "../../lib/scheme.ts";

interface Point {
  x: number;
  y: number;
}

const COUNT = 1100;
const SHAPE_NAMES = ["microchip", "terminal", "phone", "flip-phone", "laptop", "headphones", "network"];

/** Trace one of the silhouettes on a scratch canvas and sample its lit pixels. */
function traceShape(pen: CanvasRenderingContext2D, kind: number): Point[] {
  pen.clearRect(0, 0, 400, 400);
  pen.strokeStyle = "#fff";
  pen.fillStyle = "#fff";
  pen.lineWidth = 2.8;
  pen.lineCap = "round";
  const line = (x: number, y: number, x2: number, y2: number) => {
    pen.beginPath();
    pen.moveTo(x, y);
    pen.lineTo(x2, y2);
    pen.stroke();
  };
  const round = (x: number, y: number, w: number, h: number, r: number) => {
    pen.beginPath();
    pen.roundRect(x, y, w, h, r);
    pen.stroke();
  };
  const ring = (x: number, y: number, r: number) => {
    pen.beginPath();
    pen.arc(x, y, r, 0, Math.PI * 2);
    pen.stroke();
  };
  if (kind === 0) {
    // A microchip with its pins and traces.
    pen.strokeRect(110, 110, 180, 180);
    pen.strokeRect(125, 125, 150, 150);
    pen.strokeRect(150, 150, 100, 100);
    for (let p = 125; p <= 275; p += 15) {
      line(p, 85, p, 110);
      line(p, 290, p, 315);
      line(85, p, 110, p);
      line(290, p, 315, p);
    }
    for (let y = 166; y < 242; y += 12) for (let x = 166; x < 242; x += 12) pen.fillRect(x, y, 2, 2);
    for (let i = 0; i < 4; i++) {
      const d = i * 16;
      line(85, 145 + d, 50 - d * 0.4, 145 + d);
      line(50 - d * 0.4, 145 + d, 50 - d * 0.4, 70 + d * 0.2);
      line(315, 225 - d, 352 + d * 0.4, 225 - d);
      line(352 + d * 0.4, 225 - d, 352 + d * 0.4, 330 - d * 0.2);
    }
  } else if (kind === 1) {
    // A smartphone and its home screen.
    round(116, 45, 168, 310, 23);
    round(128, 74, 144, 209, 9);
    line(178, 60, 222, 60);
    ring(200, 320, 13);
    for (let y = 108; y < 240; y += 48) for (let x = 150; x < 245; x += 40) round(x, y, 23, 23, 5);
  } else if (kind === 2) {
    // A terminal window and prompt.
    round(48, 85, 304, 230, 12);
    line(48, 121, 352, 121);
    for (let x = 67; x < 106; x += 14) ring(x, 104, 3);
    line(83, 163, 111, 182);
    line(111, 182, 83, 201);
    line(131, 202, 180, 202);
    line(83, 243, 238, 243);
    line(83, 263, 193, 263);
  } else if (kind === 3) {
    // An open flip phone, with screen, hinge and keypad.
    round(122, 28, 156, 165, 18);
    pen.strokeRect(136, 53, 128, 113);
    line(183, 40, 217, 40);
    round(116, 208, 168, 166, 18);
    round(125, 191, 150, 18, 7);
    ring(200, 235, 15);
    for (let y = 270; y < 352; y += 29) for (let x = 137; x < 265; x += 44) round(x, y, 36, 18, 5);
    line(165, 94, 200, 127);
    line(200, 127, 235, 82);
  } else if (kind === 4) {
    // A laptop with code on screen.
    round(76, 68, 248, 206, 12);
    pen.strokeRect(88, 83, 224, 172);
    line(76, 275, 40, 321);
    line(40, 321, 360, 321);
    line(360, 321, 324, 275);
    line(40, 321, 56, 334);
    line(56, 334, 344, 334);
    line(344, 334, 360, 321);
    line(129, 140, 108, 162);
    line(108, 162, 129, 184);
    line(271, 140, 292, 162);
    line(292, 162, 271, 184);
    line(180, 188, 213, 133);
    line(173, 308, 227, 308);
  } else if (kind === 5) {
    // Headphones.
    pen.beginPath();
    pen.arc(200, 185, 118, Math.PI, 0);
    pen.stroke();
    pen.beginPath();
    pen.arc(200, 185, 98, Math.PI, 0);
    pen.stroke();
    line(82, 185, 82, 254);
    line(318, 185, 318, 254);
    round(68, 186, 61, 125, 20);
    round(271, 186, 61, 125, 20);
    line(113, 210, 113, 286);
    line(287, 210, 287, 286);
    pen.beginPath();
    pen.moveTo(301, 311);
    pen.quadraticCurveTo(297, 350, 221, 348);
    pen.stroke();
    round(182, 337, 45, 18, 8);
  } else {
    // A network: a hub routed out to eight nodes.
    const nodes = [
      [80, 90],
      [320, 90],
      [80, 310],
      [320, 310],
      [200, 55],
      [345, 200],
      [200, 345],
      [55, 200],
    ] as const;
    nodes.forEach(([x, y], i) => {
      line(200, 200, (200 + x) / 2, 200);
      line((200 + x) / 2, 200, (200 + x) / 2, y);
      line((200 + x) / 2, y, x, y);
      ring(x, y, i % 2 ? 12 : 18);
    });
    pen.strokeRect(174, 174, 52, 52);
    pen.strokeRect(182, 182, 36, 36);
  }
  const pixels = pen.getImageData(0, 0, 400, 400).data;
  const points: Point[] = [];
  for (let y = 0; y < 400; y += 4)
    for (let x = 0; x < 400; x += 4)
      if ((pixels[(y * 400 + x) * 4 + 3] ?? 0) > 100) points.push({ x: (x - 200) / 400, y: (y - 200) / 400 });
  return points;
}

/**
 * One canvas, one animation loop: particles assemble into device
 * silhouettes, one after another. Drawn in the page's ink, so white on the
 * dark page and black on the light one.
 */
export default function ParticleScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const sample = document.createElement("canvas");
    sample.width = sample.height = 400;
    const pen = sample.getContext("2d", { willReadFrequently: true });
    if (!canvas || !ctx || !pen) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    let lastFrame = 0;
    let elapsed = 0;
    // Ink, and how much of it: black specks read heavier on white than light on black.
    let ink = "255,255,255";
    let weight = 1;
    const readInk = () => {
      const light = currentScheme() === "light";
      ink = light ? "0,0,0" : "255,255,255";
      weight = light ? 0.85 : 1;
    };
    readInk();
    const color = (alpha: number) => `rgba(${ink},${(alpha * weight).toFixed(3)})`;

    // Resample every silhouette evenly. A modulo stride can skip most of a
    // shape when its point count shares a factor with that stride.
    const shapes = [0, 2, 1, 3, 4, 5, 6].map((kind) => {
      const points = traceShape(pen, kind);
      return Array.from({ length: COUNT }, (_, i) => points[Math.floor((i * points.length) / COUNT)] ?? { x: 0, y: 0 });
    });
    const particles = Array.from({ length: COUNT }, (_, i) => ({
      x: Math.sin(i * 24.17) * 0.7,
      y: Math.cos(i * 13.57) * 0.6,
      seed: i * 1.618,
    }));

    function draw(delta: number) {
      if (!ctx || !canvas) return;
      elapsed += delta;
      const t = elapsed / 1000;
      const still = motion.matches;
      ctx.clearRect(0, 0, width, height);
      const small = width < 760;
      const size = small ? 330 : Math.min(600, width * 0.46);
      const cx = small ? width * 0.66 : width * 0.78;
      const cy = small ? height * 0.68 : height * 0.44;
      const cycle = 3;
      const step = still ? 0 : Math.floor(t / cycle) % shapes.length;
      const next = (step + 1) % shapes.length;
      let morph = still ? 0 : (t % cycle) / cycle;
      canvas.dataset.shape = SHAPE_NAMES[step];
      canvas.dataset.nextShape = SHAPE_NAMES[next];
      morph = morph * morph * (3 - 2 * morph);
      const rotation = still ? -0.18 : Math.sin(t * 0.24) * 0.18 - 0.13;
      const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.66);
      halo.addColorStop(0, color(0.07));
      halo.addColorStop(1, color(0));
      ctx.fillStyle = halo;
      ctx.fillRect(cx - size, cy - size, size * 2, size * 2);
      // Quiet background traffic travels along a few circuit routes.
      ctx.strokeStyle = color(0.06);
      ctx.lineWidth = 1;
      for (let j = 0; j < 7; j++) {
        const y = height * (0.1 + j * 0.13);
        ctx.beginPath();
        ctx.moveTo(width * 0.38, y);
        ctx.lineTo(width * 0.5 + j * 12, y);
        ctx.lineTo(width * 0.56 + j * 12, y + 48);
        ctx.lineTo(width, y + 48);
        ctx.stroke();
      }
      for (let i = 0; i < 95; i++) {
        const x = ((i * 137.8 + t * (4 + (i % 4))) % (width + 80)) - 40;
        const y = (i * 83.19) % height;
        ctx.fillStyle = color(0.07 + (Math.sin(t * 0.7 + i) + 1) * 0.09);
        ctx.beginPath();
        ctx.arc(x, y, i % 9 === 0 ? 1.7 : 0.7, 0, 7);
        ctx.fill();
      }
      const from = shapes[step] ?? [];
      const to = shapes[next] ?? [];
      particles.forEach((p, i) => {
        const a = from[i] ?? { x: 0, y: 0 };
        const b = to[i] ?? a;
        const tx = a.x + (b.x - a.x) * morph;
        const ty = a.y + (b.y - a.y) * morph;
        const scatter = still ? 0 : Math.sin(morph * Math.PI) * 0.025;
        const targetX = tx + Math.sin(p.seed + t * 0.5) * scatter;
        const targetY = ty + Math.cos(p.seed + t * 0.4) * scatter;
        const lerp = still ? 1 : Math.min(1, delta / 65);
        p.x += (targetX - p.x) * lerp;
        p.y += (targetY - p.y) * lerp;
        const x = cx + (p.x * Math.cos(rotation) - p.y * Math.sin(rotation)) * size;
        const y = cy + (p.x * Math.sin(rotation) + p.y * Math.cos(rotation)) * size * 0.91;
        const shimmer = 0.58 + (Math.sin(t * 1.1 + p.seed) + 1) * 0.23;
        ctx.fillStyle = color(i % 8 === 0 ? shimmer : shimmer * 0.62);
        ctx.beginPath();
        ctx.arc(x, y, i % 13 === 0 ? 1.75 : 1.05, 0, 7);
        ctx.fill();
      });
      // A few packets emerge from the device and flow towards the edge.
      for (let k = 0; k < 6; k++) {
        const progress = still ? k / 6 : (t * 0.11 + k / 6) % 1;
        const x = cx - size * 0.4 + progress * size * 0.8;
        const y = cy + Math.sin(k * 1.4) * size * 0.49;
        ctx.fillStyle = color(Math.sin(progress * Math.PI) * 0.6);
        ctx.fillRect(x, y, 3, 1);
      }
    }
    function resize() {
      if (!canvas || !ctx) return;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (motion.matches) draw(0);
    }
    function tick(time: number) {
      if (visible && !document.hidden && time - lastFrame > 28) {
        const delta = lastFrame ? time - lastFrame : 30;
        lastFrame = time;
        draw(delta);
      }
      frame = requestAnimationFrame(tick);
    }
    function sync() {
      cancelAnimationFrame(frame);
      lastFrame = 0;
      if (motion.matches) draw(0);
      else frame = requestAnimationFrame(tick);
    }
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const visibility = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? true;
        lastFrame = 0;
      },
      { rootMargin: "100px" },
    );
    visibility.observe(canvas);
    motion.addEventListener("change", sync);
    const stopScheme = onSchemeChange(() => {
      readInk();
      if (motion.matches) draw(0);
    });
    resize();
    sync();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      motion.removeEventListener("change", sync);
      stopScheme();
    };
  }, []);
  return <canvas className="tech-particle-scene" ref={canvasRef} aria-hidden="true" />;
}
