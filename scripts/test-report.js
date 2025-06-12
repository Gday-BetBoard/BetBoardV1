#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Generate comprehensive test report combining unit and E2E test results
 */
function generateTestReport() {
  console.log('📊 Generating comprehensive test report...\n');

  const reportDir = 'test-reports';
  
  // Ensure report directory exists
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  let report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      coverage: null
    },
    unitTests: null,
    e2eTests: null,
    coverage: null
  };

  // Read Jest coverage summary
  try {
    const coveragePath = 'coverage/coverage-summary.json';
    if (fs.existsSync(coveragePath)) {
      const coverageData = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
      report.coverage = coverageData.total;
      report.summary.coverage = {
        statements: coverageData.total.statements.pct,
        branches: coverageData.total.branches.pct,
        functions: coverageData.total.functions.pct,
        lines: coverageData.total.lines.pct
      };
      console.log('✅ Unit test coverage loaded');
    }
  } catch (error) {
    console.log('⚠️  Could not load coverage data:', error.message);
  }

  // Read Playwright test results
  try {
    const playwrightResultsPath = 'test-results/results.json';
    if (fs.existsSync(playwrightResultsPath)) {
      const playwrightData = JSON.parse(fs.readFileSync(playwrightResultsPath, 'utf8'));
      report.e2eTests = playwrightData;
      
      // Calculate E2E summary
      if (playwrightData.suites) {
        const e2eStats = calculateE2EStats(playwrightData.suites);
        report.summary.total += e2eStats.total;
        report.summary.passed += e2eStats.passed;
        report.summary.failed += e2eStats.failed;
      }
      console.log('✅ E2E test results loaded');
    }
  } catch (error) {
    console.log('⚠️  Could not load E2E test results:', error.message);
  }

  // Generate HTML report
  const htmlReport = generateHTMLReport(report);
  fs.writeFileSync(path.join(reportDir, 'test-report.html'), htmlReport);

  // Generate JSON report
  fs.writeFileSync(path.join(reportDir, 'test-report.json'), JSON.stringify(report, null, 2));

  // Generate markdown summary
  const markdownSummary = generateMarkdownSummary(report);
  fs.writeFileSync(path.join(reportDir, 'test-summary.md'), markdownSummary);

  console.log('\n📋 Test reports generated:');
  console.log(`   HTML: ${reportDir}/test-report.html`);
  console.log(`   JSON: ${reportDir}/test-report.json`);
  console.log(`   MD:   ${reportDir}/test-summary.md`);

  // Print summary to console
  printSummary(report);

  return report;
}

function calculateE2EStats(suites) {
  let total = 0;
  let passed = 0;
  let failed = 0;

  function processSuite(suite) {
    if (suite.tests) {
      suite.tests.forEach(test => {
        total++;
        if (test.status === 'passed') passed++;
        else if (test.status === 'failed') failed++;
      });
    }
    
    if (suite.suites) {
      suite.suites.forEach(processSuite);
    }
  }

  suites.forEach(processSuite);
  return { total, passed, failed };
}

function generateHTMLReport(report) {
  const coverageRows = report.summary.coverage ? 
    Object.entries(report.summary.coverage)
      .map(([key, value]) => `<tr><td>${key}</td><td>${value}%</td></tr>`)
      .join('') : '<tr><td colspan="2">No coverage data</td></tr>';

  return `
<!DOCTYPE html>
<html>
<head>
    <title>BetBoard Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f5f5f5; padding: 20px; border-radius: 8px; }
        .summary { display: flex; gap: 20px; margin: 20px 0; }
        .metric { background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .metric h3 { margin: 0 0 10px 0; color: #333; }
        .metric .value { font-size: 24px; font-weight: bold; color: #007acc; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f5f5f5; }
        .passed { color: #28a745; }
        .failed { color: #dc3545; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎯 BetBoard Test Report</h1>
        <p>Generated: ${report.timestamp}</p>
    </div>
    
    <div class="summary">
        <div class="metric">
            <h3>Total Tests</h3>
            <div class="value">${report.summary.total}</div>
        </div>
        <div class="metric">
            <h3>Passed</h3>
            <div class="value passed">${report.summary.passed}</div>
        </div>
        <div class="metric">
            <h3>Failed</h3>
            <div class="value failed">${report.summary.failed}</div>
        </div>
        <div class="metric">
            <h3>Success Rate</h3>
            <div class="value">${report.summary.total > 0 ? Math.round((report.summary.passed / report.summary.total) * 100) : 0}%</div>
        </div>
    </div>

    <h2>📊 Coverage Report</h2>
    <table>
        <thead>
            <tr><th>Metric</th><th>Coverage</th></tr>
        </thead>
        <tbody>
            ${coverageRows}
        </tbody>
    </table>
</body>
</html>`;
}

function generateMarkdownSummary(report) {
  const coverage = report.summary.coverage;
  const coverageTable = coverage ? `
| Metric | Coverage |
|--------|----------|
| Statements | ${coverage.statements}% |
| Branches | ${coverage.branches}% |
| Functions | ${coverage.functions}% |
| Lines | ${coverage.lines}% |
` : 'No coverage data available';

  return `# 🎯 BetBoard Test Report

**Generated:** ${report.timestamp}

## Summary

- **Total Tests:** ${report.summary.total}
- **Passed:** ✅ ${report.summary.passed}
- **Failed:** ❌ ${report.summary.failed}
- **Success Rate:** ${report.summary.total > 0 ? Math.round((report.summary.passed / report.summary.total) * 100) : 0}%

## Coverage Report

${coverageTable}

---
*Report generated automatically by BetBoard test suite*
`;
}

function printSummary(report) {
  console.log('\n📊 TEST SUMMARY');
  console.log('================');
  console.log(`Total Tests: ${report.summary.total}`);
  console.log(`Passed: ✅ ${report.summary.passed}`);
  console.log(`Failed: ❌ ${report.summary.failed}`);
  console.log(`Success Rate: ${report.summary.total > 0 ? Math.round((report.summary.passed / report.summary.total) * 100) : 0}%`);
  
  if (report.summary.coverage) {
    console.log('\n📈 COVERAGE');
    console.log('============');
    Object.entries(report.summary.coverage).forEach(([key, value]) => {
      console.log(`${key}: ${value}%`);
    });
  }
}

// Run if called directly
if (require.main === module) {
  generateTestReport();
}

module.exports = { generateTestReport }; 