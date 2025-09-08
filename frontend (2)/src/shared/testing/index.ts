/**
 * Testing Utilities Export
 * 
 * Central export point for all testing utilities and helpers.
 */

// Test utilities and helpers
export * from './test-utils';
export * from './component-factory';

// Setup functions
export { default as setupTests } from './setup';

// Type definitions for testing
export interface TestUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  organization: string;
}

export interface TestExport {
  id: string;
  exportId: string;
  status: string;
  submittedAt: number;
}