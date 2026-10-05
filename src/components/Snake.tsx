import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

/**
 * Snake, as flip phones had it: arrow keys, the D-pad below, or swipes on
 * the screen. Enter or OK starts and pauses. The best score stays in this
 * browser.
 */

const CELLS = 21;
const CELL = 10;
const SIZE = CELLS * CELL;
const BEST_KEY = "jt-snake-best";

type Dir = { x: number; y: number };
type Cell = { x: number; y: number };
const DIRS: Record<string, Dir> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

function readBest(): number {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

function freeCell(snake: Cell[]): Cell {
  for (;;) {
    const cell = { x: Math.floor(Math.random() * CELLS), y: Math.floor(Math.random() * CELLS) };
    if (!snake.some((s) => s.x === cell.x && s.y === cell.y)) return cell;
  }
}

export default function Snake() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const game = useRef({
    snake: [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }] as Cell[],
    dir: DIRS.right as Dir,
    queued: [] as Dir[],
    food: { x: 15, y: 10 } as Cell,
  });
  const [state, setState] = useState<"ready" | "playing" | "paused" | "over">("ready");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(readBest);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  const draw = useCallback(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    const styles = getComputedStyle(el);
    const ink = styles.getPropertyValue("--ink").trim() || "#000";
    const grid = styles.getPropertyValue("--grid").trim() || "rgba(0,0,0,.05)";
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    if (el.width !== SIZE * ratio) {
      el.width = el.height = SIZE * ratio;
    }
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.fillStyle = grid;
    for (let i = 0; i < CELLS; i++) for (let j = 0; j < CELLS; j++) if ((i + j) % 2 === 0) ctx.fillRect(i * CELL, j * CELL, CELL, CELL);
    const { snake, food } = game.current;
    ctx.fillStyle = ink;
    snake.forEach((part, i) => {
      const inset = i === 0 ? 0.5 : 1.5;
      ctx.fillRect(part.x * CELL + inset, part.y * CELL + inset, CELL - inset * 2, CELL - inset * 2);
    });
    ctx.beginPath();
    ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2 - 1.5, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  const reset = useCallback(() => {
    const snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    game.current = { snake, dir: DIRS.right as Dir, queued: [], food: freeCell(snake) };
    setScore(0);
    draw();
  }, [draw]);

  useEffect(() => {
    draw();
    const observer = new MutationObserver(draw);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-scheme"] });
    return () => observer.disconnect();
  }, [draw]);

  useEffect(() => {
    if (state !== "playing") return;
    const speed = Math.max(70, 150 - score * 4);
    const timer = setInterval(() => {
      const g = game.current;
      const next = g.queued.shift();
      if (next && !(next.x === -g.dir.x && next.y === -g.dir.y)) g.dir = next;
      const head = g.snake[0] ?? { x: 10, y: 10 };
      const moved = { x: (head.x + g.dir.x + CELLS) % CELLS, y: (head.y + g.dir.y + CELLS) % CELLS };
      if (g.snake.some((part) => part.x === moved.x && part.y === moved.y)) {
        setState("over");
        setBest((b) => {
          const top = Math.max(b, g.snake.length - 3);
          try {
            localStorage.setItem(BEST_KEY, String(top));
          } catch {
            // private window: the record lasts for the visit
          }
          return top;
        });
        return;
      }
      g.snake.unshift(moved);
      if (moved.x === g.food.x && moved.y === g.food.y) {
        g.food = freeCell(g.snake);
        setScore(g.snake.length - 3);
      } else g.snake.pop();
      draw();
    }, speed);
    return () => clearInterval(timer);
  }, [state, score, draw]);

  const steer = (name: string) => {
    const dir = DIRS[name];
    if (!dir) return;
    if (state === "ready" || state === "over") {
      if (state === "over") reset();
      setState("playing");
    }
    const q = game.current.queued;
    if (q.length < 3) q.push(dir);
  };
  const ok = () => {
    if (state === "playing") setState("paused");
    else {
      if (state === "over") reset();
      setState("playing");
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const map: Record<string, string> = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", w: "up", s: "down", a: "left", d: "right", "2": "up", "8": "down", "4": "left", "6": "right" };
    const name = map[event.key];
    if (name) {
      event.preventDefault();
      steer(name);
    } else if (event.key === "Enter" || event.key === " " || event.key === "5") {
      event.preventDefault();
      ok();
    }
  };
  const onPointerDown = (event: PointerEvent) => {
    swipe.current = { x: event.clientX, y: event.clientY };
  };
  const onPointerUp = (event: PointerEvent) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) {
      ok();
      return;
    }
    steer(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up");
  };

  const message = state === "ready" ? "Press OK to play" : state === "paused" ? "Paused" : state === "over" ? `Game over · ${score}` : "";
  return (
    <div className="snake">
      <div className="snake-screen">
        <div className="snake-bar">
          <span>SCORE {String(score).padStart(3, "0")}</span>
          <span>BEST {String(best).padStart(3, "0")}</span>
        </div>
        <canvas
          ref={canvas}
          width={SIZE}
          height={SIZE}
          tabIndex={0}
          role="application"
          aria-label="Snake. Arrow keys steer, Enter starts and pauses."
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        />
        {message && <p className="snake-message">{message}</p>}
      </div>
      <div className="snake-pad" aria-hidden="true">
        {(["up", "left", "ok", "right", "down"] as const).map((name) => (
          <button
            key={name}
            type="button"
            tabIndex={-1}
            className={`snake-${name}`}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              if (name === "ok") ok();
              else steer(name);
              canvas.current?.focus({ preventScroll: true });
            }}
          >
            {name === "ok" ? "OK" : ""}
          </button>
        ))}
      </div>
    </div>
  );
}
