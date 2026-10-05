import type { LoadState } from "../../lib/useForum.ts";
import { links } from "../../lib/links.ts";
import Avatar from "../Avatar.tsx";
import Icon from "../Icon.tsx";

export interface Champion {
  id: number;
  username: string;
  position: number;
  points: number;
  avatar: string;
  profile: string;
}

export interface Moderator {
  username: string;
  avatar: string;
  profile: string;
}

const PLACES = ["First place", "Second place", "Third place"];

function Laurel() {
  return (
    <svg className="honors-laurel" viewBox="0 0 240 240" fill="none" aria-hidden="true">
      <circle cx="120" cy="120" r="108" stroke="currentColor" strokeDasharray="1 9" />
      <path d="M96 207C38 181 23 108 59 48M144 207c58-26 73-99 37-159" stroke="currentColor" />
      {[0, 1].map((side) => (
        <g key={side} transform={side ? "translate(240 0) scale(-1 1)" : undefined}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <g key={i} transform={`rotate(${i * 15} 120 120)`}>
              <path d="M48 132c-17-7-23-18-22-30 14 5 22 15 22 30Z" fill="currentColor" opacity=".65" />
              <path d="M48 132c0-17 7-28 18-34 2 15-5 28-18 34Z" fill="currentColor" opacity=".4" />
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}

/** This month's leaderboard and the moderators, from the forum. */
export default function Honors({
  champions,
  moderators,
  sample,
}: {
  champions: LoadState<Champion[]>;
  moderators: Moderator[];
  sample: boolean;
}) {
  const entries = champions.data ?? [];
  return (
    <section className="community-honors" aria-labelledby="honors-title">
      <div className="container">
        <header className="honors-heading">
          <div>
            <p className="honors-period">{sample ? "Sample leaderboard" : "This month"}</p>
            <h2 id="honors-title">
              Community{" "}
              <br />
              <span>champions.</span>
            </h2>
          </div>
          <a className="text-link" href={links.leaderboard}>
            The full leaderboard <Icon />
          </a>
        </header>
        {entries.length > 0 ? (
          <ol className="honors-board" aria-label="This month's leaderboard">
            {entries.map((member, index) => (
              <li key={member.id} className={`honors-place honors-place-${index + 1}`}>
                <a href={member.profile} className="honors-member">
                  <span className="honors-rank">
                    <span className="sr-only">Rank </span>
                    {String(member.position).padStart(2, "0")}
                  </span>
                  <div className="honors-medallion">
                    {index === 0 && <Laurel />}
                    <Avatar name={member.username} image={member.avatar} className="honors-portrait" />
                  </div>
                  <div className="honors-identity">
                    <span className="honors-place-label">{PLACES[index]}</span>
                    <h3>{member.username}</h3>
                  </div>
                  <div className="honors-score">
                    <strong>{Intl.NumberFormat("en").format(member.points)}</strong>
                    <span>points</span>
                  </div>
                  <span className="honors-profile">
                    View profile <Icon name="arrow" size={16} />
                  </span>
                </a>
              </li>
            ))}
          </ol>
        ) : (
          <div className="honors-empty" role="status">
            <span>
              {champions.status === "loading"
                ? "Loading this month’s champions…"
                : champions.status === "error"
                  ? "This month’s rankings are on the forum."
                  : "A new month. The leaderboard is just getting started."}
            </span>
            <Icon name="chat" size={36} />
          </div>
        )}
        {moderators.length > 0 && (
          <div className="honors-moderators">
            <header>
              <h3>
                Our moderators<span>.</span>
              </h3>
              <p>Volunteers who keep threads on topic and the forum clean.</p>
            </header>
            <ul className="honors-mod-list">
              {moderators.map((member) => (
                <li key={member.username}>
                  <a href={member.profile}>
                    <Avatar name={member.username} image={member.avatar} className="honors-portrait" />
                    <span className="honors-mod-name">{member.username}</span>
                    <span className="honors-mod-role">Moderator</span>
                    <Icon name="arrow" size={15} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
