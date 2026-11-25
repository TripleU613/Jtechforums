import { SEAL_PASSWORD, type SealedTaglines } from "./sealed.ts";

/**
 * The browser half of the tagline sealing. `landing/seal.ts` writes the boxes;
 * this opens them, one at a time and only when the page is about to need one.
 *
 * Everything here is deliberately lazy. Opening the whole list on load would
 * hand the console exactly what the sealing is there to withhold, and would
 * spend a hundred key derivations to show one line.
 */

/** Nonce length, matching the seal. */
const IV_BYTES = 12;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bytes(base64: string): Uint8Array<ArrayBuffer> {
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    out[i] = raw.charCodeAt(i);
  }
  return out;
}

/** The line's own salt: the shared salt with the line's index after it. */
function lineSalt(salt: Uint8Array, index: number): Uint8Array<ArrayBuffer> {
  const suffix = encoder.encode(`/${index}`);
  const out = new Uint8Array(salt.length + suffix.length);
  out.set(salt);
  out.set(suffix, salt.length);
  return out;
}

/**
 * Returns the reader for one sealed list. Lines already opened are kept, so the
 * walk pays for each of them once however many times it comes back around.
 *
 * The promise rejects if the box will not open — a tampered build, or, far more
 * likely, no `crypto.subtle` at all, which is what an insecure origin gets.
 * `main.ts` treats the first such failure as final.
 */
export function opener(sealed: SealedTaglines): (index: number) => Promise<string> {
  const salt = bytes(sealed.salt);
  const opened = new Map<number, string>();

  return async (index: number): Promise<string> => {
    const already = opened.get(index);
    if (already !== undefined) {
      return already;
    }

    const line = sealed.lines[index];
    if (line === undefined) {
      throw new RangeError(`no tagline ${index}`);
    }
    const box = bytes(line);
    const password = await crypto.subtle.importKey(
      "raw",
      encoder.encode(SEAL_PASSWORD),
      "PBKDF2",
      false,
      ["deriveKey"],
    );
    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: lineSalt(salt, index),
        iterations: sealed.iterations,
        hash: "SHA-256",
      },
      password,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"],
    );
    const plain = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: box.slice(0, IV_BYTES) },
      key,
      box.slice(IV_BYTES),
    );

    const text = decoder.decode(plain);
    opened.set(index, text);
    return text;
  };
}
