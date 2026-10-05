import { useEffect, useState } from "react";
import { TOAST_EVENT } from "../lib/toast.ts";

/** Shows the latest toast(); a new one replaces the old. */
export default function Toaster() {
  const [current, setCurrent] = useState<{ message: string; id: number } | null>(null);
  useEffect(() => {
    let timer = 0;
    const show = (event: Event) => {
      const { message, ms } = (event as CustomEvent<{ message: string; ms: number }>).detail;
      setCurrent({ message, id: Date.now() });
      clearTimeout(timer);
      timer = window.setTimeout(() => setCurrent(null), ms);
    };
    window.addEventListener(TOAST_EVENT, show);
    return () => {
      window.removeEventListener(TOAST_EVENT, show);
      clearTimeout(timer);
    };
  }, []);
  return (
    <div className="toaster" role="status" aria-live="polite">
      {current && (
        <p key={current.id} className="toast">
          {current.message}
        </p>
      )}
    </div>
  );
}
