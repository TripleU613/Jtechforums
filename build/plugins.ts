import path from "node:path";
import type { Plugin } from "vite";

/**
 * Serve and emit index.html from a TypeScript function instead of a file.
 * The build resolves and loads "index.html" through this plugin; the dev
 * server answers page navigations with the same document, run through
 * Vite's own HTML transforms.
 */
export function htmlDocument(render: () => string): Plugin {
  let htmlPath = "";
  let base = "/";
  return {
    name: "jt:html-document",
    enforce: "pre",
    configResolved(config) {
      htmlPath = path.resolve(config.root, "index.html");
      base = config.base;
    },
    resolveId(id) {
      if (id === htmlPath || id === "index.html" || id === "/index.html") {
        return htmlPath;
      }
      return null;
    },
    load(id) {
      return id === htmlPath ? render() : null;
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.originalUrl ?? req.url ?? "/";
        const pathname = url.split("?")[0] ?? "/";
        const page =
          req.method === "GET" &&
          req.headers.accept?.includes("text/html") &&
          pathname.startsWith(base) &&
          !path.extname(pathname);
        if (!page) {
          next();
          return;
        }
        server
          .transformIndexHtml(url, render())
          .then((html) => {
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.end(html);
          })
          .catch(next);
      });
    },
  };
}

/**
 * The site's stylesheet, written as TypeScript modules (src/styles) and
 * handed to Vite as one CSS file, so it is prefixed, minified and emitted
 * like any other stylesheet. Imported once as "virtual:jt-styles.css".
 */
export function stylesheet(render: () => string): Plugin {
  const request = "virtual:jt-styles.css";
  const id = "/__jt-styles.css";
  return {
    name: "jt:stylesheet",
    resolveId(source) {
      return source === request ? id : null;
    },
    load(source) {
      return source === id ? render() : null;
    },
  };
}
