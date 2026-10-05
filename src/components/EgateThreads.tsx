import { forumPaths, type LatestPayload } from "../lib/forum.ts";
import { forumTopic, links } from "../lib/links.ts";
import { useForum } from "../lib/useForum.ts";
import Icon from "./Icon.tsx";

const ago = (iso: string): string => {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

/** The eGate category's most recently active threads, live from the forum. */
export default function EgateThreads() {
  const state = useForum<LatestPayload>(forumPaths.egate);
  const topics = (state.data?.topic_list?.topics ?? []).filter((topic) => !topic.pinned).slice(0, 5);
  if (state.status === "error" || (state.status === "ready" && topics.length === 0)) {
    return (
      <a className="page-link" href={links.egateCategory}>
        Open the eGate category <Icon />
      </a>
    );
  }
  return (
    <div className="eg-threads">
      {state.status === "loading" ? (
        <p className="page-footnote">Loading the eGate category…</p>
      ) : (
        <ul>
          {topics.map((topic) => (
            <li key={topic.id}>
              <a className="eg-thread spotlight" href={forumTopic(topic.slug, topic.id)}>
                <strong>{topic.title}</strong>
                <span>
                  {topic.reply_count ?? 0} {topic.reply_count === 1 ? "reply" : "replies"} · active{" "}
                  {ago(topic.bumped_at ?? topic.created_at)}
                </span>
                <Icon name="arrow" size={16} />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
