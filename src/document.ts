/**
 * The page's HTML shell. There is no index.html in the repository: the build
 * (build/plugins.ts) serves and emits this instead. The one inline script
 * applies the visitor's light/dark choice from the forum's cookie before
 * the first paint (src/lib/scheme.ts keeps it current afterwards).
 */

import faq from "./data/faq.ts";

const TITLE = "JTech Forums: phones, filters, ROMs and code";
const DESCRIPTION =
  "A free tech forum for flip phones and smartphones, filtering and device management, Android ROMs, apps, AI and code. Guides and answers from the people who use them.";
const SHARE_IMAGE = "https://jtechforums.org/home/img/home/share.png";
const SHARE_IMAGE_ALT = "The JTech Forums home page: phones, filters, ROMs and code.";

// Escaping "<" keeps an answer containing "</script>" from closing the tag.
const faqSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
}).replace(/</g, "\\u003c");

const applyScheme = `(function(){try{var m=document.cookie.match(/(?:^|; )forced_color_mode=(light|dark)/);if(m)document.documentElement.dataset.scheme=m[1]}catch(e){}})();`;

export default function documentHtml(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${TITLE}</title>
    <meta name="description" content="${DESCRIPTION}" />
    <meta name="color-scheme" content="light dark" />
    <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
    <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000000" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="JTech Forums" />
    <meta property="og:title" content="${TITLE}" />
    <meta property="og:description" content="${DESCRIPTION}" />
    <meta property="og:url" content="https://jtechforums.org/home/" />
    <meta property="og:image" content="${SHARE_IMAGE}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${SHARE_IMAGE_ALT}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${TITLE}" />
    <meta name="twitter:description" content="${DESCRIPTION}" />
    <meta name="twitter:image" content="${SHARE_IMAGE}" />
    <meta name="twitter:image:alt" content="${SHARE_IMAGE_ALT}" />
    <link rel="canonical" href="https://jtechforums.org/home/" />
    <script type="application/ld+json">${faqSchema}</script>
    <link rel="icon" href="/img/home/metadata.png" />
    <link rel="preload" href="/fonts/Geist-Variable.woff2" as="font" type="font/woff2" crossorigin />
    <script>${applyScheme}</script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
}
