import type { BaseEntity, ApiResponse, PaginatedResponse } from './common';

/**
 * API Request Types
 */
export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organization: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  organization?: string;
  isActive?: boolean;
}

/**
 * API Response Types
 */
export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
  expiresIn: number;
}

export interface RefreshTokenResponse {
  token: string;
  expiresIn: number;
}

/**
 * User Management Types
 */
export type UserRole = 'admin' | 'exporter' | 'bank' | 'customs' | 'quality' | 'nbe';

export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organization: string;
  status: UserStatus;
  lastLoginAt?: string;
  permissions: string[];
}

/**
 * Export-related API Types
 */
export interface CreateExportRequest {
  exporterDetails: ExporterDetails;
  tradeDetails: TradeDetails;
  documents: DocumentUpload[];
}

export interface UpdateExportRequest {
  exporterDetails?: Partial<ExporterDetails>;
  tradeDetails?: Partial<TradeDetails>;
  status?: ExportStatus;
}

export interface DocumentUpload {
  type: DocumentType;
  file: File;
  metadata?: Record<string, any>;
}

export interface ExportListQuery {
  page?: number;
  limit?: number;
  status?: ExportStatus;
  exporterId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

/**
 * Validation API Types
 */
export interface SubmitValidationRequest {
  exportId: string;
  decision: ValidationDecision;
  comments?: string;
  attachments?: File[];
}

export type ValidationDecision = 'approve' | 'reject' | 'request_changes';

export interface ValidationResponse extends BaseEntity {
  exportId: string;
  validatorId: string;
  validatorType: string;
  decision: ValidationDecision;
  comments?: string;
  attachments: string[];
}

/**
 * Analytics API Types
 */
export interface DashboardStats {
  totalExports: number;
  pendingValidation: number;
  approvedToday: number;
  rejectedToday: number;
  averageProcessingTime: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'export_submitted' | 'validation_completed' | 'payment_released';
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

/**
 * Audit API Types
 */
export interface AuditLogQuery {
  page?: number;
  limit?: number;
  userId?: string;
  action?: string;
  dateFrom?: string;
  dateTo?: string;
  resourceType?: string;
  resourceId?: string;
}

export interface AuditLogEntry extends BaseEntity {
  userId: string;
  userEmail: string;
  action: string;
  resourceType: string;
  resourceId: string;
  changes?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
}

/**
 * Re-export types from other modules
 */
export type { 
  ExportStatus, 
  ExportRequest, 
  ExporterDetails, 
  TradeDetails, 
  DocumentType 
} from '../types/export';