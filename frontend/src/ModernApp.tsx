/**
 * Modern App Component
 * 
 * This is the modernized main application component that integrates
 * the new state management system and standardized components.
 */

import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'sonner';
import { ErrorBoundary } from 'react-error-boundary';
import { Box, Alert as MuiAlert, Typography } from '@mui/material';

// State Management
import { 
  useAuth, 
  useAuthActions, 
  useUIActions, 
  useSystemActions,
  useNotificationActions,
  useAppStore,
  isStoreReady
} from './store';

// Store Initialization Component
const StoreInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = React.useState(false);
  
  React.useEffect(() => {
    // Wait for the store to be properly initialized
    const checkStore = () => {
      if (isStoreReady()) {
        setIsReady(true);
      } else {
        // If store is not ready, retry in a short time
        setTimeout(checkStore, 10);
      }
    };
    
    checkStore();
  }, []);
  
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing application...</p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};

// Layout and Components
import ModernLayout from './components/layout/ModernLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { Spinner, Alert, AlertDescription, Card, CardContent } from './components/ui/StandardComponents';
import { Button } from './components/ui/StandardComponents';

// Page Components (lazy loaded for better performance)
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Login = React.lazy(() => import('./pages/Login'));
const ExportForm = React.lazy(() => import('./components/ExportForm'));
const UserManagement = React.lazy(() => import('./pages/UserManagement'));
const ComplianceAlerts = React.lazy(() => import('./pages/ComplianceAlerts'));
const AuditTrail = React.lazy(() => import('./pages/AuditTrail'));

// Organization-specific dashboards
const NBEDashboard = React.lazy(() => import('./pages/NBEDashboard'));
const CustomsDashboard = React.lazy(() => import('./pages/CustomsDashboard'));
const QualityDashboard = React.lazy(() => import('./pages/QualityDashboard'));
const BankDashboard = React.lazy(() => import('./pages/BankDashboard'));
const ExporterDashboard = React.lazy(() => import('./pages/ExporterDashboard'));
const ExportManage = React.lazy(() => import('./pages/ExportManage'));

// ==============================================================================
// Query Client Configuration
// ==============================================================================

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 401/403 errors
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as any).status;
          if (status === 401 || status === 403) return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: false,
    },
  },
});

// ==============================================================================
// Error Fallback Component
// ==============================================================================

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="max-w-md w-full">
        <CardContent className="p-6 text-center">
          <div className="text-red-500 mb-4">
            <svg 
              className="mx-auto h-12 w-12" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
          
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </h2>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          
          <details className="text-xs text-gray-500 mb-4 text-left">
            <summary className="cursor-pointer font-medium">Error details</summary>
            <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-auto">
              {error.message}
            </pre>
          </details>
          
          <div className="space-y-2">
            <Button onClick={resetErrorBoundary} className="w-full">
              Try again
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()} 
              className="w-full"
            >
              Refresh page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ==============================================================================
// Loading Component
// ==============================================================================

const LoadingFallback: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <Spinner size="lg" text={message} />
      </div>
    </div>
  );
};

// ==============================================================================
// System Health Monitor
// ==============================================================================

const SystemHealthMonitor: React.FC = () => {
  const { updateSystemStatus } = useSystemActions();
  const { addNotification } = useNotificationActions();
  const { setOfflineStatus } = useUIActions();
  
  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => {
      setOfflineStatus(false);
      addNotification({
        type: 'SUCCESS',
        title: 'Connection Restored',
        message: 'You are back online.',
        read: false,
      });
    };
    
    const handleOffline = () => {
      setOfflineStatus(true);
      addNotification({
        type: 'WARNING',
        title: 'Connection Lost',
        message: 'You are currently offline. Some features may not be available.',
        read: false,
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Initial status check
    setOfflineStatus(!navigator.onLine);
    
    // Periodic system health check
    const healthCheckInterval = setInterval(async () => {
      try {
        // Check API Gateway health
        const response = await fetch('/api/health', { 
          method: 'GET',
          cache: 'no-cache' 
        });
        
        if (response.ok) {
          const healthData = await response.json();
          updateSystemStatus({
            apiGateway: 'ONLINE',
            // Update other system status based on health check response
            ...healthData,
          });
        } else {
          updateSystemStatus({
            apiGateway: 'DEGRADED',
          });
        }
      } catch (error) {
        updateSystemStatus({
          apiGateway: 'OFFLINE',
        });
      }
    }, 30000); // Check every 30 seconds
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(healthCheckInterval);
    };
  }, [updateSystemStatus, addNotification, setOfflineStatus]);
  
  return null;
};

// ==============================================================================
// Authentication Guard
// ==============================================================================

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { updateLastActivity } = useAuthActions();
  
  useEffect(() => {
    // Update last activity on user interactions
    const handleActivity = () => {
      if (isAuthenticated) {
        updateLastActivity();
      }
    };
    
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });
    
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [isAuthenticated, updateLastActivity]);
  
  if (isLoading) {
    return <LoadingFallback message="Authenticating..." />;
  }
  
  return <>{children}</>;
};

// ==============================================================================
// Organization Router Component
// ==============================================================================

const OrganizationRouter: React.FC = () => {
  const { user } = useAuth();
  
  // Route to organization-specific dashboard based on user role and organization
  const getOrganizationDashboard = () => {
    if (!user) return <Navigate to="/login" replace />;
    
    // Validate user has access to their organization's dashboard
    const organizationDashboardMap: Record<string, { roles: string[], component: React.ReactElement }> = {
      'The Mint': {
        roles: ['NBE_ADMIN', 'NBE_OFFICER'],
        component: <NBEDashboard />
      },
      'Customs Authority': {
        roles: ['CUSTOMS_VALIDATOR'],
        component: <CustomsDashboard />
      },
      'Coffee Quality Authority': {
        roles: ['QUALITY_INSPECTOR'],
        component: <QualityDashboard />
      },
      'Exporter Bank': {
        roles: ['BANK_VALIDATOR'],
        component: <BankDashboard />
      },
      'Commercial Bank of Ethiopia': {
        roles: ['BANK_VALIDATOR'],
        component: <BankDashboard />
      },
      'Coffee Exporters Association': {
        roles: ['EXPORTER'],
        component: <ExporterDashboard />
      }
    };
    
    const organizationConfig = organizationDashboardMap[user.organization];
    
    // Check if user's organization is recognized
    if (!organizationConfig) {
      console.warn(`Unrecognized organization: ${user.organization}`);
      return <Dashboard />; // Fallback to general dashboard
    }
    
    // Check if user's role is allowed for their organization
    if (!organizationConfig.roles.includes(user.role)) {
      console.warn(`User ${user.name} (${user.role}) attempted to access ${user.organization} dashboard`);
      return (
        <Box sx={{ p: 3 }}>
          <MuiAlert severity="error">
            <Typography variant="h6" gutterBottom>
              Access Denied
            </Typography>
            <Typography variant="body1">
              Your role ({user.role}) is not authorized to access the {user.organization} dashboard.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Allowed roles: {organizationConfig.roles.join(', ')}
            </Typography>
          </MuiAlert>
        </Box>
      );
    }
    
    return organizationConfig.component;
  };
  
  return getOrganizationDashboard();
};

// ==============================================================================
// Main App Component
// ==============================================================================

const ModernApp: React.FC = () => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Application error:', error, errorInfo);
        // Here you could send error reports to a monitoring service
      }}
    >
      <QueryClientProvider client={queryClient}>
        <Router>
          <StoreInitializer>
            <AuthGuard>
              <SystemHealthMonitor />
              
              <ModernLayout>
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    {/* Public Routes */}
                    <Route 
                      path="/login" 
                      element={
                        <Suspense fallback={<Spinner />}>
                          <Login />
                        </Suspense>
                      } 
                    />
                  
                  {/* Export Form (Public Access) */}
                  <Route 
                    path="/export" 
                    element={
                      <Suspense fallback={<Spinner />}>
                        <ExportForm />
                      </Suspense>
                    } 
                  />
                  
                  {/* Protected Routes */}
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <Suspense fallback={<Spinner />}>
                          <Dashboard />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Organization-Specific Dashboard Routes */}
                  <Route 
                    path="/nbe-dashboard" 
                    element={
                      <ProtectedRoute 
                        allowedOrganizations={['The Mint']}
                        allowedRoles={['NBE_ADMIN', 'NBE_OFFICER']}
                      >
                        <Suspense fallback={<Spinner />}>
                          <NBEDashboard />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/customs-dashboard" 
                    element={
                      <ProtectedRoute 
                        allowedOrganizations={['Customs Authority']}
                        allowedRoles={['CUSTOMS_VALIDATOR']}
                      >
                        <Suspense fallback={<Spinner />}>
                          <CustomsDashboard />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/quality-dashboard" 
                    element={
                      <ProtectedRoute 
                        allowedOrganizations={['Coffee Quality Authority']}
                        allowedRoles={['QUALITY_INSPECTOR']}
                      >
                        <Suspense fallback={<Spinner />}>
                          <QualityDashboard />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/bank-dashboard" 
                    element={
                      <ProtectedRoute 
                        allowedOrganizations={['Exporter Bank', 'Commercial Bank of Ethiopia']}
                        allowedRoles={['BANK_VALIDATOR']}
                      >
                        <Suspense fallback={<Spinner />}>
                          <BankDashboard />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/exporter-dashboard" 
                    element={
                      <ProtectedRoute 
                        allowedOrganizations={['Coffee Exporters Association']}
                        allowedRoles={['EXPORTER']}
                      >
                        <Suspense fallback={<Spinner />}>
                          <ExporterDashboard />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/org-dashboard" 
                    element={
                      <ProtectedRoute>
                        <Suspense fallback={<Spinner />}>
                          <OrganizationRouter />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/exports" 
                    element={
                      <ProtectedRoute>
                        <Suspense fallback={<Spinner />}>
                          <ExportForm />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Exporter-specific routes */}
                  <Route 
                    path="/export/new" 
                    element={
                      <ProtectedRoute 
                        allowedOrganizations={['Coffee Exporters Association']}
                        allowedRoles={['EXPORTER']}
                      >
                        <Suspense fallback={<Spinner />}>
                          <ExportForm />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/export/manage" 
                    element={
                      <ProtectedRoute 
                        allowedOrganizations={['Coffee Exporters Association']}
                        allowedRoles={['EXPORTER']}
                      >
                        <Suspense fallback={<Spinner />}>
                          <ExportManage />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/documents" 
                    element={
                      <ProtectedRoute 
                        allowedOrganizations={['Coffee Exporters Association']}
                        allowedRoles={['EXPORTER']}
                      >
                        <Suspense fallback={<Spinner />}>
                          <ExporterDashboard />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Admin Routes - Only NBE */}
                  <Route 
                    path="/users" 
                    element={
                      <ProtectedRoute 
                        requiredPermissions={['user:manage']}
                        allowedOrganizations={['The Mint']}
                        allowedRoles={['NBE_ADMIN']}
                      >
                        <Suspense fallback={<Spinner />}>
                          <UserManagement />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/compliance" 
                    element={
                      <ProtectedRoute 
                        requiredPermissions={['compliance:screen']}
                        allowedOrganizations={['The Mint']}
                      >
                        <Suspense fallback={<Spinner />}>
                          <ComplianceAlerts />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/audit" 
                    element={
                      <ProtectedRoute requiredPermissions={['audit:read']}>
                        <Suspense fallback={<Spinner />}>
                          <AuditTrail />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Profile Route */}
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <Suspense fallback={<Spinner />}>
                          <Dashboard />
                        </Suspense>
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Default Routes */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route 
                    path="*" 
                    element={
                      <div className="p-4">
                        <MuiAlert severity="warning">
                          <Typography variant="body1">
                            Page not found. Please check the URL and try again.
                          </Typography>
                        </MuiAlert>
                      </div>
                    } 
                  />
                </Routes>
              </Suspense>
            </ModernLayout>
            
            {/* Toast Notifications */}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 5000,
                style: {
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                },
              }}
            />
          </AuthGuard>
        </StoreInitializer>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default ModernApp;