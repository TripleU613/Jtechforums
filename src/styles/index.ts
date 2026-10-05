import honors from "./legacy/honors.ts";
import tailwind from "./legacy/tailwind.ts";
import global from "./legacy/global.ts";
import night from "./legacy/night.ts";
import mobile from "./legacy/mobile.ts";

/** Every stylesheet, in cascade order. */
export default function stylesheet(): string {
  return [honors, tailwind, global, night, mobile].join("\n");
}
