import { useMemo, useState, type FormEvent } from "react";
import { forumPaths, type CategoriesPayload, type LatestPayload, type Topic } from "../../lib/forum.ts";
import { FORUM, forumSearch, forumTopic, links } from "../../lib/links.ts";
import { useForumSearch } from "../../lib/search.ts";
import { useForum } from "../../lib/useForum.ts";
import Icon, { type IconName } from "../Icon.tsx";

const TABS = ["Latest", "Popular", "Most discussed"] as const;
type Tab = (typeof TABS)[number];
const SYMBOLS: IconName[] = ["phone", "book", "chat", "grid"];
const SUGGESTIONS = ["Qin F21 Pro", "TCL Flip 2", "Kyocera E4810", "eGate", "ADB"];

const activity = (topic: Topic): number => new Date(topic.bumped_at ?? topic.created_at).getTime();

function categoryNames(payload: CategoriesPayload | null): Map<number, string> {
  const names = new Map<number, string>();
  for (const category of payload?.category_list?.categories ?? []) {
    names.set(category.id, category.name);
    for (const sub of category.subcategory_list ?? []) names.set(sub.id, sub.name);
  }
  return names;
}

function firstTag(topic: Topic): string | undefined {
  const tag = topic.tags?.[0];
  return typeof tag === "string" ? tag : tag?.name;
}

export default function Conversation({ sample }: { sample: boolean }) {
  const latest = useForum<LatestPayload>(forumPaths.latest);
  const categories = useForum<CategoriesPayload>(forumPaths.categories);
  const [tab, setTab] = useState<Tab>("Latest");
  const [query, setQuery] = useState("");
  const live = useForumSearch(query);
  const names = useMemo(() => categoryNames(categories.data), [categories.data]);
  const topics = useMemo(() => {
    const list = (latest.data?.topic_list?.topics ?? []).filter((t) => !t.pinned_globally);
    const order: Record<Tab, (a: Topic, b: Topic) => number> = {
      Latest: (a, b) => activity(b) - activity(a),
      Popular: (a, b) => (b.views ?? 0) - (a.views ?? 0),
      "Most discussed": (a, b) => (b.reply_count ?? 0) - (a.reply_count ?? 0),
    };
    return [...list].sort(order[tab]).slice(0, 4);
  }, [latest.data, tab]);

  const search = (event: FormEvent) => {
    event.preventDefault();
    if (query.trim()) window.location.assign(forumSearch(query.trim()));
  };

  return (
    <section className="conversation-section container">
      <div className="discussion-main">
        <div className="section-top">
          <div>
            <span className="eyebrow">LIVE FROM THE FORUM</span>
            <h2>Inside the forum.</h2>
          </div>
          <a className="text-link" href={links.latest}>
            All recent topics <Icon name="arrow" size={17} />
          </a>
        </div>
        <div className="topic-tabs" role="tablist" aria-label="Sort topics">
          {TABS.map((name) => (
            <button
              type="button"
              key={name}
              role="tab"
              aria-selected={tab === name}
              onClick={() => setTab(name)}
            >
              {name}
            </button>
          ))}
          <span>{sample ? "Sample topics" : "Updated live"}</span>
        </div>
        <div className="topics" role="tabpanel" aria-label={`${tab} topics`}>
          {latest.status === "loading" && (
            <p className="empty-state" role="status">
              Loading topics…
            </p>
          )}
          {latest.status === "error" && (
            <div className="empty-state">
              <p>The latest topics didn't load here.</p>
              <a className="text-link" href={FORUM}>
                Open the forum <Icon />
              </a>
            </div>
          )}
          {latest.status === "ready" && topics.length === 0 && (
            <p className="empty-state">Nothing new right now. Start a topic on the forum.</p>
          )}
          {topics.map((topic, i) => (
            <a className="topic-row" href={forumTopic(topic.slug, topic.id)} key={topic.id}>
              <span className={`topic-symbol symbol-${i}`}>
                <Icon name={SYMBOLS[i] ?? "chat"} />
              </span>
              <div>
                <h3>{topic.title}</h3>
                <p>
                  <span className="category-dot" />
                  {(topic.category_id !== undefined && names.get(topic.category_id)) ||
                    firstTag(topic) ||
                    "Forum"}
                  <span className="topic-date">
                    {new Date(activity(topic)).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </p>
              </div>
              <span className="topic-replies" aria-label={`${topic.reply_count ?? 0} replies`}>
                <Icon name="chat" size={16} />
                {topic.reply_count ?? 0}
              </span>
              <Icon name="arrow" size={17} />
            </a>
          ))}
        </div>
        <form className="forum-search" onSubmit={search} role="search">
          <Icon name="search" />
          <input
            aria-label="Search the forum"
            placeholder="Search the forum: a phone, an error, an app…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            required
          />
          <button aria-label="Search" type="submit">
            <Icon />
          </button>
        </form>
        {query.trim().length >= 2 && (
          <div className="search-live" aria-live="polite">
            {live.hits.length > 0 ? (
              <ul>
                {live.hits.slice(0, 5).map((hit) => (
                  <li key={hit.id}>
                    <a href={hit.href}>
                      <strong>{hit.title}</strong>
                      {hit.blurb && <span>{hit.blurb}</span>}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                {live.status === "searching"
                  ? "Searching…"
                  : live.status === "error"
                    ? "Live results didn't load. Press Enter for the full search."
                    : "No topics match yet. Press Enter for the full search."}
              </p>
            )}
          </div>
        )}
        <div className="search-suggestions">
          <span>Try</span>
          {SUGGESTIONS.map((suggestion) => (
            <button type="button" key={suggestion} onClick={() => setQuery(suggestion)}>
              {suggestion}
            </button>
          ))}
        </div>
      </div>
      <aside className="community-aside spotlight">
        <div className="eyebrow">BEFORE YOU POST</div>
        <Icon name="search" size={36} />
        <h3>
          Search first.{" "}
          <br />
          It's probably been asked.
        </h3>
        <p>
          Most questions already have a thread, often for the exact same model. If yours doesn't,
          start one with the details: the model, the software version, and what you've tried.
        </p>
        <a className="button" href={`${FORUM}/new-topic`}>
          Ask on the forum <Icon name="arrow" size={18} />
        </a>
        <span className="aside-signoff">Beginner questions are welcome.</span>
      </aside>
    </section>
  );
}
