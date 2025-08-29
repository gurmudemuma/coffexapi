#!/usr/bin/env node

/**
 * Load Testing Runner for Coffee Export System
 * 
 * Runs comprehensive load tests for the access control system
 * and generates detailed performance reports
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class LoadTestRunner {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      tests: [],
      summary: {}
    };
  }

  log(message) {
    console.log(`[${new Date().toLocaleTimeString()}] ${message}`);
  }

  async runArtilleryTest(configPath, outputPath) {
    return new Promise((resolve, reject) => {
      this.log(`Starting Artillery test: ${configPath}`);
      
      const artillery = spawn('artillery', [
        'run',
        '--output', outputPath,
        configPath
      ], { stdio: 'inherit' });

      artillery.on('close', (code) => {
        if (code === 0) {
          this.log(`Artillery test completed: ${configPath}`);
          resolve(outputPath);
        } else {
          reject(new Error(`Artillery test failed with code ${code}`));
        }
      });

      artillery.on('error', (error) => {
        reject(error);
      });
    });
  }

  async runPerformanceTests() {
    this.log('Running Vitest performance tests...');
    
    try {
      const result = execSync(
        'npm run test:performance',
        { encoding: 'utf8', cwd: 'frontend' }
      );
      
      this.results.tests.push({
        name: 'Frontend Performance Tests',
        type: 'unit',
        status: 'passed',
        output: result
      });
      
      this.log('Performance tests completed successfully');
    } catch (error) {
      this.log('Performance tests failed');
      this.results.tests.push({
        name: 'Frontend Performance Tests',
        type: 'unit',
        status: 'failed',
        error: error.message
      });
    }
  }

  async runLoadTests() {
    const testConfigs = [
      {
        name: 'Main Load Test',
        config: 'artillery-config.yml',
        description: 'Comprehensive load test covering all scenarios'
      }
    ];

    for (const test of testConfigs) {
      try {
        const outputPath = `load-test-results-${Date.now()}.json`;
        const fullOutputPath = path.join('load-testing', outputPath);
        
        await this.runArtilleryTest(
          path.join('load-testing', test.config),
          fullOutputPath
        );
        
        // Parse results
        const results = JSON.parse(fs.readFileSync(fullOutputPath, 'utf8'));
        
        this.results.tests.push({
          name: test.name,
          type: 'load',
          status: 'completed',
          description: test.description,
          results: results,
          outputFile: fullOutputPath
        });
        
      } catch (error) {
        this.log(`Load test failed: ${test.name} - ${error.message}`);
        this.results.tests.push({
          name: test.name,
          type: 'load',
          status: 'failed',
          error: error.message
        });
      }
    }
  }

  generateReport() {
    this.log('Generating performance report...');
    
    const report = {
      ...this.results,
      summary: this.calculateSummary()
    };

    // Write JSON report
    const reportPath = `performance-report-${Date.now()}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Generate HTML report
    this.generateHTMLReport(report, reportPath.replace('.json', '.html'));
    
    this.log(`Performance report generated: ${reportPath}`);
    return reportPath;
  }

  calculateSummary() {
    const summary = {
      totalTests: this.results.tests.length,
      passed: 0,
      failed: 0,
      performance: {
        averageResponseTime: 0,
        maxResponseTime: 0,
        totalRequests: 0,
        successRate: 0
      }
    };

    for (const test of this.results.tests) {
      if (test.status === 'passed' || test.status === 'completed') {
        summary.passed++;
      } else {
        summary.failed++;
      }

      // Extract performance metrics from load test results
      if (test.type === 'load' && test.results) {
        const aggregate = test.results.aggregate;
        if (aggregate) {
          summary.performance.totalRequests += aggregate.counters?.['http.requests'] || 0;
          
          if (aggregate.latency) {
            summary.performance.averageResponseTime = Math.max(
              summary.performance.averageResponseTime,
              aggregate.latency.mean || 0
            );
            summary.performance.maxResponseTime = Math.max(
              summary.performance.maxResponseTime,
              aggregate.latency.max || 0
            );
          }
          
          if (aggregate.rates) {
            const successRate = ((aggregate.counters?.['http.responses'] || 0) / 
                               (aggregate.counters?.['http.requests'] || 1)) * 100;
            summary.performance.successRate = Math.max(
              summary.performance.successRate,
              successRate
            );
          }
        }
      }
    }

    return summary;
  }

  generateHTMLReport(report, filePath) {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Coffee Export System - Performance Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #2196F3; color: white; padding: 20px; border-radius: 5px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .metric { background: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center; }
        .metric h3 { margin: 0 0 10px 0; color: #333; }
        .metric .value { font-size: 24px; font-weight: bold; color: #2196F3; }
        .test-results { margin: 20px 0; }
        .test { border: 1px solid #ddd; margin: 10px 0; border-radius: 5px; }
        .test-header { background: #f9f9f9; padding: 10px; font-weight: bold; }
        .test-content { padding: 10px; }
        .passed { border-left: 5px solid #4CAF50; }
        .failed { border-left: 5px solid #f44336; }
        .performance-chart { width: 100%; height: 300px; background: #f9f9f9; margin: 20px 0; display: flex; align-items: center; justify-content: center; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Coffee Export System - Performance Test Report</h1>
        <p>Generated: ${report.timestamp}</p>
    </div>

    <div class="summary">
        <div class="metric">
            <h3>Total Tests</h3>
            <div class="value">${report.summary.totalTests}</div>
        </div>
        <div class="metric">
            <h3>Passed</h3>
            <div class="value" style="color: #4CAF50;">${report.summary.passed}</div>
        </div>
        <div class="metric">
            <h3>Failed</h3>
            <div class="value" style="color: #f44336;">${report.summary.failed}</div>
        </div>
        <div class="metric">
            <h3>Success Rate</h3>
            <div class="value">${report.summary.performance.successRate.toFixed(1)}%</div>
        </div>
        <div class="metric">
            <h3>Avg Response Time</h3>
            <div class="value">${report.summary.performance.averageResponseTime.toFixed(1)}ms</div>
        </div>
        <div class="metric">
            <h3>Total Requests</h3>
            <div class="value">${report.summary.performance.totalRequests}</div>
        </div>
    </div>

    <div class="test-results">
        <h2>Test Results</h2>
        ${report.tests.map(test => `
            <div class="test ${test.status === 'failed' ? 'failed' : 'passed'}">
                <div class="test-header">
                    ${test.name} (${test.type}) - ${test.status}
                </div>
                <div class="test-content">
                    ${test.description || ''}
                    ${test.error ? `<p style="color: red;">Error: ${test.error}</p>` : ''}
                    ${test.results ? `<p>Load test completed with ${test.results.aggregate?.counters?.['http.requests'] || 0} requests</p>` : ''}
                </div>
            </div>
        `).join('')}
    </div>

    <div class="performance-chart">
        <p>Performance charts would be generated here with actual metrics visualization</p>
    </div>
</body>
</html>`;

    fs.writeFileSync(filePath, html);
  }

  async run() {
    this.log('Starting comprehensive performance testing...');
    
    try {
      // Check if Artillery is installed
      try {
        execSync('artillery --version', { stdio: 'ignore' });
      } catch (error) {
        this.log('Artillery not found. Installing...');
        execSync('npm install -g artillery', { stdio: 'inherit' });
      }

      // Run performance tests
      await this.runPerformanceTests();
      
      // Run load tests
      await this.runLoadTests();
      
      // Generate final report
      const reportPath = this.generateReport();
      
      this.log('All performance tests completed!');
      this.log(`Report available at: ${reportPath}`);
      
      // Print summary
      console.log('\n=== PERFORMANCE TEST SUMMARY ===');
      console.log(`Total Tests: ${this.results.summary.totalTests}`);
      console.log(`Passed: ${this.results.summary.passed}`);
      console.log(`Failed: ${this.results.summary.failed}`);
      console.log(`Success Rate: ${this.results.summary.performance.successRate.toFixed(1)}%`);
      console.log(`Average Response Time: ${this.results.summary.performance.averageResponseTime.toFixed(1)}ms`);
      console.log('=================================\n');
      
    } catch (error) {
      this.log(`Performance testing failed: ${error.message}`);
      process.exit(1);
    }
  }
}

// Run the tests if this script is executed directly
if (require.main === module) {
  const runner = new LoadTestRunner();
  runner.run().catch(error => {
    console.error('Performance testing failed:', error);
    process.exit(1);
  });
}

module.exports = LoadTestRunner;