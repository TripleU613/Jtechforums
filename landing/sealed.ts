/**
 * The taglines as they ship: one AES-GCM box per line, each under its own key.
 *
 * This is not secrecy, and cannot be. The password is right here in the bundle
 * because the browser has to do the opening, and nothing can be withheld from
 * a machine you have handed the whole page to. What the sealing buys is that
 * the list is no longer *readable*: `view-source` shows base64, so the joke is
 * met one line at a time instead of being scrolled through in a block. Dumping
 * the lot costs one key derivation per line — minutes, not a glance — and the
 * page itself only ever pays for the line it is about to show.
 */
export interface SealedTaglines {
  /** Base64. Joined with the line's index to salt that line's key. */
  readonly salt: string;
  /** PBKDF2 rounds per line. The cost of dumping the list is all here. */
  readonly iterations: number;
  /** Base64 `iv (12) || ciphertext || tag (16)`, in the source list's order. */
  readonly lines: readonly string[];
}

/**
 * The password every line's key is stretched from. It ships with the page, and
 * is meant to — see `SealedTaglines`. Changing it re-seals the list on the next
 * build and stops any older ciphertext opening.
 */
export const SEAL_PASSWORD = "jtech-forums/taglines";
