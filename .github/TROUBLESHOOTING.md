# 🔍 GitHub Pages Troubleshooting Checklist

Use this checklist to diagnose and fix GitHub Pages issues.

## ✅ Pre-Deployment Checklist

### Repository Settings
- [ ] Repository is public (or GitHub Pro/Team for private repos)
- [ ] Settings → Pages → Source = "GitHub Actions" (NOT "Deploy from a branch")
- [ ] Settings → Actions → General → Workflow permissions = "Read and write"
- [ ] Settings → Actions → General → "Allow GitHub Actions to create and approve pull requests" = Checked

### Workflow File
- [ ] `.github/workflows/test-automation.yml` exists
- [ ] Workflow has `pages: write` permission
- [ ] Workflow has `id-token: write` permission
- [ ] Deploy job uses `actions/deploy-pages@v4`

## 🔧 Deployment Issues

### Issue: "No deployments found"

**Symptoms:**
- Settings → Pages shows "No deployments"
- Site URL not generated

**Solutions:**
1. Check Source setting:
   ```
   Settings → Pages → Source → Must be "GitHub Actions"
   ```

2. Trigger a workflow run:
   ```
   Actions → Test Automation Pipeline → Run workflow
   ```

3. Wait for deploy-report job to complete:
   ```
   Actions → Latest run → deploy-report → Should show ✓
   ```

### Issue: "404 Not Found" when accessing site

**Symptoms:**
- URL loads but shows 404 error
- `https://bastheboss7.github.io/playwright-hybrid-integration-API-UI-A11y/` not accessible

**Solutions:**
1. Verify deployment completed:
   ```
   Settings → Pages → Should show "Your site is live at..."
   ```

2. Check workflow logs:
   ```
   Actions → Latest run → deploy-report → Deploy to GitHub Pages step
   Should show: "Deploy complete! Live URL: https://..."
   ```

3. Wait a few minutes - DNS propagation can take time

4. Try accessing with trailing slash:
   ```
   https://bastheboss7.github.io/playwright-hybrid-integration-API-UI-A11y/
   ```

### Issue: Landing page loads but "View Detailed Report" gives 404

**Symptoms:**
- Landing page works fine
- Clicking "📊 View Detailed Report" shows 404
- `/data/` directory not found

**Solution:**
- This was fixed in commit `aa44e8e`
- Update your branch:
  ```bash
  git pull origin main
  ```

### Issue: Workflow fails with "Permission denied"

**Symptoms:**
- deploy-report job fails
- Error: "Resource not accessible by integration"

**Solutions:**
1. Check workflow permissions:
   ```
   Settings → Actions → General → Workflow permissions
   Select: "Read and write permissions"
   Save
   ```

2. Check Pages permissions in workflow file:
   ```yaml
   permissions:
     pages: write
     id-token: write
   ```

3. Re-run the workflow

### Issue: "gh-pages branch not found"

**Symptoms:**
- Looking for a gh-pages branch
- Branch list doesn't show gh-pages

**Solution:**
- **This is NOT an issue!** 
- GitHub Actions deployment doesn't need a gh-pages branch
- Change Settings → Pages → Source to "GitHub Actions"

## 🔍 Debugging Steps

### Step 1: Check Workflow Execution

```bash
# View recent workflow runs
gh run list --workflow=test-automation.yml --limit=5

# View specific run
gh run view <run-id>

# View logs for deploy-report job
gh run view <run-id> --log --job=deploy-report
```

### Step 2: Verify Artifact Upload

1. Go to Actions → Latest run
2. Scroll to bottom → Artifacts section
3. Should see: `github-pages` artifact
4. Download and inspect if needed

### Step 3: Check Pages Environment

1. Settings → Environments
2. Should see: `github-pages` environment
3. Click to view deployment history
4. Latest deployment should show success ✓

### Step 4: Test Report Generation Locally

```bash
# Run tests locally
npm test

# Generate report
npx playwright test

# View report
npx playwright show-report

# If local report works, issue is with deployment, not test generation
```

## 📊 Common Error Messages

### Error: "Missing required permissions"

**Fix:**
```yaml
# In .github/workflows/test-automation.yml
permissions:
  contents: read
  pages: write        # ADD THIS
  id-token: write     # ADD THIS
```

### Error: "No upload artifact found"

**Fix:**
Check that `actions/upload-pages-artifact@v3` step ran successfully before `actions/deploy-pages@v4`

### Error: "Branch not found: gh-pages"

**Fix:**
You're using the wrong deployment method. Change Settings → Pages → Source to "GitHub Actions"

## ✅ Success Indicators

You know it's working when:

- [ ] Settings → Pages shows: "Your site is live at https://..."
- [ ] Workflow run shows: deploy-report job ✓
- [ ] Landing page loads: https://bastheboss7.github.io/playwright-hybrid-integration-API-UI-A11y/
- [ ] Detailed report loads: https://bastheboss7.github.io/playwright-hybrid-integration-API-UI-A11y/data/
- [ ] Test metadata shows on landing page (branch, commit, run ID)
- [ ] Report updates after each push to main

## 🆘 Still Having Issues?

1. Check [GITHUB_PAGES_SETUP.md](../GITHUB_PAGES_SETUP.md) for detailed guide
2. Review [DEPLOYMENT_FLOW.md](DEPLOYMENT_FLOW.md) for architecture
3. See [PAGES_QUICK_START.md](PAGES_QUICK_START.md) for quick reference

## 📋 Quick Diagnostic Command

```bash
# Run this to get full diagnostic info
echo "=== Repository Settings Check ==="
echo "Check Settings → Pages → Source should be 'GitHub Actions'"
echo ""
echo "=== Recent Workflow Runs ==="
gh run list --workflow=test-automation.yml --limit=3
echo ""
echo "=== Pages Environment ==="
echo "Check Settings → Environments → github-pages"
echo ""
echo "=== Expected URL ==="
echo "https://bastheboss7.github.io/playwright-hybrid-integration-API-UI-A11y/"
```

---

**Most Common Fix:** Change Settings → Pages → Source from "Deploy from a branch" to "GitHub Actions" 🎯
