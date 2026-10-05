import { useMemo } from "react";
import Closing from "../components/home/Closing.tsx";
import CommunityStrip from "../components/home/CommunityStrip.tsx";
import Conversation from "../components/home/Conversation.tsx";
import ExperienceRail from "../components/home/ExperienceRail.tsx";
import Faq from "../components/home/Faq.tsx";
import Hero from "../components/home/Hero.tsx";
import Honors, { type Champion, type Moderator } from "../components/home/Honors.tsx";
import MadeByMembers from "../components/home/MadeByMembers.tsx";
import MotionAtmosphere from "../components/home/MotionAtmosphere.tsx";
import People from "../components/home/People.tsx";
import StoryBridge from "../components/home/StoryBridge.tsx";
import team from "../data/team.ts";
import { forumPaths, usingSample, type AboutPayload, type LeaderboardPayload } from "../lib/forum.ts";
import { avatarUrl, forumUser } from "../lib/links.ts";
import { useForum, type LoadState } from "../lib/useForum.ts";

const LEADERBOARD_ID = 6;
// Shown in "The people behind JTech" already, and bots aren't moderators.
const NOT_LISTED = new Set([...team.map((member) => member.handle.toLowerCase()), "system", "jtechbridgebot"]);

function moderatorsFrom(about: AboutPayload | null): Moderator[] {
  const ids = new Set(about?.about.moderator_ids ?? []);
  return (about?.users ?? [])
    .filter((user) => ids.has(user.id) && !NOT_LISTED.has(user.username.toLowerCase()))
    .map((user) => ({
      username: user.username,
      avatar: avatarUrl(user.avatar_template),
      profile: forumUser(user.username),
    }));
}

function championsFrom(state: LoadState<LeaderboardPayload>): LoadState<Champion[]> {
  if (state.status !== "ready") return state;
  const data = (state.data.users ?? []).slice(0, 3).map((user, i) => ({
    id: user.id,
    username: user.username,
    position: user.position ?? i + 1,
    points: user.total_score ?? 0,
    avatar: avatarUrl(user.avatar_template, 160),
    profile: forumUser(user.username),
  }));
  return { status: "ready", data };
}

export default function Home() {
  const about = useForum<AboutPayload>(forumPaths.about);
  const leaderboard = useForum<LeaderboardPayload>(forumPaths.leaderboard(LEADERBOARD_ID, "monthly"));
  const moderators = useMemo(() => moderatorsFrom(about.data), [about.data]);
  const champions = useMemo(() => championsFrom(leaderboard), [leaderboard]);
  return (
    <>
      <MotionAtmosphere />
      <Hero />
      <CommunityStrip stats={about.data?.about.stats} sample={usingSample} />
      <StoryBridge />
      <ExperienceRail />
      <Conversation sample={usingSample} />
      <People />
      <Honors champions={champions} moderators={moderators} sample={usingSample} />
      <MadeByMembers />
      <Faq />
      <Closing />
    </>
  );
}
