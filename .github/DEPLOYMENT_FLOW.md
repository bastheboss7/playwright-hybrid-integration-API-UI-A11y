# GitHub Pages Deployment Flow

## 📊 How It Works

```
┌─────────────────────────────────────────────────────────────────────┐
│                       TRIGGER EVENT                                  │
│  • Push to main                                                      │
│  • Scheduled run (2 AM UTC)                                         │
│  • Manual workflow dispatch                                          │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    WORKFLOW EXECUTION                                │
│  Job: tests                                                          │
│  ├─ Run Playwright tests (Chromium, Firefox, WebKit)               │
│  ├─ Generate HTML reports                                           │
│  └─ Upload as artifacts (playwright-report-{browser}-{runId})      │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    DEPLOY-REPORT JOB                                 │
│  Step 1: Download All Artifacts                                     │
│  └─ Downloads: playwright-report-chromium-*                         │
│                                                                      │
│  Step 2: Prepare Report Directory                                   │
│  ├─ Create: gh-pages/data/                                         │
│  └─ Copy report to: gh-pages/data/*                                │
│                                                                      │
│  Step 3: Create Landing Page                                        │
│  ├─ Generate: gh-pages/index.html                                  │
│  ├─ Inject metadata (branch, commit, run ID)                       │
│  └─ Add link to: ./data/ (Playwright report)                       │
│                                                                      │
│  Step 4: Setup Pages                                                │
│  └─ actions/configure-pages@v4                                      │
│                                                                      │
│  Step 5: Upload Pages Artifact                                      │
│  └─ actions/upload-pages-artifact@v3                                │
│                                                                      │
│  Step 6: Deploy to GitHub Pages                                     │
│  └─ actions/deploy-pages@v4                                         │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    GITHUB PAGES (LIVE SITE)                          │
│                                                                      │
│  URL: https://bastheboss7.github.io/                                │
│       playwright-hybrid-integration-API-UI-A11y/                    │
│                                                                      │
│  Structure:                                                          │
│  /                 → Landing page (index.html)                      │
│  /data/            → Playwright HTML report                         │
│  /data/index.html  → Test results overview                          │
│  /data/trace/      → Playwright traces                              │
└─────────────────────────────────────────────────────────────────────┘
```

## 🔧 Repository Settings Required

```
Settings → Pages → Build and deployment
┌─────────────────────────────────────────────────┐
│ Source: [GitHub Actions ▼]  ← SELECT THIS       │
│                                                  │
│ NOT: [Deploy from a branch ▼]  ← DON'T USE     │
└─────────────────────────────────────────────────┘
```

## ❌ Common Mistakes

### Mistake 1: Looking for gh-pages branch
```
❌ WRONG: Trying to find or create a gh-pages branch
✅ RIGHT: No branch needed! GitHub Actions handles everything
```

### Mistake 2: Selecting "Deploy from a branch"
```
❌ WRONG: Settings → Pages → Source → "Deploy from a branch"
✅ RIGHT: Settings → Pages → Source → "GitHub Actions"
```

### Mistake 3: Trying to manually commit HTML files
```
❌ WRONG: git commit -am "Add reports" && git push origin gh-pages
✅ RIGHT: Just push to main - workflow deploys automatically
```

## ✅ Verification Steps

After enabling GitHub Pages with "GitHub Actions" source:

1. **Check Workflow Run**
   ```
   Actions tab → Test Automation Pipeline → Latest run → deploy-report job
   Should show: ✓ Deploy to GitHub Pages
   ```

2. **Check Deployment**
   ```
   Settings → Pages → Shows:
   "Your site is live at https://bastheboss7.github.io/..."
   ```

3. **Access Landing Page**
   ```
   Visit: https://bastheboss7.github.io/playwright-hybrid-integration-API-UI-A11y/
   Should show: Companies House QA Assessment landing page
   ```

4. **Access Detailed Report**
   ```
   Click: "📊 View Detailed Report" button
   Should show: Playwright HTML reporter with test results
   ```

## 🎯 Quick Reference

| What | Where | How |
|------|-------|-----|
| **Enable Pages** | Settings → Pages | Set Source to "GitHub Actions" |
| **Trigger Deploy** | Push to main | Workflow runs automatically |
| **View Report** | Browser | https://bastheboss7.github.io/playwright-hybrid-integration-API-UI-A11y/ |
| **Check Status** | Actions tab | Look for deploy-report job ✓ |

## 📚 Related Documentation

- **[GITHUB_PAGES_SETUP.md](../GITHUB_PAGES_SETUP.md)** - Complete setup guide
- **[.github/PAGES_QUICK_START.md](PAGES_QUICK_START.md)** - 3-step quick start

---

**Remember**: Your workflow is already configured. You just need to enable GitHub Pages in repository settings! 🚀
