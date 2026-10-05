import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { htmlDocument, stylesheet } from "./build/plugins.ts";
import documentHtml from "./src/document.ts";
import styles from "./src/styles/index.ts";

export default defineConfig({
  // Mounted at /home on the apex; Discourse owns /.
  base: "/home/",
  plugins: [htmlDocument(documentHtml), stylesheet(styles), react()],
  // Lightning CSS adds the vendor prefixes older phones still need
  // (-webkit-backdrop-filter and the like) for these targets.
  css: { transformer: "lightningcss" },
  build: {
    cssMinify: "lightningcss",
    cssTarget: ["chrome90", "edge90", "firefox90", "safari14", "ios14"],
  },
});
