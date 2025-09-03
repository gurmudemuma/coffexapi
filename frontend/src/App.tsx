import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ErrorBoundary } from 'react-error-boundary';

// Providers and Context
import { NotificationProvider } from './contexts/NotificationContext';
// Remove AuthProvider import - using Zustand store instead

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import { LoadingSpinner, ErrorFallback } from './shared/components';

// Lazy-loaded pages for better performance
const LoginPage = React.lazy(() => import('./pages/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const ExporterDashboard = React.lazy(() => import('./pages/ExporterDashboard'));
const BankDashboard = React.lazy(() => import('./pages/BankDashboard'));
const CustomsDashboard = React.lazy(() => import('./pages/CustomsDashboard'));
const QualityDashboard = React.lazy(() => import('./pages/QualityDashboard'));
const NBEDashboard = React.lazy(() => import('./pages/NBEDashboard'));
const ExportManage = React.lazy(() => import('./pages/ExportManage'));
const UserManagement = React.lazy(() => import('./pages/UserManagement'));
const ComplianceAlerts = React.lazy(() => import('./pages/ComplianceAlerts'));
const AuditTrail = React.lazy(() => import('./pages/AuditTrail'));
const ExportForm = React.lazy(() => import('./components/ExportForm'));
const ExportDetails = React.lazy(() => import('./pages/ExportDetails'));
const LicenseManagement = React.lazy(() => import('./pages/LicenseManagement'));
const QualityReports = React.lazy(() => import('./pages/QualityReports'));

// Global CSS
import './index.css';

/**
 * Main Application Component
 * 
 * This is the primary application entry point that provides:
 * - Global providers (Query Client, Error Boundary)
 * - Routing configuration
 * - Loading states and error handling
 * - Theme and notification systems
 */

// ==============================================================================
// Query Client Configuration
// ==============================================================================

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on authentication errors
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as any).status;
          if (status === 401 || status === 403) {
            return false;
          }
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime)
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// ==============================================================================
// Loading Component
// ==============================================================================

const LoadingFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <LoadingSpinner size="lg" text="Loading application..." />
  </div>
);

// ==============================================================================
// Error Boundary Component
// ==============================================================================

interface AppErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const AppErrorFallback: React.FC<AppErrorFallbackProps> = ({ 
  error, 
  resetErrorBoundary 
}) => (
  <ErrorFallback 
    error={error}
    resetErrorBoundary={resetErrorBoundary}
    showDetails={process.env.NODE_ENV === 'development'}
  />
);

// ==============================================================================
// Main App Component
// ==============================================================================

const App: React.FC = () => {
  return (
    <ErrorBoundary
      FallbackComponent={AppErrorFallback}
      onError={(error, errorInfo) => {
        console.error('App Error:', error, errorInfo);
        // In production, send to error reporting service
        if (process.env.NODE_ENV === 'production') {
          // Example: Sentry.captureException(error, { extra: errorInfo });
        }
      }}
    >
      <QueryClientProvider client={queryClient}>
        <Router>
          <NotificationProvider>
            <div className="min-h-screen bg-gray-50">
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  
                  {/* Protected Routes with Layout */}
                  <Route
                    path="/*"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Routes>
                            {/* Dashboard Routes */}
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            
                            {/* Organization-specific Dashboards */}
                            <Route path="/exporter" element={<ExporterDashboard />} />
                            <Route path="/bank" element={<BankDashboard />} />
                            <Route path="/customs" element={<CustomsDashboard />} />
                            <Route path="/quality" element={<QualityDashboard />} />
                            <Route path="/nbe" element={<NBEDashboard />} />
                            
                            {/* Export Management */}
                            <Route path="/exports" element={<ExportForm />} />
                            <Route path="/export/new" element={<ExportForm />} />
                            <Route path="/export/manage" element={<ExportManage />} />
                            <Route path="/exports/:exportId" element={<ExportDetails />} />
                            
                            {/* NBE Routes */}
                            <Route path="/licenses" element={<LicenseManagement />} />
                            
                            {/* Quality Authority Routes */}
                            <Route path="/quality/reports" element={<QualityReports />} />
                            
                            {/* Bank Routes - Fixed to point to specific business logic */}
                            <Route path="/bank/transfers" element={<BankDashboard />} />
                            <Route path="/bank/letters-of-credit" element={<BankDashboard />} />
                            <Route path="/bank/exchange-rates" element={<BankDashboard />} />
                            <Route path="/bank/transactions" element={<BankDashboard />} />
                            
                            {/* Customs Routes - Fixed to point to specific business logic */}
                            <Route path="/customs/shipments" element={<CustomsDashboard />} />
                            <Route path="/customs/clearance" element={<CustomsDashboard />} />
                            
                            {/* Administrative Routes */}
                            <Route path="/users" element={<UserManagement />} />
                            <Route path="/compliance" element={<ComplianceAlerts />} />
                            <Route path="/audit" element={<AuditTrail />} />
                            
                            {/* Fallback for unmatched routes */}
                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                          </Routes>
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Suspense>
            </div>
            
            {/* Global Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'white',
                  color: 'black',
                  border: '1px solid #e5e5e5',
                },
              }}
            />
          </NotificationProvider>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
