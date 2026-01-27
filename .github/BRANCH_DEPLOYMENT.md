# Branch-Based Deployment Behavior

## 🎯 Current Configuration

### Which Branches Deploy to GitHub Pages?

| Branch | Test Execution | GitHub Pages Deployment |
|--------|----------------|------------------------|
| **main** | ✅ Yes (smoke tests) | ✅ **YES - Deploys live report** |
| **develop** | ✅ Yes (on PR only) | ❌ **NO - Tests only, no deployment** |
| Other branches | ✅ Yes (on PR to main/develop) | ❌ NO |

### Current Workflow Triggers

```yaml
# Pull Requests - Tests only (no deployment)
pull_request:
  branches: [ main, develop ]
  
# Push Events - Tests + Deployment
push:
  branches: [ main ]  # ← Only main deploys!
```

### Deploy-Report Job Condition

```yaml
deploy-report:
  if: always() && (github.event_name == 'push' || 
                   github.event_name == 'schedule' || 
                   github.event_name == 'workflow_dispatch')
```

This means deployment happens when:
- ✅ **Push to main** → Tests run → Report deploys to Pages
- ✅ **Scheduled run** → Tests run → Report deploys to Pages  
- ✅ **Manual dispatch** → Tests run → Report deploys to Pages
- ❌ **PR to develop** → Tests run → No deployment
- ❌ **Push to develop** → Workflow doesn't trigger at all

## 🤔 Why This Design?

**Production Stability:**
- Live report shows production-quality results
- Only verified code from `main` appears on public site
- `develop` branch is for testing/development

**Typical Workflow:**
1. Developer works in feature branch
2. Opens PR to `develop` → Tests run (no deployment)
3. Merge to `develop` → Tests run (no deployment)
4. Open PR from `develop` to `main` → Tests run (no deployment)
5. Merge to `main` → Tests run → **Deploy to GitHub Pages** ✅

## 🔧 Options to Enable Develop Branch Deployment

### Option 1: Deploy from Both Branches (Simple)

**What it does:** Both `main` and `develop` deploy to the same GitHub Pages site (overwrites)

**Change required:**
```yaml
# In .github/workflows/test-automation.yml
push:
  branches: [ main, develop ]  # Add develop
```

**Pros:**
- ✅ Quick to implement
- ✅ See develop results on live site

**Cons:**
- ❌ Develop results overwrite main results
- ❌ Unstable code shows on public site
- ❌ Hard to tell which branch is live

### Option 2: Separate Deployment Paths (Advanced)

**What it does:** Deploy to different URLs based on branch

**Example:**
- `main` → https://bastheboss7.github.io/playwright-hybrid-integration-API-UI-A11y/
- `develop` → https://bastheboss7.github.io/playwright-hybrid-integration-API-UI-A11y/develop/

**Change required:**
```yaml
# Modify deploy-report job to use branch-specific paths
- name: Prepare Report Directory
  run: |
    BRANCH_PATH="${{ github.ref_name }}"
    mkdir -p "gh-pages/${BRANCH_PATH}/data"
    # ... rest of deployment logic
```

**Pros:**
- ✅ Both branches have separate reports
- ✅ No overwriting
- ✅ Clear which branch is which

**Cons:**
- ❌ More complex setup
- ❌ Need index page to navigate branches
- ❌ Requires workflow modification

### Option 3: Manual Dispatch Only from Develop

**What it does:** Develop doesn't auto-deploy, but you can manually trigger

**Current state:** Already supported! Just use manual dispatch:
1. Actions → Test Automation Pipeline
2. Run workflow
3. Select branch: `develop`
4. Run

**Pros:**
- ✅ No code changes needed
- ✅ You control when develop deploys
- ✅ No automatic overwrites

**Cons:**
- ❌ Manual process
- ❌ Still overwrites main's report

## 💡 Recommended Approach

**For most teams:** Keep current setup (main only)
- Develop is for testing
- Main is for production
- Merge to main when ready to publish

**If you need develop deployment:** Use Option 3 (Manual Dispatch)
- Trigger manually when you want to share develop results
- No code changes required
- You control what gets published

## 🚀 How to Deploy from Develop Right Now

Without changing any code, you can deploy from develop using manual dispatch:

### Step 1: Go to Actions
```
https://github.com/bastheboss7/playwright-hybrid-integration-API-UI-A11y/actions
```

### Step 2: Select Workflow
Click "Test Automation Pipeline"

### Step 3: Run Workflow
1. Click "Run workflow" button
2. Select branch: **develop**
3. Choose test scope (smoke/regression/all)
4. Click green "Run workflow"

### Step 4: Wait for Completion
- Tests run on develop branch
- If successful, deploy-report job runs
- Report deploys to GitHub Pages
- **Note:** This will overwrite the main branch report

## ⚠️ Important Notes

### About Overwriting
- GitHub Pages only has ONE deployment at a time
- Deploying from develop overwrites main's report
- To restore main's report, push to main again

### About Branch Visibility
- The live site doesn't show which branch was deployed
- You'll see branch name in the landing page metadata
- Check "Branch: develop" or "Branch: main" on the report

## 📚 Related Documentation

- [GITHUB_PAGES_SETUP.md](../GITHUB_PAGES_SETUP.md) - Initial setup
- [DEPLOYMENT_FLOW.md](DEPLOYMENT_FLOW.md) - How deployment works
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Fix deployment issues

---

**TL;DR:** Currently only `main` auto-deploys. To deploy from `develop`, use manual workflow dispatch from Actions tab. 🎯
