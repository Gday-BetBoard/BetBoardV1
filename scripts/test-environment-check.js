#!/usr/bin/env node

/**
 * Test Environment Checker
 * Determines if tests should run based on environment conditions
 */

const os = require('os');
const path = require('path');

class TestEnvironmentChecker {
  constructor() {
    this.isCI = process.env.CI === 'true';
    this.isProduction = process.env.NODE_ENV === 'production';
    this.forceTests = process.env.FORCE_LOCAL_TESTS === 'true';
    this.runTestsOnCommit = process.env.RUN_TESTS_ON_COMMIT === 'true';
    this.hostname = os.hostname();
    this.isLocalhost = this.checkIfLocalhost();
  }

  checkIfLocalhost() {
    // Check various indicators of localhost environment
    const localhostIndicators = [
      'localhost',
      '127.0.0.1',
      'local',
      'dev',
      'development'
    ];

    const hostname = this.hostname.toLowerCase();
    return localhostIndicators.some(indicator => 
      hostname.includes(indicator)
    ) || !this.isCI;
  }

  shouldRunTests(testType = 'unit') {
    const reasons = [];

    // Force override
    if (this.forceTests) {
      reasons.push('FORCE_LOCAL_TESTS=true');
      return { should: true, reasons };
    }

    // Production environment - never run
    if (this.isProduction) {
      reasons.push('Production environment detected');
      return { should: false, reasons };
    }

    // CI environment - only if explicitly requested
    if (this.isCI) {
      if (testType === 'unit' && process.env.RUN_UNIT_TESTS === 'true') {
        reasons.push('CI with RUN_UNIT_TESTS=true');
        return { should: true, reasons };
      }
      if (testType === 'e2e' && process.env.RUN_E2E_TESTS === 'true') {
        reasons.push('CI with RUN_E2E_TESTS=true');
        return { should: true, reasons };
      }
      reasons.push('CI environment without explicit test flag');
      return { should: false, reasons };
    }

    // Localhost environment - run by default
    if (this.isLocalhost) {
      reasons.push('Localhost environment detected');
      return { should: true, reasons };
    }

    // Default - don't run
    reasons.push('Unknown environment, defaulting to skip');
    return { should: false, reasons };
  }

  getEnvironmentInfo() {
    return {
      hostname: this.hostname,
      isCI: this.isCI,
      isProduction: this.isProduction,
      isLocalhost: this.isLocalhost,
      forceTests: this.forceTests,
      runTestsOnCommit: this.runTestsOnCommit,
      nodeEnv: process.env.NODE_ENV || 'development',
      platform: os.platform(),
      cwd: process.cwd()
    };
  }

  printStatus(testType = 'unit') {
    const { should, reasons } = this.shouldRunTests(testType);
    const info = this.getEnvironmentInfo();

    console.log('\n🔍 Test Environment Check');
    console.log('========================');
    console.log(`Test Type: ${testType}`);
    console.log(`Hostname: ${info.hostname}`);
    console.log(`Platform: ${info.platform}`);
    console.log(`Node ENV: ${info.nodeEnv}`);
    console.log(`Is CI: ${info.isCI}`);
    console.log(`Is Localhost: ${info.isLocalhost}`);
    console.log(`Force Tests: ${info.forceTests}`);
    console.log('');
    console.log(`Decision: ${should ? '✅ RUN TESTS' : '⏭️  SKIP TESTS'}`);
    console.log(`Reason: ${reasons.join(', ')}`);
    console.log('');

    return should;
  }
}

// CLI usage
if (require.main === module) {
  const testType = process.argv[2] || 'unit';
  const checker = new TestEnvironmentChecker();
  const shouldRun = checker.printStatus(testType);
  
  // Exit with appropriate code
  process.exit(shouldRun ? 0 : 1);
}

module.exports = TestEnvironmentChecker; 