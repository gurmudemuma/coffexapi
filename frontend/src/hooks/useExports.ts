import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../store';
import type { ExportRequest } from '../lib/fabric';

export type ExportSummary = {
  id: string;
  exportId: string;
  productType: string;
  quantity: number;
  totalValue: number;
  currency: string;
  destination: string;
  status: string;
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

export const useExports = (exports: Record<string, ExportRequest>) => {
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

  const processExports = useCallback((exportsData: Record<string, ExportRequest>) => {
    try {
      if (!user) return [];

      // Filter exports to only show those belonging to the current user
      const userExports = Object.values(exportsData).filter(
        (exportRequest) => exportRequest.exporter === user.id
      );

      return userExports.map((exportRequest) => ({
        id: exportRequest.id,
        exportId: exportRequest.id,
        productType: exportRequest.tradeDetails?.productType || 'N/A',
        quantity: exportRequest.tradeDetails?.quantity || 0,
        totalValue: exportRequest.tradeDetails?.totalValue || 0,
        currency: exportRequest.tradeDetails?.currency || 'USD',
        destination: exportRequest.tradeDetails?.destination || 'N/A',
        status: exportRequest.status,
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
    if (!user) return;

    try {
      setLoading(true);
      const summaries = processExports(exports);
      setExportSummaries(summaries);

      // Calculate statistics
      const activeCount = summaries.filter((s) =>
        ['SUBMITTED', 'VALIDATING'].includes(s.status)
      ).length;
      const pendingCount = summaries.filter(
        (s) => s.status === 'VALIDATING'
      ).length;
      const approvedCount = summaries.filter(
        (s) => s.status === 'APPROVED'
      ).length;
      const totalVal = summaries.reduce((sum, s) => sum + s.totalValue, 0);

      setStats({
        totalExports: summaries.length,
        activeExports: activeCount,
        pendingValidation: pendingCount,
        approvedExports: approvedCount,
        totalValue: totalVal,
      });
    } catch (err) {
      console.error('Error updating export stats:', err);
      setError(err instanceof Error ? err : new Error('Failed to update export stats'));
    } finally {
      setLoading(false);
    }
  }, [exports, user, processExports]);

  // Filter exports by status
  const getExportsByStatus = useCallback(
    (status: string) => {
      return exportSummaries.filter((exp) => exp.status === status);
    },
    [exportSummaries]
  );

  // Get a single export by ID
  const getExportById = useCallback(
    (id: string) => {
      return exportSummaries.find((exp) => exp.id === id);
    },
    [exportSummaries]
  );

  return {
    exports: exportSummaries,
    stats,
    loading,
    error,
    getExportsByStatus,
    getExportById,
  };
};