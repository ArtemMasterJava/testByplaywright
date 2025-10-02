# 🚀 CI/CD Configuration for Playwright Tests

## Overview

This project is configured with a comprehensive CI/CD pipeline using GitHub Actions that provides:

- ✅ **Multi-browser testing** (Chromium, Firefox, WebKit)
- ✅ **Mobile device testing** (Chrome Mobile, Safari Mobile)
- ✅ **Automated test reports** deployed to GitHub Pages
- ✅ **Parallel test execution** for faster feedback
- ✅ **Scheduled daily tests** to catch regressions early
- ✅ **Manual workflow dispatch** for on-demand testing

## 🔧 Workflow Features

### 1. **Lint and Type Check Job**
- Runs ESLint (if configured)
- Performs TypeScript type checking
- Ensures code quality before running tests

### 2. **Test Matrix Strategy**
- Tests run in parallel across multiple browsers
- Each browser gets its own job for isolation
- Fail-fast disabled to see all browser results

### 3. **Test Artifacts**
- HTML reports for each browser
- Screenshots and videos on failure
- Trace files for debugging
- 30-day retention for reports, 7-day for traces

### 4. **Test Summary**
- Consolidated results across all browsers
- Visual status indicators in GitHub UI
- Easy-to-read summary table

### 5. **GitHub Pages Deployment**
- Automatic deployment of test reports
- Available at: `https://[username].github.io/[repository-name]`
- Only deploys on main branch

## 🎯 Triggers

The workflow runs on:

- **Push** to `main`, `master`, or `develop` branches
- **Pull Requests** to `main` or `master`
- **Schedule**: Daily at 2 AM UTC
- **Manual**: Via GitHub Actions UI with browser selection

## 📊 Available npm Scripts

### Basic Testing
```bash
npm test                    # Run all tests
npm run test:ui            # Run with Playwright UI
npm run test:headed        # Run in headed mode
npm run test:debug         # Run in debug mode
```

### Browser-Specific Testing
```bash
npm run test:chromium      # Test only in Chromium
npm run test:firefox       # Test only in Firefox  
npm run test:webkit        # Test only in WebKit
npm run test:mobile        # Test mobile browsers only
```

### Test Categories (requires @smoke/@regression tags)
```bash
npm run test:smoke         # Run smoke tests
npm run test:regression    # Run regression tests
```

### CI/CD and Reports
```bash
npm run test:ci            # Run with CI reporters
npm run test:report        # Show HTML report
npm run test:trace         # Show trace viewer
```

### Utilities
```bash
npm run test:install       # Install browsers
npm run test:codegen       # Generate test code
```

## 🏷️ Test Tagging

Add tags to your tests for better organization:

```javascript
test('login functionality @smoke', async ({ page }) => {
  // Critical functionality test
});

test('advanced user settings @regression', async ({ page }) => {
  // Comprehensive feature test
});
```

## 🌍 Environment Configuration

Copy `playwright.env.example` to `playwright.env` and configure:

```bash
# For local development
BASE_URL=http://localhost:3000

# For staging
BASE_URL=https://staging.example.com

# For production
BASE_URL=https://example.com
```

## 🔧 Configuration Highlights

### Playwright Config Features:
- **Retries**: 2 in CI, 0 locally
- **Workers**: 1 in CI (for stability), unlimited locally
- **Timeouts**: Optimized for CI/CD environments
- **Reports**: Multiple formats (HTML, JSON, JUnit)
- **Screenshots/Videos**: Only on failure to save space

### CI-Specific Optimizations:
- Forbids `.only()` in CI to prevent accidental commits
- Uses dot reporter for cleaner CI logs
- Generates multiple report formats for integration
- Optimized browser installation per matrix job

## 📈 Monitoring and Alerts

### GitHub Actions Features:
- **Status badges** for README
- **Email notifications** on failure (configurable)
- **Slack/Teams integration** (can be added)
- **Test result summaries** in PR comments

### Recommended Monitoring:
1. Enable GitHub notifications for workflow failures
2. Set up branch protection rules requiring CI success
3. Monitor test execution time trends
4. Review test reports regularly

## 🚨 Troubleshooting

### Common Issues:

1. **Browser Installation Fails**
   ```bash
   npm run test:install-deps
   ```

2. **Tests Timeout in CI**
   - Check if BASE_URL is accessible
   - Increase timeout values in config
   - Review network-dependent tests

3. **Flaky Tests**
   - Use `test.retry()` for specific tests
   - Add proper wait conditions
   - Review element selectors

4. **GitHub Pages Not Deploying**
   - Enable GitHub Pages in repository settings
   - Check workflow permissions
   - Verify branch protection rules

## 🔐 Security Considerations

- Secrets are properly handled via GitHub Secrets
- No sensitive data in test files or configs
- Environment variables for different stages
- Proper access controls for GitHub Pages

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Best Practices for E2E Testing](https://playwright.dev/docs/best-practices)

---

**Need help?** Check the GitHub Actions logs or create an issue in this repository.
