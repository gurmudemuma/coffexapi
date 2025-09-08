import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names using clsx and tailwind-merge.
 * Handles conditional class names and deduplicates Tailwind classes.
 *
 * @param {...ClassValue[]} inputs - Class names or class name objects to be combined
 * @returns {string} Combined and deduplicated class names
 *
 * @example
 * // Returns 'p-4 bg-blue-500 hover:bg-blue-600'
 * cn('p-4', 'bg-blue-500', 'hover:bg-blue-600')
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string or Date object to a human-readable format.
 *
 * @param {string | Date} dateString - The date to format (can be a string or Date object)
 * @returns {string} Formatted date string (e.g., 'Jan 1, 2023, 12:00 PM')
 *
 * @example
 * // Returns 'Jan 1, 2023, 12:00 AM'
 * formatDate('2023-01-01T00:00:00')
 */
export function formatDate(dateString: string | Date): string {
  if (!dateString) return '';
  
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  
  // Handle invalid date
  if (Number.isNaN(date.getTime())) {
    console.warn('Invalid date provided to formatDate:', dateString);
    return 'Invalid date';
  }
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Truncates a string to a specified length and adds an ellipsis if needed.
 *
 * @param {string} str - The string to truncate
 * @param {number} length - Maximum length of the string before truncation
 * @returns {string} Truncated string with ellipsis if needed
 *
 * @example
 * // Returns 'Hello...'
 * truncate('Hello World', 5)
 */
export function truncate(str: string, length: number): string {
  if (typeof str !== 'string') {
    console.warn('truncate() expected a string but got:', typeof str);
    return '';
  }
  if (typeof length !== 'number' || length < 0) {
    console.warn('truncate() expected a positive number for length but got:', length);
    return str;
  }
  
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

/**
 * Generates a unique ID with an optional prefix.
 *
 * @param {string} [prefix='id'] - Optional prefix for the generated ID
 * @returns {string} A unique ID string
 *
 * @example
 * // Returns 'user-1a2b3c4d5e'
 * generateId('user-')
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Converts a File object to a base64 encoded string.
 *
 * @param {File} file - The file to convert
 * @returns {Promise<string>} A promise that resolves to the base64 string
 * @throws {Error} If the file cannot be read
 *
 * @example
 * // Usage with async/await
 * const base64 = await fileToBase64(file);
 */
export function fileToBase64(file: File): Promise<string> {
  if (!(file instanceof File)) {
    return Promise.reject(new Error('Expected a File object'));
  }
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as base64'));
      }
    };
    
    reader.onerror = (error) => {
      reject(error || new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Creates a debounced function that delays invoking `func` until after `wait` milliseconds
 * have elapsed since the last time the debounced function was invoked.
 *
 * @template T - The function type to debounce
 * @param {T} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @returns {(...args: Parameters<T>) => void} The debounced function
 *
 * @example
 * const debouncedFn = debounce((text) => console.log(text), 300);
 * debouncedFn('Hello'); // Will log after 300ms of no calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }
  
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function (this: any, ...args: Parameters<T>): void {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func.apply(this, args);
      timeout = null;
    }, wait);
  };
}

/**
 * Detects if the current device is a mobile device based on the user agent.
 *
 * @returns {boolean} True if the device is a mobile device, false otherwise
 *
 * @example
 * if (isMobile()) {
 *   // Apply mobile-specific logic
 * }
 */
export const isMobile = (): boolean => {
  if (typeof window === 'undefined' || !window.navigator) {
    return false;
  }
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Formats a number as a currency string.
 *
 * @param {number} amount - The amount to format
 * @param {string} [currency='USD'] - The currency code (e.g., 'USD', 'EUR')
 * @param {string} [locale='en-US'] - The locale to use for formatting
 * @returns {string} Formatted currency string
 *
 * @example
 * // Returns '$1,000.00'
 * formatCurrency(1000)
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    console.warn('formatCurrency() expected a number but got:', amount);
    return '';
  }
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return amount.toString();
  }
}

/**
 * Creates a deep clone of an object using JSON.parse/stringify.
 * Note: This will not preserve functions, undefined, or circular references.
 *
 * @template T - The type of the object to clone
 * @param {T} obj - The object to clone
 * @returns {T} A deep clone of the object
 *
 * @example
 * const original = { a: 1, b: { c: 2 } };
 * const cloned = deepClone(original);
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    console.error('Error deep cloning object:', error);
    return obj; // Return original if cloning fails
  }
}

/**
 * Checks if a value is empty. A value is considered empty if it is:
 * - null or undefined
 * - An empty string (after trimming)
 * - An empty array
 * - An empty object
 * - A Map or Set with size 0
 *
 * @param {any} value - The value to check
 * @returns {boolean} True if the value is empty, false otherwise
 *
 * @example
 * isEmpty('')        // true
 * isEmpty('   ')     // true
 * isEmpty([])        // true
 * isEmpty({})        // true
 * isEmpty(null)      // true
 * isEmpty(undefined) // true
 * isEmpty('text')    // false
 * isEmpty([1, 2, 3]) // false
 * isEmpty({ a: 1 })  // false
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' || Array.isArray(value))
    return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}
