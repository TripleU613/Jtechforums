import { useEffect, useState } from "react";
import type { AboutStats } from "../../lib/forum.ts";
import CountUp from "../CountUp.tsx";
import Icon from "../Icon.tsx";

const compact = (n: number): string =>
  Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);

const whole = (n: number) => n.toLocaleString("en-US");

/** A different live fact every few seconds, from the same /about.json. */
function Pulse({ stats }: { stats?: AboutStats }) {
  const facts = [
    stats?.posts_last_day !== undefined && `${whole(stats.posts_last_day)} posts in the last day`,
    stats?.active_users_last_day !== undefined && `${whole(stats.active_users_last_day)} members around today`,
    stats?.topics_30_days !== undefined && `${whole(stats.topics_30_days)} new topics this month`,
    stats?.likes_30_days !== undefined && `${whole(stats.likes_30_days)} likes this month`,
  ].filter((fact): fact is string => typeof fact === "string");
  const [at, setAt] = useState(0);
  useEffect(() => {
    if (facts.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setAt((i) => i + 1), 3600);
    return () => clearInterval(timer);
  }, [facts.length]);
  if (!facts.length) return null;
  const fact = facts[at % facts.length];
  return (
    <span className="strip-pulse" aria-live="off">
      <i aria-hidden="true" />
      <span key={fact}>{fact}</span>
    </span>
  );
}

/** Live numbers from the forum's /about.json. */
export default function CommunityStrip({ stats, sample }: { stats?: AboutStats; sample: boolean }) {
  return (
    <div className="community-strip">
      <div className="container strip-inner">
        <div className="strip-intro">
          <Icon name="chat" />
          <span>
            Free to read.{" "}
            <br />
            <strong>No account needed.</strong>
          </span>
        </div>
        <div>
          <strong>
            <CountUp value={stats?.users_count} format={compact} />
          </strong>
          <span>Members</span>
        </div>
        <div>
          <strong>
            <CountUp value={stats?.posts_count} format={compact} />
          </strong>
          <span>Posts</span>
        </div>
        <div>
          <strong>
            <CountUp value={stats?.active_users_30_days} format={compact} />
          </strong>
          <span>Active this month</span>
        </div>
        <div className="strip-note">
          <Pulse stats={stats} />
          Since 2023, built by its members.
          {sample && <small>Local preview · sample numbers</small>}
        </div>
      </div>
    </div>
  );
}
