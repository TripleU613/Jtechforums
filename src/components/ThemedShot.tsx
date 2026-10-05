import { asset } from "../lib/asset.ts";

/**
 * A screenshot taken in both modes ("<base>-light.webp" and
 * "<base>-dark.webp"); the stylesheet shows the one matching the page.
 */
export default function ThemedShot({
  base,
  alt,
  className = "",
  eager = false,
}: {
  base: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  const loading = eager ? "eager" : "lazy";
  return (
    <>
      <img className={`only-light ${className}`} src={asset(`${base}-light.webp`)} alt={alt} loading={loading} />
      <img className={`only-dark ${className}`} src={asset(`${base}-dark.webp`)} alt={alt} loading={loading} />
    </>
  );
}
