# Next Steps: Cloudflare Pages Migration

**Status**: ✅ Code changes complete - Ready for configuration and testing

## Quick Start Checklist

### 1️⃣ Local Testing (Do This First!)

```bash
# 1. Create local environment files
cp .env.example .env
cp functions/.env.example functions/.env

# 2. Edit .env with your actual Firebase credentials
# Get from: https://console.firebase.google.com → Project Settings → Your apps
nano .env

# 3. Edit functions/.env with SMTP settings
nano functions/.env

# 4. Install dependencies
npm install
cd functions && npm install && cd ..

# 5. Test locally
npm run dev  # Frontend on http://localhost:5173
npm --prefix functions run serve  # Functions on http://localhost:5001
```

**Test These Features:**
- [ ] Firebase Auth (sign in/out)
- [ ] Apps catalog loads
- [ ] App submission form (if admin)
- [ ] Contact form
- [ ] No console errors about missing env vars

### 2️⃣ Create Cloudflare Pages Project

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
3. Select your GitHub repository
4. Configure:
   - **Project name**: `jtech-forums`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. **Save and Deploy** (first deploy will fail - that's OK, we need to add env vars)

### 3️⃣ Configure GitHub Secrets

**Repository Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Copy/paste these one at a time:

#### Get Cloudflare Credentials:
```
CLOUDFLARE_API_TOKEN → Create at https://dash.cloudflare.com/profile/api-tokens
  (Use "Edit Cloudflare Workers" template)
CLOUDFLARE_ACCOUNT_ID → From dashboard URL: dash.cloudflare.com/<this-is-the-account-id>
```

#### Get Firebase Credentials:
From [Firebase Console](https://console.firebase.google.com/u/0/project/jtechsite-2ebc8/settings/general/web):

```
VITE_FIREBASE_API_KEY → Copy from Firebase Console
VITE_FIREBASE_AUTH_DOMAIN → jtechsite-2ebc8.firebaseapp.com
VITE_FIREBASE_PROJECT_ID → jtechsite-2ebc8
VITE_FIREBASE_STORAGE_BUCKET → jtechsite-2ebc8.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID → 589329414755
VITE_FIREBASE_APP_ID → Copy from Firebase Console
VITE_FIREBASE_MEASUREMENT_ID → Copy from Firebase Console
```

#### Application Secrets:
```
VITE_ADMIN_EMAIL → Your admin email
VITE_RECAPTCHA_SITE_KEY → Your reCAPTCHA site key
```

#### Firebase Deployment:
```bash
# Generate Firebase token
firebase login:ci
# Copy the token and add as secret:
FIREBASE_TOKEN → <paste the token>
```

### 4️⃣ Configure Cloudflare Pages Environment Variables

**Cloudflare Dashboard** → **Pages** → `jtech-forums` → **Settings** → **Environment variables**

Add all the `VITE_*` variables (same values as GitHub Secrets):
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `VITE_ADMIN_EMAIL`
- `VITE_RECAPTCHA_SITE_KEY`

**For both Production AND Preview environments!**

### 5️⃣ Configure Firebase Secrets

```bash
# Set secrets via Firebase Secret Manager
firebase functions:secrets:set DISCOURSE_API_KEY
# When prompted, paste your Discourse API key

firebase functions:secrets:set CONTACT_SMTP_PASS
# When prompted, paste your Gmail app password
```

### 6️⃣ Update Firebase Auth Authorized Domains

1. Go to [Firebase Console](https://console.firebase.google.com/u/0/project/jtechsite-2ebc8/authentication/settings)
2. **Authentication** → **Settings** → **Authorized domains**
3. Add your Cloudflare Pages domain (e.g., `jtech-forums.pages.dev`)

### 7️⃣ Deploy!

```bash
# Stage all changes
git add .

# Commit
git commit -m "Migrate to Cloudflare Pages and extract all secrets

- Remove hardcoded Firebase config and admin email
- Add environment variable validation
- Create Cloudflare Pages deployment workflow
- Create Firebase Functions deployment workflow
- Add comprehensive documentation
- Update .gitignore for better secret protection

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# Push to trigger deployment
git push origin main
```

### 8️⃣ Monitor Deployment

**Watch GitHub Actions:**
1. Go to repository → **Actions** tab
2. Check both workflows complete successfully:
   - ✅ Deploy to Cloudflare Pages
   - ✅ Deploy Firebase Functions

**Check Cloudflare Pages:**
1. Go to Cloudflare Dashboard → Pages → jtech-forums
2. Verify deployment succeeded
3. Click **Visit site** to test

### 9️⃣ Testing Checklist

Visit your deployed site and test:

- [ ] Homepage loads correctly
- [ ] Sign in with Firebase Auth works
- [ ] Apps catalog loads data from Firestore
- [ ] Contact form submission works
- [ ] Forum integration works (if applicable)
- [ ] All routes work (no 404s)
- [ ] No console errors
- [ ] reCAPTCHA works on contact form
- [ ] App submission works (if admin)
- [ ] Mobile view works

### 🔟 Update DNS (When Ready)

When everything works on `*.pages.dev`:

1. **Cloudflare Pages** → `jtech-forums` → **Custom domains** → **Set up a custom domain**
2. Add `jtechforums.org` or your preferred domain
3. Cloudflare will handle DNS automatically if domain is on Cloudflare
4. Update Firebase Auth authorized domains with the new domain

---

## Troubleshooting

### "Missing required Firebase configuration" Error

**Problem**: Environment variables not loaded in build

**Solution**:
1. Check GitHub Secrets are set correctly
2. Check Cloudflare Pages environment variables are set
3. Verify variable names match exactly (case-sensitive)

### Contact Form Fails

**Problem**: SMTP credentials not set

**Solution**:
```bash
# Verify secret is set
firebase functions:secrets:access CONTACT_SMTP_PASS

# Re-set if needed
firebase functions:secrets:set CONTACT_SMTP_PASS
```

### Firebase Functions Deploy Fails

**Problem**: Missing FIREBASE_TOKEN secret

**Solution**:
```bash
# Generate new token
firebase login:ci
# Add to GitHub Secrets as FIREBASE_TOKEN
```

### Cloudflare Pages Build Fails

**Problem**: Missing environment variables during build

**Solution**: Check all `VITE_*` secrets are added in GitHub repository settings

---

## Rollback Plan

If something goes wrong:

### Rollback Frontend
**Cloudflare Dashboard** → **Pages** → `jtech-forums` → **Deployments** → Click "**Rollback**" on previous working deployment

### Rollback Functions
```bash
git revert HEAD
git push origin main
```

### Emergency: Go Back to Firebase Hosting
```bash
# Rename workflow back
mv .github/workflows/firebase-hosting.yml.disabled .github/workflows/firebase-hosting.yml
git add .
git commit -m "Rollback to Firebase Hosting"
git push origin main
```

---

## Getting Help

- **Detailed deployment guide**: See `DEPLOYMENT.md`
- **What changed**: See `MIGRATION_SUMMARY.md`
- **Development setup**: See `README.md`
- **Firebase logs**: `firebase functions:log`
- **GitHub Actions logs**: Repository → Actions tab
- **Cloudflare logs**: Dashboard → Pages → jtech-forums → Deployments

---

## Success Criteria ✅

You're done when:
- [ ] GitHub Actions workflows run successfully
- [ ] Cloudflare Pages deploys without errors
- [ ] Firebase Functions deploy successfully
- [ ] Site loads on Cloudflare Pages URL
- [ ] All features work (auth, database, storage, contact form)
- [ ] No secrets are hardcoded in the repository
- [ ] No console errors on the live site
- [ ] You can clone the repo fresh and run it locally with just `.env` setup

**Good luck! 🚀**
