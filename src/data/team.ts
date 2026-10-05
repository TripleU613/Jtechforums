/** The people who run the forum, shown with their portraits in public/img/team. */
export interface TeamMember {
  name: string;
  handle: string;
  role: string;
  portrait: string;
}

const team: TeamMember[] = [
  { name: "Usher Weiss", handle: "TripleU", role: "Forums Owner & Maintainer", portrait: "/img/team/TripleU.webp" },
  { name: "Avrumi Sternheim", handle: "ars18", role: "Forums Admin & Moderator", portrait: "/img/team/ars18.webp" },
  {
    name: "Offline Software Solutions",
    handle: "flipadmin",
    role: "Forum Founder & Developer",
    portrait: "/img/team/flipadmin.webp",
  },
];

export default team;
