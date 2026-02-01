# Quick Start: Deploy to Cloudflare Pages

Your Cloudflare Pages site is already set up and auto-deploying from GitHub. You just need to configure environment variables and you're good to go!

## ⚡ Fast Track (3 Steps)

### 1️⃣ Set Cloudflare Environment Variables

**Option A: Via API Script (Fastest)**
```bash
# Get API token from: https://dash.cloudflare.com/profile/api-tokens
# (Use "Edit Cloudflare Workers" template)

export CLOUDFLARE_API_TOKEN=your-token-here
node set-cloudflare-env.js
```

**Option B: Via Dashboard (Easiest)**
1. Go to: https://dash.cloudflare.com/2d433e3215fc8be53cc63fc504a5b993/pages/view/jtechforums/settings/environment-variables
2. Copy all variables from `.env` file (the VITE_* ones)
3. Add them to both **Production** and **Preview** environments
4. Click Save

### 2️⃣ Trigger Deployment

**Option A: Push to GitHub**
```bash
git add .
git commit -m "Configure environment variables for Cloudflare Pages"
git push origin main
```

**Option B: Manual Redeploy**
- Go to Cloudflare dashboard → Pages → jtechforums → Deployments
- Click "..." on latest deployment → "Retry deployment"

### 3️⃣ Verify

1. **Watch deployment**: https://dash.cloudflare.com/2d433e3215fc8be53cc63fc504a5b993/pages/view/jtechforums
2. **Check build logs** for errors
3. **Visit site**: https://jtechforums.pages.dev
4. **Test features**:
   - Sign in with Firebase Auth
   - Check apps catalog loads
   - Verify no console errors

## ✅ What's Already Done

- ✅ All hardcoded secrets removed from code
- ✅ Environment variable validation added
- ✅ Build tested locally and works
- ✅ `_redirects` file configured for API routing
- ✅ Cloudflare Pages project exists and connected to GitHub
- ✅ Local `.env` file created with actual values

## 🔧 Optional: Deploy Firebase Functions

If you also want to update Firebase Functions:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/home/tripleu/Downloads/jtechsite-2ebc8-firebase-adminsdk-fbsvc-05a3a117fa.json"

# Deploy functions
./deploy.sh functions

# Or manually:
cd functions
npm install
firebase deploy --only functions
```

## 📋 Environment Variables Reference

These are the variables that need to be set in Cloudflare Pages (already in your `.env` file):

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
VITE_ADMIN_EMAIL
VITE_RECAPTCHA_SITE_KEY
```

## 🎯 That's It!

Once environment variables are set in Cloudflare Pages, every push to `main` will auto-deploy with those variables baked into the build.

## 🆘 Troubleshooting

**Build fails with "Missing required Firebase configuration"**
→ Environment variables not set in Cloudflare Pages. Use Option A or B above.

**"CLOUDFLARE_API_TOKEN not set" when running script**
→ Get token from https://dash.cloudflare.com/profile/api-tokens

**Functions not deploying**
→ Check service account is set: `echo $GOOGLE_APPLICATION_CREDENTIALS`

---

**Need more details?** See:
- `cloudflare-env-setup.md` - Detailed environment setup
- `DEPLOYMENT.md` - Complete deployment guide
- `NEXT_STEPS.md` - Full deployment checklist
