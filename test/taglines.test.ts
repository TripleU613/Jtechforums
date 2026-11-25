import assert from "node:assert/strict";
import { test } from "node:test";

import { TAGLINES } from "../landing/taglines.ts";

/** Two lines of the 40ch measure the layout reserves and never resizes. */
const MAX_LENGTH = 78;

test("every tagline fits the space the layout reserves", () => {
  const overlong = TAGLINES.filter((line) => line.length > MAX_LENGTH);
  assert.deepEqual(overlong, [], "these would be clipped");
});

test("no duplicates", () => {
  assert.equal(new Set(TAGLINES).size, TAGLINES.length);
});

test("no line is blank or padded", () => {
  for (const line of TAGLINES) {
    assert.equal(line, line.trim(), `padded: ${JSON.stringify(line)}`);
    assert.notEqual(line, "");
  }
});

/**
 * The house jokes are meant to be scattered through the rotation rather than
 * arriving in a block, so that a visitor meets them mixed in with the rest.
 */
test("the regulars are shuffled through the list, not clumped", () => {
  const regulars = [
    "dev-in-the-bm",
    "TripleU is a boogy man",
    "Ars18",
    "flippy",
    "leo buskin",
    "anon fliphones",
    "flipadmin",
    "froggy",
    "kosherboys",
    "TripleU loves arguing",
    "chatzie",
    "biden2020prez",
    "donbot",
    "kosherflipper",
    "shalom karr",
  ];

  const positions = regulars.map((name) => {
    const at = TAGLINES.findIndex((line) => line.includes(name));
    assert.notEqual(at, -1, `missing house joke: ${name}`);
    return at;
  });

  // Spread across the list rather than sitting in one run: no two adjacent, and
  // the gaps between them are not all the same.
  const sorted = [...positions].sort((a, b) => a - b);
  const gaps = sorted.slice(1).map((at, i) => at - sorted[i]!);
  assert.ok(Math.min(...gaps) > 1, "two house jokes ended up adjacent");
  assert.ok(new Set(gaps).size > 1, "the house jokes are evenly spaced, not shuffled");
});

test("the list is long enough for the coprime walk to be interesting", () => {
  assert.ok(TAGLINES.length >= 100, `only ${TAGLINES.length} taglines`);
});
