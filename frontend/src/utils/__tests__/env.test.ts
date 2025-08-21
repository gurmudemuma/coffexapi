import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getEnv,
  getOptionalEnv,
  getNumberEnv,
  getBooleanEnv,
  getEnvironment,
  isDevelopment,
  isProduction,
  isStaging,
  isFeatureEnabled,
} from '../env';

// Mock import.meta.env
const mockEnv: Record<string, string> = {};

// Create a proxy to handle dynamic property access
const envProxy = new Proxy<Record<string, string>>(mockEnv, {
  get: (_, prop) => mockEnv[prop.toString()],
  set: (_, prop, value) => {
    mockEnv[prop.toString()] = value;
    return true;
  },
});

// Mock import.meta.env
vi.stubGlobal('import', {
  meta: { env: envProxy },
});

// Store original environment
const originalEnv = { ...mockEnv };

describe('Environment Utilities', () => {
  beforeEach(() => {
    // Reset the environment before each test
    vi.resetModules();
    Object.keys(mockEnv).forEach(key => delete mockEnv[key]);
    Object.assign(mockEnv, originalEnv);
  });

  describe('getEnv()', () => {
    it('should return environment variable value', () => {
      mockEnv.TEST_VAR = 'test-value';
      expect(getEnv('TEST_VAR')).toBe('test-value');
    });

    it('should throw error for undefined variable', () => {
      expect(() => getEnv('NON_EXISTENT_VAR')).toThrow(
        'Missing required environment variable: NON_EXISTENT_VAR'
      );
    });
  });

  describe('getOptionalEnv()', () => {
    it('should return environment variable value if it exists', () => {
      mockEnv.OPTIONAL_VAR = 'optional-value';
      expect(getOptionalEnv('OPTIONAL_VAR')).toBe('optional-value');
    });

    it('should return undefined for non-existent variable', () => {
      expect(getOptionalEnv('NON_EXISTENT_VAR')).toBeUndefined();
    });
  });

  describe('getNumberEnv()', () => {
    it('should parse number from environment variable', () => {
      mockEnv.PORT = '3000';
      expect(getNumberEnv('PORT')).toBe(3000);
    });

    it('should return default value for non-existent variable', () => {
      expect(getNumberEnv('NON_EXISTENT_PORT', 8080)).toBe(8080);
    });

    it('should throw error for invalid number', () => {
      mockEnv.INVALID_NUMBER = 'not-a-number';
      expect(() => getNumberEnv('INVALID_NUMBER')).toThrow(
        'must be a valid number'
      );
    });
  });

  describe('getBooleanEnv()', () => {
    it('should return true for truthy values', () => {
      const truthyValues = ['true', 'TRUE', 'True', '1', 'yes', 'y'];
      
      truthyValues.forEach((value, index) => {
        const key = `TRUE_VALUE_${index}`;
        mockEnv[key] = value;
        expect(getBooleanEnv(key)).toBe(true);
      });
    });

    it('should return false for falsy values', () => {
      const falsyValues = ['false', 'FALSE', '0', 'no', 'n', 'random'];
      
      falsyValues.forEach((value, index) => {
        const key = `FALSE_VALUE_${index}`;
        mockEnv[key] = value;
        expect(getBooleanEnv(key)).toBe(false);
      });
    });

    it('should return default value for non-existent variable', () => {
      expect(getBooleanEnv('NON_EXISTENT_FLAG', true)).toBe(true);
    });
  });

  describe('getEnvironment()', () => {
    it('should return development by default', () => {
      delete mockEnv.VITE_APP_ENV;
      expect(getEnvironment()).toBe('development');
    });

    it('should return valid environment from VITE_APP_ENV', () => {
      mockEnv.VITE_APP_ENV = 'production';
      expect(getEnvironment()).toBe('production');
    });

    it('should default to development for invalid environment', () => {
      mockEnv.VITE_APP_ENV = 'invalid';
      expect(getEnvironment()).toBe('development');
    });
  });

  describe('environment helpers', () => {
    it('isDevelopment() should return true in development', () => {
      mockEnv.VITE_APP_ENV = 'development';
      expect(isDevelopment()).toBe(true);
      expect(isProduction()).toBe(false);
      expect(isStaging()).toBe(false);
    });

    it('isProduction() should return true in production', () => {
      mockEnv.VITE_APP_ENV = 'production';
      expect(isProduction()).toBe(true);
      expect(isDevelopment()).toBe(false);
      expect(isStaging()).toBe(false);
    });

    it('isStaging() should return true in staging', () => {
      mockEnv.VITE_APP_ENV = 'staging';
      expect(isStaging()).toBe(true);
      expect(isDevelopment()).toBe(false);
      expect(isProduction()).toBe(false);
    });
  });

  describe('isFeatureEnabled()', () => {
    it('should return true for enabled features', () => {
      mockEnv.VITE_FEATURE_TEST = 'true';
      expect(isFeatureEnabled('test')).toBe(true);
    });

    it('should return false for disabled features', () => {
      mockEnv.VITE_FEATURE_TEST = 'false';
      expect(isFeatureEnabled('test')).toBe(false);
    });

    it('should return default value for non-existent feature', () => {
      expect(isFeatureEnabled('non_existent_feature', true)).toBe(true);
      expect(isFeatureEnabled('non_existent_feature', false)).toBe(false);
    });

    it('should handle case-insensitive feature names', () => {
      mockEnv.VITE_FEATURE_TEST_FEATURE = 'true';
      expect(isFeatureEnabled('test-feature')).toBe(true);
      expect(isFeatureEnabled('TEST_FEATURE')).toBe(true);
      expect(isFeatureEnabled('test feature')).toBe(true);
    });
  });
});
