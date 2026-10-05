import { Link } from "react-router-dom";
import { asset } from "../lib/asset.ts";

/** The wordmark. One white logo, turned black for light mode by the stylesheet. */
export default function Brand({ label = "JTech Forums home" }: { label?: string }) {
  return (
    <Link className="brand" to="/" aria-label={label}>
      <img className="logo" src={asset("/img/whitelogo.webp")} alt="JTech" />
      <span>FORUMS</span>
    </Link>
  );
}
