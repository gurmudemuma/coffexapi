# Comprehensive Testing Guide
## Coffee Export System - Organization-Specific Access Control

This guide provides complete documentation for the testing infrastructure implemented for the Coffee Export System's organization-specific access control features.

## 🏗️ Testing Architecture Overview

The testing suite is designed with multiple layers of validation:

1. **Unit Tests** - Component and utility function testing
2. **Integration Tests** - Store and service integration testing
3. **End-to-End Tests** - Complete user journey testing
4. **Performance Tests** - Load and performance validation
5. **Quality Gates** - Coverage thresholds and code quality enforcement

## 📁 Testing Structure

```
frontend/
├── src/
│   ├── __tests__/                    # Unit tests
│   │   └── performance/              # Performance tests
│   ├── e2e/                         # E2E tests
│   ├── test/                        # Test utilities and setup
│   └── components/__tests__/        # Component tests
├── vitest.config.ts                 # Vitest configuration
├── playwright.config.ts             # Playwright configuration
└── package.json                     # Test scripts

root/
├── run-test-quality.js              # Quality assessment runner
├── run-performance-tests.js         # Performance test runner
├── load-testing/                    # Load testing configuration
└── .github/workflows/test-quality.yml # CI/CD pipeline
```

## 🧪 Test Suites

### 1. Unit Tests

#### ProtectedRoute Component Tests
**File**: `src/components/__tests__/ProtectedRoute.test.tsx`

Tests organization-specific access control functionality:
- Authentication checks
- Organization route access validation
- Role-based restrictions
- Permission validation
- Cross-organization access prevention
- Audit logging integration

**Key Test Scenarios**:
```bash
npm run test:unit
```

#### Store Integration Tests
**File**: `src/store/__tests__/auth.integration.test.ts`

Tests authentication store and audit logging integration:
- Login/logout flows
- State persistence
- Audit event generation
- Error handling
- Concurrent operations

#### Audit Logger Tests
**File**: `src/utils/__tests__/auditLogger.test.ts`

Tests comprehensive audit logging system:
- Event logging functionality
- Storage and retrieval
- Export capabilities
- Performance characteristics
- Error handling

#### Navigation Tests
**File**: `src/components/__tests__/navigation.test.tsx`

Tests organization-specific navigation:
- Menu generation based on organization
- Permission-based filtering
- Route protection

### 2. Performance Tests

#### Access Control Performance
**File**: `src/__tests__/performance/accessControl.performance.test.ts`

Performance benchmarks for:
- Authentication speed (< 100ms average)
- Route validation (< 1ms average)
- Audit logging (< 2ms average)
- Concurrent operations
- Memory usage monitoring
- Scalability testing

**Run Performance Tests**:
```bash
npm run test:performance
```

### 3. End-to-End Tests

#### User Access Control E2E
**File**: `src/e2e/userAccessControl.spec.ts`

Complete user journey testing:
- Login/logout flows for all user types
- Organization-specific dashboard access
- Cross-organization access prevention
- Navigation functionality
- Session management
- Audit trail verification

**Run E2E Tests**:
```bash
npm run test:e2e
```

### 4. Load Testing

#### Artillery Configuration
**File**: `load-testing/artillery-config.yml`

API load testing scenarios:
- Authentication flow load testing
- Route protection under load
- Concurrent user sessions
- Audit logging performance
- Quality thresholds enforcement

**Run Load Tests**:
```bash
node run-performance-tests.js
```

## 🎯 Quality Gates

### Coverage Thresholds

#### Global Thresholds
- **Statements**: 85%
- **Branches**: 80%
- **Functions**: 85%
- **Lines**: 85%

#### Critical Component Thresholds
- **Components** (`src/components/`): 90% across all metrics
- **Store** (`src/store/`): 95% across all metrics
- **Utils** (`src/utils/`): 90% across all metrics

### Performance Thresholds
- **Authentication**: < 100ms average response time
- **Route Validation**: < 1ms average processing time
- **Audit Logging**: < 2ms average log time
- **Memory Usage**: < 200% increase during stress tests

## 🚀 Running Tests

### Individual Test Suites

```bash
# Unit tests only
npm run test:unit

# Performance tests
npm run test:performance

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage

# Interactive test UI
npm run test:ui
```

### Comprehensive Testing

```bash
# Run all tests with quality assessment
npm run test:quality

# Or use the standalone runner
node run-test-quality.js
```

### Continuous Integration

The GitHub Actions workflow (`.github/workflows/test-quality.yml`) automatically:
- Runs all test suites
- Generates coverage reports
- Enforces quality gates
- Uploads artifacts
- Deploys coverage reports to GitHub Pages

## 📊 Test Reports

### Coverage Reports
- **HTML Report**: `frontend/coverage/index.html`
- **JSON Summary**: `frontend/coverage/coverage-summary.json`
- **LCOV Format**: `frontend/coverage/lcov.info`

### Quality Assessment Reports
- **JSON Report**: `test-quality-report-[timestamp].json`
- **HTML Report**: `test-quality-report-[timestamp].html`

### Performance Reports
- **Load Test Results**: `load-testing/load-test-results-[timestamp].json`
- **Performance Metrics**: Included in quality assessment report

## 🔧 Test Configuration

### Vitest Configuration
**File**: `vitest.config.ts`

Key features:
- JSDoc environment setup
- Coverage provider (v8)
- Test timeout configuration
- Parallel execution settings
- Reporter configuration

### Playwright Configuration
**File**: `playwright.config.ts`

Key features:
- Multi-browser testing
- Mobile viewport testing
- Screenshot/video on failure
- Global setup/teardown
- Web server integration

### Test Setup
**File**: `src/test/setup.ts`

Global test environment setup:
- DOM mocking (localStorage, sessionStorage)
- Performance API mocking
- Console warning suppression
- Custom test utilities

## 🎨 Test Organization by User Type

### NBE (National Bank of Ethiopia) Users
- **Admin**: Full access to all NBE routes including user management
- **Officer**: Limited access, no user management capabilities

### Customs Authority Users
- **Validator**: Access to customs dashboard and audit trails only

### Coffee Quality Authority Users
- **Inspector**: Access to quality dashboard and audit trails only

### Bank Users (Exporter/Commercial Banks)
- **Validator**: Access to banking dashboard and audit trails only

## 🔍 Debugging Tests

### Common Issues and Solutions

1. **Test Timeouts**
   ```bash
   # Increase timeout in vitest.config.ts
   testTimeout: 30000
   ```

2. **Coverage Threshold Failures**
   ```bash
   # Check specific file coverage
   npm run test:coverage -- --reporter=verbose
   ```

3. **E2E Test Failures**
   ```bash
   # Run with UI mode for debugging
   npx playwright test --ui
   ```

4. **Performance Test Inconsistencies**
   ```bash
   # Run performance tests multiple times
   npm run test:performance -- --run 3
   ```

## 📈 Monitoring and Metrics

### Key Performance Indicators (KPIs)
- **Test Coverage**: Target >85% statement coverage
- **Test Suite Performance**: Complete run <5 minutes
- **Build Success Rate**: Target >95%
- **Quality Gate Pass Rate**: Target 100%

### Alerts and Notifications
- Coverage drops below threshold
- Performance regression detected
- Quality gate failures
- E2E test failures

## 🛠️ Maintenance

### Adding New Tests

1. **For New Components**:
   ```bash
   # Create test file alongside component
   src/components/NewComponent.tsx
   src/components/__tests__/NewComponent.test.tsx
   ```

2. **For New Utilities**:
   ```bash
   # Create test file in utils directory
   src/utils/newUtility.ts
   src/utils/__tests__/newUtility.test.ts
   ```

3. **For New User Scenarios**:
   ```bash
   # Add to E2E test suite
   src/e2e/userAccessControl.spec.ts
   ```

### Updating Thresholds

1. **Coverage Thresholds**: Update in `vitest.config.ts`
2. **Performance Thresholds**: Update in performance test files
3. **Quality Gates**: Update in `run-test-quality.js`

## 🎯 Best Practices

### Test Writing Guidelines

1. **Descriptive Test Names**: Use clear, descriptive test names that explain what is being tested
2. **Arrange-Act-Assert**: Structure tests with clear setup, action, and verification phases
3. **Isolation**: Each test should be independent and not rely on other tests
4. **Mock External Dependencies**: Mock external services and APIs
5. **Test Edge Cases**: Include tests for error conditions and edge cases

### Performance Testing Guidelines

1. **Baseline Measurements**: Establish performance baselines before making changes
2. **Consistent Environment**: Run performance tests in consistent environments
3. **Multiple Iterations**: Run performance tests multiple times for reliable results
4. **Resource Monitoring**: Monitor memory usage and CPU during tests

### E2E Testing Guidelines

1. **Page Object Pattern**: Use page objects to organize E2E test code
2. **Wait Strategies**: Use appropriate wait strategies for async operations
3. **Test Data Management**: Use consistent test data across runs
4. **Browser Compatibility**: Test across different browsers and devices

## 📚 Resources

### Documentation Links
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Artillery Documentation](https://artillery.io/)
- [Testing Library Documentation](https://testing-library.com/)

### Internal Documentation
- [`ORGANIZATION_ACCESS_CONTROL_GUIDE.md`](./ORGANIZATION_ACCESS_CONTROL_GUIDE.md) - Implementation details
- Component documentation in respective component files
- Store documentation in store files

## 🤝 Contributing

When contributing to the test suite:

1. **Add Tests for New Features**: All new features must include tests
2. **Maintain Coverage**: Ensure coverage thresholds are maintained
3. **Update Documentation**: Update this guide for new test scenarios
4. **Run Full Test Suite**: Verify all tests pass before submitting PR
5. **Performance Impact**: Consider performance impact of changes

---

This comprehensive testing guide ensures that the Coffee Export System's organization-specific access control is thoroughly validated, performant, and maintainable.