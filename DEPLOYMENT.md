# Deployment Guide for GitHub Pages

This guide will help you deploy your WebOS application to GitHub Pages using the automated workflow.

## Prerequisites

- A GitHub account
- Your code pushed to a GitHub repository
- Node.js 20+ installed locally (for development)

## Quick Start Deployment

### Step 1: Enable GitHub Pages

1. Navigate to your repository on GitHub
2. Click on **Settings** tab
3. Click on **Pages** in the left sidebar
4. Under **Source**, select **GitHub Actions** from the dropdown

### Step 2: Configure Base Path

You need to update the base path in `vite.config.ts` to match your repository name:

```typescript
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/YOUR-REPO-NAME/' : '/',
  // ... rest of config
});
```

**Example:**
- If your repository URL is `https://github.com/username/my-webos`
- Change base to: `base: process.env.NODE_ENV === 'production' ? '/my-webos/' : '/',`

### Step 3: Push Your Changes

```bash
git add .
git commit -m "Configure for GitHub Pages deployment"
git push origin main
```

### Step 4: Monitor Deployment

1. Go to the **Actions** tab in your repository
2. You'll see the "Deploy to GitHub Pages" workflow running
3. Wait for both the "build" and "deploy" jobs to complete (usually 2-3 minutes)
4. A green checkmark indicates successful deployment

### Step 5: Access Your Site

Your site will be available at:
```
https://[your-username].github.io/[your-repo-name]/
```

## Workflow Details

The deployment workflow (`.github/workflows/deploy.yml`) automatically:

1. **Triggers** on:
   - Every push to the `main` branch
   - Manual workflow dispatch (via Actions tab)

2. **Build Process**:
   - Checks out the code
   - Sets up Node.js 20
   - Installs dependencies with `npm ci`
   - Builds the production bundle with `npm run build`
   - Adds `.nojekyll` file to disable Jekyll processing

3. **Deploy Process**:
   - Uploads build artifacts
   - Deploys to GitHub Pages environment

## Manual Deployment

To manually trigger deployment:

1. Go to the **Actions** tab
2. Click on **Deploy to GitHub Pages** workflow
3. Click **Run workflow** dropdown
4. Select `main` branch
5. Click **Run workflow** button

## Troubleshooting

### Deployment Fails

**Issue**: Workflow fails with permissions error
- **Solution**: In repository Settings → Actions → General → Workflow permissions, select "Read and write permissions"

**Issue**: 404 Page Not Found after deployment
- **Solution**: Verify the `base` path in `vite.config.ts` matches your repository name exactly

**Issue**: Assets not loading (blank page)
- **Solution**: Check browser console for 404 errors. Ensure base path includes trailing slash

### Custom Domain

To use a custom domain:

1. In repository Settings → Pages → Custom domain, enter your domain
2. Create a `CNAME` file in the `public` folder with your domain name
3. Configure DNS records with your domain provider:
   - Add A records pointing to GitHub Pages IPs
   - Or add CNAME record pointing to `[username].github.io`

## Environment Variables

If you need environment variables in production:

1. Add them to the workflow file under the build step:
   ```yaml
   - name: Build
     run: npm run build
     env:
       NODE_ENV: production
       VITE_API_URL: ${{ secrets.API_URL }}
   ```

2. Add secrets in repository Settings → Secrets and variables → Actions

## Build Optimization

The production build includes:

- Tree shaking to remove unused code
- Minification of JavaScript and CSS
- Asset optimization
- Code splitting for better performance

## Notes

- The `.nojekyll` file is important! It prevents GitHub from processing your site with Jekyll
- First deployment may take a few extra minutes
- Subsequent deployments are usually faster
- Old deployments are automatically cleaned up

## Support

If you encounter issues:
1. Check the Actions tab for detailed error logs
2. Verify all prerequisites are met
3. Ensure your repository is public (or you have GitHub Pages enabled for private repos)
4. Review the GitHub Pages documentation: https://docs.github.com/en/pages
