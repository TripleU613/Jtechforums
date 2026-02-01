# Cloudflare Pages Environment Variables Setup

Since your Cloudflare Pages project `jtechforums` is already set up and auto-deploying from GitHub, you just need to configure the environment variables.

## Method 1: Via Cloudflare Dashboard (Recommended)

1. Go to: https://dash.cloudflare.com/2d433e3215fc8be53cc63fc504a5b993/pages/view/jtechforums/settings/environment-variables

2. Add these environment variables for **Production**:

```bash
VITE_FIREBASE_API_KEY=AIzaSyBykzDYSr-DNtQW41Y3ufIZdDB75H4b1Lg
VITE_FIREBASE_AUTH_DOMAIN=jtechsite-2ebc8.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=jtechsite-2ebc8
VITE_FIREBASE_STORAGE_BUCKET=jtechsite-2ebc8.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=589329414755
VITE_FIREBASE_APP_ID=1:589329414755:web:06ee33088387ed1a9b1656
VITE_FIREBASE_MEASUREMENT_ID=G-0JP00LW81T
VITE_ADMIN_EMAIL=tripleuworld@gmail.com
VITE_RECAPTCHA_SITE_KEY=6LcKrggsAAAAAOVbLq4ZQ_bHpVAnlfNFAJQAhoRz
```

3. Add the same variables for **Preview** environment (optional but recommended)

4. Click **Save**

5. **Redeploy**: Go to Deployments tab → Click "..." on latest deployment → "Retry deployment"

## Method 2: Via Wrangler CLI

Run this command for each variable:

```bash
# Example for one variable:
wrangler pages secret put VITE_FIREBASE_API_KEY \
  --project-name=jtechforums \
  --env=production

# Then paste the value when prompted
```

Or use this automated script:

```bash
./set-cloudflare-env.sh
```

## Method 3: Bulk Upload via API

You can also set all variables at once using the Cloudflare API. I can create a script for this if you prefer.

## Verify Setup

After setting the environment variables:

1. **Trigger a new deployment**:
   - Either push to GitHub
   - Or redeploy in Cloudflare dashboard

2. **Check build logs** to ensure environment variables are loaded

3. **Test the deployed site**:
   - Visit: https://jtechforums.pages.dev
   - Check browser console for errors
   - Test authentication
   - Verify no "Missing required Firebase configuration" errors

## Current Status

✅ Frontend code ready (secrets extracted)
✅ Cloudflare Pages project exists and auto-deploys
⏳ Need to set environment variables
⏳ Need to trigger redeploy after setting variables

## Next Steps After This

1. Set up GitHub Secrets for the GitHub Actions workflow (for build-time env vars)
2. Deploy Firebase Functions with the service account
3. Test everything end-to-end
