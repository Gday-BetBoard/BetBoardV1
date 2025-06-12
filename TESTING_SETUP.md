# 🧪 BetBoard Testing Setup

## **Localhost-Only Testing Policy**

BetBoard implements a **localhost-only testing strategy** to optimize development workflow and CI/CD performance. Tests run automatically on localhost but require explicit triggers in other environments.

## **🎯 Testing Philosophy**

### **Why Localhost-Only?**
- **⚡ Faster Development**: No waiting for tests during rapid iteration
- **🚀 Optimized CI/CD**: Faster builds and deployments
- **🎯 Intentional Testing**: Tests run when you actually want them
- **💰 Cost Effective**: Reduced CI/CD resource usage

### **When Tests Run**

| Environment | Automatic | Manual | Never |
|-------------|-----------|--------|-------|
| **Localhost** | ✅ Unit + E2E | ✅ All | - |
| **CI/CD** | - | ✅ On Request | ❌ Auto |
| **Production** | - | - | ❌ Always |
| **Pre-commit** | - | ✅ Optional | ❌ Default |

## **📋 Test Suite Overview**

### **Unit Tests (Jest + React Testing Library)**
- **Files**: 3 test suites, 28 tests
- **Coverage**: 38.91% statements, 34.25% branches
- **Runtime**: ~2.6 seconds
- **Focus**: Component behavior, utility functions

### **E2E Tests (Playwright)**
- **Files**: 1 test suite, 7 tests  
- **Runtime**: ~7.3 seconds (95% faster than original)
- **Browsers**: Chromium (local), Chromium + Firefox (CI)
- **Focus**: User workflows, integration testing

## **🚀 Quick Start Commands**

### **Localhost Testing**
```bash
# Run all tests on localhost only
npm run test:local

# Run specific test types
npm run test:unit:local    # Unit tests only
npm run test:e2e:local     # E2E tests only

# Force tests in any environment
npm run test:force
```

### **Manual Testing**
```bash
# Always-run commands (ignore environment)
npm test                   # Unit tests (watch)
npm run test:ci           # Unit tests with coverage
npm run test:e2e          # E2E tests
npm run test:all          # All tests

# Interactive modes
npm run test:watch        # Unit tests (watch mode)
npm run test:e2e:ui       # E2E with Playwright UI
npm run test:e2e:headed   # E2E with visible browser
```

## **🔧 Environment Detection**

### **Environment Checker Script**
```bash
# Check if tests should run
node scripts/test-environment-check.js unit
node scripts/test-environment-check.js e2e
```

### **Detection Logic**
1. **Production**: Never run tests
2. **CI without flags**: Skip tests  
3. **CI with flags**: Run requested tests
4. **Localhost**: Run tests by default
5. **Force flag**: Always run tests

### **Environment Variables**
```bash
# Force tests regardless of environment
FORCE_LOCAL_TESTS=true

# Enable pre-commit testing
RUN_TESTS_ON_COMMIT=true

# CI-specific controls
RUN_UNIT_TESTS=true
RUN_E2E_TESTS=true
```

## **🔄 Pre-commit Hooks**

### **Default Behavior (Fast Commits)**
```bash
git commit -m "your changes"
# Runs: type-check + lint (no tests)
```

### **With Tests (Thorough Commits)**
```bash
RUN_TESTS_ON_COMMIT=true git commit -m "your changes"
# OR
npm run test:commit
# Runs: type-check + lint + unit tests
```

## **🏗️ CI/CD Integration**

### **GitHub Actions Workflow**
Tests are **manual-only** in CI/CD:

1. **Navigate**: GitHub → Actions → CI/CD Pipeline
2. **Trigger**: Click "Run workflow"
3. **Options**:
   - ☑️ Run unit tests
   - ☑️ Run E2E tests
4. **Execute**: Click "Run workflow"

### **Workflow Jobs**
- **Build**: Always runs (type-check, lint, build)
- **Test**: Only if `run_tests = true`
- **E2E**: Only if `run_e2e = true`
- **Security**: Always runs

## **📊 Test Reporting**

### **Generate Reports**
```bash
# Comprehensive test report
npm run test:report

# Coverage report (HTML)
open coverage/index.html
```

### **Report Locations**
- **HTML Report**: `test-reports/test-report.html`
- **JSON Report**: `test-reports/test-report.json`
- **Markdown**: `test-reports/test-summary.md`
- **Coverage**: `coverage/index.html`

## **🎯 Coverage Targets**

| Metric | Current | Target | Priority |
|--------|---------|--------|----------|
| Statements | 38.91% | 80% | 🔴 High |
| Branches | 34.25% | 75% | 🔴 High |
| Functions | 19.01% | 70% | 🔴 Critical |
| Lines | 39.66% | 80% | 🔴 High |

## **🚨 Untested Components**

### **Critical (0% Coverage)**
- `BetEditor.tsx` - Form handling, validation
- `SettingsModal.tsx` - User management
- `useBets.ts` - Data fetching hooks
- `api.ts` - API service layer
- `store/index.ts` - State management

### **Partial Coverage**
- `App.tsx` (54.92%) - Main application logic
- `ToastContainer.tsx` (40%) - Notification system

## **🔧 Configuration Files**

### **Jest Configuration**
- **File**: `jest.config.js`
- **Environment**: jsdom
- **Coverage**: lcov, html, text
- **Thresholds**: 50% (currently disabled)

### **Playwright Configuration**
- **File**: `playwright.config.ts`
- **Browsers**: Chromium (local), Chromium + Firefox (CI)
- **Timeouts**: Optimized for speed
- **Reports**: HTML, trace on failure

## **🚀 Performance Optimizations**

### **E2E Test Improvements**
- **Before**: 2m 34s+ with failures
- **After**: 7.3s with all passing
- **Improvement**: 95% faster execution

### **Optimization Techniques**
- Reduced browser matrix (5 → 1-2 browsers)
- Optimized selectors and waits
- Parallel execution
- Conditional CI execution

## **📈 Next Steps**

### **Immediate Priorities**
1. **Increase function coverage** (19% → 60%)
2. **Test untested components** (BetEditor, SettingsModal)
3. **Add API layer tests** (0% → 60%)
4. **Implement error scenario testing**

### **Future Enhancements**
1. **Visual regression testing**
2. **Accessibility testing**
3. **Performance testing**
4. **Cross-browser E2E testing**

## **🎯 Best Practices**

### **Writing Tests**
- Focus on user behavior over implementation
- Test error scenarios and edge cases
- Use descriptive test names
- Mock external dependencies

### **Running Tests**
- Use `test:local` for development
- Use `test:force` when needed
- Generate reports regularly
- Monitor coverage trends

### **CI/CD Strategy**
- Manual test execution for cost control
- Automatic builds and deployments
- Security scanning always enabled
- Artifact retention for debugging

---

**Remember**: Tests are tools to help you ship better code faster. This localhost-only approach ensures tests run when you need them without slowing down your development workflow. 