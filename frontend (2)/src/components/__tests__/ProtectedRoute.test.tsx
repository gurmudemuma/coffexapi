/**
 * ProtectedRoute Component Tests
 * 
 * Tests for organization-specific access control functionality
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import * as storeModule from '../../store';
import * as auditLoggerModule from '../../utils/auditLogger';
import { mockAuthState } from '../../__tests__/test-utils';

// Mock the store module
vi.mock('../../store', () => ({
  useAuth: vi.fn(),
}));

// Mock the audit logger
vi.mock('../../utils/auditLogger', () => ({
  logOrganizationViolation: vi.fn(),
  logRoleViolation: vi.fn(),
  logPermissionViolation: vi.fn(),
  logAccessDenied: vi.fn(),
}));

// Mock react-router-dom location
const mockLocation = {
  pathname: '/test-path',
  search: '',
  hash: '',
  state: null,
  key: 'test-key',
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => mockLocation,
    Navigate: ({ to }: { to: string }) => <div data-testid="navigate-to">{to}</div>,
  };
});

// Test component that will be protected
const TestComponent = () => <div data-testid="protected-content">Protected Content</div>;

// Wrapper component for testing
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('ProtectedRoute', () => {
  const mockUser = {
    id: 'user-123',
    name: 'Test User',
    role: 'NBE_ADMIN',
    organization: 'The Mint',
    permissions: ['user:manage', 'compliance:screen', 'audit:read'],
    email: 'test@nbe.gov.et',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.pathname = '/test-path';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Authentication Checks', () => {
    it('should show loading spinner when authentication is loading', () => {
      vi.mocked(storeModule.useAuth).mockReturnValue({
        ...mockAuthState,
        isAuthenticated: false,
        isLoading: true,
        user: null,
      });

      render(
        <TestWrapper>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should redirect to login when user is not authenticated', () => {
      vi.mocked(storeModule.useAuth).mockReturnValue({
        ...mockAuthState,
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });

      render(
        <TestWrapper>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('navigate-to')).toHaveTextContent('/login');
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should redirect to login when user is null even if authenticated', () => {
      vi.mocked(storeModule.useAuth).mockReturnValue({
        ...mockAuthState,
        isAuthenticated: true,
        isLoading: false,
        user: null,
      });

      render(
        <TestWrapper>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('navigate-to')).toHaveTextContent('/login');
    });
  });

  describe('Organization-Specific Route Access', () => {
    beforeEach(() => {
      vi.mocked(storeModule.useAuth).mockReturnValue({
        ...mockAuthState,
        isAuthenticated: true,
        isLoading: false,
        user: mockUser,
      });
    });

    it('should allow access to organization-specific routes', () => {
      mockLocation.pathname = '/nbe-dashboard';

      render(
        <TestWrapper>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(auditLoggerModule.logOrganizationViolation).not.toHaveBeenCalled();
    });

    it('should block access to other organizations routes', () => {
      mockLocation.pathname = '/customs-dashboard';

      render(
        <TestWrapper>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByText('Organization Access Violation')).toBeInTheDocument();
      expect(screen.getByText('The Mint')).toBeInTheDocument();
      expect(screen.getByText('/customs-dashboard')).toBeInTheDocument();
      expect(auditLoggerModule.logOrganizationViolation).toHaveBeenCalledWith(
        'user-123',
        'Test User',
        'NBE_ADMIN',
        'The Mint',
        '/customs-dashboard',
        ['/nbe-dashboard', '/dashboard/nbe', '/users', '/compliance', '/audit']
      );
    });

    it('should allow access to public routes', () => {
      mockLocation.pathname = '/export';

      render(
        <TestWrapper>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(auditLoggerModule.logOrganizationViolation).not.toHaveBeenCalled();
    });

    it('should allow access to basic dashboard route', () => {
      mockLocation.pathname = '/dashboard';

      render(
        <TestWrapper>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
  });

  describe('Role-Specific Restrictions', () => {
    it('should block NBE_OFFICER from user management', () => {
      const officerUser = { ...mockUser, role: 'NBE_OFFICER' };
      vi.mocked(storeModule.useAuth).mockReturnValue({
        ...mockAuthState,
        isAuthenticated: true,
        isLoading: false,
        user: officerUser,
      });

      mockLocation.pathname = '/users';

      render(
        <TestWrapper>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByText('Role Access Restriction')).toBeInTheDocument();
      expect(auditLoggerModule.logRoleViolation).toHaveBeenCalledWith(
        'user-123',
        'Test User',
        'NBE_OFFICER',
        'The Mint',
        '/users',
        []
      );
    });

    it('should allow NBE_ADMIN access to all NBE routes', () => {
      mockLocation.pathname = '/users';

      render(
        <TestWrapper>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(auditLoggerModule.logRoleViolation).not.toHaveBeenCalled();
    });
  });

  describe('Organization Filtering', () => {
    it('should allow access when user organization is in allowed list', () => {
      render(
        <TestWrapper>
          <ProtectedRoute allowedOrganizations={['The Mint']}>
            <TestComponent />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should block access when user organization is not in allowed list', () => {
      render(
        <TestWrapper>
          <ProtectedRoute allowedOrganizations={['Customs Authority']}>
            <TestComponent />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByText('Organization Not Allowed')).toBeInTheDocument();
      expect(screen.getByText('Customs Authority')).toBeInTheDocument();
      expect(screen.getByText('The Mint')).toBeInTheDocument();
      expect(auditLoggerModule.logOrganizationViolation).toHaveBeenCalled();
    });

    it('should allow access when no organization restriction is set', () => {
      render(
        <TestWrapper>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
  });

  describe('Role Filtering', () => {
    it('should allow access when user role is in allowed list', () => {
      render(
        <TestWrapper>
          <ProtectedRoute allowedRoles={['NBE_ADMIN']}>
            <TestComponent />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should block access when user role is not in allowed list', () => {
      render(
        <TestWrapper>
          <ProtectedRoute allowedRoles={['CUSTOMS_VALIDATOR']}>
            <TestComponent />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByText('Role Not Allowed')).toBeInTheDocument();
      expect(screen.getByText('CUSTOMS_VALIDATOR')).toBeInTheDocument();
      expect(screen.getByText('NBE_ADMIN')).toBeInTheDocument();
      expect(auditLoggerModule.logRoleViolation).toHaveBeenCalled();
    });
  });

  describe('Permission Validation', () => {
    it('should allow access when user has required permissions', () => {
      render(
        <TestWrapper>
          <ProtectedRoute requiredPermissions={['user:manage']}>
            <TestComponent />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should allow access when user has any of the required permissions', () => {
      render(
        <TestWrapper>
          <ProtectedRoute requiredPermissions={['user:manage', 'other:permission']}>
            <TestComponent />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should block access when user lacks required permissions', () => {
      render(
        <TestWrapper>
          <ProtectedRoute requiredPermissions={['admin:superuser']}>
            <TestComponent />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByText('Access Denied')).toBeInTheDocument();
      expect(screen.getByText('admin:superuser')).toBeInTheDocument();
      expect(auditLoggerModule.logPermissionViolation).toHaveBeenCalledWith(
        'user-123',
        'Test User',
        'NBE_ADMIN',
        'The Mint',
        '/test-path',
        ['admin:superuser'],
        mockUser.permissions
      );
    });

    it('should allow access when no permissions are required', () => {
      render(
        <TestWrapper>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
  });

  describe('Different Organization Users', () => {
    const organizationTestCases = [
      {
        organization: 'Customs Authority',
        role: 'CUSTOMS_VALIDATOR',
        allowedPath: '/customs-dashboard',
        blockedPath: '/nbe-dashboard',
      },
      {
        organization: 'Coffee Quality Authority',
        role: 'QUALITY_INSPECTOR',
        allowedPath: '/quality-dashboard',
        blockedPath: '/customs-dashboard',
      },
      {
        organization: 'Exporter Bank',
        role: 'BANK_VALIDATOR',
        allowedPath: '/bank-dashboard',
        blockedPath: '/quality-dashboard',
      },
      {
        organization: 'Commercial Bank of Ethiopia',
        role: 'BANK_VALIDATOR',
        allowedPath: '/bank-dashboard',
        blockedPath: '/nbe-dashboard',
      },
      {
        organization: 'Coffee Exporters Association',
        role: 'EXPORTER',
        allowedPath: '/exporter-dashboard',
        blockedPath: '/nbe-dashboard',
      },
    ];

    organizationTestCases.forEach(({ organization, role, allowedPath, blockedPath }) => {
      it(`should handle ${organization} user access correctly`, () => {
        const orgUser = {
          ...mockUser,
          organization,
          role,
          permissions: ['audit:read'],
        };

        vi.mocked(storeModule.useAuth).mockReturnValue({
          ...mockAuthState,
          isAuthenticated: true,
          isLoading: false,
          user: orgUser,
        });

        // Test allowed path
        mockLocation.pathname = allowedPath;
        const { rerender } = render(
          <TestWrapper>
            <ProtectedRoute>
              <TestComponent />
            </ProtectedRoute>
          </TestWrapper>
        );

        expect(screen.getByTestId('protected-content')).toBeInTheDocument();

        // Test blocked path
        mockLocation.pathname = blockedPath;
        rerender(
          <TestWrapper>
            <ProtectedRoute>
              <TestComponent />
            </ProtectedRoute>
          </TestWrapper>
        );

        expect(screen.getByText('Organization Access Violation')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle user without organization gracefully', () => {
      const userWithoutOrg = { ...mockUser, organization: '' };
      vi.mocked(storeModule.useAuth).mockReturnValue({
        ...mockAuthState,
        isAuthenticated: true,
        isLoading: false,
        user: userWithoutOrg,
      });

      render(
        <TestWrapper>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </TestWrapper>
      );

      // Should not crash and allow access since no organization restrictions apply
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should handle user without role gracefully', () => {
      const userWithoutRole = { ...mockUser, role: '' };
      vi.mocked(storeModule.useAuth).mockReturnValue({
        ...mockAuthState,
        isAuthenticated: true,
        isLoading: false,
        user: userWithoutRole,
      });

      render(
        <TestWrapper>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should disable organization restriction when restrictToOrganization is false', () => {
      mockLocation.pathname = '/customs-dashboard';

      render(
        <TestWrapper>
          <ProtectedRoute restrictToOrganization={false}>
            <TestComponent />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(auditLoggerModule.logOrganizationViolation).not.toHaveBeenCalled();
    });
  });

  describe('Multiple Access Controls Combined', () => {
    it('should enforce all access controls when multiple are specified', () => {
      render(
        <TestWrapper>
          <ProtectedRoute
            requiredPermissions={['user:manage']}
            allowedOrganizations={['The Mint']}
            allowedRoles={['NBE_ADMIN']}
          >
            <TestComponent />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should block access if any access control fails', () => {
      render(
        <TestWrapper>
          <ProtectedRoute
            requiredPermissions={['user:manage']}
            allowedOrganizations={['Customs Authority']} // This should fail
            allowedRoles={['NBE_ADMIN']}
          >
            <TestComponent />
          </ProtectedRoute>
        </TestWrapper>
      );

      expect(screen.getByText('Organization Not Allowed')).toBeInTheDocument();
    });
  });
});
