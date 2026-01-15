# Netlify Deployment Guide

This document describes how to deploy the REST Countries application (web + server) to Netlify using GitHub Actions.

## Architecture

- **Web App**: Angular static site deployed to Netlify CDN
- **Server App**: NestJS API deployed as Netlify Serverless Function
- **API Routes**: `/api/*` requests are routed to `/.netlify/functions/server`

## Prerequisites

1. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Node.js 20**: Required for builds

## Setup Instructions

### 1. Install Required Dependencies

Add the serverless adapter for NestJS:

```bash
npm install --save @codegenie/serverless-express @netlify/functions
```

### 2. Create Netlify Site

#### Option A: Via Netlify CLI (Recommended)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Create new site (or link existing)
netlify init

# Note the Site ID from output
```

#### Option B: Via Netlify Dashboard

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to your GitHub repository
4. **Important**: Skip the build settings for now (we'll use GitHub Actions)
5. Note your **Site ID** from Site settings → General → Site details

### 3. Get Netlify Personal Access Token

1. Go to [app.netlify.com/user/applications](https://app.netlify.com/user/applications)
2. Click "New access token"
3. Give it a name (e.g., "GitHub Actions Deploy")
4. Copy the token (you won't see it again!)

### 4. Configure GitHub Secrets

Add these secrets to your GitHub repository:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add:

| Secret Name          | Value                      | Description |
| -------------------- | -------------------------- | ----------- |
| `NETLIFY_AUTH_TOKEN` | Your personal access token | From step 3 |
| `NETLIFY_SITE_ID`    | Your site ID               | From step 2 |

### 5. Deploy

Push to the `main` branch or create a pull request:

```bash
git add .
git commit -m "Add Netlify CI/CD"
git push origin main
```

GitHub Actions will automatically:

1. Build the web app
2. Build the server function
3. Deploy to Netlify

## Verify Deployment

1. Check GitHub Actions tab for build status
2. Visit your Netlify URL (e.g., `https://your-site.netlify.app`)
3. Test API endpoint: `https://your-site.netlify.app/api/countries`

## Environment Variables

If your server needs environment variables (database URLs, API keys, etc.):

1. Go to Netlify Dashboard → Site settings → Environment variables
2. Add variables for your production environment
3. Rebuild/redeploy for changes to take effect

## Custom Domain (Optional)

1. Go to Netlify Dashboard → Domain settings
2. Click "Add custom domain"
3. Follow instructions to configure DNS

## Troubleshooting

### Build Fails

- Check GitHub Actions logs for error details
- Verify all dependencies are in `package.json`
- Ensure Node version matches (22)

### Function Timeout

Netlify Functions have a 10-second timeout on free tier:

- Consider optimizing API responses
- Or deploy server separately (Render, Railway, Fly.io)

### API 404 Errors

- Verify `netlify.toml` redirects are correct
- Check that server build output is in `.netlify/functions-serve/server/`
- Review Netlify Function logs in dashboard

### Cold Start Latency

Serverless functions may have 1-2 second cold starts:

- This is normal for infrequently accessed functions
- Consider a ping service to keep function warm
- Or use a dedicated server for production

## Local Testing

Test the Netlify Functions locally:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build both apps
npx nx build web --configuration=production
NODE_ENV=production npx nx build server --configuration=production

# Run Netlify dev server
netlify dev
```

Visit `http://localhost:8888` to test locally.

## Files Created/Modified

- `netlify.toml` - Netlify configuration
- `.github/workflows/deploy.yml` - CI/CD pipeline
- `apps/server/netlify/server.ts` - Serverless function wrapper
- `apps/server/webpack.config.js` - Updated to output functions
- `apps/web/src/environments/environment.ts` - Already configured for `/api` prefix

## Next Steps

- [ ] Set up custom domain
- [ ] Configure environment variables for production
- [ ] Set up monitoring and alerts
- [ ] Consider separate hosting for server if needed (avoid serverless limitations)
- [ ] Enable Netlify Analytics (optional)
