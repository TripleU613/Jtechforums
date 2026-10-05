# JTech Forums: home page

The landing page at [jtechforums.org/home](https://jtechforums.org/home). The forum itself (Discourse) owns the rest of the domain.

Two languages: TypeScript for the pages, the HTML shell and the tooling, and SCSS for the styles. There are no `.js`, `.css` or `.html` sources.

## What's where

| Path | What it is |
| --- | --- |
| `src/pages/` | One file per route: home, eGate, About, Contact, Terms, Privacy, and the notice pages. |
| `src/components/home/` | The home page's sections: hero, story, the four-scene rail, categories, the live forum feed, the flip-phone demo, people, champions, member projects, FAQ. |
| `src/components/` | Shared pieces: header, footer, the ⌘K palette, keyboard shortcuts, toasts, developer options, Snake, back-to-top. |
| `src/data/` | The FAQ, the member projects, the team, and a sample snapshot of the forum for local previews. |
| `src/lib/` | Forum reads, links, light/dark, analytics. |
| `src/document.ts` | The HTML shell. There is no `index.html`; the build serves and emits this. |
| `src/styles/` | The stylesheet (SCSS), built into one CSS file. `main.scss` lists the partials in cascade order; `home/` has one partial per home page section, top to bottom. |
| `build/plugins.ts` | The Vite plugin that turns `document.ts` into the page. |
| `firebase-functions/` | The contact form's backend (Firebase Functions, TypeScript). |

## The look

It follows the forum's JTech theme: JTech Light and JTech Dark (black and white, translucent hairlines), squircle corners where the browser supports them, and Geist. `src/styles/_tokens.scss` holds the palette. The original design's colours were converted by lightness onto the forum's grey ramps (`src/styles/_tones.scss`).

Light or dark follows the system, unless the visitor picked one on the forum: the page reads the forum's `forced_color_mode` cookie, and its own switch writes it, so the two stay in step.

## Hidden things

Nothing on the page mentions these, on purpose:

- Tap the big logo on the home page seven times for developer options (layout bounds, show taps, pointer location, animator duration scale): `src/lib/devmode.ts`, `src/components/DevOptions.tsx`.
- ↑ ↑ ↓ ↓ ← → ← → B A: the hero's particles spell the logo; elsewhere the page does a barrel roll (`src/lib/konami.ts`).
- The installer scene's terminal takes commands (`src/components/home/TerminalToy.tsx`).
- The story's Android watches the pointer; the flip phone buzzes if left alone; the 404 page has Snake; after midnight the hero notices.
- `?` lists the keyboard shortcuts, ⌘K or `/` opens the palette.

All of it respects reduced motion and stays out of the way while someone types.

## Screenshots

`public/img/egate/` holds eGate 1.47's own screens (setup, password, license), taken in an Android 14 emulator in light and dark. `public/img/forum/` holds captures of the forum itself in both modes. Each pair is named `<name>-light.webp` / `<name>-dark.webp`, and `ThemedShot` shows the one matching the page. Retake them when eGate or the forum's look changes.

## Forum data

The page is served from the forum's own domain, so it reads the forum's public JSON directly: `/about.json`, `/latest.json`, `/categories.json` and `/leaderboard/6.json`. No key, no proxy. Anywhere else (a local dev server, a `pages.dev` preview) those requests fail and the sections fall back to links; set `VITE_FORUM_USE_MOCK=true` for a labelled sample snapshot instead.

## Working on it

```bash
npm ci
VITE_FORUM_USE_MOCK=true npm run dev    # http://localhost:5173/home/
npm run typecheck
npm run lint                           # stylelint + prettier on src/styles; `npm run format` fixes
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
