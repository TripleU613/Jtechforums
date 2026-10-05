import type { IconName } from "../components/Icon.tsx";

/**
 * The forum's main categories (October 2026), in the order the page shows
 * them. Live counts and subcategories come from /categories.json; this list
 * keeps the section useful when that can't load.
 */
export interface CategoryInfo {
  id: number;
  path: string;
  name: string;
  blurb: string;
  icon: IconName;
  subcategories: string[];
}

const categories: CategoryInfo[] = [
  { id: 44, path: "/c/new-phones/44", name: "Phones", blurb: "Flip phones and smartphones, model by model.", icon: "phone", subcategories: ["Qin Phones", "TCL Phones", "Kyocera Phones", "Sonim Phones", "TIQ Phones", "LG Phones"] },
  { id: 5, path: "/c/filters-and-mdms/5", name: "Filtering", blurb: "Filters and device managers: how they work, and which to pick.", icon: "shield", subcategories: ["eGate", "TripleUMDM"] },
  { id: 47, path: "/c/new-operating-systems/47", name: "Operating Systems", blurb: "Android, custom ROMs, Linux and Windows.", icon: "layers", subcategories: ["Android", "Android ROMs", "Linux", "Windows"] },
  { id: 46, path: "/c/new-software-tools/46", name: "Software and Tools", blurb: "Apps, members' own modifications, and desktop software.", icon: "grid", subcategories: ["Android Apps", "Music Technology"] },
  { id: 28, path: "/c/guides/28", name: "Guides", blurb: "Reviewed, step-by-step tutorials.", icon: "book", subcategories: ["Android Guides"] },
  { id: 78, path: "/c/artificial-intelligence/78", name: "Artificial Intelligence", blurb: "Models, prompts, agents and day-to-day use.", icon: "sparkle", subcategories: [] },
  { id: 42, path: "/c/programming-and-developement/42", name: "Programming", blurb: "Writing, debugging and shipping code.", icon: "code", subcategories: ["Web Development"] },
  { id: 73, path: "/c/new-hosting/73", name: "Servers and Networking", blurb: "Self-hosting, VPS, Docker, DNS and VPNs.", icon: "server", subcategories: [] },
  { id: 35, path: "/c/groupme/35", name: "Connectivity and Messaging", blurb: "Texting, messaging apps, carriers and plans.", icon: "chat", subcategories: ["Cellular Service"] },
  { id: 27, path: "/c/hardware/27", name: "Hardware", blurb: "Computers, parts, buying advice and repairs.", icon: "chip", subcategories: [] },
  { id: 4, path: "/c/general/4", name: "General Technology", blurb: "Everything that doesn't fit anywhere else.", icon: "globe", subcategories: [] },
];

export default categories;

/** Phones people ask about; each chip searches the forum for it. */
export const phoneModels = [
  "Qin F21 Pro",
  "TCL Flip 2",
  "Kyocera E4810",
  "Sonim XP3",
  "TIQ M5",
  "LG Classic",
  "Kyocera DuraXV",
  "FIG F175",
  "Unihertz Jelly Star",
  "Megalife F1",
  "LG Exalt",
  "Mindful 2 Pro",
  "Unihertz Titan 2",
  "Wonder Phone",
];
