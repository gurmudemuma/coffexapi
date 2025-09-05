/**
 * End-to-End Tests for User Access Control
 * 
 * Tests complete user journeys and organization-specific access control scenarios
 */

import { test, expect, Page } from '@playwright/test';

// Test data for different user types
const TEST_USERS = {
  nbeAdmin: {
    username: 'nbe.admin',
    password: 'admin123',
    expectedName: 'NBE Administrator',
    organization: 'National Bank of Ethiopia',
    role: 'NBE_ADMIN',
    allowedRoutes: ['/nbe-dashboard', '/users', '/compliance', '/audit'],
    blockedRoutes: ['/customs-dashboard', '/quality-dashboard', '/bank-dashboard'],
  },
  nbeOfficer: {
    username: 'nbe.officer',
    password: 'officer123',
    expectedName: 'NBE Officer',
    organization: 'National Bank of Ethiopia',
    role: 'NBE_OFFICER',
    allowedRoutes: ['/nbe-dashboard', '/compliance', '/audit'],
    blockedRoutes: ['/users', '/customs-dashboard', '/quality-dashboard'],
  },
  customsValidator: {
    username: 'customs.validator',
    password: 'customs123',
    expectedName: 'Customs Validator',
    organization: 'Customs Authority',
    role: 'CUSTOMS_VALIDATOR',
    allowedRoutes: ['/customs-dashboard', '/audit'],
    blockedRoutes: ['/nbe-dashboard', '/users', '/quality-dashboard', '/bank-dashboard'],
  },
  qualityInspector: {
    username: 'quality.inspector',
    password: 'quality123',
    expectedName: 'Quality Inspector',
    organization: 'Coffee Quality Authority',
    role: 'QUALITY_INSPECTOR',
    allowedRoutes: ['/quality-dashboard', '/audit'],
    blockedRoutes: ['/nbe-dashboard', '/customs-dashboard', '/users', '/bank-dashboard'],
  },
  bankValidator: {
    username: 'bank.validator',
    password: 'bank123',
    expectedName: 'Bank Validator',
    organization: 'Exporter Bank',
    role: 'BANK_VALIDATOR',
    allowedRoutes: ['/bank-dashboard', '/audit'],
    blockedRoutes: ['/nbe-dashboard', '/customs-dashboard', '/quality-dashboard', '/users'],
  },
  exporterUser: {
    username: 'exporter.user',
    password: 'exporter123',
    expectedName: 'Coffee Exporter',
    organization: 'Coffee Exporters Association',
    role: 'EXPORTER',
    allowedRoutes: ['/exporter-dashboard', '/export', '/export/new', '/export/manage', '/export/:exportId/edit'],
    blockedRoutes: ['/nbe-dashboard', '/customs-dashboard', '/quality-dashboard', '/bank-dashboard', '/users', '/compliance', '/reports'],
  },
};

// Helper functions
async function loginUser(page: Page, username: string, password: string) {
  await page.goto('/login');
  await page.fill('[data-testid="username-input"]', username);
  await page.fill('[data-testid="password-input"]', password);
  await page.click('[data-testid="login-button"]');
  await page.waitForLoadState('networkidle');
}

async function logoutUser(page: Page) {
  await page.click('[data-testid="user-menu-button"]');
  await page.click('[data-testid="logout-button"]');
  await page.waitForURL('/login');
}

async function expectAccessDenied(page: Page, route: string) {
  await page.goto(route);
  await expect(page.locator('[data-testid="access-denied"]')).toBeVisible();
}

async function expectAccessAllowed(page: Page, route: string) {
  await page.goto(route);
  await expect(page.locator('[data-testid="access-denied"]')).not.toBeVisible();
  // Should show the actual content, not an error page
  await expect(page.locator('main')).toBeVisible();
}

test.describe('User Access Control E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing session
    await page.context().clearCookies();
    await page.goto('/');
  });

  test.describe('Authentication Flow', () => {
    test('should redirect unauthenticated users to login', async ({ page }) => {
      await page.goto('/nbe-dashboard');
      await expect(page).toHaveURL('/login');
    });

    test('should handle successful login for NBE Admin', async ({ page }) => {
      const user = TEST_USERS.nbeAdmin;
      await loginUser(page, user.username, user.password);
      
      // Should redirect to appropriate dashboard
      await expect(page).toHaveURL('/nbe-dashboard');
      
      // Should display user information
      await expect(page.locator('[data-testid="user-name"]')).toContainText(user.expectedName);
      await expect(page.locator('[data-testid="user-organization"]')).toContainText(user.organization);
    });

    test('should handle failed login attempt', async ({ page }) => {
      await page.goto('/login');
      await page.fill('[data-testid="username-input"]', 'invalid.user');
      await page.fill('[data-testid="password-input"]', 'wrong.password');
      await page.click('[data-testid="login-button"]');
      
      // Should show error message
      await expect(page.locator('[data-testid="login-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="login-error"]')).toContainText('Invalid credentials');
      
      // Should remain on login page
      await expect(page).toHaveURL('/login');
    });

    test('should handle logout correctly', async ({ page }) => {
      const user = TEST_USERS.nbeAdmin;
      await loginUser(page, user.username, user.password);
      await expect(page).toHaveURL('/nbe-dashboard');
      
      await logoutUser(page);
      await expect(page).toHaveURL('/login');
      
      // Should redirect to login when trying to access protected route
      await page.goto('/nbe-dashboard');
      await expect(page).toHaveURL('/login');
    });
  });

  test.describe('Organization-Specific Access Control', () => {
    Object.entries(TEST_USERS).forEach(([userType, user]) => {
      test(`should enforce access control for ${userType}`, async ({ page }) => {
        await loginUser(page, user.username, user.password);
        
        // Test allowed routes
        for (const route of user.allowedRoutes) {
          await expectAccessAllowed(page, route);
        }
        
        // Test blocked routes
        for (const route of user.blockedRoutes) {
          await expectAccessDenied(page, route);
        }
      });
    });

    test('should show organization-specific navigation for NBE users', async ({ page }) => {
      const user = TEST_USERS.nbeAdmin;
      await loginUser(page, user.username, user.password);
      
      // Should show NBE-specific navigation items
      await expect(page.locator('[data-testid="nav-control-center"]')).toBeVisible();
      await expect(page.locator('[data-testid="nav-compliance-monitor"]')).toBeVisible();
      await expect(page.locator('[data-testid="nav-user-management"]')).toBeVisible();
      await expect(page.locator('[data-testid="nav-audit-trail"]')).toBeVisible();
      
      // Should not show other organization navigation
      await expect(page.locator('[data-testid="nav-customs-operations"]')).not.toBeVisible();
      await expect(page.locator('[data-testid="nav-quality-control"]')).not.toBeVisible();
      await expect(page.locator('[data-testid="nav-banking-operations"]')).not.toBeVisible();
    });

    test('should show organization-specific navigation for Customs users', async ({ page }) => {
      const user = TEST_USERS.customsValidator;
      await loginUser(page, user.username, user.password);
      
      // Should show Customs-specific navigation items
      await expect(page.locator('[data-testid="nav-customs-operations"]')).toBeVisible();
      await expect(page.locator('[data-testid="nav-audit-trail"]')).toBeVisible();
      
      // Should not show other organization navigation
      await expect(page.locator('[data-testid="nav-control-center"]')).not.toBeVisible();
      await expect(page.locator('[data-testid="nav-user-management"]')).not.toBeVisible();
      await expect(page.locator('[data-testid="nav-quality-control"]')).not.toBeVisible();
    });

    test('should show organization-specific navigation for Exporter users', async ({ page }) => {
      const user = TEST_USERS.exporterUser;
      await loginUser(page, user.username, user.password);
      
      // Should show Exporter-specific navigation items
      await expect(page.locator('[data-testid="nav-export-dashboard"]')).toBeVisible();
      await expect(page.locator('[data-testid="nav-manage-exports"]')).toBeVisible();
      
      // Should not show audit trail for exporters (not their activity)
      await expect(page.locator('[data-testid="nav-audit-trail"]')).not.toBeVisible();
      
      // Should not show removed navigation items
      await expect(page.locator('[data-testid="nav-new-export"]')).not.toBeVisible();
      await expect(page.locator('[data-testid="nav-documents"]')).not.toBeVisible();
      
      // Should not show other organization navigation
      await expect(page.locator('[data-testid="nav-control-center"]')).not.toBeVisible();
      await expect(page.locator('[data-testid="nav-user-management"]')).not.toBeVisible();
      await expect(page.locator('[data-testid="nav-customs-operations"]')).not.toBeVisible();
      await expect(page.locator('[data-testid="nav-quality-control"]')).not.toBeVisible();
      await expect(page.locator('[data-testid="nav-banking-operations"]')).not.toBeVisible();
    });
  });

  test.describe('Role-Based Restrictions', () => {
    test('should block NBE Officer from user management', async ({ page }) => {
      const user = TEST_USERS.nbeOfficer;
      await loginUser(page, user.username, user.password);
      
      // Should not see user management in navigation
      await expect(page.locator('[data-testid="nav-user-management"]')).not.toBeVisible();
      
      // Direct access should be blocked
      await expectAccessDenied(page, '/users');
      
      // Should show role restriction message
      await page.goto('/users');
      await expect(page.locator('[data-testid="role-restriction-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="role-restriction-message"]')).toContainText('NBE_OFFICER');
    });

    test('should allow NBE Admin full access to NBE routes', async ({ page }) => {
      const user = TEST_USERS.nbeAdmin;
      await loginUser(page, user.username, user.password);
      
      // Should see all NBE navigation items
      await expect(page.locator('[data-testid="nav-user-management"]')).toBeVisible();
      
      // Should access user management successfully
      await expectAccessAllowed(page, '/users');
      await expect(page.locator('[data-testid="user-management-dashboard"]')).toBeVisible();
    });
  });

  test.describe('Cross-Organization Access Violations', () => {
    test('should prevent and log cross-organization access attempts', async ({ page }) => {
      const user = TEST_USERS.customsValidator;
      await loginUser(page, user.username, user.password);
      
      // Attempt to access NBE dashboard
      await page.goto('/nbe-dashboard');
      
      // Should show organization violation message
      await expect(page.locator('[data-testid="organization-violation"]')).toBeVisible();
      await expect(page.locator('[data-testid="organization-violation"]')).toContainText('Customs Authority');
      await expect(page.locator('[data-testid="organization-violation"]')).toContainText('/nbe-dashboard');
      
      // Check that audit event was logged (check console or local storage)
      const auditEvents = await page.evaluate(() => {
        const stored = localStorage.getItem('audit_events');
        return stored ? JSON.parse(stored) : [];
      });
      
      expect(auditEvents.some((event: any) => 
        event.eventType === 'ORGANIZATION_VIOLATION' &&
        event.userOrganization === 'Customs Authority' &&
        event.resourcePath === '/nbe-dashboard'
      )).toBeTruthy();
    });

    test('should prevent Quality Inspector from accessing Banking routes', async ({ page }) => {
      const user = TEST_USERS.qualityInspector;
      await loginUser(page, user.username, user.password);
      
      await expectAccessDenied(page, '/bank-dashboard');
      
      // Should show specific organization violation
      await expect(page.locator('[data-testid="organization-violation"]')).toContainText('Coffee Quality Authority');
    });
  });

  test.describe('Navigation and Route Protection', () => {
    test('should show appropriate dashboard links for each organization', async ({ page }) => {
      // Test NBE user
      const nbeUser = TEST_USERS.nbeAdmin;
      await loginUser(page, nbeUser.username, nbeUser.password);
      
      await page.click('[data-testid="nav-control-center"]');
      await expect(page).toHaveURL('/nbe-dashboard');
      
      await logoutUser(page);
      
      // Test Customs user
      const customsUser = TEST_USERS.customsValidator;
      await loginUser(page, customsUser.username, customsUser.password);
      
      await page.click('[data-testid="nav-customs-operations"]');
      await expect(page).toHaveURL('/customs-dashboard');
      
      await logoutUser(page);
      
      // Test Quality user
      const qualityUser = TEST_USERS.qualityInspector;
      await loginUser(page, qualityUser.username, qualityUser.password);
      
      await page.click('[data-testid="nav-quality-control"]');
      await expect(page).toHaveURL('/quality-dashboard');
    });

    test('should handle direct URL navigation correctly', async ({ page }) => {
      const user = TEST_USERS.bankValidator;
      await loginUser(page, user.username, user.password);
      
      // Direct navigation to allowed route should work
      await page.goto('/bank-dashboard');
      await expect(page.locator('[data-testid="bank-dashboard"]')).toBeVisible();
      
      // Direct navigation to blocked route should show error
      await page.goto('/nbe-dashboard');
      await expect(page.locator('[data-testid="organization-violation"]')).toBeVisible();
    });
  });

  test.describe('Session Management', () => {
    test('should maintain session across page refreshes', async ({ page }) => {
      const user = TEST_USERS.nbeAdmin;
      await loginUser(page, user.username, user.password);
      
      await page.reload();
      
      // Should still be authenticated
      await expect(page.locator('[data-testid="user-name"]')).toContainText(user.expectedName);
      await expect(page).toHaveURL('/nbe-dashboard');
    });

    test('should handle session expiration gracefully', async ({ page }) => {
      const user = TEST_USERS.nbeAdmin;
      await loginUser(page, user.username, user.password);
      
      // Simulate session expiration by clearing localStorage
      await page.evaluate(() => {
        localStorage.removeItem('authToken');
      });
      
      // Next navigation should redirect to login
      await page.goto('/users');
      await expect(page).toHaveURL('/login');
    });
  });

  test.describe('Audit Trail Verification', () => {
    test('should log successful login events', async ({ page }) => {
      const user = TEST_USERS.nbeAdmin;
      await loginUser(page, user.username, user.password);
      
      const auditEvents = await page.evaluate(() => {
        const stored = localStorage.getItem('audit_events');
        return stored ? JSON.parse(stored) : [];
      });
      
      expect(auditEvents.some((event: any) => 
        event.eventType === 'LOGIN_ATTEMPT' &&
        event.metadata?.success === true &&
        event.userName === user.expectedName
      )).toBeTruthy();
    });

    test('should log failed login attempts', async ({ page }) => {
      await page.goto('/login');
      await page.fill('[data-testid="username-input"]', 'invalid.user');
      await page.fill('[data-testid="password-input"]', 'wrong.password');
      await page.click('[data-testid="login-button"]');
      
      const auditEvents = await page.evaluate(() => {
        const stored = localStorage.getItem('audit_events');
        return stored ? JSON.parse(stored) : [];
      });
      
      expect(auditEvents.some((event: any) => 
        event.eventType === 'LOGIN_ATTEMPT' &&
        event.metadata?.success === false &&
        event.metadata?.attemptedUsername === 'invalid.user'
      )).toBeTruthy();
    });

    test('should log logout events', async ({ page }) => {
      const user = TEST_USERS.nbeAdmin;
      await loginUser(page, user.username, user.password);
      await logoutUser(page);
      
      const auditEvents = await page.evaluate(() => {
        const stored = localStorage.getItem('audit_events');
        return stored ? JSON.parse(stored) : [];
      });
      
      expect(auditEvents.some((event: any) => 
        event.eventType === 'LOGOUT' &&
        event.userName === user.expectedName
      )).toBeTruthy();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Simulate network failure
      await page.route('**/api/**', route => route.abort());
      
      await page.goto('/login');
      await page.fill('[data-testid="username-input"]', 'nbe.admin');
      await page.fill('[data-testid="password-input"]', 'admin123');
      await page.click('[data-testid="login-button"]');
      
      // Should show network error message
      await expect(page.locator('[data-testid="network-error"]')).toBeVisible();
    });

    test('should handle unauthorized access with clear messaging', async ({ page }) => {
      const user = TEST_USERS.customsValidator;
      await loginUser(page, user.username, user.password);
      
      await page.goto('/users');
      
      // Should show clear error message
      await expect(page.locator('[data-testid="access-denied"]')).toBeVisible();
      await expect(page.locator('[data-testid="access-denied"]')).toContainText('Organization Access Violation');
      
      // Should provide guidance
      await expect(page.locator('[data-testid="access-guidance"]')).toBeVisible();
    });
  });

  test.describe('Multi-User Scenarios', () => {
    test('should handle concurrent users from different organizations', async ({ browser }) => {
      const context1 = await browser.newContext();
      const context2 = await browser.newContext();
      
      const page1 = await context1.newPage();
      const page2 = await context2.newPage();
      
      // Login different users simultaneously
      await loginUser(page1, TEST_USERS.nbeAdmin.username, TEST_USERS.nbeAdmin.password);
      await loginUser(page2, TEST_USERS.customsValidator.username, TEST_USERS.customsValidator.password);
      
      // Each should see their appropriate dashboard
      await expect(page1).toHaveURL('/nbe-dashboard');
      await expect(page2).toHaveURL('/customs-dashboard');
      
      // Each should have access to their routes only
      await expectAccessAllowed(page1, '/users');
      await expectAccessDenied(page2, '/users');
      
      await expectAccessDenied(page1, '/customs-dashboard');
      await expectAccessAllowed(page2, '/customs-dashboard');
      
      await context1.close();
      await context2.close();
    });
  });
});


