/** Where the page links to. The forum lives at the root of the same domain. */
export const FORUM = "https://jtechforums.org";

export const links = {
  forum: FORUM,
  latest: `${FORUM}/latest`,
  guides: `${FORUM}/c/guides/28`,
  androidApps: `${FORUM}/c/new-software-tools/android-apps/6`,
  memberMade: `${FORUM}/tag/member-made`,
  egateCategory: `${FORUM}/c/filters-and-mdms/egate/75`,
  egateExplained: `${FORUM}/t/what-is-egate-software/235`,
  egateInstall: `${FORUM}/t/how-to-install-egate-guide/689`,
  siteFeedback: `${FORUM}/c/updates-feedback/feedback/30`,
  guidelines: `${FORUM}/t/5`,
  leaderboard: `${FORUM}/leaderboard`,
  dumbcourse: `${FORUM}/dumb`,
  signup: `${FORUM}/signup`,
  installer: "https://installer.jtechforums.org/",
  egateDownload: "https://github.com/offlinesoftwaresolutions/eGate/releases/latest",
  egateVendor: "https://pages.st/oss",
  email: "mailto:admin@jtechforums.org",
  samsclub: `${FORUM}/u/sams-club`,
  source: "https://github.com/JTech-Forums/Jtechforums",
  condvar: "https://condvar.com",
} as const;

export const forumSearch = (query: string): string =>
  `${FORUM}/search?q=${encodeURIComponent(query)}`;

export const forumUser = (username: string): string =>
  `${FORUM}/u/${encodeURIComponent(username)}`;

export const forumTopic = (slug: string, id: number): string =>
  `${FORUM}/t/${slug}/${id}`;

/** A Discourse avatar template ("/user_avatar/…/{size}/…") at a size. */
export const avatarUrl = (template: string | undefined, size = 144): string => {
  if (!template) return "";
  const path = template.replace("{size}", String(size));
  return path.startsWith("http") ? path : `${FORUM}${path}`;
};
