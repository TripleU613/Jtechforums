import { createCipheriv, pbkdf2Sync, randomBytes } from "node:crypto";

import { SEAL_PASSWORD, type SealedTaglines } from "./sealed.ts";

/**
 * Seals the tagline list for shipping. The browser side is `landing/open.ts`
 * — this writes the boxes exactly as WebCrypto's AES-GCM expects to read them,
 * and `test/seal.test.ts` holds the two ends together.
 */

/**
 * OWASP's current PBKDF2-SHA-256 figure. Around 0.1s a line on a laptop and
 * under a second on a phone, which the page hides inside the seven seconds a
 * line holds; opening all 128 costs that 128 times over, which is the point.
 * Raising it slows a dump and the first line of a visit in equal measure — the
 * first line is the one a visitor waits for, so this is the ceiling, not a
 * starting point.
 */
export const ITERATIONS = 600_000;

/** AES-256. */
const KEY_BYTES = 32;
/** GCM's nominal nonce length; anything else makes WebCrypto do extra work. */
const IV_BYTES = 12;
const SALT_BYTES = 16;

export interface SealOptions {
  /** Rounds per line. Tests wind this right down; the build does not. */
  readonly iterations?: number;
}

/**
 * The line's own salt. The index goes in rather than into the plaintext, so
 * every line costs a derivation of its own and opening one buys you nothing
 * towards the next.
 */
export function lineSalt(salt: Uint8Array, index: number): Buffer {
  return Buffer.concat([salt, Buffer.from(`/${index}`, "utf8")]);
}

export function seal(lines: readonly string[], options: SealOptions = {}): SealedTaglines {
  const iterations = options.iterations ?? ITERATIONS;
  // Fresh every build: a deploy re-seals, so nothing anyone kept still opens.
  const salt = randomBytes(SALT_BYTES);

  const sealed = lines.map((line, index) => {
    const key = pbkdf2Sync(SEAL_PASSWORD, lineSalt(salt, index), iterations, KEY_BYTES, "sha256");
    const iv = randomBytes(IV_BYTES);
    const cipher = createCipheriv("aes-256-gcm", key, iv);
    const body = Buffer.concat([cipher.update(line, "utf8"), cipher.final()]);

    // Nonce first, tag last: that is the one layout WebCrypto reads back.
    return Buffer.concat([iv, body, cipher.getAuthTag()]).toString("base64");
  });

  return { salt: salt.toString("base64"), iterations, lines: sealed };
}
