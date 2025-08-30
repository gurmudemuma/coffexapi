/**
 * Authentication Store and Audit Logging Integration Tests
 * 
 * Tests the integration between auth store and audit logging system
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAppStore, useAuth, useAuthActions } from '../../store';
import * as auditLoggerModule from '../../utils/auditLogger';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock audit logger functions
vi.mock('../../utils/auditLogger', () => ({
  logSuccessfulLogin: vi.fn(),
  logFailedLogin: vi.fn(),
  logLogout: vi.fn(),
}));

describe('Authentication Store Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.clear();
    // Reset the store state before each test
    useAppStore.getState().resetStore();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with correct default state', () => {
      const { result } = renderHook(() => useAuth());
      
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.loginAttempts).toBe(0);
      expect(typeof result.current.lastActivity).toBe('number');
    });
  });

  describe('Successful Login Flow', () => {
    it('should handle successful login with audit logging', async () => {
      const { result: authResult } = renderHook(() => useAuth());
      const { result: actionsResult } = renderHook(() => useAuthActions());

      expect(authResult.current.isAuthenticated).toBe(false);

      await act(async () => {
        await actionsResult.current.login('nbe.admin', 'admin123');
      });

      // Wait for state updates
      await waitFor(() => {
        expect(authResult.current.isAuthenticated).toBe(true);
      });

      // Check auth state
      expect(authResult.current.user).toEqual(
        expect.objectContaining({
          id: 'nbe-admin-001',
          name: 'NBE Administrator',
          role: 'NBE_ADMIN',
          organization: 'The Mint',
          email: 'admin@nbe.gov.et',
        })
      );
      expect(authResult.current.token).toMatch(/^mock\.jwt\.token\./);
      expect(authResult.current.isLoading).toBe(false);

      // Check audit logging
      expect(auditLoggerModule.logSuccessfulLogin).toHaveBeenCalledWith(
        'nbe-admin-001',
        'NBE Administrator',
        'NBE_ADMIN',
        'The Mint'
      );

      // Check localStorage
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'authToken',
        expect.stringMatching(/^mock\.jwt\.token\./)
      );
    });

    it('should handle different user types correctly', async () => {
      const userTestCases = [
        {
          username: 'customs.validator',
          password: 'customs123',
          expectedUser: {
            id: 'customs-val-001',
            name: 'Customs Validator',
            role: 'CUSTOMS_VALIDATOR',
            organization: 'Customs Authority',
          },
        },
        {
          username: 'quality.inspector',
          password: 'quality123',
          expectedUser: {
            id: 'quality-ins-001',
            name: 'Quality Inspector',
            role: 'QUALITY_INSPECTOR',
            organization: 'Coffee Quality Authority',
          },
        },
        {
          username: 'bank.validator',
          password: 'bank123',
          expectedUser: {
            id: 'bank-val-001',
            name: 'Bank Validator',
            role: 'BANK_VALIDATOR',
            organization: 'Exporter Bank',
          },
        },
      ];

      for (const testCase of userTestCases) {
        vi.clearAllMocks();
        useAppStore.getState().resetStore();

        const { result: actionsResult } = renderHook(() => useAuthActions());
        const { result: authResult } = renderHook(() => useAuth());

        await act(async () => {
          await actionsResult.current.login(testCase.username, testCase.password);
        });

        await waitFor(() => {
          expect(authResult.current.isAuthenticated).toBe(true);
        });

        expect(authResult.current.user).toEqual(
          expect.objectContaining(testCase.expectedUser)
        );

        expect(auditLoggerModule.logSuccessfulLogin).toHaveBeenCalledWith(
          testCase.expectedUser.id,
          testCase.expectedUser.name,
          testCase.expectedUser.role,
          testCase.expectedUser.organization
        );
      }
    });
  });

  describe('Failed Login Flow', () => {
    it('should handle failed login with audit logging', async () => {
      const { result: authResult } = renderHook(() => useAuth());
      const { result: actionsResult } = renderHook(() => useAuthActions());

      await act(async () => {
        try {
          await actionsResult.current.login('invalid.user', 'wrong.password');
        } catch (error) {
          // Expected to throw
        }
      });

      // Check auth state remains unchanged
      expect(authResult.current.isAuthenticated).toBe(false);
      expect(authResult.current.user).toBeNull();
      expect(authResult.current.token).toBeNull();
      expect(authResult.current.isLoading).toBe(false);

      // Check audit logging
      expect(auditLoggerModule.logFailedLogin).toHaveBeenCalledWith(
        'invalid.user',
        'Invalid credentials'
      );

      // Check localStorage was not updated
      expect(mockLocalStorage.setItem).not.toHaveBeenCalledWith(
        'authToken',
        expect.any(String)
      );
    });

    it('should increment login attempts on failed login', async () => {
      const { result: authResult } = renderHook(() => useAuth());
      const { result: actionsResult } = renderHook(() => useAuthActions());

      const initialAttempts = authResult.current.loginAttempts;

      await act(async () => {
        try {
          await actionsResult.current.login('wrong.user', 'wrong.pass');
        } catch (error) {
          // Expected to throw
        }
      });

      expect(authResult.current.loginAttempts).toBe(initialAttempts + 1);
    });
  });

  describe('Logout Flow', () => {
    it('should handle logout with audit logging', async () => {
      // First login
      const { result: authResult } = renderHook(() => useAuth());
      const { result: actionsResult } = renderHook(() => useAuthActions());

      await act(async () => {
        await actionsResult.current.login('nbe.admin', 'admin123');
      });

      await waitFor(() => {
        expect(authResult.current.isAuthenticated).toBe(true);
      });

      const loggedInUser = authResult.current.user!;

      // Clear previous mock calls
      vi.clearAllMocks();

      // Now logout
      await act(() => {
        actionsResult.current.logout();
      });

      // Check auth state
      expect(authResult.current.user).toBeNull();
      expect(authResult.current.token).toBeNull();
      expect(authResult.current.isAuthenticated).toBe(false);
      expect(authResult.current.loginAttempts).toBe(0);

      // Check audit logging
      expect(auditLoggerModule.logLogout).toHaveBeenCalledWith(
        loggedInUser.id,
        loggedInUser.name,
        loggedInUser.role,
        loggedInUser.organization
      );

      // Check localStorage
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('authToken');
    });

    it('should handle logout when no user is logged in', async () => {
      const { result: actionsResult } = renderHook(() => useAuthActions());

      await act(() => {
        actionsResult.current.logout();
      });

      // Should not crash and not log anything
      expect(auditLoggerModule.logLogout).not.toHaveBeenCalled();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('authToken');
    });
  });

  describe('Activity Updates', () => {
    it('should update last activity timestamp', async () => {
      const { result: authResult } = renderHook(() => useAuth());
      const { result: actionsResult } = renderHook(() => useAuthActions());

      const initialActivity = authResult.current.lastActivity;

      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10));

      await act(() => {
        actionsResult.current.updateLastActivity();
      });

      expect(authResult.current.lastActivity).toBeGreaterThan(initialActivity);
    });
  });

  describe('State Persistence', () => {
    it('should persist and restore auth state', async () => {
      const { result: actionsResult } = renderHook(() => useAuthActions());

      // Login
      await act(async () => {
        await actionsResult.current.login('nbe.admin', 'admin123');
      });

      const store = useAppStore.getState();
      
      // Simulate storage persistence
      const persistedState = {
        auth: {
          user: store.auth.user,
          token: store.auth.token,
          isAuthenticated: store.auth.isAuthenticated,
        },
        ui: {
          theme: store.ui.theme,
          sidebarOpen: store.ui.sidebarOpen,
        },
      };

      // Reset store
      useAppStore.getState().resetStore();

      // Simulate restore from persistence
      useAppStore.getState().setAuth(persistedState.auth);

      const { result: newAuthResult } = renderHook(() => useAuth());

      expect(newAuthResult.current.user).toEqual(
        expect.objectContaining({
          id: 'nbe-admin-001',
          name: 'NBE Administrator',
        })
      );
      expect(newAuthResult.current.isAuthenticated).toBe(true);
    });
  });

  describe('Integration with UI State', () => {
    it('should work correctly with UI state management', async () => {
      const { result: authResult } = renderHook(() => useAuth());
      const { result: actionsResult } = renderHook(() => useAuthActions());
      const { result: storeResult } = renderHook(() => useAppStore());

      // Login
      await act(async () => {
        await actionsResult.current.login('nbe.admin', 'admin123');
      });

      await waitFor(() => {
        expect(authResult.current.isAuthenticated).toBe(true);
      });

      // Update UI state
      await act(() => {
        storeResult.current.setTheme('dark');
        storeResult.current.setCurrentPage('users');
      });

      // Verify both auth and UI state are maintained
      expect(authResult.current.isAuthenticated).toBe(true);
      expect(storeResult.current.ui.theme).toBe('dark');
      expect(storeResult.current.ui.currentPage).toBe('users');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors during login', async () => {
      const { result: actionsResult } = renderHook(() => useAuthActions());

      // Mock a network error by providing invalid credentials that will throw
      await act(async () => {
        try {
          await actionsResult.current.login('', '');
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
        }
      });

      expect(auditLoggerModule.logFailedLogin).toHaveBeenCalledWith(
        '',
        expect.any(String)
      );
    });

    it('should maintain loading state correctly during errors', async () => {
      const { result: authResult } = renderHook(() => useAuth());
      const { result: actionsResult } = renderHook(() => useAuthActions());

      const loginPromise = act(async () => {
        try {
          await actionsResult.current.login('invalid', 'invalid');
        } catch (error) {
          // Expected error
        }
      });

      // Loading should be false after error
      await loginPromise;
      expect(authResult.current.isLoading).toBe(false);
    });
  });
});