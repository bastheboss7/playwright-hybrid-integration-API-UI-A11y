# GitHub Secrets Configuration

This document outlines the required secrets for the Playwright test automation CI/CD pipeline.

## Required Secrets

Configure these secrets in: **Settings → Secrets and variables → Actions → Repository secrets**

### 1. Email Notification Secrets

**EMAIL_USERNAME**
- **Purpose**: SMTP authentication username for sending email notifications
- **Value**: Your Gmail address (e.g., `your-email@gmail.com`)
- **Required**: Yes (for failure notifications)

**EMAIL_PASSWORD**
- **Purpose**: SMTP authentication password or App Password
- **Value**: Gmail App Password (not your regular password)
- **How to generate**: 
  1. Enable 2FA on your Google account
  2. Go to Google Account → Security → 2-Step Verification → App passwords
  3. Generate app password for "Mail" application
  4. Use the 16-character password generated
- **Required**: Yes (for failure notifications)

### 2. Environment Configuration Secrets

**BASE_URL_PRODUCTION** *(Optional)*
- **Purpose**: Production environment URL override
- **Value**: `https://www.evri.com`
- **Default**: Falls back to hardcoded value if not set
- **Required**: No (recommended for security)

**BASE_URL_STAGING** *(Optional)*
- **Purpose**: Staging environment URL
- **Value**: Your staging URL
- **Required**: No

**BASE_URL_TEST** *(Optional)*
- **Purpose**: Test environment URL
- **Value**: Your test URL
- **Required**: No

## Environment Configuration

The workflow uses GitHub Environments for production deployments:

**Environment Name**: `production`

Configure in: **Settings → Environments → New environment → "production"**

### Environment Protection Rules (Recommended)
- ✅ **Required reviewers**: Add team members who must approve production runs
- ✅ **Wait timer**: Optional delay before deployment (e.g., 5 minutes)
- ✅ **Deployment branches**: Restrict to `main` branch only

### Environment Secrets
You can override repository secrets at the environment level for production-specific values.

## Branch Protection Rules

Configure in: **Settings → Branches → Branch protection rules**

### Recommended Rules for `main` branch:
- ✅ Require status checks to pass before merging
  - Required checks: `test (chromium)`, `test (firefox)`, `test (webkit)`, `smoke-tests`
- ✅ Require branches to be up to date before merging
- ✅ Require approvals (minimum 1)
- ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require linear history
- ✅ Include administrators

## Verification

After configuring secrets, verify by:

1. Navigate to **Actions** tab
2. Select **Evri Playwright Tests** workflow
3. Click **Run workflow** → **Run workflow** button
4. Select browser: `chromium`
5. Check run output for:
   - ✅ Tests execute successfully
   - ✅ Email notification sent on failure (trigger a failure to test)
   - ✅ Test results published to PR (if running from PR)
   - ✅ Artifacts uploaded

## Troubleshooting

### Email notifications not working
- Verify `EMAIL_USERNAME` is correct Gmail address
- Confirm `EMAIL_PASSWORD` is App Password (not regular password)
- Check Gmail App Password is still valid (doesn't expire)
- Verify 2FA is enabled on Google account

### Test results not publishing
- Check `test-results/results.json` exists in artifacts
- Verify JSON reporter is configured in `playwright.config.ts`
- Review workflow logs for `dorny/test-reporter` step

### Secrets not available
- Secrets must be set at repository or environment level
- Workflow must reference correct environment name
- Check spelling of secret names (case-sensitive)

## Security Best Practices

- 🔒 Never commit secrets to version control
- 🔒 Rotate App Passwords periodically
- 🔒 Use environment-level secrets for production
- 🔒 Limit secret access to required workflows only
- 🔒 Review secret usage in workflow logs (values are masked)
- 🔒 Use GitHub Environments for sensitive deployments
