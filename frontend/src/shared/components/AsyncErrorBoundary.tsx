/**
 * AsyncErrorBoundary Component
 * 
 * A specialized error boundary for handling async operations and promise rejections.
 * Automatically catches unhandled promise rejections and provides recovery options.
 */

import React, { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { AlertTriangle, RefreshCw, Bug } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

interface AsyncErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const AsyncErrorFallback: React.FC<AsyncErrorFallbackProps> = ({
  error,
  resetErrorBoundary
}) => {
  const isNetworkError = error.message.includes('fetch') || 
                        error.message.includes('Network') ||
                        error.message.includes('Failed to fetch');
  
  const isTimeoutError = error.message.includes('timeout') ||
                        error.message.includes('Timeout');

  const getErrorType = () => {
    if (isNetworkError) {
      return {
        title: 'Network Error',
        description: 'Unable to connect to the server. Please check your internet connection.',
        icon: <AlertTriangle className="w-6 h-6 text-orange-600" />,
        bgColor: 'bg-orange-100',
        suggestions: [
          'Check your internet connection',
          'Verify the server is running',
          'Try again in a few moments'
        ]
      };
    }
    
    if (isTimeoutError) {
      return {
        title: 'Request Timeout',
        description: 'The operation took too long to complete.',
        icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
        bgColor: 'bg-yellow-100',
        suggestions: [
          'The server might be busy',
          'Try again with a smaller request',
          'Check your internet speed'
        ]
      };
    }
    
    return {
      title: 'Operation Failed',
      description: 'An error occurred while processing your request.',
      icon: <Bug className="w-6 h-6 text-red-600" />,
      bgColor: 'bg-red-100',
      suggestions: [
        'Try the operation again',
        'Check if you have the required permissions',
        'Contact support if the issue persists'
      ]
    };
  };

  const errorType = getErrorType();

  return (
    <div className="p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className={`mx-auto w-12 h-12 rounded-full ${errorType.bgColor} flex items-center justify-center mb-4`}>
            {errorType.icon}
          </div>
          <CardTitle className="text-lg text-gray-900">{errorType.title}</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            {errorType.description}
          </p>
          
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 text-sm">What you can do:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {errorType.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="text-xs text-gray-500">
              <summary className="cursor-pointer font-medium hover:text-gray-700">
                Technical Details
              </summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
          
          <Button onClick={resetErrorBoundary} className="w-full" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

interface AsyncErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<AsyncErrorFallbackProps>;
}

export const AsyncErrorBoundary: React.FC<AsyncErrorBoundaryProps> = ({
  children,
  fallback: CustomFallback = AsyncErrorFallback
}) => {
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      // Prevent the default browser behavior
      event.preventDefault();
      
      // In production, send to error reporting service
      if (process.env.NODE_ENV === 'production') {
        // Example: Sentry.captureException(event.reason);
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <ErrorBoundary
      FallbackComponent={CustomFallback}
      onError={(error, errorInfo) => {
        console.error('Async operation error:', error, errorInfo);
        
        // In production, send to error reporting service
        if (process.env.NODE_ENV === 'production') {
          // Example: Sentry.captureException(error, { extra: errorInfo });
        }
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default AsyncErrorBoundary;