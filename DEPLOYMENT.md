# Deployment Guide: Cloudflare Pages + Firebase

This guide walks you through deploying JTech Forums with Cloudflare Pages for the frontend and Firebase for backend services.

## Architecture

- **Frontend**: React SPA hosted on Cloudflare Pages
- **Backend**: Firebase Functions (Express API for forum proxy and contact form)
- **Services**: Firebase Auth, Firestore, Cloud Storage, reCAPTCHA Enterprise

## Prerequisites

1. Firebase project already configured (`jtechsite-2ebc8`)
2. Cloudflare account with Pages access
3. GitHub repository with Actions enabled

## Initial Setup

### 1. Create Cloudflare Pages Project

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Workers & Pages** → **Create application** → **Pages**
3. Connect to your GitHub repository
4. Configure build settings:
   - **Project name**: `jtech-forums`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: (leave empty)

### 2. Configure GitHub Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add the following secrets:

#### Cloudflare Secrets
- `CLOUDFLARE_API_TOKEN` - Create at [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
  - Use template: "Edit Cloudflare Workers"
  - Permissions: Account > Cloudflare Pages > Edit
- `CLOUDFLARE_ACCOUNT_ID` - Found in Cloudflare dashboard URL: `dash.cloudflare.com/<account-id>`

#### Firebase Configuration (Frontend)
Get these from [Firebase Console](https://console.firebase.google.com) → Project Settings → Your apps → Web app config:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

#### Application Configuration
- `VITE_ADMIN_EMAIL` - Admin email for app moderation queue
- `VITE_RECAPTCHA_SITE_KEY` - reCAPTCHA Enterprise site key from [Google Cloud Console](https://console.cloud.google.com/security/recaptcha)

#### Firebase Deployment
- `FIREBASE_TOKEN` - Generate with: `firebase login:ci`

### 3. Configure Cloudflare Pages Environment Variables

In Cloudflare Dashboard → **Pages** → `jtech-forums` → **Settings** → **Environment variables**

Add the same `VITE_*` variables as GitHub Secrets (for direct Cloudflare deployments).

### 4. Configure Firebase Secrets

Set sensitive secrets via Firebase Secret Manager (NOT environment variables):

```bash
firebase functions:secrets:set DISCOURSE_API_KEY
firebase functions:secrets:set CONTACT_SMTP_PASS
```

### 5. Configure Firebase Functions Environment Variables

Create `functions/.env.production` (do NOT commit):

```env
DISCOURSE_API_BASE=https://forums.jtechforums.org
DISCOURSE_API_USERNAME=system
CONTACT_SMTP_HOST=smtp.gmail.com
CONTACT_SMTP_PORT=465
CONTACT_SMTP_SECURE=true
CONTACT_SMTP_USER=your-email@gmail.com
CONTACT_TO_EMAIL=your-email@gmail.com
RECAPTCHA_SITE_KEY=your-recaptcha-site-key
RECAPTCHA_MIN_SCORE=0.5
RECAPTCHA_PROJECT_ID=your-project-id
```

### 6. Deploy Firebase Functions

```bash
cd functions
npm install
npm run deploy
```

Or push changes to `functions/**` - GitHub Actions will auto-deploy.

### 7. Update DNS

1. In Cloudflare DNS settings, point your domain to Cloudflare Pages
2. In Firebase Console → Authentication → Settings → Authorized domains, add your Cloudflare Pages domain

### 8. Deploy Frontend

Push to `main` branch - GitHub Actions will automatically deploy to Cloudflare Pages.

```bash
git push origin main
```

## Deployment Workflows

### Automatic Deployments

**Frontend** (`.github/workflows/cloudflare-pages.yml`):
- Triggers: Push to `main` branch
- Builds with environment variables from GitHub Secrets
- Deploys to Cloudflare Pages

**Functions** (`.github/workflows/firebase-functions.yml`):
- Triggers: Push to `main` with changes to `functions/**`, `firestore.rules`, or `storage.rules`
- Or manual trigger via workflow_dispatch
- Deploys functions and Firestore/Storage rules

### Manual Deployments

**Frontend:**
```bash
npm run build
# Then deploy via Cloudflare Dashboard or Wrangler CLI
```

**Functions:**
```bash
cd functions
npm run deploy
```

**Firestore/Storage Rules:**
```bash
firebase deploy --only firestore:rules,storage:rules
```

## Testing

### Local Testing

1. **Frontend:**
   ```bash
   npm run dev
   # Visit http://localhost:5173
   ```

2. **Functions:**
   ```bash
   npm --prefix functions run serve
   # Functions available at http://localhost:5001
   ```

3. **Full Stack:**
   ```bash
   firebase emulators:start --only hosting,functions
   ```

### Production Testing Checklist

- [ ] Frontend deploys successfully on Cloudflare Pages
- [ ] Firebase Functions deploy successfully
- [ ] Authentication works (sign in/out)
- [ ] Firestore data loads (apps catalog)
- [ ] Storage uploads work (app icons/APKs)
- [ ] Contact form submits successfully
- [ ] reCAPTCHA verification works
- [ ] Forum API proxy works (`/api/forum/*`)
- [ ] All routes load correctly (SPA routing via `_redirects`)
- [ ] No environment variable errors in browser console

## Troubleshooting

### Build Fails in GitHub Actions

Check that all required secrets are set in GitHub repository settings.

### Firebase Functions Errors

1. Check logs: `firebase functions:log`
2. Verify secrets: `firebase functions:secrets:access DISCOURSE_API_KEY`
3. Check environment variables in Firebase Console

### Cloudflare Pages 404 Errors

Verify `public/_redirects` file exists and is included in build output.

### Authentication Errors

1. Check Firebase Auth authorized domains include your Cloudflare Pages domain
2. Verify `VITE_FIREBASE_*` environment variables are correct

### Contact Form Fails

1. Verify `CONTACT_SMTP_PASS` secret is set: `firebase functions:secrets:access CONTACT_SMTP_PASS`
2. Check SMTP credentials in `functions/.env.production`
3. Verify reCAPTCHA configuration

## Rollback

### Rollback Frontend

In Cloudflare Dashboard → **Pages** → `jtech-forums` → **Deployments**, click **Rollback** on a previous deployment.

### Rollback Functions

```bash
git revert <commit-hash>
git push origin main
```

Or manually redeploy previous version:
```bash
git checkout <previous-commit>
cd functions
npm run deploy
git checkout main
```

## Security Notes

- All secrets are managed via GitHub Secrets and Firebase Secret Manager
- Never commit `.env` files
- Never hardcode API keys or credentials
- Regularly rotate API keys and tokens
- Review Firestore and Storage security rules regularly

## Support

For issues or questions:
- Check Firebase Functions logs: `firebase functions:log`
- Check Cloudflare Pages deployment logs in dashboard
- Check GitHub Actions workflow logs
- Open an issue on GitHub
- Visit [JTech Forums](https://forums.jtechforums.org)
