import { useState, useEffect } from 'react';
import { contract } from '../lib/fabric';

type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'VERIFIED';

export interface Approval {
  name: string;
  role: string;
  status: ApprovalStatus;
  timestamp?: string;
  comment?: string;
}

const ORGANIZATION_ROLES: Record<string, string> = {
  'national-bank': 'Regulator',
  'exporter-bank': 'Bank',
  'coffee-authority': 'Quality Inspector',
  customs: 'Customs',
};

const DOCUMENT_TYPES: Record<string, string> = {
  LICENSE: 'Export License',
  INVOICE: 'Commercial Invoice',
  QUALITY: 'Quality Certificate',
  SHIPPING: 'Shipping Documents',
};

export const useExportApprovals = (exportId: string | null) => {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchApprovals = async () => {
    if (!exportId) return;

    setLoading(true);
    setError(null);

    try {
      // In a real app, this would query the blockchain for the latest approval status
      // For now, we'll simulate it with mock data
      const mockApprovals: Approval[] = [
        {
          name: 'Ministry of Trade',
          role: ORGANIZATION_ROLES['national-bank'],
          status: 'PENDING',
        },
        {
          name: 'Exporter Bank',
          role: ORGANIZATION_ROLES['exporter-bank'],
          status: 'PENDING',
        },
        {
          name: 'Coffee Quality Authority',
          role: ORGANIZATION_ROLES['coffee-authority'],
          status: 'PENDING',
        },
        {
          name: 'Customs Department',
          role: ORGANIZATION_ROLES['customs'],
          status: 'PENDING',
        },
      ];

      setApprovals(mockApprovals);

      // In a real implementation, we would set up an event listener here
      // to listen for new approval events from the blockchain
    } catch (err) {
      console.error('Error fetching approvals:', err);
      setError(
        err instanceof Error ? err : new Error('Failed to fetch approvals')
      );
    } finally {
      setLoading(false);
    }
  };

  // Poll for updates
  useEffect(() => {
    fetchApprovals();

    const interval = setInterval(fetchApprovals, 15000); // Poll every 15 seconds
    return () => clearInterval(interval);
  }, [exportId]);

  return { approvals, loading, error, refresh: fetchApprovals };
};
