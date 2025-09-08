import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  showDetails?: boolean;
  title?: string;
  description?: string;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  showDetails = false,
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.'
}) => {
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-lg text-gray-900">{title}</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            {description}
          </p>
          
          {showDetails && (
            <details className="text-xs text-gray-500">
              <summary className="cursor-pointer font-medium hover:text-gray-700">
                Error Details
              </summary>
              <pre className="mt-2 p-3 bg-gray-100 rounded overflow-auto whitespace-pre-wrap break-words">
                {error.message}
                {error.stack && (
                  <>
                    {'\n\nStack Trace:\n'}
                    {error.stack}
                  </>
                )}
              </pre>
            </details>
          )}
          
          <div className="flex flex-col gap-2">
            <Button onClick={resetErrorBoundary} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleRefresh} 
              className="w-full"
            >
              Refresh Page
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={handleGoHome} 
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorFallback;