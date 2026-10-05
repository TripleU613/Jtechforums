import { forumJson, type LatestPayload } from "./forum.ts";
import { links, forumTopic } from "./links.ts";

/** Somewhere on the forum, at random: a topic from one of the first ten pages of Latest. */
export async function randomThread(): Promise<string> {
  const page = Math.floor(Math.random() * 10);
  try {
    const payload = await forumJson<LatestPayload>(`/latest.json?page=${page}`);
    const topics = (payload.topic_list?.topics ?? []).filter((t) => !t.pinned && !t.pinned_globally);
    const topic = topics[Math.floor(Math.random() * topics.length)];
    return topic ? forumTopic(topic.slug, topic.id) : links.latest;
  } catch {
    return links.latest;
  }
}

export async function openRandomThread(): Promise<void> {
  window.location.assign(await randomThread());
}
