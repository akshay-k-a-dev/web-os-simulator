# WebOS - Linux Desktop Environment

A fully functional web-based operating system built with React and TypeScript, featuring a complete desktop environment with multiple applications.

## 🚀 Features

- **Full Desktop Environment** with window management, taskbar, and power menu
- **Multiple Applications**:
  - Terminal with command execution
  - File Manager for browsing files
  - Text Editor for creating and editing documents
  - Web Browser
  - Media Player
  - System Settings
  - Calculator
- **Power Management**: Shutdown, restart, and sleep modes with boot animations
- **Customizable Wallpapers**: Gradient, solid colors, or custom images
- **Theme Customization**: Adjustable color schemes
- **Persistent Storage**: All data is saved using the Spark KV store

## 🛠️ Development

### Prerequisites
- Node.js 20 or higher
- npm

### Installation

```bash
npm install
```

### Running Locally

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

## 📦 Deployment to GitHub Pages

This project includes an automated GitHub Actions workflow that deploys to GitHub Pages.

### Setup Instructions

1. **Enable GitHub Pages** in your repository:
   - Go to Settings → Pages
   - Under "Source", select "GitHub Actions"

2. **Update the base path** in `vite.config.ts`:
   - Change `/spark-template/` to match your repository name
   - Example: If your repo is `my-webos`, change to `/my-webos/`

3. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

4. **Workflow runs automatically**:
   - The workflow triggers on every push to `main`
   - Can also be triggered manually from the Actions tab
   - Build artifacts are deployed to GitHub Pages

5. **Access your site**:
   - Visit: `https://[username].github.io/[repository-name]/`

### Manual Deployment

You can also trigger deployment manually:
- Go to Actions tab → Deploy to GitHub Pages → Run workflow

### Configuration

The deployment workflow (`.github/workflows/deploy.yml`) includes:
- Automatic dependency installation
- Production build
- `.nojekyll` file creation (disables Jekyll processing)
- Artifact upload and deployment

## 🎨 Customization

### Wallpaper
Access Settings → Wallpaper to customize:
- Gradient backgrounds
- Solid colors
- Custom image URLs

### Theme Colors
Access Settings → Theme to customize system colors:
- Primary color
- Accent color
- Background and foreground colors

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
