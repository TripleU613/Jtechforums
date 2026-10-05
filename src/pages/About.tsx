import { Link } from "react-router-dom";
import { Card, PageHero, SectionHead, Stat } from "../components/page/Page.tsx";
import Avatar from "../components/Avatar.tsx";
import Icon from "../components/Icon.tsx";
import ThemedShot from "../components/ThemedShot.tsx";
import Timeline from "../components/page/Timeline.tsx";
import { forumPaths, usingSample, type AboutPayload } from "../lib/forum.ts";
import { avatarUrl, forumUser, links } from "../lib/links.ts";
import { useForum } from "../lib/useForum.ts";

export default function About() {
  const about = useForum<AboutPayload>(forumPaths.about);
  const stats = about.data?.about.stats;
  const staffIds = new Set([...(about.data?.about.moderator_ids ?? []), ...(about.data?.about.admin_ids ?? [])]);
  const staff = (about.data?.users ?? []).filter((user) => staffIds.has(user.id) && user.id > 0);
  return (
    <div className="page">
      {usingSample && <p className="container local-notice">Local preview · the numbers below are sample data.</p>}
      <section className="page-intro">
        <PageHero eyebrow="ABOUT JTECH" title="It started with flip phones.">
          <p className="lede">
            JTech opened in 2023 as a place to figure out flip phones and the tools that keep
            smartphones in check. It now covers phones of every kind, filtering and device
            management, Android modding, AI, programming and servers, and it's still built by the
            people who post on it.
          </p>
        </PageHero>
        <div className="page-stats">
          <Stat value={stats?.active_users_30_days} label="Active this month" />
          <Stat value={stats?.posts_count} label="Posts" />
          <Stat value={stats?.users_count} label="Members" />
        </div>
        <p className="page-footnote">Live from the forum. Active means visited in the last 30 days.</p>
        <a className="page-shot" href={links.latest}>
          <span className="page-shot-bar" aria-hidden="true">
            <span>● ● ●</span>
            <span>jtechforums.org</span>
            <Icon name="external" size={12} />
          </span>
          <ThemedShot base="/img/forum/latest" alt="The forum's front page: the latest topics, with the sidebar of categories" />
        </a>
      </section>

      <section className="page-section">
        <SectionHead eyebrow="WHAT IT'S FOR" title="Questions, answered in public" />
        <div className="page-panel page-prose">
          <p>
            JTech is where you ask about technology and get a straight answer: which phone to buy,
            which filter fits, why an update broke something, how to make an app work with a keypad.
          </p>
          <p>
            The answers stay public, so the next person with the same phone finds them. That's why
            threads ask for exact models and versions, and why guides are reviewed before they're
            published.
          </p>
        </div>
      </section>

      <section className="page-section">
        <SectionHead eyebrow="THE LAST 30 DAYS" title="A month on the forum" />
        <div className="page-grid">
          <div className="page-card page-card-stat">
            <Stat value={stats?.users_30_days} label="New members" detail="joined in the last 30 days" />
          </div>
          <div className="page-card page-card-stat">
            <Stat value={stats?.posts_last_day} label="Posts today" detail="in the last 24 hours" />
          </div>
          <div className="page-card page-card-stat">
            <Stat value={stats?.posts_30_days} label="Posts this month" detail="in the last 30 days" />
          </div>
        </div>
      </section>

      <section className="page-section">
        <SectionHead eyebrow="HOW IT GREW" title="Since 2023" />
        <Timeline />
      </section>

      <section className="page-section">
        <SectionHead eyebrow="WHAT YOU'LL FIND" title="The forum, the guides, and a version for flip phones" />
        <div className="page-grid">
          <Card
            icon="chat"
            title="The forum"
            action={
              <a className="page-link" href={links.forum}>
                Visit the forum <Icon />
              </a>
            }
          >
            Threads on phones, filtering, Android, apps, AI, code and servers, sorted by device and
            topic. Free to read, no account needed.
          </Card>
          <Card
            icon="book"
            title="Guides"
            action={
              <a className="page-link" href={links.guides}>
                Browse the guides <Icon />
              </a>
            }
          >
            Step-by-step guides that a moderator reviews before they go up: rooting, flashing ROMs,
            ADB, backups, and fixes for specific phones.
          </Card>
          <Card
            icon="keypad"
            title="Dumbcourse"
            action={
              <a className="page-link" href={links.dumbcourse}>
                Open jtechforums.org/dumb <Icon />
              </a>
            }
          >
            The whole forum rebuilt for flip phones and old browsers: D-pad navigation, keypad
            shortcuts, and signing in without typing a password.
          </Card>
        </div>
      </section>

      <section className="page-section">
        <SectionHead eyebrow="HOW IT WORKS" title="A few house rules" />
        <div className="page-grid">
          <Card title="Details first">
            Help threads ask for the exact model, software version, what you expected, what happened
            and what you tried. It's what makes an answer useful to the next person.
          </Card>
          <Card title="Guides are reviewed">
            New guides wait for a moderator before they're published, so what's in Guides has been
            checked by someone besides its author.
          </Card>
          <Card title="Filters stay filters">
            How filters work, and which one to pick, is fair game. Tools and guides for getting around
            one aren't.
          </Card>
        </div>
      </section>

      <section className="page-section">
        <div className="page-panel">
          <SectionHead eyebrow="TEAM" title="Who keeps JTech running" />
          <div className="page-columns">
            <div>
              <h3>Admins and moderators</h3>
              <p>
                A small team runs the servers and the software, keeps threads in the right place, and
                reviews guides before they go up.
              </p>
              {staff.length > 0 && (
                <ul className="about-staff">
                  {staff.map((user) => (
                    <li key={user.id}>
                      <a href={forumUser(user.username)} title={user.username}>
                        <Avatar name={user.username} image={avatarUrl(user.avatar_template, 72)} />
                        <span>{user.username}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h3>Members</h3>
              <p>
                Everyone else, which is most of JTech: the people who answer questions, write the
                guides, and build the apps and ROMs others use.
              </p>
            </div>
          </div>
          <p className="page-legal-line">
            JTech Forums is operated by JTech Forums LLC, a New Jersey limited liability company based
            in Lakewood, NJ. See our <Link viewTransition to="/terms">Terms of Service</Link> and{" "}
            <Link viewTransition to="/privacy-policy">Privacy Policy</Link>.
          </p>
        </div>
      </section>

      <section className="page-section page-section-last">
        <div className="page-cta">
          <span className="eyebrow">GET INVOLVED</span>
          <h2>Ask, answer, or share something you built</h2>
          <p>Reading is free. With an account you can post, reply, and start a thread for your own project.</p>
          <div className="page-actions">
            <a className="button" href={links.signup}>
              Join the forum <Icon />
            </a>
            <Link viewTransition className="button button-ghost" to="/contact">
              Contact the team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
