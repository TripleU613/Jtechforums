import { useEffect, useState } from "react";
import { sample } from "../data/sampleForum.ts";
import { usingSample, type LatestPayload } from "./forum.ts";
import { forumTopic } from "./links.ts";

export interface SearchHit {
  id: number;
  title: string;
  href: string;
  blurb?: string;
}

interface SearchPayload {
  topics?: Array<{ id: number; title: string; slug: string }>;
  posts?: Array<{ topic_id: number; blurb?: string }>;
}

/** The forum's own search (the same one its search box uses), topics first. */
async function searchForum(term: string, signal: AbortSignal): Promise<SearchHit[]> {
  if (usingSample) {
    const topics = (sample("/latest.json") as LatestPayload).topic_list?.topics ?? [];
    const needle = term.replace(/\bcategory:\S+/g, "").trim().toLowerCase();
    return topics
      .filter((t) => t.title.toLowerCase().includes(needle))
      .map((t) => ({ id: t.id, title: t.title, href: forumTopic(t.slug, t.id) }));
  }
  const response = await fetch(`/search/query.json?term=${encodeURIComponent(term)}&include_blurbs=true`, {
    signal,
    headers: { Accept: "application/json" },
    credentials: "same-origin",
  });
  if (!response.ok) throw new Error(String(response.status));
  const payload = (await response.json()) as SearchPayload;
  const blurbs = new Map<number, string>();
  for (const post of payload.posts ?? []) if (post.blurb && !blurbs.has(post.topic_id)) blurbs.set(post.topic_id, post.blurb);
  return (payload.topics ?? []).map((t) => ({
    id: t.id,
    title: t.title,
    href: forumTopic(t.slug, t.id),
    blurb: blurbs.get(t.id),
  }));
}

export type SearchState =
  | { status: "idle"; hits: [] }
  | { status: "searching"; hits: SearchHit[] }
  | { status: "done"; hits: SearchHit[] }
  | { status: "error"; hits: [] };

/**
 * Search as someone types: waits for a pause and three characters (every
 * request reaches the forum's search log and its rate limits), and keeps
 * the last results while it looks.
 */
export function useForumSearch(term: string, wait = 600, scope = ""): SearchState {
  const [state, setState] = useState<SearchState>({ status: "idle", hits: [] });
  const typed = term.trim();
  // A scope like "category:75" narrows the search; it isn't counted as typing.
  const query = typed.length >= 3 ? `${typed} ${scope}`.trim() : typed;
  useEffect(() => {
    if (typed.length < 3) {
      setState({ status: "idle", hits: [] });
      return;
    }
    const controller = new AbortController();
    setState((prev) => ({ status: "searching", hits: prev.hits }));
    const timer = setTimeout(() => {
      searchForum(query, controller.signal).then(
        (hits) => setState({ status: "done", hits: hits.slice(0, 6) }),
        () => {
          if (!controller.signal.aborted) setState({ status: "error", hits: [] });
        },
      );
    }, wait);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, wait]);
  return state;
}
