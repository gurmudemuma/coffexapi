/**
 * FeatureErrorBoundary Component
 * 
 * A lightweight error boundary for individual features/components.
 * Allows parts of the application to fail gracefully without breaking the entire page.
 */

import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { cn } from '../../lib/utils';

interface FeatureErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  featureName?: string;
  className?: string;
  compact?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const FeatureErrorFallback: React.FC<FeatureErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  featureName = 'feature',
  className,
  compact = false,
  dismissible = false,
  onDismiss
}) => {
  if (compact) {
    return (
      <div className={cn(
        "flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-md",
        className
      )}>
        <div className="flex items-center">
          <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
          <span className="text-sm text-red-800">
            {featureName} failed to load
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetErrorBoundary}
            className="h-6 px-2 text-red-700 hover:text-red-900"
          >
            <RefreshCw className="w-3 h-3" />
          </Button>
          {dismissible && onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-6 px-2 text-red-700 hover:text-red-900"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className={cn("border-red-200 bg-red-50", className)}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-red-800 capitalize">
              {featureName} Error
            </h3>
            <p className="text-sm text-red-700 mt-1">
              This {featureName} encountered an error and couldn't load properly.
            </p>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-2">
                <summary className="text-xs text-red-600 cursor-pointer hover:text-red-800">
                  Error Details
                </summary>
                <pre className="text-xs text-red-600 mt-1 overflow-auto">
                  {error.message}
                </pre>
              </details>
            )}
            
            <div className="flex items-center space-x-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={resetErrorBoundary}
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Retry
              </Button>
              
              {dismissible && onDismiss && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDismiss}
                  className="text-red-700 hover:bg-red-100"
                >
                  Dismiss
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface FeatureErrorBoundaryProps {
  children: React.ReactNode;
  featureName?: string;
  fallback?: React.ComponentType<FeatureErrorFallbackProps>;
  className?: string;
  compact?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export const FeatureErrorBoundary: React.FC<FeatureErrorBoundaryProps> = ({
  children,
  featureName,
  fallback: CustomFallback,
  className,
  compact = false,
  dismissible = false,
  onDismiss,
  onError
}) => {
  const FallbackComponent = CustomFallback || FeatureErrorFallback;

  return (
    <ErrorBoundary
      FallbackComponent={(props) => (
        <FallbackComponent
          {...props}
          featureName={featureName}
          className={className}
          compact={compact}
          dismissible={dismissible}
          onDismiss={onDismiss}
        />
      )}
      onError={(error, errorInfo) => {
        console.error(`Feature error in ${featureName}:`, error, errorInfo);
        onError?.(error, errorInfo);
        
        // In production, send to error reporting service with feature context
        if (process.env.NODE_ENV === 'production') {
          // Example: Sentry.captureException(error, { 
          //   tags: { feature: featureName },
          //   extra: errorInfo 
          // });
        }
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default FeatureErrorBoundary;