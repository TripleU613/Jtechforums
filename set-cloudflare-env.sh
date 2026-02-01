#!/bin/bash
# Set Cloudflare Pages Environment Variables using Wrangler
# This configures all required VITE_* variables for the production environment

PROJECT_NAME="jtechforums"

echo "🔧 Setting Cloudflare Pages Environment Variables"
echo "=================================================="
echo "Project: $PROJECT_NAME"
echo ""

# Read values from .env file
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found"
    echo "Please create .env file first with: cp .env.example .env"
    exit 1
fi

source .env

echo "Setting environment variables..."
echo ""

# Firebase Configuration
wrangler pages secret put VITE_FIREBASE_API_KEY --project-name="$PROJECT_NAME" <<< "$VITE_FIREBASE_API_KEY"
wrangler pages secret put VITE_FIREBASE_AUTH_DOMAIN --project-name="$PROJECT_NAME" <<< "$VITE_FIREBASE_AUTH_DOMAIN"
wrangler pages secret put VITE_FIREBASE_PROJECT_ID --project-name="$PROJECT_NAME" <<< "$VITE_FIREBASE_PROJECT_ID"
wrangler pages secret put VITE_FIREBASE_STORAGE_BUCKET --project-name="$PROJECT_NAME" <<< "$VITE_FIREBASE_STORAGE_BUCKET"
wrangler pages secret put VITE_FIREBASE_MESSAGING_SENDER_ID --project-name="$PROJECT_NAME" <<< "$VITE_FIREBASE_MESSAGING_SENDER_ID"
wrangler pages secret put VITE_FIREBASE_APP_ID --project-name="$PROJECT_NAME" <<< "$VITE_FIREBASE_APP_ID"
wrangler pages secret put VITE_FIREBASE_MEASUREMENT_ID --project-name="$PROJECT_NAME" <<< "$VITE_FIREBASE_MEASUREMENT_ID"

# Admin Configuration
wrangler pages secret put VITE_ADMIN_EMAIL --project-name="$PROJECT_NAME" <<< "$VITE_ADMIN_EMAIL"

# reCAPTCHA Configuration
wrangler pages secret put VITE_RECAPTCHA_SITE_KEY --project-name="$PROJECT_NAME" <<< "$VITE_RECAPTCHA_SITE_KEY"

echo ""
echo "✅ All environment variables set successfully!"
echo ""
echo "Note: These are secrets, so they won't show in the dashboard."
echo "To verify, trigger a new deployment and check the build logs."
