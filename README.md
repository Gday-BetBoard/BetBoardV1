# BetBoard - Enterprise Digital Delivery Tracker

A modern, enterprise-grade digital delivery tracking system built with React and TypeScript.

## Features

- 🎯 **Bet Management**: Create, edit, and track project bets
- 👥 **User Management**: Add/remove users via settings modal
- 💬 **Comments System**: Add comments to bets with user attribution
- 🔍 **Filtering**: Filter bets by owner and status
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Modern UI**: Glassmorphism design with smooth animations
- 🔔 **Toast Notifications**: User feedback for all actions

## 🚀 Quick Start

```bash
npm install
npm start
```

## 🧪 Testing Strategy

### **Localhost-Only Testing Policy**

Tests are configured to run **only on localhost and on explicit request** to optimize development workflow and CI/CD performance.

### **Test Execution Rules**

| Environment | Unit Tests | E2E Tests | Trigger |
|-------------|------------|-----------|---------|
| **Localhost** | ✅ Auto | ✅ Auto | `npm run test:local` |
| **CI/CD** | ⏭️ Manual | ⏭️ Manual | GitHub Actions dispatch |
| **Production** | ❌ Never | ❌ Never | Blocked |
| **Pre-commit** | ⏭️ Optional | ❌ Never | `RUN_TESTS_ON_COMMIT=true` |

### **Available Test Commands**

#### **🏠 Localhost Testing**
```bash
# Run all tests (unit + E2E) on localhost only
npm run test:local

# Run unit tests on localhost only  
npm run test:unit:local

# Run E2E tests on localhost only
npm run test:e2e:local

# Force tests to run regardless of environment
npm run test:force
```

#### **🔧 Manual Testing**
```bash
# Traditional test commands (always run)
npm test                    # Unit tests (watch mode)
npm run test:ci            # Unit tests with coverage
npm run test:e2e           # E2E tests
npm run test:all           # All tests

# Interactive testing
npm run test:watch         # Unit tests in watch mode
npm run test:e2e:ui        # E2E tests with UI
npm run test:e2e:headed    # E2E tests with browser visible
```

#### **📊 Test Reporting**
```bash
# Generate comprehensive test report
npm run test:report

# Check test environment
node scripts/test-environment-check.js unit
node scripts/test-environment-check.js e2e
```

### **🔄 Pre-commit Testing**

By default, pre-commit hooks **skip tests** for faster commits:

```bash
# Normal commit (no tests)
git commit -m "your message"

# Commit with tests
RUN_TESTS_ON_COMMIT=true git commit -m "your message"
# OR
npm run test:commit
```

### **🏗️ CI/CD Testing**

Tests in GitHub Actions are **manual only**:

1. Go to **Actions** tab in GitHub
2. Select **CI/CD Pipeline** 
3. Click **Run workflow**
4. Choose test options:
   - ☑️ Run unit tests
   - ☑️ Run E2E tests

### **🌍 Environment Variables**

Control test execution with these environment variables:

```bash
# Force tests in any environment
FORCE_LOCAL_TESTS=true

# Enable tests in pre-commit hooks
RUN_TESTS_ON_COMMIT=true

# CI-specific test controls
RUN_UNIT_TESTS=true
RUN_E2E_TESTS=true
```

## 📁 Project Structure

```
src/
├── components/          # React components
├── hooks/              # Custom React hooks  
├── services/           # API services
├── store/              # State management
├── types/              # TypeScript definitions
├── utils/              # Utility functions
└── __tests__/          # Unit tests

tests/
├── e2e/                # End-to-end tests
└── unit/               # Additional unit tests

scripts/
├── test-report.js      # Test reporting
└── test-environment-check.js  # Environment detection
```

## 🛠️ Development

```bash
npm start               # Start development server
npm run build          # Build for production
npm run lint           # Run ESLint
npm run type-check     # TypeScript checking
```

## 🚀 Deployment

The application is automatically deployed to GitHub Pages on push to main branch.

**Live Demo:** https://gday-betboard.github.io/BetBoardV1/ 