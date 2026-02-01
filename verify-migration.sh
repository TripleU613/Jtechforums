#!/bin/bash
# Migration Verification Script
# This script checks that all secrets have been properly extracted

echo "🔍 Verifying Migration: Firebase Hosting → Cloudflare Pages"
echo "============================================================"
echo ""

ERRORS=0

# Check for hardcoded secrets in source files
echo "1. Checking for hardcoded secrets..."

if grep -r "AIzaSyBykzDYSr-DNtQW41Y3ufIZdDB75H4b1Lg" src/ 2>/dev/null; then
    echo "❌ FAIL: Found hardcoded Firebase API key in src/"
    ERRORS=$((ERRORS + 1))
else
    echo "✅ PASS: No hardcoded Firebase API key found"
fi

if grep -r "tripleuworld@gmail.com" src/ 2>/dev/null; then
    echo "❌ FAIL: Found hardcoded email in src/"
    ERRORS=$((ERRORS + 1))
else
    echo "✅ PASS: No hardcoded email in src/"
fi

if grep "tripleuworld@gmail.com" functions/index.js 2>/dev/null; then
    echo "❌ FAIL: Found hardcoded email in functions/index.js"
    ERRORS=$((ERRORS + 1))
else
    echo "✅ PASS: No hardcoded email in functions/index.js"
fi

echo ""
echo "2. Checking for required files..."

FILES=(
    "public/_redirects"
    ".github/workflows/cloudflare-pages.yml"
    ".github/workflows/firebase-functions.yml"
    "DEPLOYMENT.md"
    "MIGRATION_SUMMARY.md"
    "NEXT_STEPS.md"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ PASS: $file exists"
    else
        echo "❌ FAIL: $file missing"
        ERRORS=$((ERRORS + 1))
    fi
done

echo ""
echo "3. Checking .env.example files..."

if grep -q "VITE_FIREBASE_API_KEY" .env.example; then
    echo "✅ PASS: .env.example has VITE_FIREBASE_API_KEY"
else
    echo "❌ FAIL: .env.example missing VITE_FIREBASE_API_KEY"
    ERRORS=$((ERRORS + 1))
fi

if grep -q "VITE_ADMIN_EMAIL" .env.example; then
    echo "✅ PASS: .env.example has VITE_ADMIN_EMAIL"
else
    echo "❌ FAIL: .env.example missing VITE_ADMIN_EMAIL"
    ERRORS=$((ERRORS + 1))
fi

if grep -q "your-email@gmail.com" functions/.env.example; then
    echo "✅ PASS: functions/.env.example uses placeholder email"
else
    echo "❌ FAIL: functions/.env.example may have real email"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "4. Checking for import.meta.env usage..."

if grep -q "import.meta.env.VITE_FIREBASE_API_KEY" src/lib/firebase.js; then
    echo "✅ PASS: src/lib/firebase.js uses environment variables"
else
    echo "❌ FAIL: src/lib/firebase.js not using environment variables"
    ERRORS=$((ERRORS + 1))
fi

if grep -q "import.meta.env.VITE_ADMIN_EMAIL" src/pages/Apps.jsx; then
    echo "✅ PASS: src/pages/Apps.jsx uses environment variable for admin email"
else
    echo "❌ FAIL: src/pages/Apps.jsx not using environment variable"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "5. Checking .gitignore..."

if grep -q ".env.local" .gitignore; then
    echo "✅ PASS: .gitignore includes .env.local"
else
    echo "❌ FAIL: .gitignore missing .env.local"
    ERRORS=$((ERRORS + 1))
fi

if grep -q "functions/.env" .gitignore; then
    echo "✅ PASS: .gitignore includes functions/.env"
else
    echo "❌ FAIL: .gitignore missing functions/.env"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "6. Checking old workflow is disabled..."

if [ -f ".github/workflows/firebase-hosting.yml" ]; then
    echo "⚠️  WARNING: firebase-hosting.yml still exists (should be .disabled)"
    echo "   This will cause conflicts with Cloudflare Pages deployment"
fi

if [ -f ".github/workflows/firebase-hosting.yml.disabled" ]; then
    echo "✅ PASS: Old Firebase Hosting workflow disabled"
else
    echo "❌ FAIL: Old workflow not found (should be .disabled)"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "============================================================"

if [ $ERRORS -eq 0 ]; then
    echo "✅ SUCCESS: All verification checks passed!"
    echo ""
    echo "Next steps:"
    echo "1. Review NEXT_STEPS.md for deployment instructions"
    echo "2. Set up local .env files for testing"
    echo "3. Configure GitHub Secrets and Cloudflare Pages"
    echo "4. Deploy and test!"
    exit 0
else
    echo "❌ FAILED: $ERRORS check(s) failed"
    echo ""
    echo "Please review the errors above and fix before deploying."
    exit 1
fi
