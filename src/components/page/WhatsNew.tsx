import { forumPaths, type LatestPayload } from "../../lib/forum.ts";
import { forumTopic, links } from "../../lib/links.ts";
import { useForum } from "../../lib/useForum.ts";
import Icon from "../Icon.tsx";

const day = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

/** The newest posts in the forum's announcements category (its subcategories left out). */
export default function WhatsNew() {
  const state = useForum<LatestPayload>(forumPaths.announcements);
  const topics = (state.data?.topic_list?.topics ?? [])
    .filter((topic) => !topic.pinned)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);
  if (state.status === "error" || (state.status === "ready" && topics.length === 0)) return null;
  return (
    <div className="whats-new">
      {state.status === "loading" ? (
        <p className="page-footnote">Loading the latest announcements…</p>
      ) : (
        <ul>
          {topics.map((topic) => (
            <li key={topic.id}>
              <a className="whats-new-item spotlight" href={forumTopic(topic.slug, topic.id)}>
                <time dateTime={topic.created_at}>{day(topic.created_at)}</time>
                <strong>{topic.title}</strong>
                <span>
                  {topic.reply_count ?? 0} replies <Icon name="arrow" size={14} />
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
      <a className="page-link" href={`${links.forum}/c/updates-feedback/13`}>
        All announcements <Icon />
      </a>
    </div>
  );
}
