# GitHub Pages Setup Guide for Live Test Reporting

## 🎯 Overview

This repository uses **GitHub Actions** to automatically deploy test reports to GitHub Pages. This is the **modern deployment method** that does NOT require a `gh-pages` branch.

## ✅ Current Configuration

The workflow (`.github/workflows/test-automation.yml`) is already configured to:
- Generate Playwright HTML test reports
- Create a beautiful landing page
- Deploy to GitHub Pages automatically
- Update on every push to `main`, scheduled runs, and manual triggers

## 📋 Repository Settings Configuration

### Step-by-Step Instructions

Follow these steps to enable GitHub Pages for your repository:

1. **Go to Repository Settings**
   - Navigate to your repository: `https://github.com/bastheboss7/playwright-hybrid-integration-API-UI-A11y`
   - Click on **Settings** (top menu)

2. **Access Pages Settings**
   - In the left sidebar, scroll down to **Code and automation** section
   - Click on **Pages**

3. **Configure Build and Deployment Source**
   - Under **Build and deployment** section
   - Find the **Source** dropdown
   - ⚠️ **IMPORTANT**: Select **"GitHub Actions"** (NOT "Deploy from a branch")
   
   ![Pages Source Configuration](https://docs.github.com/assets/cb-47267/images/help/pages/pages-source-github-actions.png)

4. **Save and Wait**
   - The setting saves automatically
   - No `gh-pages` branch is needed
   - No additional configuration required

5. **Trigger a Deployment**
   - Push to `main` branch, OR
   - Wait for the nightly scheduled run (2 AM UTC), OR
   - Manually trigger via **Actions** → **Test Automation Pipeline** → **Run workflow**

6. **Access Your Live Report**
   - After workflow completes, visit: `https://bastheboss7.github.io/playwright-hybrid-integration-API-UI-A11y/`
   - The landing page will show test execution details
   - Click "📊 View Detailed Report" to see Playwright results

## 🔍 Understanding the Deployment Methods

### ❌ Deploy from Branch (OLD METHOD - NOT USED HERE)
- Requires a `gh-pages` branch
- You manually push HTML files to this branch
- **DO NOT USE THIS METHOD**

### ✅ GitHub Actions (MODERN METHOD - CURRENTLY CONFIGURED)
- No special branch needed
- Workflow builds and deploys automatically
- Uses `actions/deploy-pages@v4` action
- **THIS IS WHAT YOU SHOULD USE**

## 🚀 How It Works

### Workflow Deployment Process

```yaml
# The workflow automatically:
1. Runs tests (Chromium, Firefox, WebKit)
2. Generates Playwright HTML reports
3. Downloads test artifacts
4. Prepares report directory (gh-pages/data/)
5. Creates custom landing page (gh-pages/index.html)
6. Uploads as Pages artifact
7. Deploys to GitHub Pages
```

### Permissions Required

The workflow has these permissions (already configured):
```yaml
permissions:
  contents: read      # Read repository code
  pages: write        # Deploy to Pages
  id-token: write     # OIDC authentication
```

## 🛠️ Troubleshooting

### Issue: "No deployment found"
**Solution**: Make sure Pages source is set to "GitHub Actions" in Settings → Pages

### Issue: "404 Not Found" when accessing the site
**Possible causes**:
1. Workflow hasn't run yet → Trigger a workflow run
2. Deployment failed → Check Actions tab for errors
3. Wrong URL → Use `https://YOUR_USERNAME.github.io/REPO_NAME/`

### Issue: Landing page loads but "View Detailed Report" gives 404
**Solution**: This was fixed in recent commits. The report is now correctly placed in `/data/` subdirectory.

### Issue: Workflow fails with permissions error
**Solution**: 
1. Go to Settings → Actions → General
2. Scroll to "Workflow permissions"
3. Select "Read and write permissions"
4. Check "Allow GitHub Actions to create and approve pull requests"
5. Save

## 📊 Viewing Test Reports

### Live Report URL
After successful deployment, access your reports at:
```
https://bastheboss7.github.io/playwright-hybrid-integration-API-UI-A11y/
```

### Report Structure
```
/                           # Landing page (custom UI)
└── data/                   # Playwright HTML report
    ├── index.html          # Test results overview
    ├── data/               # Test data files
    └── trace/              # Playwright traces
```

### Landing Page Features
- 🎭 Test execution metadata (branch, commit, run ID)
- 📊 Direct link to detailed Playwright report
- 📁 Link to repository
- 🎨 Beautiful gradient UI
- 📱 Responsive design

## 🔄 Deployment Triggers

Reports are automatically deployed when:

| Trigger | Description | Test Scope |
|---------|-------------|------------|
| **Push to main** | After merging PRs | Smoke tests |
| **Scheduled (2 AM UTC)** | Nightly regression | Full suite |
| **Manual dispatch** | On-demand via Actions tab | Configurable |

## 📝 Verification Checklist

Use this checklist to verify your setup:

- [ ] Repository Settings → Pages → Source = "GitHub Actions"
- [ ] Latest workflow run completed successfully
- [ ] Landing page accessible at `https://YOUR_USERNAME.github.io/REPO_NAME/`
- [ ] "View Detailed Report" link works and shows Playwright results
- [ ] Test metadata displays correctly on landing page

## 🎓 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions for Pages](https://github.com/actions/deploy-pages)
- [Playwright HTML Reporter](https://playwright.dev/docs/test-reporters#html-reporter)

## ⚡ Quick Reference

### Enable Pages (One-Time Setup)
```
Settings → Pages → Source → "GitHub Actions"
```

### Trigger Deployment
```bash
# Option 1: Push to main
git push origin main

# Option 2: Manual trigger
Actions → Test Automation Pipeline → Run workflow

# Option 3: Wait for nightly run (2 AM UTC)
```

### View Reports
```
URL: https://bastheboss7.github.io/playwright-hybrid-integration-API-UI-A11y/
```

---

**Need Help?** Check the [workflow file](.github/workflows/test-automation.yml) for implementation details.
