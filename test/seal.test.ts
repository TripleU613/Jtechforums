import assert from "node:assert/strict";
import { test } from "node:test";

import { SEAL_PASSWORD, type SealedTaglines } from "../landing/sealed.ts";
import { ITERATIONS, lineSalt, seal } from "../landing/seal.ts";
import { TAGLINES } from "../landing/taglines.ts";

/**
 * The build seals with `node:crypto`; the browser opens with WebCrypto. Nothing
 * in the repository runs both, so the two ends are held together here: `open`
 * below is the same sequence `landing/open.ts` performs, written against the
 * platform API rather than Node's, so a box the build writes and a box the page
 * can read are asserted to be the same box.
 *
 * The deliberate expense is the whole point of the sealing, so these seal with
 * a token iteration count. `ITERATIONS` is what ships.
 */

const ROUNDS = 1000;

/** Base64 in, and a plain `Uint8Array` out — which is what WebCrypto takes. */
function bytes(base64: string): Uint8Array<ArrayBuffer> {
  return Uint8Array.from(Buffer.from(base64, "base64"));
}

async function open(sealed: SealedTaglines, index: number): Promise<string> {
  const salt = bytes(sealed.salt);
  const box = bytes(sealed.lines[index] ?? "");

  const password = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SEAL_PASSWORD),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: Uint8Array.from(lineSalt(salt, index)),
      iterations: sealed.iterations,
      hash: "SHA-256",
    },
    password,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"],
  );
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: box.subarray(0, 12) },
    key,
    box.subarray(12),
  );

  return new TextDecoder().decode(plain);
}

test("every line the build seals is a line the browser can open", async () => {
  const sealed = seal(TAGLINES, { iterations: ROUNDS });

  assert.equal(sealed.lines.length, TAGLINES.length);
  const opened = await Promise.all(sealed.lines.map((_, index) => open(sealed, index)));
  assert.deepEqual(opened, [...TAGLINES]);
});

test("nothing readable survives the sealing", () => {
  const shipped = JSON.stringify(seal(TAGLINES, { iterations: ROUNDS }));

  for (const line of TAGLINES) {
    assert.ok(!shipped.includes(line), `shipped in the clear: ${JSON.stringify(line)}`);
  }
  // Not just the whole lines: no run of one long enough to give it away either.
  for (const line of TAGLINES) {
    for (let at = 0; at + 12 <= line.length; at++) {
      assert.ok(!shipped.includes(line.slice(at, at + 12)), `leaked a run of ${line}`);
    }
  }
});

test("each line is its own box", () => {
  const sealed = seal(TAGLINES, { iterations: ROUNDS });
  const nonces = sealed.lines.map((line) => Buffer.from(line, "base64").subarray(0, 12).toString("hex"));

  assert.equal(new Set(nonces).size, nonces.length, "a nonce was reused");
  assert.equal(new Set(sealed.lines).size, sealed.lines.length, "two lines sealed identically");
});

test("a rebuild re-seals rather than reissuing the same ciphertext", () => {
  const first = seal(TAGLINES, { iterations: ROUNDS });
  const second = seal(TAGLINES, { iterations: ROUNDS });

  assert.notEqual(first.salt, second.salt);
  assert.notDeepEqual(first.lines, second.lines);
});

test("an edited box does not open", async () => {
  const sealed = seal(["Bump."], { iterations: ROUNDS });
  const box = Buffer.from(sealed.lines[0] ?? "", "base64");
  box[box.length - 1]! ^= 0xff;

  const tampered: SealedTaglines = { ...sealed, lines: [box.toString("base64")] };
  await assert.rejects(open(tampered, 0));
});

/**
 * The whole scheme rests on this number: it is what a line costs to open, and
 * so what the list costs to dump. Wound down far enough it seals nothing.
 */
test("the shipped iteration count is worth paying", () => {
  assert.ok(ITERATIONS >= 100_000, `only ${ITERATIONS} rounds a line`);
});
