#!/bin/bash
# Deployment Helper Script
# Usage: ./deploy.sh [frontend|functions|all]

set -e

SERVICE_ACCOUNT="/home/tripleu/Downloads/jtechsite-2ebc8-firebase-adminsdk-fbsvc-05a3a117fa.json"
export GOOGLE_APPLICATION_CREDENTIALS="$SERVICE_ACCOUNT"

echo "🚀 JTech Forums Deployment Helper"
echo "=================================="
echo ""

deploy_frontend() {
    echo "📦 Building frontend..."
    npm run build

    echo ""
    echo "☁️  Deploying to Cloudflare Pages..."
    echo ""
    echo "Choose deployment method:"
    echo "1) Deploy via Wrangler CLI (recommended for testing)"
    echo "2) Push to GitHub (triggers GitHub Actions deployment)"
    echo ""
    read -p "Choose option (1 or 2): " choice

    if [ "$choice" = "1" ]; then
        echo ""
        echo "To deploy with Wrangler, run:"
        echo "wrangler pages deploy dist --project-name=jtech-forums"
        echo ""
        echo "Note: You'll need to create the project first at:"
        echo "https://dash.cloudflare.com → Workers & Pages → Create"
        echo ""
        read -p "Press Enter to deploy now, or Ctrl+C to cancel..."
        wrangler pages deploy dist --project-name=jtech-forums
    else
        echo ""
        echo "✅ Build complete. Commit and push to deploy:"
        echo "git add ."
        echo "git commit -m 'Deploy frontend updates'"
        echo "git push origin main"
    fi
}

deploy_functions() {
    echo "🔧 Installing function dependencies..."
    cd functions
    npm install

    echo ""
    echo "📤 Deploying Firebase Functions..."
    firebase deploy --only functions

    cd ..
    echo "✅ Functions deployed successfully"
}

deploy_rules() {
    echo "🔒 Deploying Firestore and Storage rules..."
    firebase deploy --only firestore:rules,storage:rules
    echo "✅ Rules deployed successfully"
}

case "$1" in
    frontend)
        deploy_frontend
        ;;
    functions)
        deploy_functions
        ;;
    rules)
        deploy_rules
        ;;
    all)
        deploy_frontend
        echo ""
        echo "=================================="
        echo ""
        deploy_functions
        echo ""
        echo "=================================="
        echo ""
        deploy_rules
        ;;
    *)
        echo "Usage: ./deploy.sh [frontend|functions|rules|all]"
        echo ""
        echo "  frontend  - Build and deploy frontend to Cloudflare Pages"
        echo "  functions - Deploy Firebase Functions"
        echo "  rules     - Deploy Firestore and Storage rules"
        echo "  all       - Deploy everything"
        echo ""
        exit 1
        ;;
esac

echo ""
echo "✨ Deployment complete!"
