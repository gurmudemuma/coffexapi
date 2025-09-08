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
global.File = class MockFile extends Blob {
  name: string;
  lastModified: number;
  webkitRelativePath: string;
  
  constructor(chunks: any[], filename: string, options: any = {}) {
    super(chunks, options);
    this.name = filename;
    this.lastModified = Date.now();
    this.webkitRelativePath = '';
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

const MockFileReader = class extends EventTarget {
  result: string | ArrayBuffer | null = null;
  error: DOMException | null = null;
  readyState: number = 0;
  onload: ((ev: ProgressEvent) => any) | null = null;
  onerror: ((ev: ProgressEvent) => any) | null = null;
  onabort: ((ev: ProgressEvent) => any) | null = null;
  onloadstart: ((ev: ProgressEvent) => any) | null = null;
  onloadend: ((ev: ProgressEvent) => any) | null = null;
  onprogress: ((ev: ProgressEvent) => any) | null = null;
  
  readAsText(blob: Blob, encoding?: string): void {
    this.result = '';
    this.readyState = 2;
    if (this.onload) this.onload(new ProgressEvent('load'));
  }
  
  readAsDataURL(blob: Blob): void {
    this.result = 'data:text/plain;base64,';
    this.readyState = 2;
    if (this.onload) this.onload(new ProgressEvent('load'));
  }
  
  readAsArrayBuffer(blob: Blob): void {
    this.result = new ArrayBuffer(0);
    this.readyState = 2;
    if (this.onload) this.onload(new ProgressEvent('load'));
  }
  
  readAsBinaryString(blob: Blob): void {
    this.result = '';
    this.readyState = 2;
    if (this.onload) this.onload(new ProgressEvent('load'));
  }
  
  abort(): void {
    this.readyState = 2;
    if (this.onabort) this.onabort(new ProgressEvent('abort'));
  }
};

// Add static properties
(MockFileReader as any).EMPTY = 0;
(MockFileReader as any).LOADING = 1;
(MockFileReader as any).DONE = 2;

// Add static properties to prototype
(MockFileReader.prototype as any).EMPTY = 0;
(MockFileReader.prototype as any).LOADING = 1;
(MockFileReader.prototype as any).DONE = 2;

global.FileReader = MockFileReader as any;

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
  
  slice(start?: number, end?: number, contentType?: string): Blob {
    return new MockBlob();
  }
  
  stream(): ReadableStream {
    return new ReadableStream();
  }
  
  get [Symbol.toStringTag](): string {
    return 'Blob';
  }
  
  // Add missing bytes method with correct return type
  bytes(): Promise<Uint8Array<ArrayBufferLike>> {
    return Promise.resolve(new Uint8Array(new ArrayBuffer(0)));
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
(global as any).vi = vi;