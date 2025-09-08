import { vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';

export * from '@testing-library/react';

// Mock user data
export interface User {
  id: string;
  name: string;
  role: string;
  organization: string;
  permissions: string[];
  email: string;
  lastLogin?: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginAttempts: number;
  lastActivity: number;
}

export const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export const renderWithProviders = (ui: React.ReactElement) => {
  const testQueryClient = createTestQueryClient();
  
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={testQueryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
  
  return {
    ...render(ui, { wrapper: Wrapper }),
    testQueryClient,
  };
};

export const mockUser: User = {
  id: 'user-123',
  name: 'Test User',
  role: 'exporter',
  organization: 'Test Org',
  permissions: ['export:create', 'export:view'],
  email: 'test@example.com',
  lastLogin: Date.now()
};

// Mock auth state
export const mockAuthState: AuthState = {
  user: mockUser,
  token: 'mock-token-123',
  isAuthenticated: true,
  isLoading: false,
  loginAttempts: 0,
  lastActivity: Date.now()
};

// Mock notification actions
export const mockNotificationActions = {
  addNotification: vi.fn(),
  markNotificationRead: vi.fn(),
  removeNotification: vi.fn(),
  clearAllNotifications: vi.fn()
};
