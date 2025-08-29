import type { BaseEntity } from './common';
import type { UserRole, UserStatus } from './api';

/**
 * User Profile Types
 */
export interface UserProfile extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organization: string;
  status: UserStatus;
  avatar?: string;
  phone?: string;
  department?: string;
  title?: string;
  lastLoginAt?: string;
  permissions: string[];
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationPreferences;
  dashboard: DashboardPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  browser: boolean;
  sms: boolean;
  exportUpdates: boolean;
  validationAlerts: boolean;
  systemAlerts: boolean;
}

export interface DashboardPreferences {
  defaultView: 'grid' | 'list';
  itemsPerPage: number;
  showWelcome: boolean;
  widgets: string[];
}

/**
 * User Activity Types
 */
export interface UserActivity extends BaseEntity {
  userId: string;
  action: UserAction;
  description: string;
  ipAddress: string;
  userAgent: string;
  metadata?: Record<string, any>;
}

export type UserAction = 
  | 'login'
  | 'logout'
  | 'profile_update'
  | 'password_change'
  | 'export_create'
  | 'export_update'
  | 'validation_submit'
  | 'document_upload'
  | 'document_download';

/**
 * User Management Types
 */
export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organization: string;
  permissions?: string[];
  sendWelcomeEmail?: boolean;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  organization?: string;
  status?: UserStatus;
  permissions?: string[];
  phone?: string;
  department?: string;
  title?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface SetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

/**
 * User Statistics
 */
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  usersByRole: Record<UserRole, number>;
  usersByOrganization: Record<string, number>;
  usersByStatus: Record<UserStatus, number>;
}

export interface UserSessionInfo {
  id: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  loginAt: string;
  lastActivityAt: string;
  isActive: boolean;
}