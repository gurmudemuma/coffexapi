// Shared constants
export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  EXPORTS: '/api/exports',
  USERS: '/api/users',
  APPROVALS: '/api/approvals',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  OFFLINE_DATA: 'offline_data',
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  MIN_LENGTH: (min: number) => `Minimum ${min} characters required`,
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;