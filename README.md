# JTech Forums: home page

The landing page at [jtechforums.org/home](https://jtechforums.org/home). The forum itself (Discourse) owns the rest of the domain.

It's all TypeScript: React pages, the HTML shell and the stylesheet. There are no `.js`, `.css` or `.html` sources.

## What's where

| Path | What it is |
| --- | --- |
| `src/pages/` | One file per route: home, eGate, About, Contact, Terms, Privacy, and the notice pages. |
| `src/components/home/` | The home page's sections: hero, story, the four-scene rail, the live forum feed, people, champions, member projects, FAQ. |
| `src/data/` | The FAQ, the member projects, the team, and a sample snapshot of the forum for local previews. |
| `src/lib/` | Forum reads, links, light/dark, analytics. |
| `src/document.ts` | The HTML shell. There is no `index.html`; the build serves and emits this. |
| `src/styles/` | The stylesheet, as `css` template literals, built into one CSS file. `index.ts` lists the modules in cascade order. |
| `build/plugins.ts` | The two Vite plugins that turn `document.ts` and `src/styles` into the page and its stylesheet. |
| `firebase-functions/` | The contact form's backend (Firebase Functions, TypeScript). |

## The look

It follows the forum's JTech theme: JTech Light and JTech Dark (black and white, translucent hairlines), squircle corners where the browser supports them, and Geist. `src/styles/tokens.ts` holds the palette. The original design's colours were converted by lightness onto the forum's grey ramps (`src/styles/tones.ts`).

Light or dark follows the system, unless the visitor picked one on the forum: the page reads the forum's `forced_color_mode` cookie, and its own switch writes it, so the two stay in step.

## Forum data

The page is served from the forum's own domain, so it reads the forum's public JSON directly: `/about.json`, `/latest.json`, `/categories.json` and `/leaderboard/6.json`. No key, no proxy. Anywhere else (a local dev server, a `pages.dev` preview) those requests fail and the sections fall back to links; set `VITE_FORUM_USE_MOCK=true` for a labelled sample snapshot instead.

## Working on it

```bash
npm ci
VITE_FORUM_USE_MOCK=true npm run dev    # http://localhost:5173/home/
npm run typecheck
npm run build && npm run preview
```

## Deploying

- **The page.** Pushing to `main` deploys it: the Cloudflare Pages project `jtechforums` builds it (`npm run build`, output `dist`), and the `jtechorg-home` Worker serves it at `/home` and sends `/api` to Firebase.
- **The contact backend** does not deploy on push: `cd firebase-functions && npm ci && npm run deploy` (it compiles to `lib/` first).

Build variables (Cloudflare Pages):

| Variable | Used for |
| --- | --- |
| `VITE_RECAPTCHA_SITE_KEY` | The contact form's reCAPTCHA Enterprise key. |
| `VITE_FIREBASE_*` | Firebase's web config, for Google Analytics only. |
| `VITE_CONTACT_ENDPOINT` | Optional; defaults to `/api/contact`. |
| `VITE_FORUM_USE_MOCK` | Local previews only. Never in a live build. |

The backend reads `CONTACT_SMTP_HOST`, `CONTACT_SMTP_PORT`, `CONTACT_SMTP_USER`, `CONTACT_TO_EMAIL`, `RECAPTCHA_SITE_KEY`, `RECAPTCHA_PROJECT_ID` and `RECAPTCHA_MIN_SCORE` from `firebase-functions/.env`, and the secrets `CONTACT_SMTP_PASS` and `DISCOURSE_API_KEY` from Secret Manager. Never commit `.env` files or keys.

## Contributing

Fork, change, open a pull request with a clear description. Be a mentch.

This repository is open so the community can contribute to the site. You may not reuse it or its contents for personal or commercial projects.

## Questions

Ask on [the forum](https://jtechforums.org) or open an issue.
