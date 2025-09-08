import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  cn,
  formatDate,
  truncate,
  generateId,
  fileToBase64,
  debounce,
  isMobile,
  formatCurrency,
  deepClone,
  isEmpty,
} from '../utils';

describe('Utility Functions', () => {
  describe('cn()', () => {
    it('should combine class names', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      expect(cn('base', isActive && 'active', 'class1')).toBe('base active class1');
    });
  });

  describe('formatDate()', () => {
    it('should format date string', () => {
      const date = '2023-01-01T00:00:00';
      const result = formatDate(date);
      expect(result).toMatch(/^[A-Z][a-z]{2} \d{1,2}, \d{4}, \d{1,2}:\d{2} [AP]M$/);
    });

    it('should handle Date object', () => {
      const date = new Date('2023-01-01T00:00:00');
      const result = formatDate(date);
      expect(result).toMatch(/^[A-Z][a-z]{2} \d{1,2}, \d{4}, \d{1,2}:\d{2} [AP]M$/);
    });

    it('should handle invalid date', () => {
      const result = formatDate('invalid-date');
      expect(result).toBe('Invalid date');
    });
  });

  describe('truncate()', () => {
    it('should truncate long strings', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...');
    });

    it('should not truncate short strings', () => {
      expect(truncate('Hi', 5)).toBe('Hi');
    });

    it('should handle empty string', () => {
      expect(truncate('', 5)).toBe('');
    });

    it('should handle non-string input', () => {
      // @ts-expect-error Testing invalid input
      expect(truncate(123, 1)).toBe('');
    });
  });

  describe('generateId()', () => {
    it('should generate id with default prefix', () => {
      const id = generateId();
      expect(id).toMatch(/^id-[a-z0-9]{7,}$/);
    });

    it('should generate id with custom prefix', () => {
      const id = generateId('test');
      expect(id).toMatch(/^test-[a-z0-9]{7,}$/);
    });
  });

  describe('fileToBase64()', () => {
    it('should convert file to base64', async () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const result = await fileToBase64(file);
      expect(result).toMatch(/^data:text\/plain;base64/);
    });

    it('should reject with error for invalid input', async () => {
      // @ts-expect-error Testing invalid input
      await expect(fileToBase64(null)).rejects.toThrow('Expected a File object');
    });
  });

  describe('debounce()', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should debounce function calls', () => {
      const mockFn = vi.fn();
      const debounced = debounce(mockFn, 100);

      debounced(1);
      debounced(2);
      debounced(3);

      vi.advanceTimersByTime(50);
      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith(3);
    });
  });

  describe('isMobile()', () => {
    const originalNavigator = { ...window.navigator };

    afterEach(() => {
      // Restore original navigator
      Object.defineProperty(window, 'navigator', {
        value: originalNavigator,
        writable: true,
      });
    });

    it('should detect mobile user agent', () => {
      Object.defineProperty(window, 'navigator', {
        value: { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)' },
        writable: true,
      });
      expect(isMobile()).toBe(true);
    });

    it('should detect desktop user agent', () => {
      Object.defineProperty(window, 'navigator', {
        value: { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        writable: true,
      });
      expect(isMobile()).toBe(false);
    });
  });

  describe('formatCurrency()', () => {
    it('should format number as currency', () => {
      expect(formatCurrency(1000)).toMatch(/^\$1,000\.00$/);
    });

    it('should handle different currencies', () => {
      expect(formatCurrency(1000, 'EUR', 'de-DE')).toMatch(/^1\.000,00\s?€/);
    });

    it('should handle invalid input', () => {
      // @ts-expect-error Testing invalid input
      expect(formatCurrency('not a number')).toBe('');
    });
  });

  describe('deepClone()', () => {
    it('should create a deep clone of an object', () => {
      const obj = { a: 1, b: { c: 2 } };
      const clone = deepClone(obj);
      expect(clone).toEqual(obj);
      expect(clone).not.toBe(obj);
      expect(clone.b).not.toBe(obj.b);
    });

    it('should handle primitive values', () => {
      expect(deepClone(42)).toBe(42);
      expect(deepClone('test')).toBe('test');
      expect(deepClone(null)).toBe(null);
    });
  });

  describe('isEmpty()', () => {
    it('should check if value is empty', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
      expect(isEmpty('test')).toBe(false);
      expect(isEmpty([1, 2, 3])).toBe(false);
      expect(isEmpty({ a: 1 })).toBe(false);
    });
  });
});
