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
}

export const ApproverLayout: React.FC<ApproverLayoutProps> = ({ 
  organizationType,
  userRole = 'APPROVER',
  userName = 'Approver Officer'
}) => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('dashboard');
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
        activeView={activeView}
        onViewChange={(view) => setActiveView(view)}
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
          {activeView === 'dashboard' && (
            <div className="space-y-6">
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow border-purple-200"
                  role="region"
                  aria-label="Total Requests"
                  tabIndex={0}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Total Requests</p>
                        <p 
                          className="text-3xl font-bold text-black"
                          aria-live="polite"
                          aria-atomic="true"
                        >
                          {loading ? '...' : dashboardMetrics.totalRequests}
                        </p>
                      </div>
                      <div 
                        className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center"
                        aria-hidden="true"
                      >
                        <Clock className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow border-status-pending"
                  role="region"
                  aria-label="Pending Approvals"
                  tabIndex={0}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-status-pending">
                          Pending Approvals
                        </p>
                        <p 
                          className="text-3xl font-bold text-status-pending"
                          aria-live="polite"
                          aria-atomic="true"
                        >
                          {loading ? '...' : dashboardMetrics.pending}
                        </p>
                      </div>
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center bg-status-pending-light"
                        aria-hidden="true"
                      >
                        <XCircle className="w-6 h-6 text-status-pending" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow border-status-approved"
                  role="region"
                  aria-label="Approved Requests"
                  tabIndex={0}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-status-approved">
                          Approved
                        </p>
                        <p 
                          className="text-3xl font-bold text-status-approved"
                          aria-live="polite"
                          aria-atomic="true"
                        >
                          {loading ? '...' : dashboardMetrics.approved}
                        </p>
                      </div>
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center bg-status-approved-light"
                        aria-hidden="true"
                      >
                        <CheckCircle className="w-6 h-6 text-status-approved" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow border-status-rejected"
                  role="region"
                  aria-label="Rejected Requests"
                  tabIndex={0}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-status-rejected">
                          Rejected
                        </p>
                        <p 
                          className="text-3xl font-bold text-status-rejected"
                          aria-live="polite"
                          aria-atomic="true"
                        >
                          {loading ? '...' : dashboardMetrics.rejected}
                        </p>
                      </div>
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center bg-status-rejected-light"
                        aria-hidden="true"
                      >
                        <XCircle className="w-6 h-6 text-status-rejected" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-purple-200">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-black mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        className="h-auto py-4 flex flex-col items-center justify-center bg-purple-600 hover:bg-purple-700"
                        onClick={() => setActiveView('pending')}
                      >
                        <Clock className="w-6 h-6 mb-2" />
                        <span>Pending</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-auto py-4 flex flex-col items-center justify-center border-purple-200 text-purple-600 hover:bg-purple-50"
                        onClick={() => setActiveView('urgent')}
                      >
                        <XCircle className="w-6 h-6 mb-2" />
                        <span>Urgent</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-purple-200">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-black mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      <p className="text-purple-600 text-center py-4">
                        Recent activity will appear here
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* All other views use the EnhancedApproverPanel content */}
          {activeView !== 'dashboard' && (
            <div className="bg-white rounded-lg shadow-sm border border-purple-200">
              <EnhancedApproverPanel 
                organizationType={organizationType} 
                userRole={userRole}
                initialView={activeView}
                contentOnly={true}
                hideHeader={true}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ApproverLayout;