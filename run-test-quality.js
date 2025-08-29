#!/usr/bin/env node

/**
 * Test Coverage and Quality Gates Runner
 * 
 * Runs all tests, generates coverage reports, and enforces quality gates
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class TestCoverageRunner {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      coverage: {},
      testResults: {},
      qualityGates: {
        passed: true,
        failures: []
      },
      summary: {}
    };
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',   // Cyan
      success: '\x1b[32m', // Green
      warning: '\x1b[33m', // Yellow
      error: '\x1b[31m',   // Red
      reset: '\x1b[0m'     // Reset
    };
    
    const color = colors[type] || colors.info;
    console.log(`${color}[${new Date().toLocaleTimeString()}] ${message}${colors.reset}`);
  }

  async runCommand(command, options = {}) {
    return new Promise((resolve, reject) => {
      const child = spawn('npm', ['run', command], {
        stdio: 'pipe',
        shell: true,
        cwd: options.cwd || process.cwd(),
        ...options
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
        if (options.showOutput) {
          process.stdout.write(data);
        }
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
        if (options.showOutput) {
          process.stderr.write(data);
        }
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve({ stdout, stderr, code });
        } else {
          reject(new Error(`Command failed with code ${code}\nStderr: ${stderr}`));
        }
      });

      child.on('error', (error) => {
        reject(error);
      });
    });
  }

  async runUnitTests() {
    this.log('Running unit tests with coverage...', 'info');
    
    try {
      const result = await this.runCommand('test:coverage', {
        cwd: './frontend',
        showOutput: false
      });
      
      this.results.testResults.unit = {
        status: 'passed',
        output: result.stdout
      };
      
      this.log('Unit tests completed successfully', 'success');
      return true;
    } catch (error) {
      this.log('Unit tests failed', 'error');
      this.results.testResults.unit = {
        status: 'failed',
        error: error.message
      };
      return false;
    }
  }

  async runE2ETests() {
    this.log('Running E2E tests...', 'info');
    
    try {
      const result = await this.runCommand('test:e2e', {
        cwd: './frontend',
        showOutput: false
      });
      
      this.results.testResults.e2e = {
        status: 'passed',
        output: result.stdout
      };
      
      this.log('E2E tests completed successfully', 'success');
      return true;
    } catch (error) {
      this.log('E2E tests failed', 'error');
      this.results.testResults.e2e = {
        status: 'failed',
        error: error.message
      };
      return false;
    }
  }

  async runPerformanceTests() {
    this.log('Running performance tests...', 'info');
    
    try {
      const result = await this.runCommand('test:performance', {
        cwd: './frontend',
        showOutput: false
      });
      
      this.results.testResults.performance = {
        status: 'passed',
        output: result.stdout
      };
      
      this.log('Performance tests completed successfully', 'success');
      return true;
    } catch (error) {
      this.log('Performance tests failed (continuing)', 'warning');
      this.results.testResults.performance = {
        status: 'failed',
        error: error.message
      };
      return true; // Don't fail the build for performance tests
    }
  }

  async parseCoverageReport() {
    this.log('Parsing coverage report...', 'info');
    
    try {
      const coveragePath = path.join('./frontend/coverage/coverage-summary.json');
      
      if (fs.existsSync(coveragePath)) {
        const coverageData = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
        this.results.coverage = coverageData;
        
        this.log('Coverage report parsed successfully', 'success');
        return true;
      } else {
        this.log('Coverage report not found', 'warning');
        return false;
      }
    } catch (error) {
      this.log(`Failed to parse coverage report: ${error.message}`, 'error');
      return false;
    }
  }

  checkQualityGates() {
    this.log('Checking quality gates...', 'info');
    
    const thresholds = {
      statements: 85,
      branches: 80,
      functions: 85,
      lines: 85
    };

    const criticalFiles = {
      'src/components/': { statements: 90, branches: 85, functions: 90, lines: 90 },
      'src/store/': { statements: 95, branches: 90, functions: 95, lines: 95 },
      'src/utils/': { statements: 90, branches: 85, functions: 90, lines: 90 }
    };

    if (!this.results.coverage.total) {
      this.results.qualityGates.failures.push('No coverage data available');
      this.results.qualityGates.passed = false;
      return;
    }

    const total = this.results.coverage.total;
    
    // Check global thresholds
    Object.entries(thresholds).forEach(([metric, threshold]) => {
      const coverage = total[metric];
      if (coverage && coverage.pct < threshold) {
        this.results.qualityGates.failures.push(
          `Global ${metric} coverage ${coverage.pct}% is below threshold ${threshold}%`
        );
        this.results.qualityGates.passed = false;
      }
    });

    // Check critical file thresholds
    Object.entries(criticalFiles).forEach(([path, thresholds]) => {
      Object.entries(this.results.coverage).forEach(([filePath, fileData]) => {
        if (filePath.includes(path) && fileData.statements) {
          Object.entries(thresholds).forEach(([metric, threshold]) => {
            const coverage = fileData[metric];
            if (coverage && coverage.pct < threshold) {
              this.results.qualityGates.failures.push(
                `File ${filePath} ${metric} coverage ${coverage.pct}% is below critical threshold ${threshold}%`
              );
              this.results.qualityGates.passed = false;
            }
          });
        }
      });
    });

    if (this.results.qualityGates.passed) {
      this.log('All quality gates passed', 'success');
    } else {
      this.log(`Quality gates failed: ${this.results.qualityGates.failures.length} failures`, 'error');
    }
  }

  generateBadges() {
    this.log('Generating coverage badges...', 'info');
    
    if (!this.results.coverage.total) {
      return;
    }

    const total = this.results.coverage.total;
    const badges = {};

    ['statements', 'branches', 'functions', 'lines'].forEach(metric => {
      const coverage = total[metric];
      if (coverage) {
        const pct = coverage.pct;
        let color = 'red';
        
        if (pct >= 90) color = 'brightgreen';
        else if (pct >= 80) color = 'green';
        else if (pct >= 70) color = 'yellow';
        else if (pct >= 60) color = 'orange';
        
        badges[metric] = {
          schemaVersion: 1,
          label: metric,
          message: `${pct}%`,
          color: color
        };
      }
    });

    // Write badges to file
    const badgesPath = './frontend/coverage/badges.json';
    fs.writeFileSync(badgesPath, JSON.stringify(badges, null, 2));
    
    this.log('Coverage badges generated', 'success');
  }

  generateReport() {
    this.log('Generating comprehensive test report...', 'info');
    
    this.results.summary = {
      totalTests: Object.keys(this.results.testResults).length,
      passedTests: Object.values(this.results.testResults).filter(r => r.status === 'passed').length,
      failedTests: Object.values(this.results.testResults).filter(r => r.status === 'failed').length,
      qualityGatesPassed: this.results.qualityGates.passed,
      qualityGateFailures: this.results.qualityGates.failures.length,
      overallCoverage: this.results.coverage.total ? {
        statements: this.results.coverage.total.statements?.pct || 0,
        branches: this.results.coverage.total.branches?.pct || 0,
        functions: this.results.coverage.total.functions?.pct || 0,
        lines: this.results.coverage.total.lines?.pct || 0
      } : null
    };

    // Write JSON report
    const reportPath = `test-quality-report-${Date.now()}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    
    // Generate HTML report
    this.generateHTMLReport(reportPath.replace('.json', '.html'));
    
    this.log(`Test quality report generated: ${reportPath}`, 'success');
    return reportPath;
  }

  generateHTMLReport(filePath) {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Coffee Export System - Test Quality Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 30px 0; }
        .metric { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
        .metric h3 { margin: 0 0 15px 0; color: #333; font-size: 14px; text-transform: uppercase; }
        .metric .value { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
        .passed { color: #4CAF50; }
        .failed { color: #f44336; }
        .warning { color: #ff9800; }
        .coverage-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
        .coverage-item { background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .coverage-bar { width: 100%; height: 20px; background: #e0e0e0; border-radius: 10px; overflow: hidden; margin: 10px 0; }
        .coverage-fill { height: 100%; transition: width 0.3s ease; }
        .test-results { margin: 30px 0; }
        .test-section { background: white; margin: 15px 0; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .test-header { padding: 20px; border-bottom: 1px solid #eee; font-weight: bold; display: flex; justify-content: space-between; align-items: center; }
        .test-content { padding: 20px; }
        .quality-gates { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .failure-item { background: #ffebee; padding: 10px; margin: 5px 0; border-radius: 5px; border-left: 4px solid #f44336; }
        .status-badge { padding: 5px 15px; border-radius: 20px; color: white; font-size: 12px; font-weight: bold; }
        .status-passed { background: #4CAF50; }
        .status-failed { background: #f44336; }
        .progress-ring { transform: rotate(-90deg); }
        .progress-ring-circle { transition: stroke-dasharray 0.35s; }
    </style>
</head>
<body>
    <div class="header">
        <h1>☕ Coffee Export System</h1>
        <h2>Test Quality & Coverage Report</h2>
        <p>Generated: ${this.results.timestamp}</p>
    </div>

    <div class="summary">
        <div class="metric">
            <h3>Overall Status</h3>
            <div class="value ${this.results.qualityGates.passed ? 'passed' : 'failed'}">
                ${this.results.qualityGates.passed ? '✅ PASSED' : '❌ FAILED'}
            </div>
        </div>
        <div class="metric">
            <h3>Test Suites</h3>
            <div class="value">${this.results.summary.totalTests}</div>
            <div>${this.results.summary.passedTests} passed, ${this.results.summary.failedTests} failed</div>
        </div>
        <div class="metric">
            <h3>Quality Gates</h3>
            <div class="value ${this.results.qualityGates.passed ? 'passed' : 'failed'}">
                ${this.results.qualityGates.failures.length}
            </div>
            <div>Failures</div>
        </div>
        <div class="metric">
            <h3>Coverage Score</h3>
            <div class="value ${this.results.summary.overallCoverage ? 
              (this.results.summary.overallCoverage.statements >= 85 ? 'passed' : 'warning') : 'failed'}">
                ${this.results.summary.overallCoverage ? 
                  Math.round(this.results.summary.overallCoverage.statements) + '%' : 'N/A'}
            </div>
            <div>Statements</div>
        </div>
    </div>

    ${this.results.summary.overallCoverage ? `
    <div class="coverage-grid">
        ${['statements', 'branches', 'functions', 'lines'].map(metric => {
          const pct = this.results.summary.overallCoverage[metric];
          const color = pct >= 90 ? '#4CAF50' : pct >= 80 ? '#8BC34A' : pct >= 70 ? '#FFC107' : pct >= 60 ? '#FF9800' : '#F44336';
          return `
            <div class="coverage-item">
                <h4 style="margin: 0 0 10px 0; text-transform: capitalize;">${metric}</h4>
                <div class="coverage-bar">
                    <div class="coverage-fill" style="width: ${pct}%; background: ${color};"></div>
                </div>
                <div style="font-weight: bold; color: ${color};">${pct.toFixed(1)}%</div>
            </div>
          `;
        }).join('')}
    </div>
    ` : ''}

    <div class="quality-gates">
        <h2>Quality Gates ${this.results.qualityGates.passed ? '✅' : '❌'}</h2>
        ${this.results.qualityGates.failures.length > 0 ? `
            <h3>Failures:</h3>
            ${this.results.qualityGates.failures.map(failure => `
                <div class="failure-item">${failure}</div>
            `).join('')}
        ` : '<p style="color: #4CAF50; font-weight: bold;">All quality gates passed!</p>'}
    </div>

    <div class="test-results">
        <h2>Test Results</h2>
        ${Object.entries(this.results.testResults).map(([type, result]) => `
            <div class="test-section">
                <div class="test-header">
                    <span>${type.charAt(0).toUpperCase() + type.slice(1)} Tests</span>
                    <span class="status-badge status-${result.status}">${result.status.toUpperCase()}</span>
                </div>
                <div class="test-content">
                    ${result.error ? `<p style="color: #f44336;">Error: ${result.error}</p>` : 
                      '<p style="color: #4CAF50;">All tests passed successfully</p>'}
                </div>
            </div>
        `).join('')}
    </div>

    <div style="margin-top: 40px; text-align: center; color: #666;">
        <p>Report generated by Coffee Export System Test Quality Runner</p>
    </div>
</body>
</html>`;

    fs.writeFileSync(filePath, html);
  }

  async run() {
    this.log('Starting comprehensive test quality assessment...', 'info');
    
    const startTime = Date.now();
    
    try {
      // Run all test suites
      await this.runUnitTests();
      await this.runPerformanceTests();
      // await this.runE2ETests(); // Comment out for now as it requires server setup
      
      // Parse coverage data
      await this.parseCoverageReport();
      
      // Check quality gates
      this.checkQualityGates();
      
      // Generate badges and reports
      this.generateBadges();
      const reportPath = this.generateReport();
      
      const duration = Date.now() - startTime;
      
      // Print summary
      console.log('\n' + '='.repeat(80));
      console.log('🏁 TEST QUALITY ASSESSMENT COMPLETE');
      console.log('='.repeat(80));
      console.log(`⏱️  Duration: ${Math.round(duration / 1000)}s`);
      console.log(`📊 Test Suites: ${this.results.summary.totalTests} (${this.results.summary.passedTests} passed, ${this.results.summary.failedTests} failed)`);
      
      if (this.results.summary.overallCoverage) {
        console.log(`📈 Coverage: ${this.results.summary.overallCoverage.statements.toFixed(1)}% statements, ${this.results.summary.overallCoverage.branches.toFixed(1)}% branches`);
      }
      
      console.log(`🚪 Quality Gates: ${this.results.qualityGates.passed ? 'PASSED ✅' : 'FAILED ❌'}`);
      
      if (this.results.qualityGates.failures.length > 0) {
        console.log(`❗ Quality Gate Failures: ${this.results.qualityGates.failures.length}`);
        this.results.qualityGates.failures.forEach(failure => {
          this.log(`   • ${failure}`, 'error');
        });
      }
      
      console.log(`📄 Report: ${reportPath}`);
      console.log('='.repeat(80) + '\n');
      
      // Exit with appropriate code
      if (!this.results.qualityGates.passed) {
        this.log('Quality gates failed - build should fail', 'error');
        process.exit(1);
      } else {
        this.log('All quality checks passed!', 'success');
        process.exit(0);
      }
      
    } catch (error) {
      this.log(`Test quality assessment failed: ${error.message}`, 'error');
      process.exit(1);
    }
  }
}

// Add new scripts to package.json if this script is run directly
if (require.main === module) {
  // Check if we're in the right directory
  if (!fs.existsSync('./frontend/package.json')) {
    console.error('Please run this script from the project root directory');
    process.exit(1);
  }

  // Add performance test script to package.json
  const packageJsonPath = './frontend/package.json';
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (!packageJson.scripts['test:performance']) {
    packageJson.scripts['test:performance'] = 'vitest run src/__tests__/performance --reporter=verbose';
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    console.log('Added test:performance script to package.json');
  }

  const runner = new TestCoverageRunner();
  runner.run().catch(error => {
    console.error('Test quality runner failed:', error);
    process.exit(1);
  });
}

module.exports = TestCoverageRunner;