/**
 * Test Setup Configuration
 * 
 * Global test setup for Vitest environment
 */

import '@testing-library/jest-dom';
import { expect, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Global test configuration
beforeAll(() => {
  // Mock global objects that might not be available in test environment
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock ResizeObserver
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock IntersectionObserver
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock localStorage
  const localStorageMock = (() => {
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
    value: localStorageMock,
  });

  // Mock sessionStorage
  Object.defineProperty(window, 'sessionStorage', {
    value: localStorageMock,
  });

  // Mock performance.now for consistent timing in tests
  global.performance = global.performance || {};
  global.performance.now = vi.fn(() => Date.now());

  // Mock crypto for ID generation
  Object.defineProperty(global, 'crypto', {
    value: {
      randomUUID: vi.fn(() => 'test-uuid-' + Math.random().toString(36).substr(2, 9)),
      getRandomValues: vi.fn((arr) => {
        for (let i = 0; i < arr.length; i++) {
          arr[i] = Math.floor(Math.random() * 256);
        }
        return arr;
      }),
    },
  });

  // Mock navigator
  Object.defineProperty(window, 'navigator', {
    value: {
      userAgent: 'Mozilla/5.0 (Test Environment)',
      language: 'en-US',
      languages: ['en-US', 'en'],
      onLine: true,
    },
    writable: true,
  });

  // Set up environment variables for tests
  process.env.NODE_ENV = 'test';
});

// Clean up after each test
afterEach(() => {
  // Clean up React Testing Library
  cleanup();
  
  // Clear all mocks
  vi.clearAllMocks();
  
  // Reset localStorage and sessionStorage
  localStorage.clear();
  sessionStorage.clear();
  
  // Reset console mocks if any
  if (vi.isMockFunction(console.log)) {
    console.log.mockReset();
  }
  if (vi.isMockFunction(console.warn)) {
    console.warn.mockReset();
  }
  if (vi.isMockFunction(console.error)) {
    console.error.mockReset();
  }
});

// Global cleanup
afterAll(() => {
  vi.restoreAllMocks();
});

// Extend expect with custom matchers if needed
expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

// Declare custom matcher types
declare module 'vitest' {
  interface Assertion<T = any> {
    toBeWithinRange(floor: number, ceiling: number): T;
  }
  interface AsymmetricMatchersContaining {
    toBeWithinRange(floor: number, ceiling: number): any;
  }
}

// Test timeout configuration
vi.setConfig({
  testTimeout: 30000,
  hookTimeout: 30000,
});

// Suppress console warnings/errors during tests unless explicitly testing them
const originalError = console.error;
const originalWarn = console.warn;

console.error = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning:') || 
     args[0].includes('React does not recognize') ||
     args[0].includes('validateDOMNesting'))
  ) {
    return;
  }
  originalError.call(console, ...args);
};

console.warn = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('React Router') ||
     args[0].includes('Failed to parse'))
  ) {
    return;
  }
  originalWarn.call(console, ...args);
};

// Export test utilities for common use
export const testUtils = {
  // Create a mock user for testing
  createMockUser: (overrides = {}) => ({
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    role: 'USER',
    organization: 'Test Organization',
    permissions: ['read'],
    ...overrides,
  }),

  // Create mock audit event
  createMockAuditEvent: (overrides = {}) => ({
    id: `audit-${Date.now()}-test`,
    timestamp: Date.now(),
    eventType: 'ACCESS_DENIED' as const,
    severity: 'MEDIUM' as const,
    resourcePath: '/test',
    description: 'Test audit event',
    userAgent: 'Test Agent',
    ...overrides,
  }),

  // Wait for async operations to complete
  waitForAsync: () => new Promise(resolve => setTimeout(resolve, 0)),

  // Mock API response
  mockApiResponse: (data: any, status = 200) => ({
    data,
    status,
    statusText: 'OK',
    headers: {},
    config: {},
  }),
};