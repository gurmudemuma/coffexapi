import type { User, UserRole } from './api';

/**
 * Authentication State Types
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextValue extends AuthState {
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

/**
 * Permission Types
 */
export const PERMISSIONS = {
  // Export permissions
  CREATE_EXPORT: 'export:create',
  VIEW_EXPORT: 'export:view',
  UPDATE_EXPORT: 'export:update',
  DELETE_EXPORT: 'export:delete',
  
  // Validation permissions
  VALIDATE_EXPORT: 'export:validate',
  VIEW_VALIDATION: 'validation:view',
  
  // User management permissions
  CREATE_USER: 'user:create',
  VIEW_USER: 'user:view',
  UPDATE_USER: 'user:update',
  DELETE_USER: 'user:delete',
  
  // Admin permissions
  VIEW_AUDIT: 'audit:view',
  MANAGE_SYSTEM: 'system:manage',
  VIEW_ANALYTICS: 'analytics:view',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

/**
 * Role-based Access Control
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: Object.values(PERMISSIONS),
  exporter: [
    PERMISSIONS.CREATE_EXPORT,
    PERMISSIONS.VIEW_EXPORT,
    PERMISSIONS.UPDATE_EXPORT,
  ],
  bank: [
    PERMISSIONS.VIEW_EXPORT,
    PERMISSIONS.VALIDATE_EXPORT,
    PERMISSIONS.VIEW_VALIDATION,
  ],
  customs: [
    PERMISSIONS.VIEW_EXPORT,
    PERMISSIONS.VALIDATE_EXPORT,
    PERMISSIONS.VIEW_VALIDATION,
  ],
  quality: [
    PERMISSIONS.VIEW_EXPORT,
    PERMISSIONS.VALIDATE_EXPORT,
    PERMISSIONS.VIEW_VALIDATION,
  ],
  nbe: [
    PERMISSIONS.VIEW_EXPORT,
    PERMISSIONS.VALIDATE_EXPORT,
    PERMISSIONS.VIEW_VALIDATION,
    PERMISSIONS.VIEW_ANALYTICS,
  ],
};

/**
 * Session Types
 */
export interface SessionInfo {
  userId: string;
  email: string;
  role: UserRole;
  organization: string;
  permissions: Permission[];
  loginAt: string;
  expiresAt: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface SessionStorage {
  token: string;
  refreshToken: string;
  user: User;
  expiresAt: number;
}

/**
 * Authentication Events
 */
export type AuthEvent = 
  | 'login'
  | 'logout'
  | 'token_refresh'
  | 'session_expired'
  | 'unauthorized_access';

export interface AuthEventData {
  event: AuthEvent;
  timestamp: string;
  userId?: string;
  metadata?: Record<string, any>;
}