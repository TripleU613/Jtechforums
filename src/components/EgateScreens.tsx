import type { CSSProperties } from "react";
import ThemedShot from "./ThemedShot.tsx";

/** eGate 1.47's own screens, in turn: set up from a computer, then the password, then the license. */
export const EGATE_SCREENS = [
  { base: "/img/egate/login", alt: "eGate 1.47 asking for its password" },
  { base: "/img/egate/setup", alt: "eGate 1.47 setup: a command to run from a connected computer" },
  { base: "/img/egate/activate", alt: "eGate 1.47 asking for a license code" },
] as const;

interface Screen {
  base: string;
  alt: string;
}

export default function EgateScreens({
  className = "",
  screens = EGATE_SCREENS,
}: {
  className?: string;
  screens?: readonly Screen[];
}) {
  return (
    <div className={`phone-screen ${className}`}>
      {screens.map((screen, i) => (
        <div className="screen-frame" key={screen.base} style={{ "--frame": i } as CSSProperties}>
          <ThemedShot base={screen.base} alt={screen.alt} eager={i === 0} />
        </div>
      ))}
    </div>
  );
}
