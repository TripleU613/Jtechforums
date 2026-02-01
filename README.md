# JTech Website

Welcome to the **JTech Website** repository—the official open-source project for [JTech Forums](https://jtechforums.org).
This site provides beginner guides, an app list, FAQs, and other resources for the Jewish tech and filtering community.

---

## Environment Setup

### Local Development

1. **Copy environment templates:**
   ```bash
   cp .env.example .env
   cd functions && cp .env.example .env
   ```

2. **Edit `.env` files with your Firebase credentials** (NEVER commit these files)
   - Frontend `.env`: Add Firebase config from Firebase Console
   - Backend `functions/.env`: Add SMTP settings and reCAPTCHA config

3. **Install dependencies:**
   ```bash
   npm install
   cd functions && npm install
   ```

4. **Run locally:**
   ```bash
   npm run dev  # Frontend dev server (port 5173)
   npm --prefix functions run serve  # Firebase Functions emulator (port 5001)
   ```

### Deployment

- **Frontend**: Auto-deploys to Cloudflare Pages on push to `main`
- **Backend**: Auto-deploys Firebase Functions on changes to `functions/**`
- **Manual Functions deploy**: `cd functions && npm run deploy`

### Security

**NEVER commit:**
- `.env` files
- Firebase service account keys
- API keys or secrets

All secrets are managed via GitHub Secrets and Firebase Secret Manager.

---

## Contributing

We welcome contributions! Whether you're editing guides, improving formatting, or adding new sections, your help makes JTech better.

1. Fork this repository.
2. Make your changes (guides, sections, formatting, or improvements).
3. Submit a pull request with a clear description of your edits.
4. Wait for review—maintainers will provide feedback or merge your PR.

---

## Important Notes

* The only purpose of this repository being open-source is to allow contributions to the JTech website.
* You may not reuse this repository or its contents for personal or commercial projects.
* Be a mentch—contribute respectfully and follow the rules.

---

## Firebase Hosting & Forum API

Forum data now flows through Firebase Functions (`functions/index.js`) and the React app is deployed via Firebase Hosting.

1. Configure secrets: `firebase functions:secrets:set DISCOURSE_API_KEY`.
2. (Optional) Override defaults by setting environment variables `DISCOURSE_API_BASE` / `DISCOURSE_API_USERNAME` before deploying Functions (or via the Cloud console).
3. Deploy or emulate functions via `cd functions && npm run deploy` / `npm run serve`.
4. Hosting configuration (`firebase.json`) serves the built `dist/` directory and rewrites `/api/**` requests to the `forumApi` function, so the SPA can simply call `/api/forum/...`.
5. The web app defaults `VITE_FORUM_API_BASE_URL` to `/api`, but you can point it to any other endpoint (e.g. the emulator) when developing locally.

---

## Contact Form Email

`/contact` now posts to Firebase Functions, which relays the message via SMTP to `tripleuworld@gmail.com`.

1. Copy `functions/.env.example` to `functions/.env.production` (and optionally `.env.local`) and fill in your SMTP host, username, and `CONTACT_SMTP_PASS` (e.g. a Gmail App Password).
2. Provide the reCAPTCHA Enterprise site key/project (the backend calls Google’s Assessment API using the default Firebase service account); set the matching public key in `.env` via `VITE_RECAPTCHA_SITE_KEY`.
3. Deploy with `firebase deploy --only functions` (the CLI uploads `.env.*` values to Secret Manager automatically).
4. The endpoint responds at both `/contact` and `/api/contact`; Hosting already rewrites `/api/contact` so the SPA can call it without additional configuration.

---

## App Catalog & Submissions

* `/apps` lists Firestore-backed cards for every approved submission and lets verified users upload APKs, icons, and forum links.
* Email/password auth (Firebase Auth) plus email verification is required before the submission form unlocks; only `tripleuworld@gmail.com` sees the admin review queue.
* Metadata lives in the Firestore `apps` collection and files in Storage buckets (`app-icons/` + `app-apks/`); security rules are defined in `firestore.rules` and `storage.rules`.
* Deploy the new rules with `npx firebase deploy --only firestore:rules,storage:rules`, keep `CONTACT_SMTP_PASS` + `DISCOURSE_API_KEY` secrets set, and update `/apps` content by approving entries in the admin queue.

---

## License

This project is not available for personal or commercial use.
Unauthorized use outside of contributing to JTech is strictly prohibited.

---

## Questions or Suggestions?

* Join the discussion on [JTech Forums](https://jtechforums.org).
* Or open an issue here in the repository.

Thank you for contributing and helping improve **JTech**!
