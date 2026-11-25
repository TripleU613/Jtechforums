declare module "virtual:taglines" {
  import type { SealedTaglines } from "./sealed.ts";
  const sealed: SealedTaglines;
  export default sealed;
}
