/**
 * Environment variable utilities with type safety and runtime validation.
 * These utilities provide type-safe access to environment variables with proper error handling.
 * 
 * @module utils/env
 */

type Environment = 'development' | 'staging' | 'production';

/**
 * Gets the value of a required environment variable.
 * 
 * @template K - The key type extending keyof ImportMetaEnv
 * @param {K} key - The environment variable key
 * @returns {string} The environment variable value
 * @throws {Error} If the environment variable is not defined
 * 
 * @example
 * // Returns the value of VITE_API_URL or throws an error if not set
 * const apiUrl = getEnv('VITE_API_URL');
 */
export function getEnv<K extends keyof ImportMetaEnv>(key: K): string {
  const value = import.meta.env[key];
  
  if (value === undefined) {
    const error = new Error(`Missing required environment variable: ${key}`);
    console.error(error);
    throw error;
  }
  
  return String(value);
}

/**
 * Gets the value of an optional environment variable.
 * 
 * @template K - The key type extending keyof ImportMetaEnv
 * @param {K} key - The environment variable key
 * @returns {string | undefined} The environment variable value or undefined if not set
 * 
 * @example
 * // Returns the value of VITE_DEBUG or undefined if not set
 * const debug = getOptionalEnv('VITE_DEBUG');
 */
export function getOptionalEnv<K extends keyof ImportMetaEnv>(
  key: K
): string | undefined {
  const value = import.meta.env[key];
  return value !== undefined ? String(value) : undefined;
}

/**
 * Gets the value of a required environment variable as a number.
 * 
 * @template K - The key type extending keyof ImportMetaEnv
 * @param {K} key - The environment variable key
 * @param {number} [defaultValue] - Optional default value if parsing fails
 * @returns {number} The parsed number value
 * @throws {Error} If the environment variable is not a valid number and no default is provided
 * 
 * @example
 * // Returns the value of VITE_PORT as a number or throws an error
 * const port = getNumberEnv('VITE_PORT');
 * 
 * // With default value
 * const port = getNumberEnv('VITE_PORT', 3000);
 */
export function getNumberEnv<K extends keyof ImportMetaEnv>(
  key: K,
  defaultValue?: number
): number {
  const value = getOptionalEnv(key);
  
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  
  const num = Number(value);
  if (Number.isNaN(num)) {
    const error = new Error(
      `Environment variable ${key} must be a valid number, got: ${value}`
    );
    console.error(error);
    throw error;
  }
  
  return num;
}

/**
 * Gets the value of a required environment variable as a boolean.
 * 
 * @template K - The key type extending keyof ImportMetaEnv
 * @param {K} key - The environment variable key
 * @param {boolean} [defaultValue] - Optional default value if not set
 * @returns {boolean} The parsed boolean value
 * 
 * @remarks
 * The following case-insensitive values are considered `true`:
 * - 'true', 't', 'yes', 'y', '1'
 * 
 * All other values are considered `false`.
 * 
 * @example
 * // Returns true if VITE_DEBUG is 'true', '1', 'yes', etc.
 * const debug = getBooleanEnv('VITE_DEBUG');
 */
export function getBooleanEnv<K extends keyof ImportMetaEnv>(
  key: K,
  defaultValue: boolean = false
): boolean {
  const value = getOptionalEnv(key);
  
  if (value === undefined) {
    return defaultValue;
  }
  
  const normalized = String(value).trim().toLowerCase();
  return ['true', 't', 'yes', 'y', '1'].includes(normalized);
}

/**
 * Gets the current application environment.
 * 
 * @returns {Environment} The current environment ('development', 'staging', or 'production')
 * 
 * @example
 * if (getEnvironment() === 'development') {
 *   // Development-specific code
 * }
 */
export function getEnvironment(): Environment {
  const env = (getOptionalEnv('VITE_APP_ENV') || 'development').toLowerCase();
  
  if (['development', 'staging', 'production'].includes(env)) {
    return env as Environment;
  }
  
  console.warn(
    `Invalid VITE_APP_ENV value: '${env}'. ` +
    `Expected 'development', 'staging', or 'production'. Defaulting to 'development'.`
  );
  
  return 'development';
}

/**
 * Checks if the application is running in development mode.
 * 
 * @returns {boolean} True if the environment is 'development'
 * 
 * @example
 * if (isDevelopment()) {
 *   // Development-only code
 * }
 */
export function isDevelopment(): boolean {
  return getEnvironment() === 'development';
}

/**
 * Checks if the application is running in production mode.
 * 
 * @returns {boolean} True if the environment is 'production'
 * 
 * @example
 * if (isProduction()) {
 *   // Production-only code
 * }
 */
export function isProduction(): boolean {
  return getEnvironment() === 'production';
}

/**
 * Checks if the application is running in staging mode.
 * 
 * @returns {boolean} True if the environment is 'staging'
 * 
 * @example
 * if (isStaging()) {
 *   // Staging-only code
 * }
 */
export function isStaging(): boolean {
  return getEnvironment() === 'staging';
}

/**
 * Checks if a feature is enabled based on environment variables.
 * 
 * @param {string} feature - The feature name (case-insensitive)
 * @param {boolean} [defaultValue=false] - Default value if the feature flag is not set
 * @returns {boolean} True if the feature is enabled
 * 
 * @example
 * // Returns true if VITE_FEATURE_DARK_MODE is 'true', '1', etc.
 * const isDarkMode = isFeatureEnabled('dark_mode');
 * 
 * // With default value
 * const isEnabled = isFeatureEnabled('new_ui', true);
 */
export function isFeatureEnabled(
  feature: string,
  defaultValue: boolean = false
): boolean {
  if (!feature || typeof feature !== 'string') {
    console.warn('Feature name must be a non-empty string');
    return defaultValue;
  }
  
  const normalizedFeature = feature.trim().toUpperCase();
  const envVarName = `VITE_FEATURE_${normalizedFeature}` as keyof ImportMetaEnv;
  
  try {
    return getBooleanEnv(envVarName, defaultValue);
  } catch (error) {
    console.warn(
      `Failed to check feature flag '${feature}':`,
      error instanceof Error ? error.message : 'Unknown error'
    );
    return defaultValue;
  }
}
