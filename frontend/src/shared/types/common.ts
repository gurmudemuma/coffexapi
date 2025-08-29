/**
 * Common API Response Types
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Common Entity Types
 */
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditableEntity extends BaseEntity {
  createdBy: string;
  updatedBy?: string;
}

/**
 * Common UI Types
 */
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TableColumn<T = any> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, record: T) => React.ReactNode;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

/**
 * Form Types
 */
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'file' | 'checkbox';
  required?: boolean;
  placeholder?: string;
  options?: SelectOption[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | null;
  };
}

export interface FormError {
  field: string;
  message: string;
}

/**
 * Navigation Types
 */
export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ComponentType<any>;
  badge?: string | number;
  children?: NavItem[];
  permissions?: string[];
}

/**
 * Notification Types
 */
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  variant?: 'primary' | 'secondary';
}

/**
 * Component Prop Types
 */
export interface ComponentWithChildren {
  children: React.ReactNode;
}

export interface ComponentWithClassName {
  className?: string;
}

export interface ComponentWithTestId {
  'data-testid'?: string;
}

export type BaseComponentProps = ComponentWithChildren & 
  ComponentWithClassName & 
  ComponentWithTestId;