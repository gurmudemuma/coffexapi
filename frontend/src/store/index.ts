/**
 * Centralized State Management Store
 * 
 * This module provides a unified state management solution using Zustand
 * for the Coffee Export Platform frontend.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import { 
  logSuccessfulLogin, 
  logFailedLogin, 
  logLogout 
} from '../utils/auditLogger';

// ==============================================================================
// Type Definitions
// ==============================================================================

export interface User {
  id: string;
  name: string;
  role: string;
  organization: string;
  permissions: string[];
  email?: string;
  lastLogin?: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginAttempts: number;
  lastActivity: number;
}

export interface ExportDocument {
  id: string;
  type: 'LICENSE' | 'INVOICE' | 'QUALITY' | 'SHIPPING';
  file: File | null;
  metadata: {
    name: string;
    hash: string;
    size: number;
    uploadedAt: number;
    ipfsCid?: string;
    encrypted: boolean;
  };
  validationStatus: 'PENDING' | 'VALID' | 'INVALID' | 'PROCESSING';
  validationResult?: {
    valid: boolean;
    reasons: string[];
    validatedBy: string;
    timestamp: number;
  };
}

export interface ExportRequest {
  id: string;
  exporterId: string;
  documents: Record<string, ExportDocument>;
  status: 'DRAFT' | 'SUBMITTED' | 'VALIDATING' | 'APPROVED' | 'REJECTED' | 'PAYMENT_RELEASED';
  submittedAt?: number;
  approvedAt?: number;
  rejectedAt?: number;
  tradeDetails: {
    productType: string;
    quantity: number;
    unitPrice: number;
    totalValue: number;
    currency: string;
    destination: string;
    contractNumber: string;
  };
  validationSummary: {
    totalValidations: number;
    completedValidations: number;
    passedValidations: number;
    failedValidations: number;
  };
}

export interface SystemStatus {
  apiGateway: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  blockchain: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  ipfs: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  validators: Record<string, 'ONLINE' | 'OFFLINE' | 'DEGRADED'>;
  lastChecked: number;
}

export interface NotificationItem {
  id: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

export interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  currentPage: string;
  isOffline: boolean;
  loading: Record<string, boolean>;
  error: Record<string, string | null>;
}

// ==============================================================================
// Store Definition
// ==============================================================================

interface AppStore {
  // Auth State
  auth: AuthState;
  setAuth: (auth: Partial<AuthState>) => void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateLastActivity: () => void;
  
  // Export Management
  exports: Record<string, ExportRequest>;
  currentExport: ExportRequest | null;
  setCurrentExport: (exportRequest: ExportRequest | null) => void;
  addExport: (exportRequest: ExportRequest) => void;
  updateExport: (id: string, updates: Partial<ExportRequest>) => void;
  removeExport: (id: string) => void;
  
  // Document Management
  addDocument: (exportId: string, document: ExportDocument) => void;
  updateDocument: (exportId: string, documentId: string, updates: Partial<ExportDocument>) => void;
  removeDocument: (exportId: string, documentId: string) => void;
  
  // System Status
  systemStatus: SystemStatus;
  updateSystemStatus: (status: Partial<SystemStatus>) => void;
  
  // Notifications
  notifications: NotificationItem[];
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp'>) => void;
  markNotificationRead: (id: string) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  
  // UI State
  ui: UIState;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  setCurrentPage: (page: string) => void;
  setOfflineStatus: (isOffline: boolean) => void;
  setLoading: (key: string, loading: boolean) => void;
  setError: (key: string, error: string | null) => void;
  
  // Actions
  resetStore: () => void;
}

// ==============================================================================
// Initial State
// ==============================================================================

const initialState = {
  auth: {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    loginAttempts: 0,
    lastActivity: Date.now(),
  } as AuthState,
  
  exports: {} as Record<string, ExportRequest>,
  currentExport: null as ExportRequest | null,
  
  systemStatus: {
    apiGateway: 'ONLINE',
    blockchain: 'ONLINE',
    ipfs: 'ONLINE',
    validators: {
      'NATIONAL_BANK': 'ONLINE',
      'EXPORTER_BANK': 'ONLINE',
      'QUALITY_AUTHORITY': 'ONLINE',
      'CUSTOMS': 'ONLINE',
    },
    lastChecked: Date.now(),
  } as SystemStatus,
  
  notifications: [] as NotificationItem[],
  
  ui: {
    theme: 'system',
    sidebarOpen: true,
    currentPage: 'dashboard',
    isOffline: false,
    loading: {},
    error: {},
  } as UIState,
};

// ==============================================================================
// Store Implementation
// ==============================================================================

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,
        
        // Auth Actions
        setAuth: (auth) => {
          set((state) => {
            Object.assign(state.auth, auth);
          });
        },
        
        login: async (username: string, password: string) => {
          set((state) => {
            state.auth.isLoading = true;
            state.auth.loginAttempts += 1;
          });
          
          try {
            // Mock login implementation - replace with actual API call
            const response = await mockLogin(username, password);
            
            set((state) => {
              state.auth.user = response.user;
              state.auth.token = response.token;
              state.auth.isAuthenticated = true;
              state.auth.isLoading = false;
              state.auth.lastActivity = Date.now();
            });
            
            // Log successful login
            logSuccessfulLogin(
              response.user.id,
              response.user.name,
              response.user.role,
              response.user.organization
            );
            
            // Set axios default header
            if (typeof window !== 'undefined') {
              localStorage.setItem('authToken', response.token);
            }
            
          } catch (error) {
            // Log failed login
            logFailedLogin(username, (error as Error).message);
            
            set((state) => {
              state.auth.isLoading = false;
            });
            throw error;
          }
        },
        
        logout: () => {
          // Get current user before clearing state
          const currentUser = get().auth.user;
          
          set((state) => {
            state.auth.user = null;
            state.auth.token = null;
            state.auth.isAuthenticated = false;
            state.auth.loginAttempts = 0;
            state.auth.lastActivity = Date.now();
          });
          
          // Log logout if user was authenticated
          if (currentUser) {
            logLogout(
              currentUser.id,
              currentUser.name,
              currentUser.role,
              currentUser.organization
            );
          }
          
          // Clear localStorage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
          }
        },
        
        updateLastActivity: () => {
          set((state) => {
            state.auth.lastActivity = Date.now();
          });
        },
        
        // Export Management
        setCurrentExport: (exportRequest) => {
          set((state) => {
            state.currentExport = exportRequest;
          });
        },
        
        addExport: (exportRequest) => {
          set((state) => {
            state.exports[exportRequest.id] = exportRequest;
          });
        },
        
        updateExport: (id, updates) => {
          set((state) => {
            if (state.exports[id]) {
              Object.assign(state.exports[id], updates);
            }
            if (state.currentExport?.id === id) {
              Object.assign(state.currentExport, updates);
            }
          });
        },
        
        removeExport: (id) => {
          set((state) => {
            delete state.exports[id];
            if (state.currentExport?.id === id) {
              state.currentExport = null;
            }
          });
        },
        
        // Document Management
        addDocument: (exportId, document) => {
          set((state) => {
            if (state.exports[exportId]) {
              state.exports[exportId].documents[document.id] = document;
            }
            if (state.currentExport?.id === exportId) {
              state.currentExport.documents[document.id] = document;
            }
          });
        },
        
        updateDocument: (exportId, documentId, updates) => {
          set((state) => {
            if (state.exports[exportId]?.documents[documentId]) {
              Object.assign(state.exports[exportId].documents[documentId], updates);
            }
            if (state.currentExport?.id === exportId && state.currentExport.documents[documentId]) {
              Object.assign(state.currentExport.documents[documentId], updates);
            }
          });
        },
        
        removeDocument: (exportId, documentId) => {
          set((state) => {
            if (state.exports[exportId]) {
              delete state.exports[exportId].documents[documentId];
            }
            if (state.currentExport?.id === exportId) {
              delete state.currentExport.documents[documentId];
            }
          });
        },
        
        // System Status
        updateSystemStatus: (status) => {
          set((state) => {
            Object.assign(state.systemStatus, status);
            state.systemStatus.lastChecked = Date.now();
          });
        },
        
        // Notifications
        addNotification: (notification) => {
          const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          set((state) => {
            state.notifications.unshift({
              ...notification,
              id,
              timestamp: Date.now(),
              read: false,
            });
            
            // Keep only last 100 notifications
            if (state.notifications.length > 100) {
              state.notifications = state.notifications.slice(0, 100);
            }
          });
        },
        
        markNotificationRead: (id) => {
          set((state) => {
            const notification = state.notifications.find(n => n.id === id);
            if (notification) {
              notification.read = true;
            }
          });
        },
        
        removeNotification: (id) => {
          set((state) => {
            state.notifications = state.notifications.filter(n => n.id !== id);
          });
        },
        
        clearAllNotifications: () => {
          set((state) => {
            state.notifications = [];
          });
        },
        
        // UI State
        setTheme: (theme) => {
          set((state) => {
            state.ui.theme = theme;
          });
        },
        
        toggleSidebar: () => {
          set((state) => {
            state.ui.sidebarOpen = !state.ui.sidebarOpen;
          });
        },
        
        setCurrentPage: (page) => {
          set((state) => {
            state.ui.currentPage = page;
          });
        },
        
        setOfflineStatus: (isOffline) => {
          set((state) => {
            state.ui.isOffline = isOffline;
          });
        },
        
        setLoading: (key, loading) => {
          set((state) => {
            state.ui.loading[key] = loading;
          });
        },
        
        setError: (key, error) => {
          set((state) => {
            state.ui.error[key] = error;
          });
        },
        
        // Reset Store
        resetStore: () => {
          set(initialState);
        },
      })),
      {        name: 'coffee-export-store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          auth: {
            user: state.auth.user,
            token: state.auth.token,
            isAuthenticated: state.auth.isAuthenticated,
          },
          ui: {
            theme: state.ui.theme,
            sidebarOpen: state.ui.sidebarOpen,
          },
        }),
        merge: (persistedState, currentState) => {
          // Ensure we merge with default values if persisted state is incomplete
          const typedPersistedState = persistedState as Partial<{ 
            auth: Partial<AuthState>; 
            ui: Partial<UIState>; 
          }> | undefined;
          
          if (!typedPersistedState) {
            return currentState;
          }
          
          return {
            ...currentState,
            auth: {
              ...currentState.auth,
              ...typedPersistedState.auth,
            },
            ui: {
              ...currentState.ui,
              ...typedPersistedState.ui,
            },
          };
        },
      }
    ),
    {
      name: 'coffee-export-store',
    }
  )
);

// ==============================================================================
// Utility Functions and Hooks
// ==============================================================================

// Utility function to safely get store state
export const getStoreState = () => {
  try {
    return useAppStore.getState();
  } catch (error) {
    console.warn('Store not initialized, returning default state');
    return initialState;
  }
};

// Utility function to safely check if store is ready
export const isStoreReady = () => {
  try {
    const state = useAppStore.getState();
    return state && state.ui && typeof state.ui.theme === 'string';
  } catch (error) {
    return false;
  }
};

// Mock login function - replace with actual API integration
const mockLogin = async (username: string, password: string): Promise<{ user: User; token: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const mockUsers: Record<string, { password: string; user: User }> = {
    'nbe': {
      password: 'password',
      user: {
        id: 'nbe-admin-001',
        name: 'NBE Officer',
        role: 'NBE_ADMIN',
        organization: 'The Mint',
        permissions: [
          'license:create', 'license:read', 'license:update', 'license:delete',
          'declaration:read', 'declaration:approve', 'declaration:reject',
          'compliance:screen', 'compliance:override', 'compliance:freeze',
          'regulatory:all', 'audit:read', 'user:manage'
        ],
        email: 'admin@nbe.gov.et',
        lastLogin: Date.now(),
      }
    },
    'customs': {
      password: 'password',
      user: {
        id: 'customs-val-001',
        name: 'Customs Officer',
        role: 'CUSTOMS_VALIDATOR',
        organization: 'Customs Authority',
        permissions: [
          'shipping:validate', 'document:review', 'customs:approve', 'audit:read'
        ],
        email: 'validator@customs.gov.et',
        lastLogin: Date.now(),
      }
    },
    'quality': {
      password: 'password',
      user: {
        id: 'quality-ins-001',
        name: 'Quality Inspector',
        role: 'QUALITY_INSPECTOR',
        organization: 'Coffee Quality Authority',
        permissions: [
          'quality:inspect', 'certificate:issue', 'quality:approve', 'audit:read'
        ],
        email: 'inspector@coffeequality.gov.et',
        lastLogin: Date.now(),
      }
    },
    'bank': {
      password: 'password',
      user: {
        id: 'bank-val-001',
        name: 'Bank Officer',
        role: 'BANK_VALIDATOR',
        organization: 'Commercial Bank of Ethiopia',
        permissions: [
          'invoice:validate', 'payment:process', 'bank:approve', 'audit:read'
        ],
        email: 'validator@exporterbank.com',
        lastLogin: Date.now(),
      }
    },
    'exporter': {
      password: 'password',
      user: {
        id: 'exporter-001',
        name: 'Coffee Exporter',
        role: 'EXPORTER',
        organization: 'Coffee Exporters Association',
        permissions: [
          'export:create', 'export:read', 'export:update', 'export:submit',
          'document:upload', 'document:read', 'payment:request', 'audit:read'
        ],
        email: 'exporter@coffeeexporters.com',
        lastLogin: Date.now(),
      }
    }
  };

  const userCredentials = mockUsers[username];
  
  if (!userCredentials || userCredentials.password !== password) {
    throw new Error('Invalid credentials');
  }

  return {
    token: `mock.jwt.token.${Date.now()}`,
    user: userCredentials.user
  };
};

// Selector hooks for specific state slices
export const useAuth = () => useAppStore((state) => state.auth);
export const useAuthActions = () => useAppStore((state) => ({
  login: state.login,
  logout: state.logout,
  updateLastActivity: state.updateLastActivity,
}));

export const useExports = () => useAppStore((state) => state.exports);
export const useCurrentExport = () => useAppStore((state) => state.currentExport);
export const useExportActions = () => useAppStore((state) => ({
  setCurrentExport: state.setCurrentExport,
  addExport: state.addExport,
  updateExport: state.updateExport,
  removeExport: state.removeExport,
  addDocument: state.addDocument,
  updateDocument: state.updateDocument,
  removeDocument: state.removeDocument,
}));

export const useSystemStatus = () => useAppStore((state) => state.systemStatus);
export const useSystemActions = () => useAppStore((state) => ({
  updateSystemStatus: state.updateSystemStatus,
}));

export const useNotifications = () => useAppStore((state) => state.notifications);
export const useNotificationActions = () => useAppStore((state) => ({
  addNotification: state.addNotification,
  markNotificationRead: state.markNotificationRead,
  removeNotification: state.removeNotification,
  clearAllNotifications: state.clearAllNotifications,
}));

export const useUI = () => useAppStore((state) => state.ui);
export const useUIActions = () => useAppStore((state) => ({
  setTheme: state.setTheme,
  toggleSidebar: state.toggleSidebar,
  setCurrentPage: state.setCurrentPage,
  setOfflineStatus: state.setOfflineStatus,
  setLoading: state.setLoading,
  setError: state.setError,
}));

