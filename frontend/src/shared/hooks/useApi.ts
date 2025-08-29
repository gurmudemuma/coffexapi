/**
 * useApi Hook
 * 
 * A reusable hook for managing API calls with loading, error, and success states.
 * Provides optimized state management with automatic cleanup and error handling.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { ApiResponse } from '../types';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

interface UseApiOptions {
  initialData?: any;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  retryAttempts?: number;
  retryDelay?: number;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (apiCall: () => Promise<ApiResponse<T>>) => Promise<void>;
  reset: () => void;
  retry: () => void;
}

/**
 * Custom hook for API state management
 * 
 * @param options - Configuration options for the hook
 * @returns API state and control functions
 */
export const useApi = <T = any>(options: UseApiOptions = {}): UseApiReturn<T> => {
  const {
    initialData = null,
    onSuccess,
    onError,
    retryAttempts = 3,
    retryDelay = 1000,
  } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
    lastUpdated: null,
  });

  const lastApiCallRef = useRef<(() => Promise<ApiResponse<T>>) | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);

  // Cleanup function
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const execute = useCallback(async (apiCall: () => Promise<ApiResponse<T>>) => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    lastApiCallRef.current = apiCall;
    retryCountRef.current = 0;

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    const attemptApiCall = async (attempt: number = 0): Promise<void> => {
      try {
        const response = await apiCall();
        
        // Check if request was aborted
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }

        if (response.success) {
          setState({
            data: response.data || null,
            loading: false,
            error: null,
            lastUpdated: new Date(),
          });
          onSuccess?.(response.data);
        } else {
          throw new Error(response.error || 'API request failed');
        }
      } catch (error) {
        // Check if request was aborted
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        // Retry logic
        if (attempt < retryAttempts) {
          retryCountRef.current = attempt + 1;
          setTimeout(() => {
            attemptApiCall(attempt + 1);
          }, retryDelay * Math.pow(2, attempt)); // Exponential backoff
          return;
        }

        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
        onError?.(errorMessage);
      }
    };

    await attemptApiCall();
  }, [onSuccess, onError, retryAttempts, retryDelay]);

  const reset = useCallback(() => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setState({
      data: initialData,
      loading: false,
      error: null,
      lastUpdated: null,
    });
    retryCountRef.current = 0;
  }, [initialData]);

  const retry = useCallback(async () => {
    if (lastApiCallRef.current) {
      await execute(lastApiCallRef.current);
    }
  }, [execute]);

  return {
    ...state,
    execute,
    reset,
    retry,
  };
};

export default useApi;