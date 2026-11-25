import assert from "node:assert/strict";
import { test } from "node:test";

import { API, inviteCode, probe } from "../src/lib/probe.ts";

const json = (status: number, body: unknown): Response =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

test("reads a well-formed invite code and rejects anything else", () => {
  assert.equal(inviteCode("?i=abc-DEF123"), "abc-DEF123");
  assert.equal(inviteCode(""), null);
  assert.equal(inviteCode("?i=a"), null);
  assert.equal(inviteCode("?i=https://evil.example"), null);
  assert.equal(inviteCode("?i=abc%2F..%2Fx"), null);
});

test("open when the API echoes the invite back", async () => {
  let asked = "";
  const reach = await probe("abc123", async (url) => {
    asked = url;
    return json(200, { code: "abc123", guild: {} });
  });
  assert.equal(reach, "open");
  assert.equal(asked, API + "abc123");
});

test("blocked when a filter answers 200 with its own page", async () => {
  const html = async () =>
    new Response("<html>Blocked by your filter</html>", { status: 200, headers: { "content-type": "text/html" } });
  assert.equal(await probe("abc123", html), "blocked");
});

test("blocked when a filter answers 200 with some other JSON", async () => {
  assert.equal(await probe("abc123", async () => json(200, { blocked: true })), "blocked");
});

test("blocked on network failure and on filter error statuses", async () => {
  assert.equal(await probe("abc123", async () => Promise.reject(new TypeError("Failed to fetch"))), "blocked");
  assert.equal(await probe("abc123", async () => json(403, { message: "denied" })), "blocked");
});

test("open on rate limiting and on an expired invite, since both are the real API", async () => {
  assert.equal(await probe("abc123", async () => json(429, { retry_after: 1 })), "open");
  assert.equal(await probe("abc123", async () => json(404, { code: 10006 })), "open");
});

test("blocked when the check hangs past the timeout", async () => {
  const hang = (_url: string, init: { signal: AbortSignal }) =>
    new Promise<Response>((_resolve, reject) =>
      init.signal.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError"))),
    );
  assert.equal(await probe("abc123", hang, 20), "blocked");
});
