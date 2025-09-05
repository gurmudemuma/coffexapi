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
 * Export-related Types
 */
export type ExportStatus = 'DRAFT' | 'SUBMITTED' | 'VALIDATING' | 'APPROVED' | 'REJECTED' | 'PAYMENT_RELEASED';

export type DocumentType = 'license' | 'invoice' | 'qualityCert' | 'other';

export interface ExporterDetails {
  companyName: string;
  registrationNumber: string;
  taxId: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface TradeDetails {
  productName: string;
  productDescription: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalValue: number;
  currency: string;
  countryOfOrigin: string;
  destinationCountry: string;
  incoterms: string;
  shippingDate: string;
  expectedDeliveryDate: string;
  paymentTerms: string;
  paymentMethod: string;
  specialInstructions?: string;
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
// Removed the problematic re-export