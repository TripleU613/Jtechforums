import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { htmlDocument, stylesheet } from "./build/plugins.ts";
import documentHtml from "./src/document.ts";
import styles from "./src/styles/index.ts";

export default defineConfig({
  // Mounted at /home on the apex; Discourse owns /.
  base: "/home/",
  plugins: [htmlDocument(documentHtml), stylesheet(styles), react()],
});
