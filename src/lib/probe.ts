/**
 * Decides whether this browser can reach the chat server before sending it
 * there.
 *
 * A content filter rarely fails the way a dead network does. Many answer with
 * their own block page and a 200, so "the request succeeded" proves nothing;
 * only a body that the real API would send counts. The invite endpoint answers
 * cross-origin and echoes the code back, which a block page cannot fake.
 */

export type Reach = "open" | "blocked";

/** Invite codes are short and URL-safe; anything else is not ours to forward. */
const CODE = /^[A-Za-z0-9-]{2,32}$/;

export const API = "https://discord.com/api/v10/invites/";
export const INVITE = "https://discord.com/invite/";

/** How long the check may take before it counts as blocked. */
export const TIMEOUT_MS = 6000;

/** The invite code from `?i=`, or null when it is missing or malformed. */
export function inviteCode(search: string): string | null {
  const code = new URLSearchParams(search).get("i");
  return code !== null && CODE.test(code) ? code : null;
}

type Fetch = (url: string, init: { signal: AbortSignal; credentials: "omit" }) => Promise<Response>;

export async function probe(code: string, fetchFn: Fetch, timeoutMs = TIMEOUT_MS): Promise<Reach> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchFn(API + encodeURIComponent(code), {
      signal: controller.signal,
      credentials: "omit",
    });
    // A shared filter exit hits the rate limit for everyone behind it; that is
    // the real API answering, so the way through is open.
    if (response.status === 429) return "open";
    // An expired invite is the real API too. Send them on: the server's own
    // page says what went wrong better than we can.
    if (response.status === 404) return "open";
    if (!response.ok) return "blocked";
    const body: unknown = await response.json();
    return isInvite(body, code) ? "open" : "blocked";
  } catch {
    // Refused, reset, timed out, stripped of CORS headers, or not JSON: every
    // way a filter answers instead of the server.
    return "blocked";
  } finally {
    clearTimeout(timer);
  }
}

function isInvite(body: unknown, code: string): boolean {
  return typeof body === "object" && body !== null && (body as { code?: unknown }).code === code;
}
