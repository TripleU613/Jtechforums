/**
 * A file in public/, resolved against the app's base path. The site is
 * served from / in development and from /home on the forum's domain, where
 * Discourse owns the root. Vite rewrites the URLs it can see at build time,
 * but not string literals in components, so every public/ asset goes
 * through here.
 */
export const asset = (path: string): string =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
