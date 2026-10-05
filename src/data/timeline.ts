import { FORUM } from "../lib/links.ts";

/** Moments in the forum's life, each dated by its own thread. */
export interface Milestone {
  date: string;
  title: string;
  text: string;
  href?: string;
}

const timeline: Milestone[] = [
  { date: "2023-07-28", title: "The forum opens", text: "A place to figure out flip phones and the tools that keep smartphones in check." },
  {
    date: "2025-06-19",
    title: "Guides get their own home",
    text: "A category for finished tutorials, each one reviewed by a moderator before it goes up.",
    href: `${FORUM}/t/about-the-guides-category/3333`,
  },
  {
    date: "2025-06-30",
    title: "TripleUMDM's main thread",
    text: "It goes on to pass 900 replies and 26,000 views.",
    href: `${FORUM}/t/tripleumdm-main-thread/3717`,
  },
  {
    date: "2026-02-01",
    title: "A D-pad app for the forum",
    text: "A keypad-friendly app for reading the forum. It runs on Dumbcourse now.",
    href: `${FORUM}/t/forums-d-pad-app/5736`,
  },
  {
    date: "2026-08-01",
    title: "The categories, reorganized",
    text: "Every topic sorted into a clear home for its subject, with rules for each.",
    href: `${FORUM}/t/a-powerful-ai-is-organizing-content-on-the-forums/8767`,
  },
  {
    date: "2026-09-18",
    title: "Moving to jtechforums.org",
    text: "The forum takes over the main address; this page moves to /home.",
    href: `${FORUM}/t/going-to-be-messing-with-the-domains-so-expect-interruptions/8674`,
  },
  {
    date: "2026-09-30",
    title: "REQ-PM and a Dumbcourse refresh",
    text: "Members can ask for each other's contact details and share only what they choose, and the flip-phone version gets a big update.",
    href: `${FORUM}/t/after-all-pm-issues-and-complaints-we-solve-it-today/8762`,
  },
  {
    date: "2026-10-01",
    title: "The JTech theme",
    text: "Black and white, Geist, and a planet on the front page.",
    href: `${FORUM}/t/the-new-jtech-theme-is-now-selectable/10225`,
  },
];

export default timeline;
