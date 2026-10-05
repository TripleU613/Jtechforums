import { useEffect, useRef, useState } from "react";
import { SCALES, setDevOptions, useDevOptions } from "../lib/devmode.ts";
import { toast } from "../lib/toast.ts";
import Icon from "./Icon.tsx";

/** The pointer-location strip and crosshair, as on an Android phone. */
function PointerLocation() {
  const [state, setState] = useState({ x: 0, y: 0, vx: 0, vy: 0, down: false });
  const last = useRef({ x: 0, y: 0, t: 0 });
  useEffect(() => {
    const move = (event: PointerEvent) => {
      const now = performance.now();
      const dt = Math.max(1, now - last.current.t);
      const vx = (event.clientX - last.current.x) / dt;
      const vy = (event.clientY - last.current.y) / dt;
      last.current = { x: event.clientX, y: event.clientY, t: now };
      setState((s) => ({ ...s, x: event.clientX, y: event.clientY, vx, vy }));
    };
    const down = () => setState((s) => ({ ...s, down: true }));
    const up = () => setState((s) => ({ ...s, down: false }));
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, []);
  return (
    <div className="dev-pointer" aria-hidden="true">
      <p className="dev-pointer-strip">
        <span>P: {state.down ? 1 : 0} / 1</span>
        <span>X: {state.x.toFixed(1)}</span>
        <span>Y: {state.y.toFixed(1)}</span>
        <span>Xv: {state.vx.toFixed(3)}</span>
        <span>Yv: {state.vy.toFixed(3)}</span>
      </p>
      <i className="dev-cross-x" style={{ transform: `translateY(${state.y}px)` }} />
      <i className="dev-cross-y" style={{ transform: `translateX(${state.x}px)` }} />
    </div>
  );
}

/** "Show taps": a dot wherever a pointer goes down. */
function ShowTaps() {
  const [taps, setTaps] = useState<Array<{ id: number; x: number; y: number }>>([]);
  useEffect(() => {
    const down = (event: PointerEvent) => {
      const tap = { id: performance.now(), x: event.clientX, y: event.clientY };
      setTaps((all) => [...all.slice(-8), tap]);
      setTimeout(() => setTaps((all) => all.filter((t) => t.id !== tap.id)), 650);
    };
    window.addEventListener("pointerdown", down, { passive: true });
    return () => window.removeEventListener("pointerdown", down);
  }, []);
  return (
    <div className="dev-taps" aria-hidden="true">
      {taps.map((tap) => (
        <i key={tap.id} style={{ left: tap.x, top: tap.y }} />
      ))}
    </div>
  );
}

function Switch({ label, detail, on, onChange }: { label: string; detail: string; on: boolean; onChange: (on: boolean) => void }) {
  return (
    <button type="button" className="dev-row" role="switch" aria-checked={on} onClick={() => onChange(!on)}>
      <span>
        <strong>{label}</strong>
        <small>{detail}</small>
      </span>
      <i className={`dev-switch${on ? " is-on" : ""}`} />
    </button>
  );
}

/** Developer options: hidden until the logo on the home page is tapped seven times. */
export default function DevOptions() {
  const options = useDevOptions();
  const [open, setOpen] = useState(true);
  if (!options.unlocked) return null;
  const scaleLabel = options.scale === 0 ? "Animation off" : `Animation scale ${options.scale}x`;
  const nextScale = SCALES[(SCALES.indexOf(options.scale as (typeof SCALES)[number]) + 1) % SCALES.length] ?? 1;
  return (
    <>
      {options.pointer && <PointerLocation />}
      {options.taps && <ShowTaps />}
      <aside className={`dev-panel${open ? " is-open" : ""}`} aria-label="Developer options">
        <button type="button" className="dev-head" onClick={() => setOpen(!open)} aria-expanded={open}>
          <Icon name="code" size={16} />
          <span>Developer options</span>
          <Icon name={open ? "close" : "plus"} size={14} />
        </button>
        {open && (
          <div className="dev-body">
            <Switch label="Show layout bounds" detail="Outline every box on the page" on={options.bounds} onChange={(bounds) => setDevOptions({ bounds })} />
            <Switch label="Show taps" detail="Mark each tap and click" on={options.taps} onChange={(taps) => setDevOptions({ taps })} />
            <Switch label="Pointer location" detail="Track the pointer, with velocity" on={options.pointer} onChange={(pointer) => setDevOptions({ pointer })} />
            <button type="button" className="dev-row" onClick={() => setDevOptions({ scale: nextScale })}>
              <span>
                <strong>Animator duration scale</strong>
                <small>{scaleLabel}</small>
              </span>
              <Icon name="sliders" size={16} />
            </button>
            <button
              type="button"
              className="dev-off"
              onClick={() => {
                setDevOptions({ unlocked: false, bounds: false, taps: false, pointer: false, scale: 1 });
                toast("Developer options are off");
              }}
            >
              Turn off developer options
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
