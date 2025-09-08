/**
 * RouteErrorBoundary Component
 * 
 * A specialized error boundary for route-level error handling.
 * Provides contextual error messages and recovery options based on the route.
 */

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { AlertTriangle, RefreshCw, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

interface RouteErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const RouteErrorFallback: React.FC<RouteErrorFallbackProps> = ({
  error,
  resetErrorBoundary
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getRouteContext = () => {
    const path = location.pathname;
    
    if (path.includes('/exports')) {
      return {
        title: 'Export Management Error',
        description: 'There was an issue loading the export management interface.',
        suggestions: [
          'Check your internet connection',
          'Verify your export permissions',
          'Try refreshing the page'
        ]
      };
    }
    
    if (path.includes('/dashboard')) {
      return {
        title: 'Dashboard Error',
        description: 'Unable to load the dashboard data.',
        suggestions: [
          'Check if all services are running',
          'Verify your authentication status',
          'Try refreshing the page'
        ]
      };
    }
    
    if (path.includes('/users')) {
      return {
        title: 'User Management Error',
        description: 'There was an issue with the user management system.',
        suggestions: [
          'Check your admin permissions',
          'Verify the user service is available',
          'Try refreshing the page'
        ]
      };
    }
    
    return {
      title: 'Application Error',
      description: 'An unexpected error occurred.',
      suggestions: [
        'Try refreshing the page',
        'Check your internet connection',
        'Contact support if the issue persists'
      ]
    };
  };

  const context = getRouteContext();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-xl text-gray-900">{context.title}</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <p className="text-gray-600 text-center">
            {context.description}
          </p>
          
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Try these steps:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {context.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="text-xs text-gray-500">
              <summary className="cursor-pointer font-medium hover:text-gray-700">
                Error Details (Development)
              </summary>
              <pre className="mt-2 p-3 bg-gray-100 rounded overflow-auto whitespace-pre-wrap break-words">
                {error.message}
                {error.stack && `\n\nStack:\n${error.stack}`}
              </pre>
            </details>
          )}
          
          <div className="flex flex-col gap-2">
            <Button onClick={resetErrorBoundary} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={handleGoBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              
              <Button variant="outline" onClick={handleGoHome}>
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </div>
            
            <Button variant="ghost" onClick={handleRefresh} className="w-full">
              Refresh Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface RouteErrorBoundaryProps {
  children: React.ReactNode;
}

export const RouteErrorBoundary: React.FC<RouteErrorBoundaryProps> = ({
  children
}) => {
  return (
    <ErrorBoundary
      FallbackComponent={RouteErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Route Error:', error, errorInfo);
        
        // In production, send to error reporting service
        if (process.env.NODE_ENV === 'production') {
          // Example: Sentry.captureException(error, { extra: errorInfo });
        }
      }}
      onReset={() => {
        // Clear any error-related state
        window.location.reload();
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default RouteErrorBoundary;