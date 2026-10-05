import type {
  AboutPayload,
  CategoriesPayload,
  LatestPayload,
  LeaderboardPayload,
  Topic,
} from "../lib/forum.ts";

/**
 * A snapshot of the forum's public JSON from October 5, 2026, served instead
 * of live requests when VITE_FORUM_USE_MOCK=true (a local preview with no
 * forum behind it). The page labels it as sample data.
 */

const avatar = (user: string, id: string): string =>
  `/user_avatar/jtechforums.org/${user}/{size}/${id}.png`;

const about: AboutPayload = {
  about: {
    stats: {
      topics_count: 2680,
      posts_count: 76668,
      users_count: 1356,
      active_users_30_days: 623,
      users_30_days: 222,
      posts_30_days: 4545,
      posts_last_day: 40,
      likes_30_days: 2315,
      visitors_last_day: 484,
      active_users_last_day: 91,
      topics_30_days: 112,
    },
    moderator_ids: [331, 941, 43, 77, 1247, 741, 1, 28],
    admin_ids: [],
  },
  users: [
    { id: 331, username: "Dev-in-the-BM_2.0", avatar_template: avatar("dev-in-the-bm_2.0", "969_2") },
    { id: 941, username: "ars18", avatar_template: avatar("ars18", "11805_2") },
    { id: 43, username: "TripleU", avatar_template: avatar("tripleu", "488_2") },
    { id: 77, username: "anonymousfliphones", avatar_template: avatar("anonymousfliphones", "2591_2") },
    { id: 1247, username: "Shalom_Karr", avatar_template: avatar("shalom_karr", "8264_2") },
    { id: 741, username: "flipphoneguy", avatar_template: avatar("flipphoneguy", "11165_2") },
    { id: 1, username: "FlipAdmin", avatar_template: avatar("flipadmin", "2891_2") },
    { id: 28, username: "kosherboy", avatar_template: avatar("kosherboy", "292_2") },
  ],
};

const topic = (
  id: number,
  slug: string,
  title: string,
  category_id: number,
  tags: string[],
  views: number,
  reply_count: number,
  created_at: string,
  bumped_at: string,
): Topic => ({
  id,
  slug,
  title,
  category_id,
  tags,
  views,
  reply_count,
  created_at,
  bumped_at,
  posters: [43, 941, 331, 741, 1247].slice(id % 3, (id % 3) + 3).map((user_id) => ({ user_id })),
});

const latest: LatestPayload = {
  users: [
    { id: 43, username: "TripleU", avatar_template: avatar("tripleu", "488_2") },
    { id: 941, username: "ars18", avatar_template: avatar("ars18", "11805_2") },
    { id: 331, username: "Dev-in-the-BM_2.0", avatar_template: avatar("dev-in-the-bm_2.0", "969_2") },
    { id: 741, username: "flipphoneguy", avatar_template: avatar("flipphoneguy", "11165_2") },
    { id: 1247, username: "Shalom_Karr", avatar_template: avatar("shalom_karr", "8264_2") },
  ],
  topic_list: {
    topics: [
      topic(5830, "unihertz-announces-planned-android-16-upgrades-for-titan-2-and-jelly-star", "Unihertz Announces Planned Android 16 Upgrades for Titan 2 and Jelly Star", 56, ["news", "bar-phone"], 2930, 172, "2026-02-07T19:05:33Z", "2026-10-05T06:10:50Z"),
      topic(10231, "how-to-use-ai-effectively-day-to-day", "How to use AI effectively, day to day", 78, ["discussion", "ai"], 111, 13, "2026-10-02T05:19:06Z", "2026-10-05T04:50:09Z"),
      topic(3717, "tripleumdm-main-thread", "TripleUMDM Main Thread", 76, ["master-thread", "mdm"], 26720, 944, "2025-06-30T02:51:28Z", "2026-10-05T04:38:24Z"),
      topic(32, "hardware-phones-computers-for-sale-thread", "Hardware (Phones, computers) for sale thread", 27, ["master-thread", "phones"], 4294, 145, "2023-09-07T01:32:39Z", "2026-10-05T04:26:36Z"),
      topic(8681, "jev-new-model-from-type-safe-ai", "Jev, new model from Type Safe AI", 78, ["news", "ai"], 227, 11, "2026-09-20T18:43:15Z", "2026-10-05T01:51:26Z"),
      topic(235, "what-is-egate-software", "What is eGate software?", 75, ["question", "egate"], 2294, 49, "2024-11-17T00:13:17Z", "2026-10-05T01:28:34Z"),
    ],
  },
};

const sub = (id: number, name: string, topic_count: number) => ({ id, name, topic_count });

const categories: CategoriesPayload = {
  category_list: {
    categories: [
      { id: 78, name: "Artificial Intelligence", topic_count: 88, topics_week: 5 },
      { id: 35, name: "Connectivity and Messaging", topic_count: 126, subcategory_list: [sub(86, "Cellular Service", 65)] },
      { id: 5, name: "Filtering", topic_count: 158, subcategory_list: [sub(75, "eGate", 53), sub(76, "TripleUMDM", 7)] },
      { id: 4, name: "General Technology", topic_count: 58, subcategory_list: [sub(83, "Ctrl, Shift, Esc", 9)] },
      { id: 27, name: "Hardware", topic_count: 84 },
      {
        id: 47,
        name: "Operating Systems",
        topic_count: 10,
        subcategory_list: [sub(24, "Android", 181), sub(7, "Android ROMs", 34), sub(62, "Linux", 41), sub(63, "Windows", 64)],
      },
      {
        id: 44,
        name: "Phones",
        topic_count: 68,
        subcategory_list: [
          sub(32, "Qin Phones", 179),
          sub(33, "TCL Phones", 151),
          sub(56, "Other Phones", 171),
          sub(87, "Sonim Phones", 49),
          sub(101, "Kyocera Phones", 40),
          sub(97, "TIQ Phones", 41),
          sub(102, "LG Phones", 32),
        ],
      },
      { id: 42, name: "Programming and Development", topic_count: 66, subcategory_list: [sub(71, "Web Development", 48)] },
      { id: 73, name: "Servers and Networking", topic_count: 33 },
      {
        id: 46,
        name: "Software and Tools",
        topic_count: 125,
        subcategory_list: [sub(6, "Android Apps", 271), sub(88, "Music Technology", 31)],
      },
      { id: 28, name: "Guides", topic_count: 11, subcategory_list: [sub(15, "Android Guides", 69)] },
    ],
  },
};

const leaderboard: LeaderboardPayload = {
  users: [
    { id: 43, username: "TripleU", avatar_template: avatar("tripleu", "488_2"), total_score: 2909, position: 1 },
    { id: 941, username: "ars18", avatar_template: avatar("ars18", "11805_2"), total_score: 2665, position: 2 },
    { id: 331, username: "Dev-in-the-BM_2.0", avatar_template: avatar("dev-in-the-bm_2.0", "969_2"), total_score: 2435, position: 3 },
  ],
};

const announcements: LatestPayload = {
  topic_list: {
    topics: [
      topic(10225, "the-new-jtech-theme-is-now-selectable", "The New Jtech Theme Is Now Selectable", 13, ["update"], 230, 34, "2026-10-01T20:46:15Z", "2026-10-05T03:08:26Z"),
      topic(8762, "after-all-pm-issues-and-complaints-we-solve-it-today", "After all PM issues and complaints, we solve it today", 13, ["update"], 173, 31, "2026-09-30T12:00:00Z", "2026-09-30T12:00:00Z"),
      topic(8674, "going-to-be-messing-with-the-domains-so-expect-interruptions", "Going to be messing with the domains so expect interruptions", 13, ["update"], 76, 2, "2026-09-18T12:00:00Z", "2026-09-18T12:00:00Z"),
    ],
  },
};

const egateThreads: LatestPayload = {
  topic_list: {
    topics: [
      { ...topic(6272, "about-the-egate-category", "About the eGate category", 75, [], 25, 0, "2026-03-27T00:39:32Z", "2026-03-27T00:39:32Z"), pinned: true },
      topic(235, "what-is-egate-software", "What is eGate software?", 75, [], 2308, 49, "2024-11-17T00:13:17Z", "2026-10-05T01:28:34Z"),
      topic(9059, "filter-administrator-pin-lost-on-a-broken-phone", "Filter administrator PIN lost on a broken phone", 75, [], 9, 0, "2026-01-18T22:06:27Z", "2026-09-30T17:39:57Z"),
      topic(8995, "finding-the-egate-reseller-portal-url", "Finding the eGate reseller portal URL", 75, [], 6, 0, "2025-11-20T09:07:04Z", "2026-09-30T17:28:57Z"),
      topic(8813, "how-does-dns-filtering-work-with-egate", "How does DNS filtering work with eGate?", 75, [], 4, 0, "2025-04-24T22:35:37Z", "2026-09-30T16:50:30Z"),
      topic(8746, "egate-android-mdm-version-1-47", "eGate - Android MDM - Version 1.47+", 75, [], 57, 0, "2026-09-28T13:15:45Z", "2026-09-28T13:15:45Z"),
      topic(8708, "using-android-auto-with-egate-on-a-qin-f21-pro", "Using Android Auto with eGate on a Qin F21 Pro", 75, [], 135, 4, "2026-09-23T18:57:39Z", "2026-09-25T07:16:00Z"),
    ],
  },
};

export function sample(path: string): unknown {
  if (path.startsWith("/c/filters-and-mdms/egate")) return egateThreads;
  if (path.startsWith("/c/updates-feedback")) return announcements;
  if (path.startsWith("/about.json")) return about;
  if (path.startsWith("/latest.json")) return latest;
  if (path.startsWith("/categories.json")) return categories;
  if (path.startsWith("/leaderboard/")) return leaderboard;
  return {};
}
