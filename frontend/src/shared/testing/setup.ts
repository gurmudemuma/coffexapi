/**
 * Test Setup Configuration
 * 
 * Global test setup that runs before all tests.
 * Includes DOM mocking, global utilities, and environment configuration.
 */

import { vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

// ==============================================================================
// Global Test Configuration
// ==============================================================================

// Automatically cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Reset modules between tests
beforeEach(() => {
  vi.resetModules();
});

// ==============================================================================
// DOM Mocking
// ==============================================================================

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true,
});

// Mock window.scroll
Object.defineProperty(window, 'scroll', {
  value: vi.fn(),
  writable: true,
});

// Mock IntersectionObserver
class IntersectionObserverMock {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
  
  constructor(callback: IntersectionObserverCallback) {
    // Store callback for potential use in tests
  }
}

Object.defineProperty(window, 'IntersectionObserver', {
  value: IntersectionObserverMock,
  writable: true,
});

// Mock ResizeObserver
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  
  constructor(callback: ResizeObserverCallback) {
    // Store callback for potential use in tests
  }
}

Object.defineProperty(window, 'ResizeObserver', {
  value: ResizeObserverMock,
  writable: true,
});

// Mock MutationObserver
class MutationObserverMock {
  observe = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
  
  constructor(callback: MutationCallback) {
    // Store callback for potential use in tests
  }
}

Object.defineProperty(window, 'MutationObserver', {
  value: MutationObserverMock,
  writable: true,
});

// ==============================================================================
// Web APIs Mocking
// ==============================================================================

// Mock Clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(''),
  },
  writable: true,
});

// Mock Geolocation API
Object.defineProperty(navigator, 'geolocation', {
  value: {
    getCurrentPosition: vi.fn(),
    watchPosition: vi.fn(),
    clearWatch: vi.fn(),
  },
  writable: true,
});

// Mock File API
global.File = class MockFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  
  constructor(chunks: any[], filename: string, options: any = {}) {
    this.name = filename;
    this.size = 0;
    this.type = options.type || '';
    this.lastModified = Date.now();
  }
  
  arrayBuffer(): Promise<ArrayBuffer> {
    return Promise.resolve(new ArrayBuffer(0));
  }
  
  text(): Promise<string> {
    return Promise.resolve('');
  }
  
  slice() {
    return new MockFile([], this.name);
  }
};

global.FileReader = class MockFileReader {
  result: string | ArrayBuffer | null = null;
  error: any = null;
  readyState: number = 0;
  onload: ((event: any) => void) | null = null;
  onerror: ((event: any) => void) | null = null;
  onabort: ((event: any) => void) | null = null;
  onloadstart: ((event: any) => void) | null = null;
  onloadend: ((event: any) => void) | null = null;
  onprogress: ((event: any) => void) | null = null;
  
  readAsText() {
    this.result = '';
    this.readyState = 2;
    if (this.onload) this.onload({ target: this });
  }
  
  readAsDataURL() {
    this.result = 'data:text/plain;base64,';
    this.readyState = 2;
    if (this.onload) this.onload({ target: this });
  }
  
  readAsArrayBuffer() {
    this.result = new ArrayBuffer(0);
    this.readyState = 2;
    if (this.onload) this.onload({ target: this });
  }
  
  abort() {
    this.readyState = 2;
    if (this.onabort) this.onabort({ target: this });
  }
};

// ==============================================================================
// URL and Blob Mocking
// ==============================================================================

global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();

global.Blob = class MockBlob {
  size: number = 0;
  type: string;
  
  constructor(chunks: any[] = [], options: any = {}) {
    this.type = options.type || '';
  }
  
  arrayBuffer(): Promise<ArrayBuffer> {
    return Promise.resolve(new ArrayBuffer(0));
  }
  
  text(): Promise<string> {
    return Promise.resolve('');
  }
  
  slice() {
    return new MockBlob();
  }
};

// ==============================================================================
// Console Mocking (for cleaner test output)
// ==============================================================================

// Suppress console.error in tests unless explicitly needed
const originalError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalError;
});

// ==============================================================================
// Environment Variables
// ==============================================================================

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.VITE_API_BASE_URL = 'http://localhost:5000';
process.env.VITE_FEATURE_IPFS_UPLOAD = 'false';

// ==============================================================================
// Global Test Utilities
// ==============================================================================

// Add custom matchers
declare global {
  namespace Vi {
    interface Assertion {
      toBeLoading(): void;
    }
  }
}

// Make vi globally available
global.vi = vi;