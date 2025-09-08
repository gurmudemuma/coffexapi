import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../store';
import type { ExportRequest } from '../lib/fabric';
import { contract } from '../lib/fabric';

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
  exporterId: string;
  exporter: string; // Added exporter field for organization filtering
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

  const processExports = useCallback((exportsData: Record<string, ExportRequest>) => {
    try {
      if (!user) return [];

      // Filter exports to only show those belonging to the current user's organization
      const orgExports = Object.values(exportsData).filter(
        (exportRequest) => exportRequest.exporter === user.organization
      );

      return orgExports.map((exportRequest) => {
        // Ensure tradeDetails exists
        const tradeDetails = exportRequest.tradeDetails || {
          productType: 'N/A',
          quantity: 0,
          unitPrice: 0,
          totalValue: 0,
          currency: 'USD',
          destination: 'N/A',
          contractNumber: 'N/A',
        };
        
        // Calculate validation progress safely
        const totalValidations = exportRequest.validationSummary?.totalValidations ?? 0;
        const completedValidations = exportRequest.validationSummary?.completedValidations ?? 0;
        const validationProgress = totalValidations > 0 
          ? (completedValidations / totalValidations) * 100 
          : 0;

        return {
          id: exportRequest.id,
          exportId: exportRequest.exportId,
          productType: tradeDetails.productType || 'N/A',
          quantity: tradeDetails.quantity || 0,
          totalValue: tradeDetails.totalValue || 0,
          currency: tradeDetails.currency || 'USD',
          destination: tradeDetails.destination || 'N/A',
          status: exportRequest.status,
          submittedAt: exportRequest.submittedAt,
          validationProgress,
          exporterId: exportRequest.exporterId,
          exporter: exportRequest.exporter,
        };
      });
    } catch (err) {
      console.error('Error processing exports:', err);
      setError(err instanceof Error ? err : new Error('Failed to process exports'));
      return [];
    }
  }, [user]);

  // Fetch export data from blockchain
  const fetchExports = useCallback(async () => {
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
    setError(null);

    try {
      // Fetch exports from blockchain for the current user's organization
      const exportsData = await contract.getExportsByOrganization(user.organization);
      
      const summaries = processExports(exportsData);
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
    } catch (err) {
      console.error('Error fetching exports:', err);
      // Provide more detailed error information
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError(new Error('Network error: Unable to connect to the server. Please check your internet connection and ensure the backend service is running.'));
      } else {
        setError(err instanceof Error ? err : new Error('Failed to load exports. Please try again later.'));
      }
    } finally {
      setLoading(false);
    }
  }, [user, processExports]);

  // Update export summaries and stats when user changes
  useEffect(() => {
    fetchExports();
  }, [user, fetchExports]);

  // Refresh function to manually trigger data refresh
  const refreshExports = useCallback(() => {
    fetchExports();
  }, [fetchExports]);

  return {
    exportSummaries,
    stats,
    loading,
    error,
    refreshExports,
  };
};