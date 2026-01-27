# 🚀 Quick Guide: Deploy from Develop Branch

## Current Situation

❌ **Pushing to develop does NOT auto-deploy to GitHub Pages**  
✅ **Only main branch auto-deploys**

## ⚡ Deploy from Develop Right Now (No Code Changes)

### Step 1: Navigate to Actions
```
https://github.com/bastheboss7/playwright-hybrid-integration-API-UI-A11y/actions
```

### Step 2: Select the Workflow
Click on **"Test Automation Pipeline"** in the left sidebar

### Step 3: Run Workflow
1. Click the **"Run workflow"** button (top right, blue button)
2. A dropdown appears:
   ```
   Use workflow from
   Branch: [main ▼]  ← Click this dropdown
   ```
3. Select **develop** from the dropdown
4. Choose test scope (optional): smoke/regression/all
5. Click green **"Run workflow"** button

### Step 4: Monitor Progress
1. The workflow starts running
2. Watch the progress in Actions tab
3. Wait for "deploy-report" job to complete ✅
4. Your develop branch results are now live!

### Step 5: Access Your Report
```
https://bastheboss7.github.io/playwright-hybrid-integration-API-UI-A11y/
```

## ⚠️ Important Notes

### About Overwriting
- GitHub Pages shows ONE deployment at a time
- Deploying from develop **overwrites** main's report
- The landing page will show "Branch: develop" in metadata
- To restore main's report, push to main again

### How to Tell Which Branch is Live
Check the landing page metadata:
```
Branch: develop  ← Shows which branch was deployed
Commit: abc1234
```

## 🔧 Want Auto-Deploy from Develop?

If you want develop to auto-deploy on every push (like main does):

### Option A: Add develop to push triggers
Edit `.github/workflows/test-automation.yml` line 22:

```yaml
# Current (main only)
push:
  branches: [ main ]

# Change to (both branches)
push:
  branches: [ main, develop ]
```

**Result:**
- ✅ Every push to develop auto-deploys
- ⚠️ Develop results overwrite main results
- ⚠️ Unstable code appears on public site

### Option B: Keep separate reports per branch
This requires more complex changes - see [BRANCH_DEPLOYMENT.md](BRANCH_DEPLOYMENT.md) for details.

## 📊 Comparison

| Method | Auto-Deploy? | Overwrites main? | Code Changes? |
|--------|--------------|------------------|---------------|
| **Manual dispatch** (current) | ❌ No | ⚠️ Yes | ✅ None needed |
| **Add develop to push** | ✅ Yes | ⚠️ Yes | Modify line 22 |
| **Separate paths** | ✅ Yes | ✅ No | Complex changes |

## 💡 Recommended Approach

**For most teams:**
1. Keep main as auto-deploy (production)
2. Use manual dispatch for develop (testing)
3. When develop is ready → merge to main → auto-deploys

**If you need frequent develop reports:**
1. Add develop to push triggers (Option A above)
2. Accept that it overwrites main's report
3. Communicate to team which branch is live

## 🎯 Quick Commands

### Check current branch on live site
Look at landing page metadata:
```
Branch: [branch-name]
Commit: [sha]
```

### Restore main branch report
```bash
git checkout main
git commit --allow-empty -m "Trigger deployment"
git push origin main
```

### Switch back to develop report
Use manual dispatch (Steps 1-5 above)

## 📚 See Also

- [BRANCH_DEPLOYMENT.md](BRANCH_DEPLOYMENT.md) - Complete branch deployment guide
- [PAGES_QUICK_START.md](PAGES_QUICK_START.md) - Initial setup
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Fix deployment issues

---

**TL;DR:** Use Actions → Test Automation Pipeline → Run workflow → Select "develop" branch → Deploy! 🚀
