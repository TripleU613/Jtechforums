import { defineConfig, type Plugin } from "vite";
import { htmlDocument } from "./build/plugins.ts";
import landingDocument, { HOME } from "./landing/document.ts";
import { seal } from "./landing/seal.ts";
import { TAGLINES } from "./landing/taglines.ts";

/**
 * The landing page for the old and extra domains (mitmachim.com,
 * apps4flip.org, jtechforums.com and the rest). A separate build from the
 * home page: it is served at the root of those domains by its own Pages
 * project, while the home page lives under /home on jtechforums.org.
 */

/** The tagline list, sealed fresh on every build. */
function taglines(): Plugin {
  const id = "virtual:taglines";
  return {
    name: "jt:taglines",
    resolveId: (source) => (source === id ? `\0${id}` : null),
    load: (source) =>
      source === `\0${id}`
        ? `export default ${JSON.stringify(seal(TAGLINES))};`
        : null,
  };
}

/** What Pages and crawlers read next to the page. */
function siteFiles(): Plugin {
  const today = new Date().toISOString().slice(0, 10);
  const files: Record<string, string> = {
    // Everything is crawlable; the canonical, not a disallow, tells search
    // engines which copy counts.
    "robots.txt": `User-agent: *\nAllow: /\n\nSitemap: ${HOME}sitemap.xml\n`,
    "sitemap.xml": `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${HOME}</loc>\n    <lastmod>${today}</lastmod>\n  </url>\n</urlset>\n`,
    _headers: `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: SAMEORIGIN\n\n/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n\n/\n  Cache-Control: public, max-age=0, must-revalidate\n`,
  };
  return {
    name: "jt:site-files",
    apply: "build",
    generateBundle() {
      for (const [fileName, source] of Object.entries(files)) {
        this.emitFile({ type: "asset", fileName, source });
      }
    },
  };
}

export default defineConfig({
  base: "/",
  // The images and font are imported from public/ so they are hashed and
  // bundled; copying the home page's whole public/ would ship it twice.
  publicDir: false,
  plugins: [htmlDocument(landingDocument), taglines(), siteFiles()],
  css: { transformer: "lightningcss" },
  build: {
    outDir: "dist-landing",
    emptyOutDir: true,
    cssMinify: "lightningcss",
    cssTarget: ["chrome90", "edge90", "firefox90", "safari14", "ios14"],
  },
});
