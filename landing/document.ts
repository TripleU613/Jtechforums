/**
 * The landing page's HTML shell, served on the old and extra JTech domains
 * (see `vite.landing.config.ts`). Every copy points its canonical at the home
 * page, so whatever those domains attract counts for jtechforums.org.
 */

export const HOME = "https://jtechforums.org/home/";
export const TITLE = "JTech Forums";
export const DESCRIPTION = "Where the thread is the documentation.";
const SHARE_IMAGE = "https://jtechforums.org/home/img/home/share.png";

export default function landingDocument(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${TITLE}</title>
    <meta name="description" content="${DESCRIPTION}" />
    <link rel="canonical" href="${HOME}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="color-scheme" content="light dark" />
    <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
    <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000000" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${TITLE}" />
    <meta property="og:title" content="${TITLE}" />
    <meta property="og:description" content="${DESCRIPTION}" />
    <meta property="og:url" content="${HOME}" />
    <meta property="og:image" content="${SHARE_IMAGE}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="${SHARE_IMAGE}" />
    <link rel="icon" href="/public/img/home/metadata.png" />
    <script type="module" src="/landing/main.ts"></script>
  </head>
  <body>
    <main class="landing">
      <img class="landing-logo logo" src="/public/img/whitelogo.webp" alt="JTech Forums" width="860" height="250" />
      <p class="landing-line">
        <span class="landing-line-text" aria-hidden="true">${DESCRIPTION}</span>
        <span class="landing-line-live" aria-live="polite">${DESCRIPTION}</span>
      </p>
      <a class="button landing-go" href="${HOME}">jtechforums.org <span aria-hidden="true">&rarr;</span></a>
    </main>
  </body>
</html>
`;
}
