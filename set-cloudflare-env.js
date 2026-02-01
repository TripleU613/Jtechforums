#!/usr/bin/env node
/**
 * Set Cloudflare Pages Environment Variables via API
 *
 * Usage: node set-cloudflare-env.js
 *
 * Requirements:
 * 1. Set CLOUDFLARE_API_TOKEN environment variable
 * 2. Have .env file with all VITE_* variables
 */

const fs = require('fs');
const path = require('path');

const ACCOUNT_ID = '2d433e3215fc8be53cc63fc504a5b993';
const PROJECT_NAME = 'jtechforums';

// Read .env file
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ Error: .env file not found');
  console.error('Please create .env file first: cp .env.example .env');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const match = line.match(/^(VITE_[A-Z_]+)=(.+)$/);
  if (match) {
    envVars[match[1]] = match[2];
  }
});

console.log('📋 Found environment variables:');
Object.keys(envVars).forEach(key => {
  console.log(`   ${key}=${envVars[key].substring(0, 20)}...`);
});
console.log('');

// Check for API token
const apiToken = process.env.CLOUDFLARE_API_TOKEN;
if (!apiToken) {
  console.error('❌ Error: CLOUDFLARE_API_TOKEN environment variable not set');
  console.error('');
  console.error('Get your API token from:');
  console.error('https://dash.cloudflare.com/profile/api-tokens');
  console.error('');
  console.error('Then run:');
  console.error('export CLOUDFLARE_API_TOKEN=your-token-here');
  console.error('node set-cloudflare-env.js');
  process.exit(1);
}

async function setEnvironmentVariables() {
  const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}`;

  console.log('🔧 Updating Cloudflare Pages environment variables...');
  console.log('');

  // Get current project config
  const getResponse = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!getResponse.ok) {
    const error = await getResponse.text();
    console.error('❌ Failed to get project config:', error);
    process.exit(1);
  }

  const projectData = await getResponse.json();

  // Update deployment configs with new environment variables
  const deployment_configs = {
    production: {
      env_vars: {}
    },
    preview: {
      env_vars: {}
    }
  };

  // Add all VITE_* variables
  Object.entries(envVars).forEach(([key, value]) => {
    deployment_configs.production.env_vars[key] = { value };
    deployment_configs.preview.env_vars[key] = { value };
  });

  // Patch the project
  const patchResponse = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ deployment_configs }),
  });

  if (!patchResponse.ok) {
    const error = await patchResponse.text();
    console.error('❌ Failed to update environment variables:', error);
    process.exit(1);
  }

  console.log('✅ Successfully set environment variables for:');
  console.log('   • Production environment');
  console.log('   • Preview environment');
  console.log('');
  console.log('🚀 Next steps:');
  console.log('   1. Trigger a new deployment by pushing to GitHub');
  console.log('   2. Or redeploy in Cloudflare dashboard');
  console.log('   3. Check build logs to verify env vars are loaded');
  console.log('');
  console.log('Dashboard: https://dash.cloudflare.com/' + ACCOUNT_ID + '/pages/view/' + PROJECT_NAME);
}

setEnvironmentVariables().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
