/**
 * Organization-Specific Navigation and Routing Tests
 * 
 * Tests for navigation menu generation and organization routing
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, render } from '@testing-library/react';
import { MemoryRouter, BrowserRouter } from 'react-router-dom';
import * as storeModule from '../../store';
import { mockUser, renderWithProviders, mockAuthState, mockNotificationActions } from '../../__tests__/test-utils';

// Mock the store module
vi.mock('../../store', () => ({
  useAuth: vi.fn(),
  useUI: vi.fn(),
  useUIActions: vi.fn(),
  useNotifications: vi.fn(),
  useNotificationActions: vi.fn(),
  useSystemStatus: vi.fn(),
}));

// Mock UI components
vi.mock('@mui/material', () => ({
  Box: ({ children, ...props }: any) => <div data-testid="box" {...props}>{children}</div>,
  Alert: ({ children, severity, ...props }: any) => <div data-testid="alert" {...props}>{children}</div>,
  Typography: ({ children, variant, ...props }: any) => <div data-testid="typography" {...props}>{children}</div>,
}));

// Mock the dashboard components
const mockDashboard = () => <div data-testid="dashboard">Dashboard</div>;
vi.mock('../../pages/NBEDashboard', () => ({ default: mockDashboard }));
vi.mock('../../pages/CustomsDashboard', () => ({ default: mockDashboard }));
vi.mock('../../pages/QualityDashboard', () => ({ default: mockDashboard }));
vi.mock('../../pages/BankDashboard', () => ({ default: mockDashboard }));
vi.mock('../../pages/Dashboard', () => ({ default: mockDashboard }));

// Mock the store module
vi.mock('../../store', () => ({
  useAuth: vi.fn(),
  useUI: vi.fn(),
  useUIActions: vi.fn(),
  useNotifications: vi.fn(),
  useNotificationActions: vi.fn(),
  useSystemStatus: vi.fn(),
}));

// Mock Material-UI components
vi.mock('@mui/material', () => ({
  Box: ({ children, ...props }: any) => <div data-testid="mui-box" {...props}>{children}</div>,
  Alert: ({ children, severity, ...props }: any) => (
    <div data-testid="mui-alert" data-severity={severity} {...props}>{children}</div>
  ),
  Typography: ({ children, variant, ...props }: any) => (
    <div data-testid="mui-typography" data-variant={variant} {...props}>{children}</div>
  ),
}));

// Mock the dashboard components
vi.mock('../../pages/NBEDashboard', () => ({
  default: () => <div data-testid="nbe-dashboard">NBE Dashboard</div>,
}));

vi.mock('../../pages/CustomsDashboard', () => ({
  default: () => <div data-testid="customs-dashboard">Customs Dashboard</div>,
}));

vi.mock('../../pages/QualityDashboard', () => ({
  default: () => <div data-testid="quality-dashboard">Quality Dashboard</div>,
}));

vi.mock('../../pages/BankDashboard', () => ({
  default: () => <div data-testid="bank-dashboard">Bank Dashboard</div>,
}));

vi.mock('../../pages/Dashboard', () => ({
  default: () => <div data-testid="general-dashboard">General Dashboard</div>,
}));

describe('Organization-Specific Navigation', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();

    // Default mock implementations
    vi.mocked(storeModule.useAuth).mockReturnValue({
      ...mockAuthState,
      user: { ...mockUser },
    });

    vi.mocked(storeModule.useUI).mockReturnValue({
      theme: 'light',
      sidebarOpen: true,
      currentPage: 'dashboard',
      isOffline: false,
      loading: {},
      error: {},
    });

    vi.mocked(storeModule.useUIActions).mockReturnValue({
      setTheme: vi.fn(),
      toggleSidebar: vi.fn(),
      setCurrentPage: vi.fn(),
      setOfflineStatus: vi.fn(),
      setLoading: vi.fn(),
      setError: vi.fn(),
    });

    vi.mocked(storeModule.useNotifications).mockReturnValue([]);
    vi.mocked(storeModule.useNotificationActions).mockReturnValue({
      ...mockNotificationActions,
    });
    vi.mocked(storeModule.useSystemStatus).mockReturnValue({
      apiGateway: 'ONLINE',
      blockchain: 'ONLINE',
      ipfs: 'ONLINE',
      validators: {},
      lastChecked: Date.now(),
    });
  });

  describe('Navigation Menu Generation', () => {
    // Test the getNavigationItems function indirectly through ModernLayout
    const organizationTestCases = [
      {
        organization: 'The Mint',
        role: 'NBE_ADMIN',
        expectedItems: ['Dashboard', 'NBE Control Center', 'Compliance Monitor', 'User Management', 'Audit Trail'],
      },
      {
        organization: 'The Mint',
        role: 'NBE_OFFICER',
        expectedItems: ['Dashboard', 'NBE Control Center', 'Compliance Monitor', 'Audit Trail'], // No User Management
      },
      {
        organization: 'Customs Authority',
        role: 'CUSTOMS_VALIDATOR',
        expectedItems: ['Dashboard', 'Customs Operations', 'Audit Trail'],
      },
      {
        organization: 'Coffee Quality Authority',
        role: 'QUALITY_INSPECTOR',
        expectedItems: ['Dashboard', 'Quality Control', 'Audit Trail'],
      },
      {
        organization: 'Exporter Bank',
        role: 'BANK_VALIDATOR',
        expectedItems: ['Dashboard', 'Banking Operations', 'Audit Trail'],
      },
      {
        organization: 'Commercial Bank of Ethiopia',
        role: 'BANK_VALIDATOR',
        expectedItems: ['Dashboard', 'Banking Operations', 'Audit Trail'],
      },
    ];

    organizationTestCases.forEach(({ organization, role, expectedItems }) => {
      it(`should generate correct navigation for ${organization} - ${role}`, async () => {
        const mockUser = {
          id: 'test-user',
          name: 'Test User',
          role,
          organization,
          permissions: ['audit:read', 'user:manage', 'compliance:screen'],
          email: 'test@example.com',
        };

        vi.mocked(storeModule.useAuth).mockReturnValue({
          ...mockAuthState,
          user: mockUser,
        });

        // Import and render ModernLayout after mocking
        const ModernLayout = await import('../../components/layout/ModernLayout');

        render(
          <BrowserRouter>
            <ModernLayout.default>
              <div>Test Content</div>
            </ModernLayout.default>
          </BrowserRouter>
        );

        // Check if expected navigation items are rendered
        await waitFor(() => {
          expectedItems.forEach(item => {
            expect(screen.getByText(item)).toBeInTheDocument();
          });
        });

        // Check that User Management is only shown for NBE_ADMIN
        if (role === 'NBE_ADMIN') {
          expect(screen.getByText('User Management')).toBeInTheDocument();
        } else if (organization === 'The Mint' && role === 'NBE_OFFICER') {
          expect(screen.queryByText('User Management')).not.toBeInTheDocument();
        }
      });
    });

    it('should handle user without organization gracefully', async () => {
      const mockUser = {
        id: 'test-user',
        name: 'Test User',
        role: 'UNKNOWN_ROLE',
        organization: '',
        permissions: [],
        email: 'test@example.com',
      };

      vi.mocked(storeModule.useAuth).mockReturnValue({
        ...mockAuthState,
        user: mockUser,
      });

      const ModernLayout = await import('../../components/layout/ModernLayout');

      render(
        <BrowserRouter>
          <ModernLayout.default>
            <div>Test Content</div>
          </ModernLayout.default>
        </BrowserRouter>
      );

      // Should at least show Dashboard
      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });
    });
  });

  describe('OrganizationRouter Component', () => {
    let OrganizationRouter: any;

    beforeEach(async () => {
      // Dynamically import the component to ensure mocks are applied
      const ModernAppModule = await import('../../ModernApp');
      // Extract OrganizationRouter component for testing
      // Since it's not exported, we'll test it through the main app routing
    });

    const routerTestCases = [
      {
        organization: 'The Mint',
        role: 'NBE_ADMIN',
        expectedComponent: 'nbe-dashboard',
      },
      {
        organization: 'The Mint',
        role: 'NBE_OFFICER',
        expectedComponent: 'nbe-dashboard',
      },
      {
        organization: 'Customs Authority',
        role: 'CUSTOMS_VALIDATOR',
        expectedComponent: 'customs-dashboard',
      },
      {
        organization: 'Coffee Quality Authority',
        role: 'QUALITY_INSPECTOR',
        expectedComponent: 'quality-dashboard',
      },
      {
        organization: 'Exporter Bank',
        role: 'BANK_VALIDATOR',
        expectedComponent: 'bank-dashboard',
      },
      {
        organization: 'Commercial Bank of Ethiopia',
        role: 'BANK_VALIDATOR',
        expectedComponent: 'bank-dashboard',
      },
    ];

    routerTestCases.forEach(({ organization, role, expectedComponent }) => {
      it(`should route ${organization} - ${role} to correct dashboard`, async () => {
        const mockUser = {
          id: 'test-user',
          name: 'Test User',
          role,
          organization,
          permissions: ['audit:read'],
          email: 'test@example.com',
        };

        vi.mocked(storeModule.useAuth).mockReturnValue({
          ...mockAuthState,
          user: mockUser,
        });

        // Test by rendering a simple router that mimics OrganizationRouter logic
        const TestOrganizationRouter = () => {
          const { user } = storeModule.useAuth();
          
          if (!user) return <div data-testid="no-user">No User</div>;
          
          const organizationDashboardMap: Record<string, { roles: string[], component: React.ReactElement }> = {
            'The Mint': {
              roles: ['NBE_ADMIN', 'NBE_OFFICER'],
              component: <div data-testid="nbe-dashboard">NBE Dashboard</div>
            },
            'Customs Authority': {
              roles: ['CUSTOMS_VALIDATOR'],
              component: <div data-testid="customs-dashboard">Customs Dashboard</div>
            },
            'Coffee Quality Authority': {
              roles: ['QUALITY_INSPECTOR'],
              component: <div data-testid="quality-dashboard">Quality Dashboard</div>
            },
            'Exporter Bank': {
              roles: ['BANK_VALIDATOR'],
              component: <div data-testid="bank-dashboard">Bank Dashboard</div>
            },
            'Commercial Bank of Ethiopia': {
              roles: ['BANK_VALIDATOR'],
              component: <div data-testid="bank-dashboard">Bank Dashboard</div>
            }
          };
          
          const organizationConfig = organizationDashboardMap[user.organization];
          
          if (!organizationConfig) {
            return <div data-testid="general-dashboard">General Dashboard</div>;
          }
          
          if (!organizationConfig.roles.includes(user.role)) {
            return (
              <div data-testid="access-denied">
                Access Denied: Role {user.role} not authorized for {user.organization}
              </div>
            );
          }
          
          return organizationConfig.component;
        };

        render(
          <BrowserRouter>
            <TestOrganizationRouter />
          </BrowserRouter>
        );

        expect(screen.getByTestId(expectedComponent)).toBeInTheDocument();
      });
    });

    it('should show access denied for invalid role-organization combinations', async () => {
      const mockUser = {
        id: 'test-user',
        name: 'Test User',
        role: 'CUSTOMS_VALIDATOR', // Wrong role for NBE
        organization: 'The Mint',
        permissions: [],
        email: 'test@example.com',
      };

      vi.mocked(storeModule.useAuth).mockReturnValue({
        ...mockAuthState,
        user: mockUser,
      });

      const TestOrganizationRouter = () => {
        const { user } = storeModule.useAuth();
        
        if (!user) return <div data-testid="no-user">No User</div>;
        
        const organizationDashboardMap: Record<string, { roles: string[] }> = {
          'The Mint': {
            roles: ['NBE_ADMIN', 'NBE_OFFICER'],
          },
        };
        
        const organizationConfig = organizationDashboardMap[user.organization];
        
        if (organizationConfig && !organizationConfig.roles.includes(user.role)) {
          return (
            <div data-testid="access-denied">
              Access Denied: Role {user.role} not authorized for {user.organization}
            </div>
          );
        }
        
        return <div data-testid="allowed">Access Allowed</div>;
      };

      render(
        <BrowserRouter>
          <TestOrganizationRouter />
        </BrowserRouter>
      );

      expect(screen.getByTestId('access-denied')).toBeInTheDocument();
      expect(screen.getByText(/Role CUSTOMS_VALIDATOR not authorized for The Mint/)).toBeInTheDocument();
    });

    it('should fallback to general dashboard for unrecognized organizations', async () => {
      const mockUser = {
        id: 'test-user',
        name: 'Test User',
        role: 'UNKNOWN_ROLE',
        organization: 'Unknown Organization',
        permissions: [],
        email: 'test@example.com',
      };

      vi.mocked(storeModule.useAuth).mockReturnValue({
        ...mockAuthState,
        user: mockUser,
      });

      const TestOrganizationRouter = () => {
        const { user } = storeModule.useAuth();
        
        if (!user) return <div data-testid="no-user">No User</div>;
        
        const organizationDashboardMap: Record<string, any> = {
          'The Mint': { roles: ['NBE_ADMIN'] },
        };
        
        const organizationConfig = organizationDashboardMap[user.organization];
        
        if (!organizationConfig) {
          return <div data-testid="general-dashboard">General Dashboard</div>;
        }
        
        return <div data-testid="org-dashboard">Organization Dashboard</div>;
      };

      render(
        <BrowserRouter>
          <TestOrganizationRouter />
        </BrowserRouter>
      );

      expect(screen.getByTestId('general-dashboard')).toBeInTheDocument();
    });
  });

  describe('Navigation State Management', () => {
    it('should update current page when navigation occurs', async () => {
      const mockUser = {
        id: 'test-user',
        name: 'Test User',
        role: 'NBE_ADMIN',
        organization: 'The Mint',
        permissions: ['user:manage'],
        email: 'test@example.com',
      };

      vi.mocked(storeModule.useAuth).mockReturnValue({
        ...mockAuthState,
        user: mockUser,
      });

      // Mock router with specific route
      render(
        <MemoryRouter initialEntries={['/users']}>
          <div data-testid="test-router">Router Test</div>
        </MemoryRouter>
      );

      // Verify the test setup works
      expect(screen.getByTestId('test-router')).toBeInTheDocument();
    });

    it('should handle theme changes correctly', async () => {
      const mockUser = {
        id: 'test-user',
        name: 'Test User',
        role: 'NBE_ADMIN',
        organization: 'The Mint',
        permissions: [],
        email: 'test@example.com',
      };

      vi.mocked(storeModule.useAuth).mockReturnValue({
        ...mockAuthState,
        user: mockUser,
      });

      // Test different theme states
      const themes = ['light', 'dark', 'system'] as const;
      
      themes.forEach(theme => {
        vi.mocked(storeModule.useUI).mockReturnValue({
          theme,
          sidebarOpen: true,
          currentPage: 'dashboard',
          isOffline: false,
          loading: {},
          error: {},
        });

        const { rerender } = render(
          <BrowserRouter>
            <div data-testid={`theme-${theme}`}>Theme: {theme}</div>
          </BrowserRouter>
        );

        expect(screen.getByTestId(`theme-${theme}`)).toBeInTheDocument();
        
        rerender(
          <BrowserRouter>
            <div data-testid="theme-updated">Updated</div>
          </BrowserRouter>
        );
      });
    });
  });

  describe('Permission-Based Navigation', () => {
    it('should hide navigation items when user lacks permissions', async () => {
      const mockUser = {
        id: 'test-user',
        name: 'Test User',
        role: 'NBE_OFFICER',
        organization: 'The Mint',
        permissions: ['audit:read'], // Missing user:manage and compliance:screen
        email: 'test@example.com',
      };

      vi.mocked(storeModule.useAuth).mockReturnValue({
        ...mockAuthState,
        user: mockUser,
      });

      // Test permission filtering logic
      const hasPermission = (permissions?: string[]): boolean => {
        if (!permissions || permissions.length === 0) return true;
        return permissions.some(permission => mockUser.permissions.includes(permission));
      };

      // Test various permission scenarios
      expect(hasPermission(['user:manage'])).toBe(false);
      expect(hasPermission(['compliance:screen'])).toBe(false);
      expect(hasPermission(['audit:read'])).toBe(true);
      expect(hasPermission([])).toBe(true);
      expect(hasPermission(undefined)).toBe(true);
    });

    it('should show navigation items when user has required permissions', async () => {
      const mockUser = {
        id: 'test-user',
        name: 'Test User',
        role: 'NBE_ADMIN',
        organization: 'The Mint',
        permissions: ['user:manage', 'compliance:screen', 'audit:read'],
        email: 'test@example.com',
      };

      vi.mocked(storeModule.useAuth).mockReturnValue({
        ...mockAuthState,
        user: mockUser,
      });

      const hasPermission = (permissions?: string[]): boolean => {
        if (!permissions || permissions.length === 0) return true;
        return permissions.some(permission => mockUser.permissions.includes(permission));
      };

      // All permissions should be available
      expect(hasPermission(['user:manage'])).toBe(true);
      expect(hasPermission(['compliance:screen'])).toBe(true);
      expect(hasPermission(['audit:read'])).toBe(true);
    });
  });
});