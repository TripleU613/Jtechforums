import { links } from "../lib/links.ts";

export interface FaqEntry {
  question: string;
  answer: string;
  link?: { label: string; href: string; internal?: boolean };
}

/** Taken from how the forum actually runs: its guidelines and category rules. */
const faq: FaqEntry[] = [
  {
    question: "What is JTech?",
    answer:
      "A free, public forum about technology. Most threads are about phones (flip phones especially), filters and device management, Android ROMs and rooting, and apps, with plenty on AI, programming, servers and computers too.",
  },
  {
    question: "Do I need an account?",
    answer:
      "Not to read: everything public on the forum is open to visitors. To post, reply or react, sign up. It takes a minute.",
    link: { label: "Sign up", href: links.signup },
  },
  {
    question: "How do I get help with a phone?",
    answer:
      "Search first; most problems already have a thread. If yours doesn't, post in the category for your device with the exact model, carrier and software version, what you expected, what happened, and what you've already tried.",
  },
  {
    question: "Can I use the forum on a flip phone?",
    answer:
      "Yes. jtechforums.org/dumb is the whole forum rebuilt for keypad phones and old browsers. It runs on the D-pad and number keys, and you can sign in without typing a password. Phones whose browser can't run the full forum are sent there automatically.",
    link: { label: "Open the flip-phone version", href: links.dumbcourse },
  },
  {
    question: "Can I message someone privately?",
    answer:
      "The forum has no private messages. To swap contact details, use REQ-PM: you send a request, and the other member chooses exactly what to share.",
  },
  {
    question: "What isn't allowed?",
    answer:
      "Personal attacks, spam, and anything that isn't family-friendly. Filtering is a topic here; getting around one isn't, so no bypass tools, unfiltered ROMs or guides to disabling restrictions.",
    link: { label: "Read the Community Guidelines", href: links.guidelines },
  },
  {
    question: "Can I post about something I sell?",
    answer:
      "A paid product or service can come up as an answer to someone's question, but it can't be the subject of its own thread. Free and open-source projects can have one, and so can reviews of phones and services people already use.",
  },
  {
    question: "Can I share files and APKs?",
    answer:
      "Share your own work, or link to where you got it. No pirated software, and no files from sources nobody can check.",
  },
  {
    question: "What language should I post in?",
    answer: "English, so everyone can follow along and find it later in search.",
  },
  {
    question: "How do I report a post or a bug?",
    answer:
      "Flag the post and a moderator will look at it. For problems with the forum itself, or ideas for it, post in Site Feedback.",
    link: { label: "Site Feedback", href: links.siteFeedback },
  },
  {
    question: "Who runs JTech?",
    answer:
      "JTech Forums LLC, with a small team of admins and volunteer moderators. Everything else (the answers, guides, apps and ROMs) comes from members.",
  },
  {
    question: "How do I reach the team?",
    answer: "Use the contact form, or email admin@jtechforums.org.",
    link: { label: "Contact the team", href: "/contact", internal: true },
  },
];

/** An anchor for each question: #faq-can-i-message-someone-privately */
export const faqId = (question: string): string =>
  `faq-${question.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;

export default faq;
