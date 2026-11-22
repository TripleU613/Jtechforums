import { asset } from "../lib/asset.ts";
import { links } from "../lib/links.ts";

/**
 * The wordmark. It says "JTech Forums", so it goes to the forum, a page load
 * away; the header's Home link is the way back to this page. One white logo,
 * turned black for light mode by the stylesheet.
 */
export default function Brand({ label = "JTech Forums" }: { label?: string }) {
  return (
    <a className="brand" href={links.forum} aria-label={label}>
      <img className="logo" src={asset("/img/whitelogo.webp")} alt="JTech" />
      <span>FORUMS</span>
    </a>
  );
}
