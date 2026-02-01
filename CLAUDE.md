# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overvie

JTech Website is an open-source community platform for the Jewish tech and filtering community. It's a React SPA with Firebase backend providing beginner guides, app catalog, FAQs, and Discourse forum integration.

## Commands

```bash
# Frontend development
npm install                          # Install dependencies
npm run dev                          # Vite dev server (port 5173)
npm run build                        # Build to dist/
npm run preview                      # Preview production build

# Backend (Firebase Functions)
npm --prefix functions install       # Install function dependencies
npm --prefix functions run serve     # Start Functions emulator (port 5001)
npm --prefix functions run deploy    # Deploy functions

# Full local testing
npx firebase emulators:start --only hosting,functions
```

## Tech Stack

- **Frontend:** React 19 + Vite 7 + Tailwind CSS 3 + Framer Motion + GSAP
- **Backend:** Firebase Cloud Functions (Node 20, Express 5)
- **Services:** Firebase Auth, Firestore, Cloud Storage, reCAPTCHA Enterprise
- **Deployment:** Firebase Hosting with GitHub Actions auto-deploy on main push

## Architecture

**Request Flow:**
- SPA calls `/api/forum/*` or `/api/contact`
- Firebase Hosting rewrites to `forumApi` Cloud Function
- Function proxies to Discourse API or sends SMTP email

**Key Patterns:**
- `AuthContext` manages Firebase Auth state + user profile hydration from Firestore
- `fetchForumApi()` in `src/lib/forumApi.js` handles all forum calls with optional mock fallback
- Responsive home page: `Home.jsx` (desktop) vs `HomeMobile.jsx` (mobile, detected via media queries)
- Page transitions via Framer Motion `AnimatePresence`

**Critical Paths:**
| Path | Description |
|------|-------------|
| `src/App.jsx` | Route definitions + page transitions |
| `src/context/AuthContext.jsx` | Global auth state provider |
| `src/lib/firebase.js` | Firebase SDK initialization |
| `src/lib/forumApi.js` | Forum API client with mock fallback |
| `functions/index.js` | Express backend: forum proxy, contact email, reCAPTCHA |
| `tailwind.config.js` | Theme: custom fonts (Space Grotesk, Inter, JetBrains Mono), colors, animations |
| `firebase.json` | Hosting rewrites, emulator config |

## Environment Variables

**Frontend (.env):**
- `VITE_RECAPTCHA_SITE_KEY` - reCAPTCHA Enterprise public key
- `VITE_FORUM_API_BASE_URL` - API endpoint (defaults to `/api`)
- `VITE_FORUM_USE_MOCK` - Set to `auto` or `fallback` for mock data in dev

**Functions (.env.production):**
- `DISCOURSE_API_KEY` - Discourse API key (use Firebase Secret Manager)
- `CONTACT_SMTP_*` - SMTP configuration for contact form
- `RECAPTCHA_*` - reCAPTCHA Enterprise backend config

## Coding Conventions

- Functional React components in PascalCase
- 2-space indentation, single quotes, trailing semicolons
- Tailwind-first styling; extend tokens in `tailwind.config.js`
- Cloud Functions use CommonJS (`module.exports`)
- All forum traffic through `src/lib/forumApi` (never hard-code backend URLs)

## Firestore Collections

- `users` - User profiles (hydrated by AuthContext)
- `apps` - App catalog submissions (admin-approved)

Security rules in `firestore.rules` and `storage.rules`. Deploy with:
```bash
npx firebase deploy --only firestore:rules,storage:rules
```
