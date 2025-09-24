import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ApproverSidebar from './ApproverSidebar';
import { EnhancedApproverPanel } from './EnhancedApproverPanel';
import { toast } from 'sonner';
// Status colors are now defined in tailwind.config.js
import { DashboardHeader } from './DashboardHeader';
import { getOrganizationConfig } from '../config/organizationConfig';

type MetricKey = 'totalRequests' | 'pending' | 'approved' | 'rejected';

interface DashboardMetrics extends Record<MetricKey, number> {
  totalRequests: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface DashboardApiResponse {
  totalRequests: number;
  pending: number;
  approved: number;
  rejected: number;
  [key: string]: unknown; // Allow for additional properties
}

const isDashboardApiResponse = (data: unknown): data is DashboardApiResponse => {
  if (typeof data !== 'object' || data === null) return false;
  
  const requiredFields: MetricKey[] = ['totalRequests', 'pending', 'approved', 'rejected'];
  return requiredFields.every(field => 
    field in data && typeof (data as DashboardApiResponse)[field] === 'number'
  );
};

interface ApproverLayoutProps {
  organizationType: string;
  userRole?: 'APPROVER' | 'BANK_SUPERVISOR' | 'BANK';
  userName?: string;
  children?: React.ReactNode;
}

export const ApproverLayout: React.FC<ApproverLayoutProps> = ({
  organizationType,
  userRole = 'APPROVER',
  userName = 'Approver Officer',
  children
}) => {
  const navigate = useNavigate();
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics>({
    totalRequests: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const config = getOrganizationConfig(organizationType);

  // Fetch dashboard data with enhanced error handling
  const fetchDashboardData = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(
        `http://localhost:8000/api/approval-channels/summary?org=${organizationType}`,
        {
          headers: {
            'X-User-Role': userRole,
            'X-Organization': organizationType,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          },
          credentials: 'include'
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }
      
      const data: unknown = await response.json();
      
      if (!isDashboardApiResponse(data)) {
        throw new Error('Invalid data format received from server');
      }
      
      setDashboardMetrics({
        totalRequests: data.totalRequests,
        pending: data.pending,
        approved: data.approved,
        rejected: data.rejected
      });
    } catch (error) {
      console.error('Error in fetchDashboardData:', error);
      
      // More specific error messages based on error type
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        toast.error('Unable to connect to the server. Please check your network connection.');
      } else if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error('An unexpected error occurred while loading dashboard data');
      }
      
      // Reset metrics to show loading state
      setDashboardMetrics({
        totalRequests: 0,
        pending: 0,
        approved: 0,
        rejected: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Refresh all data
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Set up polling every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);

    return () => clearInterval(interval);
  }, [organizationType, userRole]);

  const handleLogout = () => {
    // Clear any stored authentication tokens
    try {
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error('Error clearing auth token:', error);
    }
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-yellow-50">
      {/* Sidebar */}
      <ApproverSidebar 
        organizationName={config.name}
        organizationType={organizationType}
        userRole={userRole}
        onViewChange={(view) => {}}
        onLogout={handleLogout}
        pendingCount={dashboardMetrics.pending}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          title={config.name}
          subtitle={config.role}
          userName={userName}
          onRefresh={handleRefresh}
          onLogout={handleLogout}
          refreshing={refreshing}
        />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
export default ApproverLayout;