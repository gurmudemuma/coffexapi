/**
 * Centralized Configuration Management for Coffee Export System
 * 
 * This module provides consistent configuration management across all services
 * with environment variable support, validation, and default values.
 */

const path = require('path');
const fs = require('fs');

// Environment configuration
const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  PRODUCTION: 'production',
  TEST: 'test'
};

/**
 * Get environment variable with validation and default fallback
 */
function getEnvVar(key, defaultValue = '', required = false, type = 'string') {
  const value = process.env[key] || defaultValue;
  
  if (required && !value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  
  // Type conversion and validation
  switch (type) {
    case 'number':
      const numValue = parseInt(value, 10);
      if (isNaN(numValue)) {
        console.warn(`Warning: ${key} is not a valid number, using default: ${defaultValue}`);
        return parseInt(defaultValue, 10);
      }
      return numValue;
    
    case 'boolean':
      return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
    
    case 'json':
      try {
        return JSON.parse(value);
      } catch (error) {
        console.warn(`Warning: ${key} is not valid JSON, using default`);
        return defaultValue;
      }
    
    case 'array':
      return value ? value.split(',').map(item => item.trim()) : defaultValue;
    
    default:
      return value;
  }
}

/**
 * System-wide configuration
 */
const SystemConfig = {
  // Environment settings
  ENVIRONMENT: getEnvVar('NODE_ENV', ENVIRONMENTS.DEVELOPMENT),
  DEBUG: getEnvVar('DEBUG', 'false', false, 'boolean'),
  LOG_LEVEL: getEnvVar('LOG_LEVEL', 'info'),
  
  // System metadata
  SYSTEM_NAME: getEnvVar('SYSTEM_NAME', 'Coffee Export Platform'),
  SYSTEM_VERSION: getEnvVar('SYSTEM_VERSION', '2.0.0'),
  
  // Network configuration
  NETWORK: {
    NAME: getEnvVar('NETWORK_NAME', 'coffee-export-network'),
    CHANNEL: getEnvVar('CHANNEL_NAME', 'coffee-channel'),
    CHAINCODE_NAME: getEnvVar('CHAINCODE_NAME', 'coffee-export'),
    CHAINCODE_VERSION: getEnvVar('CHAINCODE_VERSION', '2.0.0'),
  },
  
  // API Gateway configuration
  API_GATEWAY: {
    HOST: getEnvVar('API_GATEWAY_HOST', 'localhost'),
    PORT: getEnvVar('API_GATEWAY_PORT', '8000', false, 'number'),
    VERSION: getEnvVar('API_VERSION', '2.0.0'),
    BASE_PATH: getEnvVar('API_BASE_PATH', '/api'),
    TIMEOUT: getEnvVar('API_TIMEOUT', '30000', false, 'number'),
    
    // CORS configuration
    CORS: {
      ALLOWED_ORIGINS: getEnvVar('CORS_ALLOWED_ORIGINS', '*', false, 'array'),
      ALLOWED_METHODS: getEnvVar('CORS_ALLOWED_METHODS', 'GET,POST,PUT,DELETE,OPTIONS', false, 'array'),
      ALLOWED_HEADERS: getEnvVar('CORS_ALLOWED_HEADERS', 'Content-Type,Authorization,X-Request-ID', false, 'array'),
      MAX_AGE: getEnvVar('CORS_MAX_AGE', '86400', false, 'number'),
    },
    
    // Rate limiting
    RATE_LIMIT: {
      ENABLED: getEnvVar('RATE_LIMIT_ENABLED', 'true', false, 'boolean'),
      WINDOW_MS: getEnvVar('RATE_LIMIT_WINDOW_MS', '60000', false, 'number'),
      MAX_REQUESTS: getEnvVar('RATE_LIMIT_MAX_REQUESTS', '100', false, 'number'),
      SKIP_SUCCESSFUL_REQUESTS: getEnvVar('RATE_LIMIT_SKIP_SUCCESS', 'false', false, 'boolean'),
    },
    
    // Authentication
    AUTH: {
      ENABLED: getEnvVar('AUTH_ENABLED', 'false', false, 'boolean'),
      JWT_SECRET: getEnvVar('JWT_SECRET', 'default-secret-change-in-production'),
      JWT_EXPIRES_IN: getEnvVar('JWT_EXPIRES_IN', '24h'),
      BCRYPT_ROUNDS: getEnvVar('BCRYPT_ROUNDS', '12', false, 'number'),
    },
  },
  
  // Frontend configuration
  FRONTEND: {
    HOST: getEnvVar('FRONTEND_HOST', 'localhost'),
    PORT: getEnvVar('FRONTEND_PORT', '3000', false, 'number'),
    BUILD_PATH: getEnvVar('FRONTEND_BUILD_PATH', './build'),
    PUBLIC_URL: getEnvVar('FRONTEND_PUBLIC_URL', '/'),
    
    // Feature flags
    FEATURES: {
      IPFS_UPLOAD: getEnvVar('FEATURE_IPFS_UPLOAD', 'true', false, 'boolean'),
      OFFLINE_MODE: getEnvVar('FEATURE_OFFLINE_MODE', 'true', false, 'boolean'),
      REAL_TIME_UPDATES: getEnvVar('FEATURE_REAL_TIME_UPDATES', 'true', false, 'boolean'),
      ADVANCED_ANALYTICS: getEnvVar('FEATURE_ADVANCED_ANALYTICS', 'false', false, 'boolean'),
    },
  },
  
  // Validator services configuration
  VALIDATORS: {
    // National Bank Validator
    NATIONAL_BANK: {
      TYPE: 'LICENSE',
      HOST: getEnvVar('NATIONAL_BANK_HOST', 'localhost'),
      PORT: getEnvVar('NATIONAL_BANK_PORT', '8080', false, 'number'),
      ENDPOINT: getEnvVar('NATIONAL_BANK_ENDPOINT', 'http://localhost:8080'),
      TIMEOUT: getEnvVar('NATIONAL_BANK_TIMEOUT', '30000', false, 'number'),
      VALID_HASHES: getEnvVar('VALID_LICENSE_HASHES', 'a1b2c3d4e5f6789012345,e5f6g7h8901234567890a', false, 'array'),
    },
    
    // Exporter Bank Validator
    EXPORTER_BANK: {
      TYPE: 'INVOICE',
      HOST: getEnvVar('EXPORTER_BANK_HOST', 'localhost'),
      PORT: getEnvVar('EXPORTER_BANK_PORT', '5000', false, 'number'),
      ENDPOINT: getEnvVar('EXPORTER_BANK_ENDPOINT', 'http://localhost:5000'),
      TIMEOUT: getEnvVar('EXPORTER_BANK_TIMEOUT', '30000', false, 'number'),
      VALID_HASHES: getEnvVar('VALID_INVOICE_HASHES', 'x9y8z7w6v5u4t3s2r1q0,w6v5u4t3s2r1q0p9o8n7', false, 'array'),
    },
    
    // Quality Authority Validator
    QUALITY_AUTHORITY: {
      TYPE: 'QUALITY',
      HOST: getEnvVar('QUALITY_AUTHORITY_HOST', 'localhost'),
      PORT: getEnvVar('QUALITY_AUTHORITY_PORT', '8081', false, 'number'),
      ENDPOINT: getEnvVar('QUALITY_AUTHORITY_ENDPOINT', 'http://localhost:8081'),
      TIMEOUT: getEnvVar('QUALITY_AUTHORITY_TIMEOUT', '30000', false, 'number'),
      VALID_HASHES: getEnvVar('VALID_QUALITY_HASHES', 'q1w2e3r4t5y6u7i8o9p0,t5y6u7i8o9p0a1s2d3f4', false, 'array'),
    },
    
    // Customs Validator
    CUSTOMS: {
      TYPE: 'SHIPPING',
      HOST: getEnvVar('CUSTOMS_HOST', 'localhost'),
      PORT: getEnvVar('CUSTOMS_PORT', '8082', false, 'number'),
      ENDPOINT: getEnvVar('CUSTOMS_ENDPOINT', 'http://localhost:8082'),
      TIMEOUT: getEnvVar('CUSTOMS_TIMEOUT', '30000', false, 'number'),
      VALID_HASHES: getEnvVar('VALID_SHIPPING_HASHES', 's1h2i3p4p5i6n7g8d9o0,p5i6n7g8d9o0c1u2m3e4', false, 'array'),
    },
  },
  
  // IPFS configuration
  IPFS: {
    API_HOST: getEnvVar('IPFS_API_HOST', 'localhost'),
    API_PORT: getEnvVar('IPFS_API_PORT', '5001', false, 'number'),
    GATEWAY_HOST: getEnvVar('IPFS_GATEWAY_HOST', 'localhost'),
    GATEWAY_PORT: getEnvVar('IPFS_GATEWAY_PORT', '8080', false, 'number'),
    API_URL: getEnvVar('IPFS_API_URL', 'http://localhost:5001'),
    GATEWAY_URL: getEnvVar('IPFS_GATEWAY_URL', 'http://localhost:8080'),
    TIMEOUT: getEnvVar('IPFS_TIMEOUT', '60000', false, 'number'),
    MAX_FILE_SIZE: getEnvVar('IPFS_MAX_FILE_SIZE', '104857600', false, 'number'), // 100MB
    ENCRYPTION_ENABLED: getEnvVar('IPFS_ENCRYPTION_ENABLED', 'true', false, 'boolean'),
    ENCRYPTION_KEY: getEnvVar('IPFS_ENCRYPTION_KEY', ''),
  },
  
  // Database configuration
  DATABASE: {
    // CouchDB configuration
    COUCHDB: {
      ENABLED: getEnvVar('COUCHDB_ENABLED', 'true', false, 'boolean'),
      USERNAME: getEnvVar('COUCHDB_USERNAME', 'admin'),
      PASSWORD: getEnvVar('COUCHDB_PASSWORD', 'adminpw'),
      ENDPOINTS: {
        NATIONAL_BANK: getEnvVar('COUCHDB_NATIONAL_BANK_URL', 'http://localhost:15984'),
        EXPORTER_BANK: getEnvVar('COUCHDB_EXPORTER_BANK_URL', 'http://localhost:15985'),
        COFFEE_AUTHORITY: getEnvVar('COUCHDB_COFFEE_AUTHORITY_URL', 'http://localhost:15986'),
        CUSTOMS: getEnvVar('COUCHDB_CUSTOMS_URL', 'http://localhost:15987'),
      },
      TIMEOUT: getEnvVar('COUCHDB_TIMEOUT', '30000', false, 'number'),
      MAX_RETRIES: getEnvVar('COUCHDB_MAX_RETRIES', '3', false, 'number'),
    },
  },
  
  // Security configuration
  SECURITY: {
    TLS_ENABLED: getEnvVar('TLS_ENABLED', 'true', false, 'boolean'),
    CERT_PATH: getEnvVar('CERT_PATH', '/etc/ssl/certs'),
    KEY_PATH: getEnvVar('KEY_PATH', '/etc/ssl/private'),
    CA_CERT_PATH: getEnvVar('CA_CERT_PATH', '/etc/ssl/ca'),
    ENCRYPTION_ALGORITHM: getEnvVar('ENCRYPTION_ALGORITHM', 'AES-256-CBC'),
    HASH_ALGORITHM: getEnvVar('HASH_ALGORITHM', 'SHA256'),
    
    // Session configuration
    SESSION: {
      SECRET: getEnvVar('SESSION_SECRET', 'default-session-secret-change-in-production'),
      MAX_AGE: getEnvVar('SESSION_MAX_AGE', '86400000', false, 'number'), // 24 hours
      SECURE: getEnvVar('SESSION_SECURE', 'false', false, 'boolean'),
      HTTP_ONLY: getEnvVar('SESSION_HTTP_ONLY', 'true', false, 'boolean'),
    },
  },
  
  // Monitoring and logging
  MONITORING: {
    HEALTH_CHECK_INTERVAL: getEnvVar('HEALTH_CHECK_INTERVAL', '30000', false, 'number'),
    METRICS_ENABLED: getEnvVar('METRICS_ENABLED', 'true', false, 'boolean'),
    METRICS_PORT: getEnvVar('METRICS_PORT', '9090', false, 'number'),
    
    // Logging configuration
    LOGGING: {
      LEVEL: getEnvVar('LOG_LEVEL', 'info'),
      FORMAT: getEnvVar('LOG_FORMAT', 'combined'),
      ROTATION: getEnvVar('LOG_ROTATION', 'daily'),
      MAX_SIZE: getEnvVar('LOG_MAX_SIZE', '10m'),
      MAX_FILES: getEnvVar('LOG_MAX_FILES', '14', false, 'number'),
      DIRECTORY: getEnvVar('LOG_DIRECTORY', './logs'),
    },
    
    // Performance monitoring
    PERFORMANCE: {
      RESPONSE_TIME_THRESHOLD: getEnvVar('PERF_RESPONSE_TIME_THRESHOLD', '5000', false, 'number'),
      ERROR_RATE_THRESHOLD: getEnvVar('PERF_ERROR_RATE_THRESHOLD', '5', false, 'number'),
      MEMORY_THRESHOLD: getEnvVar('PERF_MEMORY_THRESHOLD', '90', false, 'number'),
      CPU_THRESHOLD: getEnvVar('PERF_CPU_THRESHOLD', '80', false, 'number'),
    },
  },
  
  // Docker and deployment configuration
  DEPLOYMENT: {
    CONTAINER_REGISTRY: getEnvVar('CONTAINER_REGISTRY', 'localhost:5000'),
    IMAGE_TAG: getEnvVar('IMAGE_TAG', 'latest'),
    NAMESPACE: getEnvVar('NAMESPACE', 'coffee-export'),
    REPLICAS: getEnvVar('REPLICAS', '1', false, 'number'),
    
    // Resource limits
    RESOURCES: {
      CPU_LIMIT: getEnvVar('CPU_LIMIT', '1000m'),
      MEMORY_LIMIT: getEnvVar('MEMORY_LIMIT', '512Mi'),
      CPU_REQUEST: getEnvVar('CPU_REQUEST', '100m'),
      MEMORY_REQUEST: getEnvVar('MEMORY_REQUEST', '128Mi'),
    },
  },
};

/**
 * Validate required configuration values
 */
function validateConfig() {
  const errors = [];
  
  // Validate environment
  if (!Object.values(ENVIRONMENTS).includes(SystemConfig.ENVIRONMENT)) {
    errors.push(`Invalid environment: ${SystemConfig.ENVIRONMENT}`);
  }
  
  // Validate ports are not conflicting
  const ports = [
    SystemConfig.API_GATEWAY.PORT,
    SystemConfig.FRONTEND.PORT,
    SystemConfig.VALIDATORS.NATIONAL_BANK.PORT,
    SystemConfig.VALIDATORS.EXPORTER_BANK.PORT,
    SystemConfig.VALIDATORS.QUALITY_AUTHORITY.PORT,
    SystemConfig.VALIDATORS.CUSTOMS.PORT,
  ];
  
  const uniquePorts = new Set(ports);
  if (uniquePorts.size !== ports.length) {
    errors.push('Port conflicts detected in configuration');
  }
  
  // Validate required secrets in production
  if (SystemConfig.ENVIRONMENT === ENVIRONMENTS.PRODUCTION) {
    const requiredSecrets = [
      SystemConfig.API_GATEWAY.AUTH.JWT_SECRET,
      SystemConfig.SECURITY.SESSION.SECRET,
    ];
    
    requiredSecrets.forEach((secret, index) => {
      if (!secret || secret.includes('default') || secret.includes('change')) {
        errors.push(`Production requires secure secrets (index: ${index})`);
      }
    });
  }
  
  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
  }
  
  return true;
}

/**
 * Get configuration for a specific service
 */
function getServiceConfig(serviceName) {
  const serviceConfigs = {
    'api-gateway': {
      host: SystemConfig.API_GATEWAY.HOST,
      port: SystemConfig.API_GATEWAY.PORT,
      cors: SystemConfig.API_GATEWAY.CORS,
      rateLimit: SystemConfig.API_GATEWAY.RATE_LIMIT,
      auth: SystemConfig.API_GATEWAY.AUTH,
    },
    'frontend': {
      host: SystemConfig.FRONTEND.HOST,
      port: SystemConfig.FRONTEND.PORT,
      buildPath: SystemConfig.FRONTEND.BUILD_PATH,
      features: SystemConfig.FRONTEND.FEATURES,
    },
    'national-bank-validator': SystemConfig.VALIDATORS.NATIONAL_BANK,
    'exporter-bank-validator': SystemConfig.VALIDATORS.EXPORTER_BANK,
    'quality-authority-validator': SystemConfig.VALIDATORS.QUALITY_AUTHORITY,
    'customs-validator': SystemConfig.VALIDATORS.CUSTOMS,
  };
  
  return serviceConfigs[serviceName] || {};
}

/**
 * Export configuration object and utility functions
 */
module.exports = {
  SystemConfig,
  ENVIRONMENTS,
  validateConfig,
  getServiceConfig,
  getEnvVar,
  
  // Convenience methods
  isDevelopment: () => SystemConfig.ENVIRONMENT === ENVIRONMENTS.DEVELOPMENT,
  isProduction: () => SystemConfig.ENVIRONMENT === ENVIRONMENTS.PRODUCTION,
  isTest: () => SystemConfig.ENVIRONMENT === ENVIRONMENTS.TEST,
};