import { sample } from "../data/sampleForum.ts";

/**
 * Reads the forum's public JSON. The page is served from the forum's own
 * domain (jtechforums.org/home), so these are same-origin requests that
 * need no key and no proxy: exactly what a signed-out visitor's browser
 * would fetch from the forum itself. Anywhere else (a local dev server, a
 * pages.dev preview) the requests fail and the sections show their
 * fallbacks, or sample data when VITE_FORUM_USE_MOCK=true.
 */

export interface ForumUser {
  id: number;
  username: string;
  name?: string;
  avatar_template?: string;
  title?: string | null;
}

export interface AboutStats {
  topics_count?: number;
  posts_count?: number;
  users_count?: number;
  active_users_30_days?: number;
  users_30_days?: number;
  posts_30_days?: number;
  posts_last_day?: number;
}

export interface AboutPayload {
  about: {
    stats?: AboutStats;
    moderator_ids?: number[];
    admin_ids?: number[];
  };
  users?: ForumUser[];
}

export interface Topic {
  id: number;
  slug: string;
  title: string;
  views?: number;
  reply_count?: number;
  like_count?: number;
  created_at: string;
  bumped_at?: string;
  category_id?: number;
  tags?: Array<string | { name: string }>;
  pinned?: boolean;
  pinned_globally?: boolean;
}

export interface LatestPayload {
  topic_list?: { topics?: Topic[] };
}

export interface CategoriesPayload {
  category_list?: {
    categories?: Array<{
      id: number;
      name: string;
      subcategory_list?: Array<{ id: number; name: string }>;
    }>;
  };
}

export interface LeaderboardPayload {
  users?: Array<ForumUser & { total_score?: number; position?: number }>;
}

export const usingSample = import.meta.env.VITE_FORUM_USE_MOCK === "true";

export async function forumJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  if (usingSample) return sample(path) as T;
  const response = await fetch(path, {
    signal: signal ?? null,
    headers: { Accept: "application/json" },
    credentials: "same-origin",
  });
  if (!response.ok) throw new Error(`${path}: ${response.status}`);
  return (await response.json()) as T;
}

export const forumPaths = {
  about: "/about.json",
  latest: "/latest.json",
  categories: "/categories.json?include_subcategories=true",
  leaderboard: (id: number, period: string) =>
    `/leaderboard/${id}.json?period=${encodeURIComponent(period)}`,
};
