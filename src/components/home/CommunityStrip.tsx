import type { AboutStats } from "../../lib/forum.ts";
import CountUp from "../CountUp.tsx";
import Icon from "../Icon.tsx";

const compact = (n: number): string =>
  Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);

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
          Since 2023.{" "}
          <br />
          Built by its members.
          {sample && <small>Local preview · sample numbers</small>}
        </div>
      </div>
    </div>
  );
}
