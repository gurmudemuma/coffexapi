import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../store';
import type { ExportRequest } from '../lib/fabric';

export type ExportStatus = 
  | 'DRAFT' 
  | 'SUBMITTED' 
  | 'VALIDATING' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'PAYMENT_RELEASED';

export type ExportSummary = {
  id: string;
  exportId: string;
  productType: string;
  quantity: number;
  totalValue: number;
  currency: string;
  destination: string;
  status: ExportStatus;
  submittedAt?: number;
  validationProgress: number;
};

export type ExportStats = {
  totalExports: number;
  activeExports: number;
  pendingValidation: number;
  approvedExports: number;
  totalValue: number;
};

export const useExports = () => {
  const { user } = useAuth();
  const [exportSummaries, setExportSummaries] = useState<ExportSummary[]>([]);
  const [stats, setStats] = useState<ExportStats>({
    totalExports: 0,
    activeExports: 0,
    pendingValidation: 0,
    approvedExports: 0,
    totalValue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Mock data for demonstration
  const mockExports: Record<string, ExportRequest> = {
    'exp-001': {
      id: 'exp-001',
      exportId: 'CE-2024-001',
      exporter: user?.id || 'user-1',
      status: 'SUBMITTED',
      submittedAt: Date.now() - 24 * 60 * 60 * 1000, // 1 day ago
      tradeDetails: {
        productType: 'Arabica Coffee Beans',
        quantity: 5000,
        totalValue: 150000,
        currency: 'USD',
        destination: 'Germany',
      },
      validationSummary: {
        totalValidations: 4,
        completedValidations: 2,
      },
      documents: {},
      timestamp: Date.now(),
    },
    'exp-002': {
      id: 'exp-002',
      exportId: 'CE-2024-002',
      exporter: user?.id || 'user-1',
      status: 'VALIDATING',
      submittedAt: Date.now() - 12 * 60 * 60 * 1000, // 12 hours ago
      tradeDetails: {
        productType: 'Robusta Coffee Beans',
        quantity: 3000,
        totalValue: 90000,
        currency: 'USD',
        destination: 'Italy',
      },
      validationSummary: {
        totalValidations: 4,
        completedValidations: 1,
      },
      documents: {},
      timestamp: Date.now(),
    },
    'exp-003': {
      id: 'exp-003',
      exportId: 'CE-2024-003',
      exporter: user?.id || 'user-1',
      status: 'APPROVED',
      submittedAt: Date.now() - 48 * 60 * 60 * 1000, // 2 days ago
      tradeDetails: {
        productType: 'Arabica Coffee Beans',
        quantity: 7500,
        totalValue: 225000,
        currency: 'USD',
        destination: 'Netherlands',
      },
      validationSummary: {
        totalValidations: 4,
        completedValidations: 4,
      },
      documents: {},
      timestamp: Date.now(),
    },
  };

  const processExports = useCallback((exportsData: Record<string, ExportRequest>) => {
    try {
      if (!user) return [];

      // Filter exports to only show those belonging to the current user
      const userExports = Object.values(exportsData).filter(
        (exportRequest) => exportRequest.exporter === user.id
      );

      return userExports.map((exportRequest) => ({
        id: exportRequest.id,
        exportId: exportRequest.exportId,
        productType: exportRequest.tradeDetails?.productType || 'N/A',
        quantity: exportRequest.tradeDetails?.quantity || 0,
        totalValue: exportRequest.tradeDetails?.totalValue || 0,
        currency: exportRequest.tradeDetails?.currency || 'USD',
        destination: exportRequest.tradeDetails?.destination || 'N/A',
        status: exportRequest.status as ExportStatus,
        submittedAt: exportRequest.submittedAt,
        validationProgress:
          (exportRequest.validationSummary?.totalValidations ?? 0) > 0
            ? ((exportRequest.validationSummary?.completedValidations ?? 0) /
                (exportRequest.validationSummary?.totalValidations ?? 1)) *
              100
            : 0,
      }));
    } catch (err) {
      console.error('Error processing exports:', err);
      setError(err instanceof Error ? err : new Error('Failed to process exports'));
      return [];
    }
  }, [user]);

  // Update export summaries and stats when exports or user changes
  useEffect(() => {
    if (!user) {
      setExportSummaries([]);
      setStats({
        totalExports: 0,
        activeExports: 0,
        pendingValidation: 0,
        approvedExports: 0,
        totalValue: 0,
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Process data immediately without artificial delay
    try {
      const summaries = processExports(mockExports);
      setExportSummaries(summaries);

      // Calculate stats
      const totalExports = summaries.length;
      const activeExports = summaries.filter(s => ['SUBMITTED', 'VALIDATING'].includes(s.status)).length;
      const pendingValidation = summaries.filter(s => s.status === 'VALIDATING').length;
      const approvedExports = summaries.filter(s => s.status === 'APPROVED').length;
      const totalValue = summaries.reduce((sum, s) => sum + s.totalValue, 0);

      setStats({
        totalExports,
        activeExports,
        pendingValidation,
        approvedExports,
        totalValue,
      });

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load exports'));
    } finally {
      setLoading(false);
    }
  }, [user, processExports]);

  return {
    exports: mockExports,
    exportSummaries,
    stats,
    loading,
    error,
  };
};