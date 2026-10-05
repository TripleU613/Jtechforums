/** Things members built and shared on the forum, each with its own thread. */
export interface Project {
  name: string;
  author: string;
  /** The author's forum avatar (a Discourse template), when they have one. */
  avatar?: string;
  kind: string;
  description: string;
  topic: string;
}

const projects: Project[] = [
  {
    name: "Waze Wizard",
    author: "sams-club",
    avatar: "/user_avatar/jtechforums.org/sams-club/{size}/3863_2.png",
    kind: "Android app",
    description:
      "Waze for phones without a touchscreen: type where you're going, press one button, and Waze opens with Go Now already pressed.",
    topic: "/t/waze-wizard-pre-release/4954",
  },
  {
    name: "DPAD Messaging",
    author: "jbriones95",
    avatar: "/user_avatar/jtechforums.org/jbriones95/{size}/323_2.png",
    kind: "Android app",
    description:
      "A texting app you can drive entirely with the D-pad, tested on the Qin F21 and Kyocera flip phones.",
    topic: "/t/dpad-messaging/6790",
  },
  {
    name: "MatChat",
    author: "WonkySim",
    avatar: "/user_avatar/jtechforums.org/wonkysim/{size}/11768_2.png",
    kind: "Android app",
    description: "A Matrix chat client made for dumbphones.",
    topic: "/t/matchat-matrix-client-release/9433",
  },
  {
    name: "Edit apps online",
    author: "flipphoneguy",
    avatar: "/user_avatar/jtechforums.org/flipphoneguy/{size}/11165_2.png",
    kind: "Website",
    description:
      "Upload an APK and change its package name, permissions, activities or minimum Android version, with every field explained along the way.",
    topic: "/t/edit-apps-online-free-website/7496",
  },
  {
    name: "SMS Sync",
    author: "Tora_Tech",
    kind: "Self-hosted",
    description:
      "Read and answer your phone's texts from other devices and the web, through your own free Supabase backend.",
    topic: "/t/sms-sync/7621",
  },
  {
    name: "CobaltConverte",
    author: "A.I.V",
    avatar: "/user_avatar/jtechforums.org/a.i.v/{size}/535_2.png",
    kind: "Desktop app",
    description:
      "A simple window on top of FFmpeg for converting media files, without the command line.",
    topic: "/t/cobaltconverte-gui-software-for-ffmpeg/4737",
  },
];

export default projects;
