import { useState } from "react";

/** A portrait that falls back to initials when there is no image or it fails. */
export default function Avatar({
  name,
  image,
  className = "avatar",
}: {
  name: string;
  image?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <span className={className}>
      {image && !failed ? (
        <img src={image} alt="" loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <span aria-hidden="true">{name.replace(/^@/, "").slice(0, 2).toUpperCase()}</span>
      )}
    </span>
  );
}
